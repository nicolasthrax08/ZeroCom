import { describe, expect, it } from 'vitest';
import {
  evaluateHighFrequency,
  evaluateGeoSkip,
  evaluateAlwaysViewNeverEngage,
  evaluateMultiPhoneOneDevice,
} from '../server/broker-risk';

describe('broker behavioral detection predicates', () => {
  describe('evaluateHighFrequency', () => {
    it('returns null at exactly 30 listings (threshold is >30)', () => {
      const views = Array.from({ length: 30 }, () => ({ district: 'A' }));
      expect(evaluateHighFrequency(views)).toBeNull();
    });

    it('fires at 31 listings within one district', () => {
      const views = Array.from({ length: 31 }, () => ({ district: 'A' }));
      const meta = evaluateHighFrequency(views);
      expect(meta).not.toBeNull();
      expect(meta?.views).toBe(31);
      expect(meta?.districts).toBe(1);
    });

    it('counts distinct districts', () => {
      const views = [
        ...Array.from({ length: 20 }, () => ({ district: 'A' })),
        ...Array.from({ length: 20 }, () => ({ district: 'B' })),
      ];
      const meta = evaluateHighFrequency(views);
      expect(meta?.districts).toBe(2);
    });
  });

  describe('evaluateGeoSkip', () => {
    it('returns null below 5 cities', () => {
      expect(evaluateGeoSkip(['Shanghai', 'Beijing', 'Shenzhen', 'Hangzhou'])).toBeNull();
    });

    it('fires at 5 distinct cities', () => {
      const meta = evaluateGeoSkip(['Shanghai', 'Beijing', 'Shenzhen', 'Hangzhou', 'Chengdu']);
      expect(meta).not.toBeNull();
      expect(meta?.cities).toBe(5);
    });
  });

  describe('evaluateAlwaysViewNeverEngage', () => {
    it('returns null below 100 views', () => {
      expect(evaluateAlwaysViewNeverEngage(99, false)).toBeNull();
    });

    it('returns null when the user has chatted recently (engaged)', () => {
      expect(evaluateAlwaysViewNeverEngage(150, true)).toBeNull();
    });

    it('fires at 100 views with no recent chat', () => {
      const meta = evaluateAlwaysViewNeverEngage(100, false);
      expect(meta).not.toBeNull();
      expect(meta?.views).toBe(100);
    });
  });

  describe('evaluateMultiPhoneOneDevice', () => {
    it('returns null at 2 devices (threshold is >2)', () => {
      expect(evaluateMultiPhoneOneDevice(2)).toBeNull();
    });

    it('fires at 3 devices', () => {
      const meta = evaluateMultiPhoneOneDevice(3);
      expect(meta).not.toBeNull();
      expect(meta?.deviceCount).toBe(3);
    });
  });
});
