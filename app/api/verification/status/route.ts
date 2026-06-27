import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';

export async function GET() {
  const user = await requireUser();
  const v = await store.findVerificationByUserId(user.id);
  return NextResponse.json({ ok: true, data: v ?? null });
}
