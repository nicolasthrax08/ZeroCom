import express from "express";
import { sendOtpSchema, verifyOtpSchema } from "../schemas/authSchemas.js";
import { sendOtp, verifyOtp } from "../services/otpService.js";

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    res.status(400).json({ error: "VALIDATION_ERROR", details: e.errors });
  }
};

router.post("/send-otp", validate(sendOtpSchema), async (req, res) => {
  const { phone } = req.body;
  const result = await sendOtp(phone);
  if (result.ok) {
    res.json({ ok: true });
  } else {
    res.status(400).json({ ok: false, reason: result.reason });
  }
});

router.post("/verify-otp", validate(verifyOtpSchema), async (req, res) => {
  const { phone, code } = req.body;
  const result = await verifyOtp(phone, code);
  if (result.ok) {
    res.json({ ok: true, token: "generated-token-placeholder", tokenType: "Bearer" });
  } else {
    res.status(400).json({ ok: false, reason: result.reason });
  }
});

export default router;
