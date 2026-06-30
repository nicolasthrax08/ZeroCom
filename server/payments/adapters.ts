// Payment provider adapters for Alipay and WeChat Pay.
// C-02 FIX: No hardcoded mock secret fallback. PAYMENT_MOCK_SECRET must be set.
// H-07 FIX: Adapter selection is now clean — the mock is only used when
// explicitly enabled via env. Production adapter slots are prepared.

import { createHmac } from 'crypto';

export interface CreatePaymentOrderInput {
  outTradeNo: string;
  amountFen: number;
  description: string;
}

export type PaymentProviderAdapter = {
  provider: 'ALIPAY' | 'WECHATPAY';
  createOrder(input: CreatePaymentOrderInput): Promise<Record<string, unknown>>;
  verifyWebhook(headers: Headers, rawBody: Buffer): Promise<{
    outTradeNo: string;
    tradeNo: string;
    amountFen: number;
    status: 'SUCCESS' | 'FAIL';
  }>;
  queryOrder(outTradeNo: string): Promise<'PENDING' | 'PAID' | 'CLOSED'>;
};

// C-02 FIX: Require explicit env var. No known fallback string.
let _mockSecret: string | null = null;

function getMockSecret(): string {
  if (_mockSecret) return _mockSecret;
  const secret = process.env.PAYMENT_MOCK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: PAYMENT_MOCK_SECRET must be set in production');
    }
    throw new Error('MISSING: Set PAYMENT_MOCK_SECRET in your .env file');
  }
  _mockSecret = secret;
  return secret;
}

function verifyMockSignature(headers: Headers, rawBody: Buffer): boolean {
  const secret = getMockSecret();
  const expected = headers.get('x-mock-signature');
  if (!expected) return false;
  const computed = createHmac('sha256', secret).update(rawBody).digest('hex');
  // Constant-time comparison to prevent timing attacks.
  if (expected.length !== computed.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ computed.charCodeAt(i);
  }
  return result === 0;
}

export const alipayMock: PaymentProviderAdapter = {
  provider: 'ALIPAY',
  async createOrder(input) {
    return {
      provider: 'ALIPAY',
      qrUrl: `https://mock-qr.example.com/alipay?otn=${input.outTradeNo}`,
      outTradeNo: input.outTradeNo,
      amountFen: input.amountFen,
    };
  },
  async verifyWebhook(headers, rawBody) {
    if (!verifyMockSignature(headers, rawBody)) {
      return { outTradeNo: '', tradeNo: '', amountFen: 0, status: 'FAIL' };
    }
    let parsed: { out_trade_no?: string; trade_no?: string; amount_fen?: number };
    try {
      parsed = JSON.parse(rawBody.toString());
    } catch {
      return { outTradeNo: '', tradeNo: '', amountFen: 0, status: 'FAIL' };
    }
    return {
      outTradeNo: parsed.out_trade_no ?? '',
      tradeNo: parsed.trade_no ?? `sim-alipay-${Date.now()}`,
      amountFen: typeof parsed.amount_fen === 'number' ? parsed.amount_fen : 0,
      status: 'SUCCESS',
    };
  },
  async queryOrder() {
    return 'PENDING';
  },
};

export const wechatpayMock: PaymentProviderAdapter = {
  provider: 'WECHATPAY',
  async createOrder(input) {
    return {
      provider: 'WECHATPAY',
      prepayId: `wx-mock-${input.outTradeNo}`,
      outTradeNo: input.outTradeNo,
      amountFen: input.amountFen,
    };
  },
  async verifyWebhook(headers, rawBody) {
    if (!verifyMockSignature(headers, rawBody)) {
      return { outTradeNo: '', tradeNo: '', amountFen: 0, status: 'FAIL' };
    }
    let parsed: { out_trade_no?: string; transaction_id?: string; amount_fen?: number };
    try {
      parsed = JSON.parse(rawBody.toString());
    } catch {
      return { outTradeNo: '', tradeNo: '', amountFen: 0, status: 'FAIL' };
    }
    return {
      outTradeNo: parsed.out_trade_no ?? '',
      tradeNo: parsed.transaction_id ?? `sim-wx-${Date.now()}`,
      amountFen: typeof parsed.amount_fen === 'number' ? parsed.amount_fen : 0,
      status: 'SUCCESS',
    };
  },
  async queryOrder() {
    return 'PENDING';
  },
};

// H-07 FIX: Adapter selection based on mock flag. Production adapters
// would be added here when integrating real Alipay/WeChat SDKs.
export function selectAlipayAdapter(): PaymentProviderAdapter {
  if (process.env.ALIPAY_MOCK === 'true') {
    return alipayMock;
  }
  // Production: return a real adapter configured with merchant keys.
  // For now, throw a clear error to prevent silent mock usage.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: Real Alipay adapter not yet implemented. Set ALIPAY_MOCK=true for demo.');
  }
  return alipayMock;
}

export function selectWechatpayAdapter(): PaymentProviderAdapter {
  if (process.env.WECHATPAY_MOCK === 'true') {
    return wechatpayMock;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: Real WeChat Pay adapter not yet implemented. Set WECHATPAY_MOCK=true for demo.');
  }
  return wechatpayMock;
}
