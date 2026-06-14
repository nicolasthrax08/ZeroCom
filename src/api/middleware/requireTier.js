export const requireTier = (min) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "AUTH_REQUIRED" });
  const tier = req.user.verificationTier === "phone+ID" ? 2 : 1;
  if (tier < min) return res.status(403).json({ error: "INSUFFICIENT_TIER", required: min, actual: tier });
  next();
};
