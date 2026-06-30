import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';

import { withErrorHandling } from '@/server/api-utils';

export const GET = withErrorHandling(async () => {
  const user = await requireUser();
  const v = await store.findVerificationByUserId(user.id);
  return NextResponse.json({ ok: true, data: v ?? null });
});

