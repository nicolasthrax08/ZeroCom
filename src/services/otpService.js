
import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis();

const SmsProvider = {
  async send(phone, message) {
    // TODO: Swap this out for Aliyun or Tencent SMS implementation
    console.log(`[SMS Provider] Sending to ${phone}: ${message}`);
    return true;
  }
};

export async function sendOtp(phone) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const dailyKey = `otp:daily:${phone}:${today}`;
  const cooldownKey = `otp:cooldown:${phone}`;
  const otpKey = `otp:${phone}`;

  // 1. Check Daily Limit (3 sends/day)
  const dailyCount = await redis.get(dailyKey);
  if (dailyCount && parseInt(dailyCount) >= 3) {
    throw new Error('Daily OTP limit reached. Please try again tomorrow.');
  }

  // 2. Check Cooldown (60s)
  const cooldown = await redis.get(cooldownKey);
  if (cooldown) {
    throw new Error('Please wait 60 seconds before requesting a new code.');
  }

  // 3. Generate 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();

  // 4. Store OTP with 300s TTL
  await redis.set(otpKey, code, 'EX', 300);

  // 5. Set Cooldown (60s)
  await redis.set(cooldownKey, '1', 'EX', 60);

  // 6. Increment Daily Count (24h TTL)
  await redis.incr(dailyKey);
  if (parseInt(dailyCount || 0) === 0) {
    await redis.expire(dailyKey, 86400);
  }

  // 7. Dispatch SMS
  await SmsProvider.send(phone, `Your verification code is: ${code}`);

  return { success: true };
}

export async function verifyOtp(phone, code) {
  const otpKey = `otp:${phone}`;
  const failKey = `otp:fail:${phone}`;

  // 1. Check Lockout (5 failures -> 1h lockout)
  const failCount = await redis.get(failKey);
  if (failCount && parseInt(failCount) >= 5) {
    throw new Error('Too many failed attempts. Please try again in 1 hour.');
  }

  // 2. Single GET to check code
  const storedCode = await redis.get(otpKey);

  if (storedCode && storedCode === code) {
    // Match: delete OTP and reset failure count
    await redis.del(otpKey);
    await redis.del(failKey);
    return { success: true };
  }

  // 3. Failure: increment fail count
  await redis.incr(failKey);
  await redis.expire(failKey, 3600);

  return { success: false, message: 'Invalid verification code.' };
}
