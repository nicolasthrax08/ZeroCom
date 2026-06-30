import { NextResponse } from 'next/server';
import { sendOtp } from '@/server/auth';
import { otpSendSchema } from '@/lib/validation/otp';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'BAD_JSON', message: '请求体错误' } }, { status: 400 });
  }
  const parsed = otpSendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: 'INVALID_INPUT', message: parsed.error.issues[0]?.message ?? '输入无效' } },
      { status: 400 },
    );
  }
  const result = await sendOtp(parsed.data.phone);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: { code: result.code, message: result.message }, retryAfterSeconds: result.retryAfterSeconds },
      { status: 429 },
    );
  }
  return NextResponse.json(
    { ok: true, data: { cooldownSeconds: result.cooldownSeconds, devOtp: result.devOtp } },
    { status: 200 },
  );
}
