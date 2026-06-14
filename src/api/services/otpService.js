import crypto from 'crypto';
import redis from './redisClient.js';
import smsProvider from './smsProvider.js';

export async function sendOtp(phone) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const dailyKey = `otp:daily:${phone}:${dateStr}`;
    const cooldownKey = `otp:cooldown:${phone}`;
    const otpKey = `otp:otp:${phone}`;

    // 1. Daily limit check
    const dailyCount = await redis.get(dailyKey);
    if (dailyCount && parseInt(dailyCount) >= 3) {
        return { ok: false, reason: 'DAILY_LIMIT' };
    }

    // 2. Cooldown check
    const cooldown = await redis.get(cooldownKey);
    if (cooldown) {
        return { ok: false, reason: 'COOLDOWN' };
    }

    // Generate code
    const code = crypto.randomInt(100000, 999999).toString();

    // 3. Store OTP
    await redis.set(otpKey, code, 'EX', 300);

    // 4. Set Cooldown
    await redis.set(cooldownKey, '1', 'EX', 60, 'NX');

    // 5. Increment daily count
    const multi = redis.multi();
    multi.incr(dailyKey);
    // Set 24h TTL on first hit
    if (!dailyCount) {
        multi.expire(dailyKey, 86400);
    }
    await multi.exec();

    // 6. Send SMS
    smsProvider.send(phone, code);

    return { ok: true };
}

export async function verifyOtp(phone, code) {
    const otpKey = `otp:otp:${phone}`;
    const failKey = `otp:fail:${phone}`;

    // 1. Lockout check
    const failCount = await redis.get(failKey);
    if (failCount && parseInt(failCount) >= 5) {
        return { ok: false, reason: 'LOCKED' };
    }

    // 2. Get OTP
    const storedCode = await redis.get(otpKey);
    if (!storedCode) {
        return { ok: false, reason: 'NO_CODE' };
    }

    // 3. Compare
    if (storedCode === code) {
        await redis.del(otpKey);
        await redis.del(failKey);
        return { ok: true };
    } else {
        // Increment fail count
        const newFailCount = await redis.incr(failKey);
        if (newFailCount === 1) {
            await redis.expire(failKey, 3600);
        }
        return { ok: false, reason: 'MISMATCH' };
    }
}
