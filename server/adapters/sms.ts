// Mock SMS adapter. Production would plug in Tencent Cloud SMS / Alibaba Cloud SMS.
// The interface matches SmsProviderAdapter so swapping is a one-file change.
import { randomInt } from 'crypto';

export interface SmsProviderAdapter {
  sendOtp(phone: string, otp: string): Promise<void>;
}

export function generateOtp(): string {
  // cryptographically secure — do NOT replace with Math.random()
  return String(randomInt(100_000, 1_000_000));
}

export const smsMock: SmsProviderAdapter = {
  async sendOtp(_phone: string, _otp: string): Promise<void> {
    // In production: call SMS provider API. Never log OTPs.
  },
};

