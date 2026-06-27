// Mock provider adapters for Alipay and WeChat Pay.
// They implement PaymentProviderAdapter. Production implementations sign requests
// with merchant private keys stored in KMS/HSM and verify webhooks with the
// provider's public keys.

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
  async verifyWebhook(_headers, rawBody) {
    // Production: verify RSA2 signature using Alipay's public key.
    // Mock: parse and echo.
    let parsed: { out_trade_no?: string; trade_no?: string };
    try {
      parsed = JSON.parse(rawBody.toString());
    } catch {
      parsed = { out_trade_no: '', trade_no: '' };
    }
    return {
      outTradeNo: parsed.out_trade_no ?? '',
      tradeNo: parsed.trade_no ?? `sim-alipay-${Date.now()}`,
      amountFen: 0,
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
  async verifyWebhook(_headers, rawBody) {
    // Production: decrypt AEAD_AES_256_GCM payload, verify HMAC-SHA256 signature.
    let parsed: { out_trade_no?: string; transaction_id?: string };
    try {
      parsed = JSON.parse(rawBody.toString());
    } catch {
      parsed = { out_trade_no: '', transaction_id: '' };
    }
    return {
      outTradeNo: parsed.out_trade_no ?? '',
      tradeNo: parsed.transaction_id ?? `sim-wx-${Date.now()}`,
      amountFen: 0,
      status: 'SUCCESS',
    };
  },
  async queryOrder() {
    return 'PENDING';
  },
};
