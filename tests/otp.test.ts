import { describe, expect, it } from 'vitest';
import { OTP_COOLDOWN_SECONDS, OTP_MAX_ATTEMPTS, OTP_TTL_SECONDS } from '../lib/constants';
import { smsMock, generateOtp } from '../server/adapters/sms';

describe('otp lifecycle', () => {
  it('generates a 6-digit OTP', () => {
    const otp = generateOtp();
    expect(otp).toMatch(/^\d{6}$/);
  });

  it('cooldown is 60 seconds', () => {
    expect(OTP_COOLDOWN_SECONDS).toBe(60);
  });

  it('max attempts is 3', () => {
    expect(OTP_MAX_ATTEMPTS).toBe(3);
  });

  it('otp ttl is 300 seconds', () => {
    expect(OTP_TTL_SECONDS).toBe(300);
  });

  it('sms mock does not throw', async () => {
    await expect(smsMock.sendOtp('13800000001', '123456')).resolves.toBeUndefined();
  });
});
