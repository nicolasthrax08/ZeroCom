// Payment service — keeps subscription flip path behind a single function so UI
// cannot short-circuit paid-tier activation. Provider adapters implement a common
// interface; the mock adapters simulate Alipay and WeChat Pay UX.

import { store } from '../data/store';
import { alipayMock, wechatpayMock, type PaymentProviderAdapter } from './adapters';
import { addMinutes } from '@/lib/utils/date';
import { ORDER_EXPIRE_MINUTES } from '@/lib/constants';
import { logAnalytics } from '../audit';
import { NotFound } from '../errors';
import type { PaymentOrder } from '../data/types';

export function adapterFor(provider: 'ALIPAY' | 'WECHATPAY'): PaymentProviderAdapter {
  return provider === 'ALIPAY' ? alipayMock : wechatpayMock;
}

export async function createOrder(input: {
  userId: string;
  planCode: 'MONTHLY_PRO' | 'ANNUAL_PRO';
  provider: 'ALIPAY' | 'WECHATPAY';
}): Promise<PaymentOrder> {
  const plan = input.planCode === 'ANNUAL_PRO'
    ? { amountFen: 19900, days: 365, autoRenew: true }
    : { amountFen: 2900, days: 30, autoRenew: false };
  const outTradeNo = `${input.userId}_${input.planCode}_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();
  const order: PaymentOrder = {
    outTradeNo,
    userId: input.userId,
    provider: input.provider,
    planCode: input.planCode,
    amountFen: plan.amountFen,
    status: 'PENDING_USER_PAY',
    expiresAt: addMinutes(now, ORDER_EXPIRE_MINUTES).toISOString(),
    paidAt: null,
    providerPayload: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  await store.createPaymentOrder(order);
  await store.appendPaymentAuditLog({
    orderId: outTradeNo,
    eventType: 'ORDER_CREATED',
    payload: { planCode: input.planCode, provider: input.provider },
  });
  // Trigger provider to populate QR/deeplink in providerPayload.
  const adapter = adapterFor(input.provider);
  const result = await adapter.createOrder({
    outTradeNo,
    amountFen: plan.amountFen,
    description: `ZeroCom ${input.planCode}`,
  });
  await store.updatePaymentOrder(outTradeNo, { providerPayload: result });
  await logAnalytics('subscription_order_created', {
    userId: input.userId,
    metadata: { planCode: input.planCode, outTradeNo },
  });
  return (await store.findPaymentOrder(outTradeNo)) as PaymentOrder;
}

/**
 * Idempotently flip an order to PAID and activate the subscription.
 * Called by the production webhook handler or the local-only
 * "simulate webhook" helper. This is the ONLY public path that grants paid tier.
 */
export async function markPaidFromVerifiedWebhook(input: {
  outTradeNo: string;
  tradeNo: string;
  provider: 'ALIPAY' | 'WECHATPAY';
  amountFen: number;
}): Promise<PaymentOrder> {
  const order = await store.findPaymentOrder(input.outTradeNo);
  if (!order) throw new NotFound(`Order not found: ${input.outTradeNo}`);
  if (order.status === 'PAID') return order; // idempotent
  if (order.status === 'EXPIRED' || order.status === 'CANCELLED' || order.status === 'REFUNDED') {
    throw new Error(`Order in terminal state: ${order.status}`);
  }
  if (order.expiresAt && new Date(order.expiresAt).getTime() < Date.now()) {
    await store.updatePaymentOrder(input.outTradeNo, { status: 'EXPIRED' });
    throw new Error('Order expired; cannot mark paid');
  }
  const updated = await store.updatePaymentOrder(input.outTradeNo, {
    status: 'PAID',
    paidAt: new Date().toISOString(),
    providerPayload: { ...(order.providerPayload as object), tradeNo: input.tradeNo },
  });
  await store.appendPaymentAuditLog({
    orderId: input.outTradeNo,
    eventType: 'WEBHOOK_RECEIVED',
    payload: { tradeNo: input.tradeNo, amountFen: input.amountFen },
  });

  // Activate or extend subscription.
  const existing = await store.activeSubscription(order.userId);
  const days = order.planCode === 'ANNUAL_PRO' ? 365 : 30;
  const autoRenew = order.planCode === 'ANNUAL_PRO';
  const newEnd = existing
    ? addMinutes(new Date(Math.max(new Date(existing.endsAt).getTime(), Date.now())), days * 1440)
    : addMinutes(new Date(), days * 1440);
  const sub = existing
    ? await store.updateSubscription(existing.id, {
        endsAt: newEnd.toISOString(),
        status: 'ACTIVE',
        autoRenew,
      })
    : await store.createSubscription({
        userId: order.userId,
        planCode: order.planCode,
        status: 'ACTIVE',
        startsAt: new Date().toISOString(),
        endsAt: newEnd.toISOString(),
        autoRenew,
      });
  await store.appendPaymentAuditLog({
    orderId: input.outTradeNo,
    eventType: 'SUBSCRIPTION_ACTIVATED',
    payload: { subscriptionId: sub?.id },
  });
  await logAnalytics('subscription_paid', {
    userId: order.userId,
    metadata: { outTradeNo: input.outTradeNo, planCode: order.planCode },
  });
  return updated!;
}

/** Local/dev-only shortcut for demos — attempts verifyWebhook + markPaid. */
export async function devSimulateWebhookSuccess(outTradeNo: string): Promise<PaymentOrder> {
  const order = await store.findPaymentOrder(outTradeNo);
  if (!order) throw new NotFound('Order not found');
  const adapter = adapterFor(order.provider);
  const event = await adapter.verifyWebhook(
    new Headers({ 'content-type': 'application/json' }),
    Buffer.from(JSON.stringify({ out_trade_no: outTradeNo, trade_no: `sim-${outTradeNo}` })),
  );
  return markPaidFromVerifiedWebhook({
    outTradeNo: event.outTradeNo,
    tradeNo: event.tradeNo,
    provider: order.provider,
    amountFen: order.amountFen,
  });
}

export async function cancelOrder(outTradeNo: string): Promise<PaymentOrder | null> {
  const order = await store.findPaymentOrder(outTradeNo);
  if (!order) return null;
  if (order.status === 'PAID') {
    throw new Error('Refund required for PAID orders');
  }
  return store.updatePaymentOrder(outTradeNo, { status: 'CANCELLED' });
}

export async function expireOrderIfNecessary(outTradeNo: string): Promise<void> {
  const order = await store.findPaymentOrder(outTradeNo);
  if (!order || order.status !== 'PENDING_USER_PAY') return;
  if (new Date(order.expiresAt).getTime() < Date.now()) {
    await store.updatePaymentOrder(outTradeNo, { status: 'EXPIRED' });
    await store.appendPaymentAuditLog({
      orderId: outTradeNo,
      eventType: 'ORDER_EXPIRED',
      payload: {},
    });
  }
}
