import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 1,
  connectTimeout: 500,
});

redis.on("error", (err) => {
  console.warn("Redis connection error (Rate Limiter failing open):", err.message);
});

export const rateLimit = ({ windowMs, max, keyFn }) => {
  return async (req, res, next) => {
    const id = keyFn(req);
    const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
    const key = `rl:${req.route?.path || req.path}:${id}:${windowStart}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }

      if (current > max) {
        const ttl = Math.ceil((windowStart + windowMs - Date.now()) / 1000);
        return res.status(429).json({
          error: "RATE_LIMITED",
          retryAfter: ttl,
        });
      }
      next();
    } catch (err) {
      // Fail open: allow request if Redis is down, but log the failure
      next();
    }
  };
};

export { redis };
