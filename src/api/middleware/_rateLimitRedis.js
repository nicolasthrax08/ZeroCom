import Redis from 'ioredis';

const redisUrl = process.env.RATE_LIMIT_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

export default redis;
