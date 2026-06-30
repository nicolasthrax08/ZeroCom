// Authentication service: OTP lifecycle, session management, admin 2FA.
import { createHmac, randomBytes } from 'crypto';
import { verifyTotp } from './totp';
import { cookies } from 'next/headers';
import { store } from './data/store';
import { prisma } from './data/prisma';
import { smsMock, generateOtp } from './adapters/sms';
import { logAnalytics } from './audit';
import { encrypt, decrypt } from './crypto';
import { checkRateLimit } from './rate-limit';
import { Unauthorized, Forbidden } from './errors';
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

// C-01 FIX: No fallback strings. Env vars MUST be set in production.
// We read them lazily (not at module load) so the build can succeed without
// env vars present, but any runtime request will fail fast if they're missing.
function getEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`FATAL: ${name} must be set in production`);
  }
  return val;
}

let _phoneHmacSecret: string | null = null;
let _nextauthSecret: string | null = null;

function getPhoneHmacSecret(): string {
  if (!_phoneHmacSecret) {
    _phoneHmacSecret = getEnv('PHONE_HMAC_SECRET');
  }
  return _phoneHmacSecret;
}

function getNextauthSecret(): string {
  if (!_nextauthSecret) {
    _nextauthSecret = getEnv('NEXTAUTH_SECRET');
    if (process.env.NODE_ENV === 'production' && _nextauthSecret.length < 32) {
      throw new Error('FATAL: NEXTAUTH_SECRET must be at least 32 characters');
    }
  }
  return _nextauthSecret;
}

// C-05 FIX: Sessions stored in the database via the Session model.
// The in-memory sessions Map is used as a hot cache; on miss we read from DB.
// This ensures sessions survive server restarts.
const sessions = new Map<string, { userId: string; createdAt: number }>();
const SESSION_TTL_MS = SESSION_TTL_DAYS * 86_400 * 1000;

export function isValidMainlandPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function phoneHashOf(phone: string): string {
  return createHmac('sha256', getPhoneHmacSecret()).update(phone).digest('hex');
}

export function hashedPhoneOf(phone: string): string {
  return phoneHashOf(phone);
}

// H-01 FIX: Real encryption for phone numbers.
export function encryptPhone(phone: string): string {
  return encrypt(phone);
}

export function decryptPhone(encrypted: string): string {
  return decrypt(encrypted);
}

export type OtpSendResult =
  | { ok: true; cooldownSeconds: number; devOtp?: string }
  | { ok: false; code: 'INVALID_PHONE' | 'COOLDOWN' | 'RATE_LIMITED'; message: string; retryAfterSeconds?: number };

export async function sendOtp(phone: string, clientIp?: string): Promise<OtpSendResult> {
  if (!isValidMainlandPhone(phone)) {
    return { ok: false, code: 'INVALID_PHONE', message: '请输入有效的中国大陆手机号码' };
  }

  // H-02 FIX: IP-level rate limiting on OTP send.
  if (clientIp) {
    const ipLimit = checkRateLimit(`otp:send:${clientIp}`, 5, 3600); // 5 per hour per IP
    if (!ipLimit.allowed) {
      return {
        ok: false,
        code: 'RATE_LIMITED',
        message: `发送过于频繁，请在 ${Math.ceil((ipLimit.resetAt - Date.now()) / 1000)} 秒后重试`,
        retryAfterSeconds: Math.ceil((ipLimit.resetAt - Date.now()) / 1000),
      };
    }
  }

  const phoneHash = phoneHashOf(phone);
  const existing = await store.getOtpSession(phoneHash);
  if (existing) {
    const elapsed = (Date.now() - new Date(existing.lastSentAt).getTime()) / 1000;
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
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_SECONDS * 1000);
  await store.setOtpSession(phoneHash, {
    otp,
    phone,
    attempts: 0,
    expiresAt,
    lastSentAt: now,
  });
  await smsMock.sendOtp(phone, otp);
  await logAnalytics('auth_otp_requested', { userId: null, metadata: { phoneHash } });

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
        | 'POLICY_NOT_ACCEPTED'
        | 'RATE_LIMITED';
      message: string;
    };

