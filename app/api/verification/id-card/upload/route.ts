import { NextResponse } from 'next/server';
import { requireUser } from '@/server/auth';
import { store } from '@/server/data/store';
import { logAnalytics } from '@/server/audit';

export async function POST(req: Request) {
  const user = await requireUser();
  // Mock: accept upload and return a placeholder URL.
  const url = `/placeholder-id-card.svg`;
  const v = await store.findVerificationByUserId(user.id);
  if (v) {
    await store.updateVerification(user.id, { idCardFrontUrl: url });
  }
  await logAnalytics('verification_started', { userId: user.id });
  return NextResponse.json({ ok: true, data: { url } });
}
