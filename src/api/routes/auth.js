import express from "express";
import { z } from "zod";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const sendOtpSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "Invalid Mainland China phone number format"),
});

router.post("/send-otp", asyncHandler(async (req, res) => {
  const { phone } = sendOtpSchema.parse(req.body);
  
  // Mock sending OTP logic
  console.log(`Sending OTP to ${phone}`);
  
  res.json({
    success: true,
    message: "OTP sent successfully"
  });
}));

router.post("/verify-otp", asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      error: "Phone and OTP are required"
    });
  }

  if (otp === "123456") {
    return res.json({
      success: true,
      token: "mock-jwt-token"
    });
  }

  return res.status(400).json({
    success: false,
    error: "Invalid OTP"
  });
}));

export default router;