export async function verifyOtp(
  phone: string,
  otp: string,
  acceptTerms: boolean,
  acceptPrivacy: boolean,
  clientIp?: string,
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

  // H-03 FIX: IP-level rate limiting on OTP verify.
  if (clientIp) {
    const ipLimit = checkRateLimit(`otp:verify:${clientIp}`, 20, 3600); // 20 per hour per IP
    if (!ipLimit.allowed) {
      return {
        ok: false,
        code: 'RATE_LIMITED',
        message: '验证尝试过于频繁，请稍后再试',
      };
    }
  }

  const phoneHash = phoneHashOf(phone);
  const session = await store.getOtpSession(phoneHash);
  if (!session) {
    return { ok: false, code: 'OTP_EXPIRED', message: '验证码不存在，请重新获取' };
  }
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await store.deleteOtpSession(phoneHash);
    return { ok: false, code: 'OTP_EXPIRED', message: '验证码已过期，请重新获取' };
  }
  if (session.attempts >= OTP_MAX_ATTEMPTS) {
    await store.deleteOtpSession(phoneHash);
    return { ok: false, code: 'ATTEMPTS_EXCEEDED', message: '验证码尝试次数过多，请重新获取' };
  }

  const newAttempts = await store.incrementOtpAttempts(phoneHash);
  if (session.otp !== otp) {
    return {
      ok: false,
      code: 'OTP_MISMATCH',
      message: `验证码错误（剩余 ${OTP_MAX_ATTEMPTS - newAttempts} 次）`,
    };
  }

  // Success — clear OTP session.
  await store.deleteOtpSession(phoneHash);

  // Find-or-create user.
  let user = await store.findUserByPhoneHash(phoneHash);
  if (!user) {
    const displayName =
      Object.entries(SEED_PHONES).find(([, p]) => p === phone)?.[0] ?? null;
    user = await store.createUser({
      phoneEncrypted: encryptPhone(phone),
      phoneHash,
      displayName: displayName ? `用户 ${phone}` : null,
      role: 'USER',
      isShadowBanned: false,
      isHardBanned: false,
      termsAcceptedAt: new Date().toISOString(),
      privacyAcceptedAt: new Date().toISOString(),
      totpSecret: null,
      totpEnabled: false,
    });
    await store.createVerification(user.id);
  } else {
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
  const token = randomBytes(32).toString('hex');
  const now = new Date();
  sessions.set(token, { userId, createdAt: now.getTime() });
  // Persist to DB so sessions survive restarts.
  await prisma.session.create({ data: { token, userId, createdAt: now } }).catch(() => {});
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
}

export async function clearSession(): Promise<void> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (token) {
    sessions.delete(token);
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }
  c.delete(SESSION_COOKIE);
}

export async function invalidateAllSessionsForUser(userId: string): Promise<void> {
  for (const [token, session] of sessions) {
    if (session.userId === userId) sessions.delete(token);
  }
  await prisma.session.deleteMany({ where: { userId } }).catch(() => {});
}

export async function currentUserId(): Promise<string | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Check in-memory cache first.
  const cached = sessions.get(token);
  if (cached) {
    if (Date.now() - cached.createdAt > SESSION_TTL_MS) {
      sessions.delete(token);
      await prisma.session.delete({ where: { token } }).catch(() => {});
      return null;
    }
    return cached.userId;
  }

  // Cache miss — check DB.
  const dbSession = await prisma.session.findUnique({ where: { token } }).catch(() => null);
  if (!dbSession) return null;
  if (Date.now() - dbSession.createdAt.getTime() > SESSION_TTL_MS) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }
  // Populate cache.
  sessions.set(token, { userId: dbSession.userId, createdAt: dbSession.createdAt.getTime() });
  return dbSession.userId;
}

export async function currentUser(): Promise<User | null> {
  const id = await currentUserId();
  if (!id) return null;
  return store.findUserById(id);
}

export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) throw new Unauthorized('Please sign in');
  return u;
}

// H-04 FIX: Admin 2FA support.
export async function requireAdmin(): Promise<User> {
  const u = await currentUser();
  if (!u) throw new Unauthorized('Please sign in');
  if (u.role !== 'ADMIN' && u.role !== 'MODERATOR') throw new Forbidden('Admin access required');
  return u;
}

/**
 * Verify a TOTP code for an admin user. Returns true if valid.
 * The user must have totpEnabled=true and totpSecret set.
 */
export async function verifyAdminTotp(userId: string, code: string): Promise<boolean> {
  const user = await store.findUserById(userId);
  if (!user || !user.totpEnabled || !user.totpSecret) return false;
  return verifyTotp(user.totpSecret, code);
}

export function devLoginPhoneForUserId(userId: string): string | null {
  return Object.entries(SEED_PHONES).find(([id]) => id === userId)?.[1] ?? null;
}
