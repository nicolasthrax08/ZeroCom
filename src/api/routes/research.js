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
import express from "express";

const router = express.Router();

router.get("/trends", (req, res) => {
  res.json({
    trends: [
      { id: 1, topic: "AI-driven market analysis", growth: "+25%", sentiment: "Positive" },
      { id: 2, topic: "Sustainable packaging", growth: "+12%", sentiment: "Neutral" },
      { id: 3, topic: "Direct-to-consumer logistics", growth: "+18%", sentiment: "Positive" },
      { id: 4, topic: "Hyper-local delivery networks", growth: "+5%", sentiment: "Mixed" },
    ],
    timestamp: new Date().toISOString(),
    source: "Mock Market Data Engine"
  });
});

export default router;
