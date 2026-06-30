// Simple in-memory rate limiter.
// For production with multiple instances, replace with Redis-based limiting.

const buckets = new Map<string, { count: number; resetAt: number }>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(key: string, max: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: max - 1, resetAt: now + windowSeconds * 1000 };
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: max - existing.count, resetAt: existing.resetAt };
}

/**
 * Clean up expired entries. Call periodically if memory is a concern.
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, val] of buckets) {
    if (val.resetAt <= now) buckets.delete(key);
  }
}
