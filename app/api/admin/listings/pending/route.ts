import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';

export async function GET() {
  await requireAdmin();
  const rows = await store.listListings({ status: 'PENDING_VERIFICATION', includeShadowBanned: true });
  return NextResponse.json({ ok: true, data: { listings: rows } });
}
