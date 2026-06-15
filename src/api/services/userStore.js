import redis from './redisClient.js';

const USER_PREFIX = 'user:';

export const getById = async (id) => {
  const data = await redis.hgetall(`${USER_PREFIX}${id}`);
  if (!data || !data.id) return null;
  
  // Reconstruct nested objects
  if (data.subscription) {
    try {
      data.subscription = JSON.parse(data.subscription);
    } catch (e) {
      data.subscription = { plan: 'free', active: false };
    }
  }
  
  return data;
};

export const upsert = async (user) => {
  const userKey = `${USER_PREFIX}${user.id}`;
  const userData = { ...user };
  
  // Serialize nested objects for Redis
  if (userData.subscription) {
    userData.subscription = JSON.stringify(userData.subscription);
  }
  
  await redis.hmset(userKey, userData);
  return user;
};

// Initialize default users if they don't exist
export const initializeDefaultUsers = async () => {
  const defaultUsers = [
    { id: 'u_free', phone: '13800000000', verificationTier: 'phone_only', subscription: { plan: 'free', active: false } },
    { id: 'u_paid_t2', phone: '13900000000', verificationTier: 'phone+ID', subscription: { plan: 'monthly', active: true } }
  ];
  
  for (const user of defaultUsers) {
    const exists = await redis.exists(`${USER_PREFIX}${user.id}`);
    if (!exists) {
      await upsert(user);
    }
  }
};
