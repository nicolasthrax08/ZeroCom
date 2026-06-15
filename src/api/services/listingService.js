import redis from './redisClient.js';

export const create = async (data) => {
  const id = `l_${Date.now()}`;
  const listing = {
    ...data,
    id,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  await redis.hset(`listing:${id}`, listing);
  await redis.sadd('listings:active', id);
  return listing;
};

export const getById = async (id) => {
  const data = await redis.hgetall(`listing:${id}`);
  if (!data || !data.id) return null;
  return data;
};

export const list = async ({ city, district, minPrice, maxPrice, page = 1, pageSize = 10 }) => {
  const ids = await redis.smembers('listings:active');
  let filtered = [];
  
  for (const id of ids) {
    const listing = await redis.hgetall(`listing:${id}`);
    if (!listing || listing.status !== 'active') continue;
    
    if (city && listing.city !== city) continue;
    if (district && listing.district !== district) continue;
    if (minPrice && parseFloat(listing.priceWan) < parseFloat(minPrice)) continue;
    if (maxPrice && parseFloat(listing.priceWan) > parseFloat(maxPrice)) continue;
    
    filtered.push(listing);
  }

  const start = (page - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
};

export const update = async (id, data) => {
  const exists = await redis.exists(`listing:${id}`);
  if (!exists) return null;
  
  await redis.hmset(`listing:${id}`, data);
  const updated = await redis.hgetall(`listing:${id}`);
  return updated;
};

export const softDelete = async (id) => {
  const exists = await redis.exists(`listing:${id}`);
  if (!exists) return false;
  
  await redis.hset(`listing:${id}`, 'status', 'removed');
  await redis.srem('listings:active', id);
  return true;
};
