import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';
import { NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');
  await store.updateListing(listing.id, { status: 'REMOVED', verificationStatus: 'REJECTED' });
  return NextResponse.json({ ok: true, data: { id: listing.id, status: 'REMOVED' } });
}
