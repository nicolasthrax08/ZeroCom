import { describe, expect, it } from 'vitest';
import { isValidMainlandPhone } from '../server/auth';
import { PHONE_REGEX } from '../lib/constants';

describe('phone validation', () => {
  it('accepts valid numbers', () => {
    expect(isValidMainlandPhone('13800138000')).toBe(true);
    expect(isValidMainlandPhone('19912345678')).toBe(true);
    expect(PHONE_REGEX.test('15900001111')).toBe(true);
  });

  it('rejects invalid prefixes', () => {
    expect(isValidMainlandPhone('12345678901')).toBe(false);
    expect(isValidMainlandPhone('11111111111')).toBe(false);
    expect(isValidMainlandPhone('1380013800')).toBe(false);
    expect(isValidMainlandPhone('')).toBe(false);
  });
});
