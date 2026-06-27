import { NextResponse } from 'next/server';
import { hardBan } from '@/server/broker-risk';
import { requireAdmin } from '@/server/auth';
import { store } from '@/server/data/store';
import { NotFound } from '@/server/errors';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const user = await store.findUserById(id);
  if (!user) throw new NotFound('用户不存在');
  await hardBan(id, null, '管理员执行永久封禁');
  return NextResponse.json({ ok: true, data: { id, isHardBanned: true } });
}
