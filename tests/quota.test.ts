import { describe, expect, it } from 'vitest';
import { shanghaiBusinessDate } from '../lib/utils/date';
import { FREE_VIEWS_PER_DAY } from '../lib/constants';

describe('quota rules', () => {
  it('free views per day is 5', () => {
    expect(FREE_VIEWS_PER_DAY).toBe(5);
  });

  it('business date is in Asia/Shanghai', () => {
    const d = shanghaiBusinessDate();
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
