import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';
import { NotFound, BadRequest } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const action = body?.action;
  if (action !== 'approve' && action !== 'reject') throw new BadRequest('action 必须为 approve 或 reject');
  let found = null;
  for (const a of await store.listAppeals()) {
    if (a.id === id) {
      found = a;
      break;
    }
  }
  if (!found) throw new NotFound('申诉不存在');
  await store.updateAppeal(found.id, {
    status: action === 'approve' ? 'APPROVED' : 'REJECTED',
    resolvedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, data: { id: found.id, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } });
}
