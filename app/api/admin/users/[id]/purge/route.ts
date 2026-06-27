import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';
import { NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const user = await store.findUserById(id);
  if (!user) throw new NotFound('用户不存在');
  const listings = await store.listListings({ sellerId: id, includeShadowBanned: true });
  for (const l of listings) {
    await store.updateListing(l.id, { status: 'REMOVED' });
  }
  return NextResponse.json({ ok: true, data: { id, purged: listings.length } });
}
