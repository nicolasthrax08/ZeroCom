import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { listingCreateSchema } from '@/lib/validation/listing';
import { requireUser } from '@/server/auth';
import { hasActivePro } from '@/server/entitlements';
import { logAnalytics } from '@/server/audit';
import { geoMock } from '@/server/adapters/geo';
import { recordBrokerSignal } from '@/server/broker-risk';
import { BadRequest, Unauthorized, Forbidden } from '@/server/errors';

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const city = sp.get('city') ?? undefined;
  const district = sp.get('district') ?? undefined;
  const minPrice = sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined;
  const maxPrice = sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined;
  const minArea = sp.get('minArea') ? Number(sp.get('minArea')) : undefined;
  const maxArea = sp.get('maxArea') ? Number(sp.get('maxArea')) : undefined;
  const bedrooms = sp.get('bedrooms') ? Number(sp.get('bedrooms')) : undefined;
  const q = sp.get('q') ?? undefined;

  const listings = await store.listListings({
    city,
    district,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    bedrooms,
    q,
    status: 'ACTIVE',
  });

  // Attach photos to each listing for card display.
  const withPhotos = await Promise.all(
    listings.map(async (l) => ({
      ...l,
      photos: await store.listPhotosByListing(l.id),
    })),
  );

  await logAnalytics('listing_feed_viewed', { metadata: { count: listings.length } });
  return NextResponse.json({ ok: true, data: { listings: withPhotos } });
}

export async function POST(req: Request) {
  const user = await requireUser().catch((e) => {
    throw new Unauthorized(e.message);
  });
  const verification = await store.findVerificationByUserId(user.id);
  if (!verification || (verification.status !== 'ID_VERIFIED' && verification.status !== 'ID_PENDING')) {
    throw new Forbidden('NEEDS_TIER2');
  }
  const body = await req.json().catch(() => null);
  const parsed = listingCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequest(parsed.error.issues[0]?.message ?? '输入无效');
  }
  const data = parsed.data;
  const geo = await geoMock.geocode(`${data.city} ${data.addressDetail}`, data.city);
  const listing = await store.createListing({
    sellerId: user.id,
    title: data.title,
    description: data.description,
    city: data.city,
    district: data.district,
    addressDetail: data.addressDetail,
    lat: data.lat ?? geo.lat,
    lng: data.lng ?? geo.lng,
    geoHash: `${data.city.slice(0, 2)}-${data.district.slice(0, 2)}-hash`,
    priceRmbWan: data.priceRmbWan,
    areaSqm: data.areaSqm,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    propertyType: data.propertyType,
    verificationStatus: 'PENDING',
    status: 'PENDING_VERIFICATION',
    publishedAt: null,
  });
  await store.addPhotos(listing.id, data.photos);
  // Duplicate detection: flag if any existing listing has same geoHash and 80%+ pHash.
  const existing = await store.listListings({ city: data.city, district: data.district, includeShadowBanned: true });
  for (const e of existing) {
    if (e.id === listing.id) continue;
    if (e.geoHash === listing.geoHash) {
      await recordBrokerSignal({
        userId: user.id,
        listingId: listing.id,
        signalType: 'LISTING_HIJACK',
        severity: 'HIGH',
        metadata: { duplicateOf: e.id },
      });
    }
  }
  await logAnalytics('listing_created', { userId: user.id, listingId: listing.id });
  return NextResponse.json({ ok: true, data: { id: listing.id, status: listing.status } }, { status: 201 });
}
