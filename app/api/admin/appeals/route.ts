import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';

import { withErrorHandling } from '@/server/api-utils';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const rows = await store.listAppeals();
  return NextResponse.json({ ok: true, data: { appeals: rows } });
});

