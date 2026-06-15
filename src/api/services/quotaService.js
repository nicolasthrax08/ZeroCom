import redis from './redisClient.js';

const TTL_SECONDS = 15 * 60;

export const checkAndIncrement = async (userId, isPaid) => {
  if (isPaid) {
    return { allowed: true, resetsAt: new Date().toISOString() };
  }

  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const key = `quota:${userId}:${today}`;
  
  const currentCount = await redis.incr(key);
  if (currentCount === 1) {
    await redis.expire(key, 86400);
  }
  
  if (currentCount > 5) {
    return { 
        allowed: false, 
        resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString() 
    };
  }

  return { 
      allowed: true, 
      remaining: 5 - currentCount, 
      resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString() 
  };
};
