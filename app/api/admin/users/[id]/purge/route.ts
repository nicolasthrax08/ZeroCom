import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';
import { NotFound } from '@/server/errors';

import { withErrorHandling } from '@/server/api-utils';

export const POST = withErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await requireAdmin();
  const user = await store.findUserById(id);
  if (!user) throw new NotFound('用户不存在');
  const listings = await store.listListings({ sellerId: id, includeShadowBanned: true });
  for (const l of listings) {
    await store.updateListing(l.id, { status: 'REMOVED' });
  }
  return NextResponse.json({ ok: true, data: { id, purged: listings.length } });
});

