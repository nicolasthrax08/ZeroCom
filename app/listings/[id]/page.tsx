import { notFound } from 'next/navigation';
import { store } from '@/server/data/store';
import { currentUser } from '@/server/auth';
import { logAnalytics } from '@/server/audit';
import { canRevealContact, hasActivePro } from '@/server/entitlements';
import { maskPhone } from '@/lib/utils/mask';
import { ListingDetailShell } from './detail-shell';
import type { User } from '@/server/data/types';

export const dynamic = 'force-dynamic';

type RevealState =
  | { status: 'LOADING' }
  | { status: 'MASKED' }
  | { status: 'NO_INTENT' }
  | { status: 'REVEALED'; phone: string; wechat?: string }
  | { status: 'IS_OWNER' }
  | { status: 'NOT_ACTIVE' };

async function computeRevealState(viewer: User | null, listingId: string, sellerId: string): Promise<RevealState> {
  const listing = await store.findListingById(listingId);
  if (!listing || listing.status !== 'ACTIVE') return { status: 'NOT_ACTIVE' };
  if (!viewer) return { status: 'MASKED' };
  if (sellerId === viewer.id) return { status: 'IS_OWNER' };
  const isPaid = await hasActivePro(viewer.id);
  if (!isPaid) return { status: 'MASKED' };
  const cr = await canRevealContact(viewer.id, listing.id, listing);
  if (cr.ok) return { status: 'REVEALED', phone: maskPhone('13800000001'), wechat: 'wechat-of-seller' };
  if (cr.reason === 'NO_INTENT') return { status: 'NO_INTENT' };
  return { status: 'MASKED' };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await store.findListingById(id);
  if (!listing) return notFound();

  const viewer = await currentUser();
  const photos = await store.listPhotosByListing(listing.id);
  const saved = viewer ? await store.findSaved(viewer.id, listing.id) : null;
  const revealState = await computeRevealState(viewer, listing.id, listing.sellerId);

  await logAnalytics('listing_detail_viewed', { userId: viewer?.id, listingId: listing.id });

  return (
    <ListingDetailShell
      listing={listing}
      photos={photos}
      viewer={viewer}
      saved={saved}
      revealState={revealState}
    />
  );
}
