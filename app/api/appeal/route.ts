import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { appealSchema } from '@/lib/validation/report';
import { BadRequest, NotFound } from '@/server/errors';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = appealSchema.safeParse(body);
  if (!parsed.success) throw new BadRequest(parsed.error.issues[0]?.message ?? '输入无效');
  const enforcements = await store.listEnforcements(user.id);
  const target = enforcements.find((e) => e.id === parsed.data.enforcementId);
  if (!target) throw new NotFound('未找到对应的执行记录');
  const appeal = await store.createAppeal({
    userId: user.id,
    enforcementId: target.id,
    reason: parsed.data.reason,
    supportingText: parsed.data.supportingText ?? null,
    status: 'OPEN',
    resolvedAt: null,
  });
  return NextResponse.json({ ok: true, data: { id: appeal.id, status: appeal.status } }, { status: 201 });
}
