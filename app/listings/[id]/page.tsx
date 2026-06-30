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

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await store.findListingById(id);
  if (!listing) return notFound();

  const viewer = await currentUser();
  const photos = await store.listPhotosByListing(listing.id);
  const saved = viewer ? await store.findSaved(viewer.id, listing.id) : null;

  let revealState: RevealState;
  if (!listing || listing.status !== 'ACTIVE') {
    revealState = { status: 'NOT_ACTIVE' };
  } else if (!viewer) {
    revealState = { status: 'MASKED' };
  } else if (listing.sellerId === viewer.id) {
    revealState = { status: 'IS_OWNER' };
  } else if (!await hasActivePro(viewer.id)) {
    revealState = { status: 'MASKED' };
  } else {
    const cr = await canRevealContact(viewer.id, listing.id, listing);
    if (cr.ok) revealState = { status: 'REVEALED', phone: maskPhone('13800000001'), wechat: 'wechat-of-seller' };
    else if (cr.reason === 'NO_INTENT') revealState = { status: 'NO_INTENT' };
    else revealState = { status: 'MASKED' };
  }

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
