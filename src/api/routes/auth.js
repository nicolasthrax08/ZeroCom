import express from "express";
import { sendOtpSchema, verifyOtpSchema } from "../schemas/authSchemas.js";
import { z } from "zod";

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    res.status(400).json({ error: "VALIDATION_ERROR", details: e.errors });
  }
};

router.post("/send-otp", validate(sendOtpSchema), (req, res) => {
  res.json({ success: true, message: "OTP sent successfully" });
});

router.post("/verify-otp", validate(verifyOtpSchema), (req, res) => {
  res.json({ success: true, message: "OTP verified successfully" });
});

export default router;
