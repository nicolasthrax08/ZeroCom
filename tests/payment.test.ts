import { describe, expect, it } from 'vitest';
import { ORDER_EXPIRE_MINUTES } from '../lib/constants';
import { formatRMB } from '../lib/utils/money';

describe('payment', () => {
  it('order expires in 15 minutes', () => {
    expect(ORDER_EXPIRE_MINUTES).toBe(15);
  });

  it('formats RMB correctly', () => {
    expect(formatRMB(2900)).toContain('¥');
    expect(formatRMB(2900)).toContain('29');
  });
});
