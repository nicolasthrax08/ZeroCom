import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';
import { refreshRisk } from '@/server/broker-risk';
import { NotFound } from '@/server/errors';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const user = await store.findUserById(id);
  if (!user) throw new NotFound('用户不存在');
  const verification = await store.findVerificationByUserId(user.id);
  const subscriptions = await store.listSubscriptions(user.id);
  const enforcements = await store.listEnforcements(user.id);
  const signals = await store.listBrokerSignalsForUser(user.id);
  const risk = await refreshRisk(user.id);
  return NextResponse.json({
    ok: true,
    data: { user, verification, subscriptions, enforcements, signals, risk },
  });
}
