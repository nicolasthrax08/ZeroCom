import { describe, expect, it } from 'vitest';
import {
  aggregateScore,
  recommendEnforcement,
  firstMessageLooksLikeBrokerOutbound,
} from '../server/broker-risk';

describe('broker risk scoring', () => {
  it('aggregates scores by severity', () => {
    const agg = aggregateScore([
      { severity: 'MEDIUM', score: 20 } as any,
      { severity: 'HIGH', score: 50 } as any,
    ]);
    expect(agg).toBe(70);
  });

  it('shadow ban recommended for high scores', () => {
    expect(recommendEnforcement(80, false)).toBe('SHADOW_BAN');
    expect(recommendEnforcement(120, false)).toBe('HARD_BAN');
    expect(recommendEnforcement(10, false)).toBe('NONE');
  });

  it('critical always triggers hard ban', () => {
    expect(recommendEnforcement(0, true)).toBe('HARD_BAN');
  });

  it('flags broker-ish first messages', () => {
    expect(firstMessageLooksLikeBrokerOutbound('加我微信 wechatid').flagged).toBe(true);
    expect(firstMessageLooksLikeBrokerOutbound('电话 13800138000 联系').flagged).toBe(true);
    expect(firstMessageLooksLikeBrokerOutbound('感兴趣的请扫码').flagged).toBe(true);
    expect(firstMessageLooksLikeBrokerOutbound('房子还在吗？想看房').flagged).toBe(false);
  });
});
