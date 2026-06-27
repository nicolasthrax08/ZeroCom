import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { currentUser } from '@/server/auth';
import { recordListingView, hasActivePro } from '@/server/entitlements';
import { canRevealContact } from '@/server/entitlements';
import { QuotaExceeded, NotFound } from '@/server/errors';
import { logAnalytics } from '@/server/audit';
import { SEED_PHONES } from '@/server/data/seed-data';
import type { Listing, User } from '@/server/data/types';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');

  const user = await currentUser();
  const isOwner = !!user && user.id === listing.sellerId;
  const isPaid = user ? await hasActivePro(user.id) : false;

  // Quota enforcement for non-owners.
  let remaining: number | undefined;
  let unlimited = false;
  try {
    if (!isOwner) {
      const r = await recordListingView(user?.id ?? 'anon', listing.id, {
        isOwner: false,
        isPaid,
      });
      remaining = r.remaining;
      unlimited = !!r.unlimited;
    }
  } catch (e) {
    if (e instanceof QuotaExceeded) {
      await logAnalytics('quota_exhausted', { userId: user?.id, listingId: listing.id });
      return NextResponse.json(
        {
          ok: false,
          error: { code: 'QUOTA_EXCEEDED', message: '今日免费浏览额度已用完' },
          data: { quota: 'FREE_VIEWS_PER_DAY' },
        },
        { status: 402 },
      );
    }
    throw e;
  }

  // Attach photos.
  const photos = await store.listPhotosByListing(listing.id);

  // Contact reveal state.
  let contactState: 'MASKED' | 'REVEALED' | 'NO_INTENT' | 'IS_OWNER' | 'NOT_ACTIVE' = 'MASKED';
  let sellerPhone: string | null = null;
  let sellerWeChat: string | null = null;
  let directMatchBadge = false;

  if (listing.status !== 'ACTIVE') contactState = 'NOT_ACTIVE';
  else if (isOwner) contactState = 'IS_OWNER';
  else {
    const cr = user ? await canRevealContact(user.id, listing.id, listing) : { ok: false, reason: 'NOT_PAID' as const };
    if (cr.ok) {
      contactState = 'REVEALED';
      const sellerPhoneSeed = Object.entries(SEED_PHONES).find(([id]) => id === listing.sellerId)?.[1];
      sellerPhone = sellerPhoneSeed ?? '13800000000';
      sellerWeChat = 'wechat-of-seller';
      directMatchBadge = true;
    } else if (cr.reason === 'NO_INTENT') {
      contactState = 'NO_INTENT';
    }
  }

  await logAnalytics('listing_detail_viewed', { userId: user?.id, listingId: listing.id });

  return NextResponse.json({
    ok: true,
    data: {
      listing: { ...listing, photos },
      viewer: user
        ? { id: user.id, role: user.role, isOwner }
        : null,
      quota: { remaining, unlimited },
      contact: { state: contactState, sellerPhone, sellerWeChat, directMatchBadge },
    },
  });
}
