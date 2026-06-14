import { verifyAccessToken } from "../services/jwtService.js";
import * as userStore from "../services/userStore.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: "MISSING_TOKEN" });

  try {
    const payload = verifyAccessToken(match[1]);
    const user = userStore.getById(payload.sub);
    if (!user) return res.status(401).json({ error: "USER_NOT_FOUND" });
    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ error: "TOKEN_EXPIRED" });
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
