import express from 'express';
import { z } from 'zod';
import { trendsFixtures, districtsFixtures, comparablesFixtures } from '../data/researchFixtures.js';

const router = express.Router();

// GET /api/research/trends?city=&district=&months=
router.get('/trends', (req, res) => {
  const schema = z.object({
    city: z.string(),
    district: z.string().optional(),
    months: z.string(),
  });

  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { city, district, months } = result.data;
  const filtered = trendsFixtures.filter(t => t.city === city && (!district || t.district === district));
  res.json(filtered);
});

// GET /api/research/districts?city=
router.get('/districts', (req, res) => {
  const schema = z.object({
    city: z.string(),
  });

  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { city } = result.data;
  const filtered = districtsFixtures.filter(d => d.city === city);
  res.json(filtered);
});

// GET /api/research/comparables?listingId=
router.get('/comparables', (req, res) => {
  const schema = z.object({
    listingId: z.string(),
  });

  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { listingId } = result.data;
  const found = comparablesFixtures.filter(c => c.listingId === listingId);
  res.json(found);
});

export default router;
