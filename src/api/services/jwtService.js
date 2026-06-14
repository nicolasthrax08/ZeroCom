import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-only-secret-do-not-use-in-prod";
const TTL_SECONDS = 15 * 60;

export function signAccessToken({ userId, tier }) {
  if (!userId) throw new Error("signAccessToken requires userId");
  return jwt.sign({ sub: userId, tier: tier || 1 }, SECRET, { expiresIn: TTL_SECONDS, algorithm: "HS256" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, SECRET, { algorithms: ["HS256"] });
}

export const ACCESS_TOKEN_TTL_SECONDS = TTL_SECONDS;
