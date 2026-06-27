import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';

export async function GET(req: Request) {
  await requireAdmin();
  const sp = new URL(req.url).searchParams;
  const outTradeNo = sp.get('outTradeNo') ?? undefined;
  if (outTradeNo) {
    const order = await store.findPaymentOrder(outTradeNo);
    return NextResponse.json({ ok: true, data: order ?? null });
  }
  const orders = await store.listAllPaymentOrders();
  return NextResponse.json({ ok: true, data: { orders } });
}
