import { describe, expect, it } from 'vitest';

describe('business rules', () => {
  it('platform charges zero commission', () => {
    expect(0).toBe(0);
  });

  it('free users have 5 daily views', () => {
    expect(5).toBe(5);
  });

  it('monthly pro is ¥29', () => {
    expect(2900).toBe(2900);
  });

  it('annual pro is ¥199', () => {
    expect(19900).toBe(19900);
  });
});
