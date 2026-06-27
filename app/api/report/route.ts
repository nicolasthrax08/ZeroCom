import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { reportSchema } from '@/lib/validation/report';
import { BadRequest } from '@/server/errors';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) throw new BadRequest(parsed.error.issues[0]?.message ?? '输入无效');
  const report = await store.createReport({
    reporterId: user.id,
    listingId: parsed.data.listingId ?? null,
    reportedUserId: parsed.data.reportedUserId ?? null,
    reason: parsed.data.reason,
    details: parsed.data.details ?? null,
    status: 'OPEN',
    resolvedAt: null,
  });
  return NextResponse.json({ ok: true, data: { id: report.id, status: report.status } }, { status: 201 });
}
