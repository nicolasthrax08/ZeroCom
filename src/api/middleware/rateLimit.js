import redis from './_rateLimitRedis.js';

export const rateLimit = ({ windowMs, max, keyFn = (req) => req.ip, routeName = 'global' }) => {
  return async (req, res, next) => {
    const id = keyFn(req);
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const key = `rl:${routeName}:${id}:${windowStart}`;

    try {
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000) + 1);
      }

      if (count > max) {
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
        return res.status(429).json({
          error: 'RATE_LIMITED',
          retryAfter: Math.ceil(windowMs / 1000),
        });
      }

      next();
    } catch (err) {
      // Fail open to avoid blocking requests if Redis is down
      console.error('Rate limit Redis error:', err);
      next();
    }
  };
};
