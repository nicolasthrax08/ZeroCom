import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { hasActivePro } from '@/server/entitlements';
import { assertCanSendMessage } from '@/server/entitlements';
import { firstMessageLooksLikeBrokerOutbound, recordBrokerSignal } from '@/server/broker-risk';
import { BadRequest, Forbidden, NotFound } from '@/server/errors';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const conv = await store.findConversationById(id);
  if (!conv) throw new NotFound('会话不存在');
  if (conv.buyerId !== user.id && conv.sellerId !== user.id) throw new Forbidden('NOT_PARTICIPANT');
  const messages = await store.listMessages(conv.id);
  return NextResponse.json({ ok: true, data: { messages } });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const conv = await store.findConversationById(id);
  if (!conv) throw new NotFound('会话不存在');
  if (conv.buyerId !== user.id && conv.sellerId !== user.id) throw new Forbidden('NOT_PARTICIPANT');
  const body = await req.json().catch(() => null);
  const message = String(body?.message ?? '').trim();
  if (!message) throw new BadRequest('消息不能为空');
  const isPaid = await hasActivePro(user.id);
  await assertCanSendMessage(user.id, { isOwner: conv.sellerId === user.id, isPaid });
  const isFirstFromUser = !(await store.listMessages(conv.id)).some((m) => m.senderId === user.id);
  let flagged = false;
  if (isFirstFromUser) {
    const scan = firstMessageLooksLikeBrokerOutbound(message);
    if (scan.flagged) {
      flagged = true;
      await recordBrokerSignal({
        userId: user.id,
        listingId: conv.listingId,
        signalType: 'OFF_PLATFORM_REDIRECT',
        severity: 'MEDIUM',
        metadata: { reason: scan.reason },
      });
    }
  }
  const msg = await store.createMessage({
    conversationId: conv.id,
    senderId: user.id,
    body: message,
    isFlagged: flagged,
  });
  return NextResponse.json({ ok: true, data: { id: msg.id, isFlagged: flagged } });
}
