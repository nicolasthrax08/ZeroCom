import * as userStore from '../services/userStore.js';
import * as quotaService from '../services/quotaService.js';

export const quotaGate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Missing x-user-id' });
  }
  const user = userStore.getById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const isPaid = user.subscription.plan !== 'free';
  const result = quotaService.checkAndIncrement(userId, isPaid);

  if (!result.allowed) {
    return res.status(402).json({ error: 'QUOTA_EXHAUSTED', upgradeUrl: '/api/subscriptions' });
  }
  
  req.user = user;
  next();
};
