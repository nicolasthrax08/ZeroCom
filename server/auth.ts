// Authentication service: OTP lifecycle, session cookie management.
import { cookies } from 'next/headers';
import { store } from './data/store';
import { otpMock, smsMock, generateOtp } from './adapters/sms';
import { logAnalytics } from './audit';
import {
  OTP_COOLDOWN_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_SECONDS,
  PHONE_REGEX,
  SEED_PHONES,
} from '@/lib/constants';
import type { User } from './data/types';

const SESSION_COOKIE = 'zerocom_session';
const SESSION_TTL_DAYS = 7;

export function isValidMainlandPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

function phoneHashOf(phone: string): string {
  // For demo we use a stable hash; production would use HMAC-SHA256.
  return `hash-${phone}`;
}

export function hashedPhoneOf(phone: string): string {
  return phoneHashOf(phone);
}

export type OtpSendResult =
  | { ok: true; cooldownSeconds: number; devOtp?: string }
  | { ok: false; code: 'INVALID_PHONE' | 'COOLDOWN'; message: string; retryAfterSeconds?: number };

export async function sendOtp(phone: string): Promise<OtpSendResult> {
  if (!isValidMainlandPhone(phone)) {
    return { ok: false, code: 'INVALID_PHONE', message: '请输入有效的中国大陆手机号码' };
  }
  const phoneHash = phoneHashOf(phone);
  const existing = store.otpSessions.get(phoneHash);
  const now = Date.now();
  if (existing) {
    const elapsed = (now - new Date(existing.lastSentAt).getTime()) / 1000;
    if (elapsed < OTP_COOLDOWN_SECONDS) {
      return {
        ok: false,
        code: 'COOLDOWN',
        message: `请稍后再试（${Math.ceil(OTP_COOLDOWN_SECONDS - elapsed)} 秒后重试）`,
        retryAfterSeconds: Math.ceil(OTP_COOLDOWN_SECONDS - elapsed),
      };
    }
  }
  const otp = generateOtp();
  const expiresAt = new Date(now + OTP_TTL_SECONDS * 1000).toISOString();
  store.otpSessions.set(phoneHash, {
    otp,
    phone,
    attempts: 0,
    expiresAt,
    lastSentAt: new Date(now).toISOString(),
  });
  await smsMock.sendOtp(phone, otp);
  await logAnalytics('auth_otp_requested', { userId: null, metadata: { phone } });

  const isDev = process.env.NODE_ENV !== 'production';
  return {
    ok: true,
    cooldownSeconds: OTP_COOLDOWN_SECONDS,
    devOtp: isDev ? otp : undefined,
  };
}

export type OtpVerifyResult =
  | {
      ok: true;
      userId: string;
      role: User['role'];
      verificationStatus: string;
    }
  | {
      ok: false;
      code:
        | 'INVALID_PHONE'
        | 'OTP_MISMATCH'
        | 'OTP_EXPIRED'
        | 'ATTEMPTS_EXCEEDED'
        | 'POLICY_NOT_ACCEPTED';
      message: string;
    };

export async function verifyOtp(
  phone: string,
  otp: string,
  acceptTerms: boolean,
  acceptPrivacy: boolean,
): Promise<OtpVerifyResult> {
  if (!isValidMainlandPhone(phone) || !/^\d{6}$/.test(otp)) {
    return { ok: false, code: 'INVALID_PHONE', message: '手机号或验证码无效' };
  }
  if (!acceptTerms || !acceptPrivacy) {
    return {
      ok: false,
      code: 'POLICY_NOT_ACCEPTED',
      message: '请先同意《服务条款》和《隐私政策》',
    };
  }
  const phoneHash = phoneHashOf(phone);
  const session = store.otpSessions.get(phoneHash);
  if (!session) {
    return { ok: false, code: 'OTP_EXPIRED', message: '验证码不存在，请重新获取' };
  }
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    return { ok: false, code: 'OTP_EXPIRED', message: '验证码已过期，请重新获取' };
  }
  if (session.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, code: 'ATTEMPTS_EXCEEDED', message: '验证码尝试次数过多，请重新获取' };
  }
  session.attempts += 1;
  if (session.otp !== otp) {
    return {
      ok: false,
      code: 'OTP_MISMATCH',
      message: `验证码错误（剩余 ${OTP_MAX_ATTEMPTS - session.attempts} 次）`,
    };
  }

  // Find-or-create user.
  let user = await store.findUserByPhoneHash(phoneHash);
  if (!user) {
    const displayName =
      Object.entries(SEED_PHONES).find(([, p]) => p === phone)?.[0] ?? null;
    user = await store.createUser({
      phoneEncrypted: `enc-${phone}`,
      phoneHash,
      displayName: displayName ? `用户 ${phone}` : null,
      role: 'USER',
      isShadowBanned: false,
      isHardBanned: false,
      termsAcceptedAt: new Date().toISOString(),
      privacyAcceptedAt: new Date().toISOString(),
    });
    // Create a default Tier-1 verification record.
    await store.createVerification(user.id);
  } else {
    // Update policy acceptance timestamps.
    await store.updateUser(user.id, {
      termsAcceptedAt: user.termsAcceptedAt ?? new Date().toISOString(),
      privacyAcceptedAt: user.privacyAcceptedAt ?? new Date().toISOString(),
    });
  }

  await logAnalytics('auth_completed', { userId: user.id });

  const verification = await store.findVerificationByUserId(user.id);
  return {
    ok: true,
    userId: user.id,
    role: user.role,
    verificationStatus: verification?.status ?? 'PHONE_ONLY',
  };
}

export async function issueSession(userId: string): Promise<void> {
  const c = await cookies();
  c.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
}

export async function clearSession(): Promise<void> {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}

export async function currentUserId(): Promise<string | null> {
  const c = await cookies();
  const v = c.get(SESSION_COOKIE)?.value;
  return v ?? null;
}

export async function currentUser(): Promise<User | null> {
  const id = await currentUserId();
  if (!id) return null;
  return store.findUserById(id);
}

export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) throw new Error('UNAUTHENTICATED');
  return u;
}

export async function requireAdmin(): Promise<User> {
  const u = await currentUser();
  if (!u) throw new Error('UNAUTHENTICATED');
  if (u.role !== 'ADMIN' && u.role !== 'MODERATOR') throw new Error('FORBIDDEN');
  return u;
}

export function devLoginPhoneForUserId(userId: string): string | null {
  return Object.entries(SEED_PHONES).find(([id]) => id === userId)?.[1] ?? null;
}
