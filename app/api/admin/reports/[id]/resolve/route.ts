import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireAdmin } from '@/server/auth';
import { NotFound, BadRequest } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const action = body?.action;
  if (action !== 'resolve' && action !== 'reject') throw new BadRequest('action 必须为 resolve 或 reject');
  const report = await store.findReportById(id);
  if (!report) throw new NotFound('举报不存在');
  await store.updateReport(report.id, {
    status: action === 'resolve' ? 'RESOLVED' : 'REJECTED',
    resolvedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, data: { id: report.id, status: action === 'resolve' ? 'RESOLVED' : 'REJECTED' } });
}
