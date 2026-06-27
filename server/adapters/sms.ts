// Mock SMS adapter. Production would plug in Tencent Cloud SMS / Alibaba Cloud SMS.
// The interface matches SmsProviderAdapter so swapping is a one-file change.

export interface SmsProviderAdapter {
  sendOtp(phone: string, otp: string): Promise<void>;
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const smsMock: SmsProviderAdapter = {
  async sendOtp(phone: string, otp: string): Promise<void> {
    // In production: call SMS provider API. Here we just log.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[smsMock] OTP ${otp} sent to ${phone}`);
    }
  },
};

// OTP lifecycle adapter. Production would back this with Redis / DB.
export const otpMock = {
  async verify(_phone: string, _otp: string): Promise<boolean> {
    return true;
  },
};
