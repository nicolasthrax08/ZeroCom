import { NextResponse } from 'next/server';
import { store } from '@/server/data/store';
import { requireUser } from '@/server/auth';
import { ocrMock } from '@/server/adapters/ocr';
import { realNameSchema } from '@/lib/validation/verification';
import { recordBrokerSignal } from '@/server/broker-risk';
import { logAnalytics } from '@/server/audit';
import { BadRequest } from '@/server/errors';

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const parsed = realNameSchema.safeParse(body);
  if (!parsed.success) throw new BadRequest(parsed.error.issues[0]?.message ?? '输入无效');
  const { realName, idCardNumber } = parsed.data;
  const idCardHash = `id-card-hash-${idCardNumber}`;
  // Duplicate ID hash detection — critical broker signal.
  const reusedBy = await store.idCardHashUsed(idCardHash, user.id);
  if (reusedBy) {
    await recordBrokerSignal({
      userId: user.id,
      signalType: 'ID_CARD_REUSE',
      severity: 'CRITICAL',
      metadata: { reusedBy: reusedBy.id },
    });
    return NextResponse.json(
      { ok: false, error: { code: 'ID_CARD_REUSED', message: '该身份证已被其他账户使用' } },
      { status: 409 },
    );
  }
  const ocr = await ocrMock.verifyPrcIdCard('mock-id-card', realName);
  await store.updateVerification(user.id, {
    realNameHash: `realname-hash-${realName}`,
    idCardHash,
    idCardFrontUrl: ocr.idCardFrontUrl,
    ocrProvider: ocr.ocrProvider,
    status: ocr.ok ? 'ID_VERIFIED' : 'ID_REJECTED',
    reviewedAt: new Date().toISOString(),
  });
  await logAnalytics('verification_completed', { userId: user.id });
  return NextResponse.json({ ok: true, data: { status: ocr.ok ? 'ID_VERIFIED' : 'ID_REJECTED' } });
}
