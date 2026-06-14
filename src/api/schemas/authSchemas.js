import { z } from "zod";

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "Invalid phone number format"),
});

export const verifyOtpSchema = z.object({
  phone: z.string(),
  code: z.string().length(6, "OTP code must be 6 digits"),
});
