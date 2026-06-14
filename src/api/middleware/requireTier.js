import * as userStore from '../services/userStore.js';

export const requireTier = (min) => (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Missing x-user-id' });
  }
  const user = userStore.getById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const tier = user.verificationTier === 'phone+ID' ? 2 : 1;
  if (tier < min) {
    return res.status(403).json({ error: 'Insufficient tier' });
  }
  
  req.user = user;
  next();
};
