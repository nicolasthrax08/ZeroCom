import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { canRevealContact } from '@/server/entitlements';
import { recordBrokerSignal } from '@/server/broker-risk';
import { logAnalytics } from '@/server/audit';
import { SEED_PHONES } from '@/server/data/seed-data';
import { NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');
  const cr = await canRevealContact(user.id, listing.id, listing);
  if (!cr.ok) {
    return NextResponse.json(
      { ok: false, error: { code: cr.reason ?? 'NOT_ALLOWED', message: '暂不能查看联系方式' } },
      { status: 403 },
    );
  }
  const sellerPhone = Object.entries(SEED_PHONES).find(([id]) => id === listing.sellerId)?.[1] ?? '13800000000';
  await store.recordContactReveal(user.id, listing.id, 'DIRECT');
  await logAnalytics('contact_revealed', { userId: user.id, listingId: listing.id });
  return NextResponse.json({
    ok: true,
    data: {
      sellerPhone,
      sellerWeChat: 'wechat-of-seller',
      directMatchBadge: true,
    },
  });
}
