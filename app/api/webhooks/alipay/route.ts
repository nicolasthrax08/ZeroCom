import { NextResponse } from 'next/server';
import { alipayMock } from '@/server/payments/adapters';
import { markPaidFromVerifiedWebhook } from '@/server/payments';
import { store } from '@/server/data/store';
import { logAnalytics } from '@/server/audit';

export async function POST(req: Request) {
  const rawBody = Buffer.from(await req.arrayBuffer());
  const headers = req.headers;
  // Production: verify RSA2 signature using Alipay public key before proceeding.
  const event = await alipayMock.verifyWebhook(headers, rawBody);
  if (event.status !== 'SUCCESS') {
    return NextResponse.json({ ok: false, error: { code: 'INVALID_STATUS', message: '支付状态异常' } }, { status: 400 });
  }
  const order = await store.findPaymentOrder(event.outTradeNo);
  if (!order) {
    return NextResponse.json({ ok: false, error: { code: 'ORDER_NOT_FOUND', message: '订单不存在' } }, { status: 404 });
  }
  if (order.status === 'PAID') {
    return NextResponse.json({ ok: true, data: { idempotent: true } });
  }
  const updated = await markPaidFromVerifiedWebhook({
    outTradeNo: event.outTradeNo,
    tradeNo: event.tradeNo,
    provider: 'ALIPAY',
    amountFen: order.amountFen,
  });
  return NextResponse.json({ ok: true, data: { outTradeNo: updated.outTradeNo, status: updated.status } });
}
