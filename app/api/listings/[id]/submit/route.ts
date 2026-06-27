import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { Forbidden, NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');
  if (listing.sellerId !== user.id) throw new Forbidden('NOT_OWNER');
  if (listing.status !== 'DRAFT') throw new Forbidden('NOT_DRAFT');
  await store.updateListing(listing.id, { status: 'PENDING_VERIFICATION' });
  return NextResponse.json({ ok: true, data: { id: listing.id, status: 'PENDING_VERIFICATION' } });
}
