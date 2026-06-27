import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';

export async function GET() {
  const user = await requireUser();
  const convs = await store.listConversationsForUser(user.id);
  const data = await Promise.all(
    convs.map(async (c) => ({
      id: c.id,
      listingId: c.listingId,
      buyerId: c.buyerId,
      sellerId: c.sellerId,
      lastMessage: (await store.listMessages(c.id)).slice(-1)[0] ?? null,
    })),
  );
  return NextResponse.json({ ok: true, data: { conversations: data } });
}
