import { NextResponse } from 'next/server';
import { verifyOtp, issueSession } from '@/server/auth';
import { otpVerifySchema } from '@/lib/validation/otp';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'BAD_JSON', message: '请求体错误' } }, { status: 400 });
  }
  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? '输入无效' } },
      { status: 400 },
    );
  }
  const { phone, otp, acceptTerms, acceptPrivacy } = parsed.data;
  const result = await verifyOtp(phone, otp, acceptTerms, acceptPrivacy);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: { code: result.code, message: result.message } },
      { status: 401 },
    );
  }
  await issueSession(result.userId);
  return NextResponse.json(
    { ok: true, data: { userId: result.userId, role: result.role, verificationStatus: result.verificationStatus } },
    { status: 200 },
  );
}
