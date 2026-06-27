import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { hasActivePro } from '@/server/entitlements';
import { firstMessageLooksLikeBrokerOutbound, recordBrokerSignal } from '@/server/broker-risk';
import { assertCanSendMessage } from '@/server/entitlements';
import { BadRequest, NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const listing = await store.findListingById(id);
  if (!listing) throw new NotFound('房源不存在');
  const body = await req.json().catch(() => null);
  const message = String(body?.message ?? '').trim();
  if (!message) throw new BadRequest('消息不能为空');

  const isPaid = await hasActivePro(user.id);
  await assertCanSendMessage(user.id, { isOwner: false, isPaid });

  let conv = await store.findConversationForListingAndBuyer(listing.id, user.id);
  if (!conv) {
    conv = await store.createConversation({
      listingId: listing.id,
      buyerId: user.id,
      sellerId: listing.sellerId,
    });
  }
  const isFirstMessageFromUser = !(await store.listMessages(conv.id)).some((m) => m.senderId === user.id);
  let flagged = false;
  if (isFirstMessageFromUser) {
    const scan = firstMessageLooksLikeBrokerOutbound(message);
    if (scan.flagged) {
      flagged = true;
      await recordBrokerSignal({
        userId: user.id,
        listingId: listing.id,
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
  return NextResponse.json({ ok: true, data: { id: msg.id, conversationId: conv.id, isFlagged: flagged } });
}
