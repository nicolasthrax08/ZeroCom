import express from "express";
import { z } from "zod";
import { TRENDS, DISTRICTS, COMPARABLES } from "../data/researchFixtures.js";

const router = express.Router();

const trendsQuery = z.object({
  city: z.string().min(1),
  district: z.string().min(1).optional(),
  months: z.coerce.number().int().min(1).max(24).default(6),
});

router.get("/trends", (req, res) => {
  const parsed = trendsQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
  const { city, district, months } = parsed.data;
  const data = TRENDS.filter(t => t.city === city && (!district || t.district === district)).slice(-months);
  res.json({ city, district: district || null, months: data.length, data });
});

const districtsQuery = z.object({ city: z.string().min(1) });

router.get("/districts", (req, res) => {
  const parsed = districtsQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
  const data = DISTRICTS.filter(d => d.city === parsed.data.city);
  res.json({ city: parsed.data.city, count: data.length, data });
});

const comparablesQuery = z.object({ listingId: z.string().min(1) });

router.get("/comparables", (req, res) => {
  const parsed = comparablesQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", issues: parsed.error.issues });
  const data = COMPARABLES.filter(c => c.listingId === parsed.data.listingId);
  res.json({ listingId: parsed.data.listingId, count: data.length, data });
});

export default router;
