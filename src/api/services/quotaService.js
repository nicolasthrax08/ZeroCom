const quotas = new Map();

export const checkAndIncrement = (userId, isPaid) => {
  if (isPaid) {
    return { allowed: true, resetsAt: new Date().toISOString() };
  }

  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const key = `${userId}:${today}`;
  const currentCount = quotas.get(key) || 0;

  if (currentCount >= 5) {
    return { 
        allowed: false, 
        resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString() 
    };
  }

  quotas.set(key, currentCount + 1);
  return { 
      allowed: true, 
      remaining: 4 - currentCount, 
      resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString() 
  };
};
