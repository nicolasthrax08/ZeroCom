import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { currentUser } from '@/server/auth';
import { NotFound, Forbidden } from '@/server/errors';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  const order = await store.findPaymentOrder(id);
  if (!order) throw new NotFound('订单不存在');
  if (user && order.userId !== user.id && user.role !== 'ADMIN') throw new Forbidden('NOT_OWNER');
  return NextResponse.json({ ok: true, data: order });
}
