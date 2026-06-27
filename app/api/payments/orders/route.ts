import { NextResponse } from 'next/server';
import { createOrder } from '@/server/payments';
import { requireUser } from '@/server/auth';
import { orderCreateSchema } from '@/lib/validation/payment';
import { BadRequest } from '@/server/errors';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = orderCreateSchema.safeParse(body);
  if (!parsed.success) throw new BadRequest(parsed.error.issues[0]?.message ?? '输入无效');
  const order = await createOrder({
    userId: user.id,
    planCode: parsed.data.planCode,
    provider: parsed.data.provider,
  });
  return NextResponse.json({ ok: true, data: order }, { status: 201 });
}
