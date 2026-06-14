
import express from 'express';
import { sendOtp, verifyOtp } from '../../services/otpService.js';

const router = express.Router();

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });
    
    await sendOtp(phone);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(429).json({ error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });

    const result = await verifyOtp(phone, code);
    if (result.success) {
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(429).json({ error: error.message });
  }
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
