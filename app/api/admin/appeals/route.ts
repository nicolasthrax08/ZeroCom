import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';

export async function GET() {
  await requireAdmin();
  const rows = await store.listAppeals();
  return NextResponse.json({ ok: true, data: { appeals: rows } });
}
