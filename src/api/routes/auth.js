import express from "express";
import { sendOtpSchema, verifyOtpSchema, validate } from "../schemas/authSchemas.js";
import { sendOtp, verifyOtp } from "../services/otpService.js";
import { signAccessToken, ACCESS_TOKEN_TTL_SECONDS } from "../services/jwtService.js";
import * as userStore from "../services/userStore.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/send-otp", validate(sendOtpSchema), asyncHandler(async (req, res) => {
  const result = await sendOtp(req.body.phone);
  if (result.ok) return res.json({ ok: true });
  const status = result.reason === "DAILY_LIMIT" ? 429 : 429;
  return res.status(status).json({ ok: false, reason: result.reason });
}));

router.post("/verify-otp", validate(verifyOtpSchema), asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  const result = await verifyOtp(phone, code);
  if (!result.ok) return res.status(401).json({ ok: false, reason: result.reason });

  // Upsert user — first-time verify creates a tier-1 user
  const userId = `u_${phone}`;
  let user = userStore.getById(userId);
  if (!user) {
    user = { id: userId, phone, verificationTier: "phone_only", subscription: { plan: "free", active: false } };
    userStore.upsert(user);
  }

  const tier = user.verificationTier === "phone+ID" ? 2 : 1;
  const accessToken = signAccessToken({ userId, tier });
  res.json({ ok: true, accessToken, tokenType: "Bearer", expiresIn: ACCESS_TOKEN_TTL_SECONDS, user: { id: userId, tier } });
}));

export default router;
