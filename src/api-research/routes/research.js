import express from 'express';
import { z } from 'zod';
import researchFixtures from '../data/researchFixtures.js';

const router = express.Router();

const TrendsSchema = z.object({
  city: z.string().min(1),
  district: z.string().optional(),
  months: z.string().optional(),
});

const DistrictsSchema = z.object({
  city: z.string().min(1),
});

const ComparablesSchema = z.object({
  listingId: z.string().min(1),
});

router.get('/trends', (req, res) => {
  const result = TrendsSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const { city } = result.data;
  const data = researchFixtures.trends[city];
  if (!data) {
    return res.status(404).json({ error: 'City not found in research data' });
  }
  res.json(data);
});

router.get('/districts', (req, res) => {
  const result = DistrictsSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const { city } = result.data;
  const data = researchFixtures.districts[city];
  if (!data) {
    return res.status(404).json({ errors: 'City not found in research data' });
  }
  res.json(data);
});

router.get('/comparables', (req, res) => {
  const result = ComparablesSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const { listingId } = result.data;
  const data = researchFixtures.comparables[listingId];
  if (!data) {
    return res.status(404).json({ error: 'Listing not found in research data' });
  }
  res.json(data);
});

export default router;
