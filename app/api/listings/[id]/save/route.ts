import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { assertCanSaveListing } from '@/server/entitlements';
import { NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');
  await assertCanSaveListing(user.id, listing.id);
  const saved = await store.saveListing(user.id, listing.id);
  return NextResponse.json({ ok: true, data: { id: saved.id, listingId: saved.listingId } });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  await store.unsaveListing(user.id, id);
  return NextResponse.json({ ok: true, data: { listingId: id } });
}
