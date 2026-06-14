import * as quotaService from "../services/quotaService.js";

export const quotaGate = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "AUTH_REQUIRED" });
  const isPaid = req.user.subscription?.plan !== "free" && req.user.subscription?.active === true;
  const result = quotaService.checkAndIncrement(req.user.id, isPaid);
  if (!result.allowed) {
    return res.status(402).json({ error: "QUOTA_EXHAUSTED", upgradeUrl: "/api/subscriptions", resetsAt: result.resetsAt });
  }
  res.setHeader("x-quota-remaining", result.remaining ?? "unlimited");
  next();
};
