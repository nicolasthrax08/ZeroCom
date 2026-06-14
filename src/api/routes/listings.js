import express from "express";
import { z } from "zod";
import * as listingService from "../services/listingService.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireTier } from "../middleware/requireTier.js";
import { quotaGate } from "../middleware/quotaGate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

const listingSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(5000),
  city: z.string().min(1),
  district: z.string().min(1),
  address: z.string().min(1),
  priceWan: z.number().positive(),
  areaSqm: z.number().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  photos: z.array(z.string().url()).min(1).max(20),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/),
  contactWechat: z.string().optional(),
});

router.post("/", requireAuth, requireTier(2), asyncHandler(async (req, res) => {
  const validation = listingSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", issues: validation.error.issues });
  }
  const listing = listingService.create({ ...validation.data, sellerId: req.user.id });
  res.status(201).json(listing);
}));

router.get("/", asyncHandler(async (req, res) => {
  const { city, district, minPrice, maxPrice, page, pageSize } = req.query;
  const listings = listingService.list({
    city, district,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  const masked = listings.map((l) => ({
    ...l,
    contactPhone: l.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
    contactWechat: null,
  }));
  res.json(masked);
}));

router.get("/:id", requireAuth, quotaGate, asyncHandler(async (req, res) => {
  const listing = listingService.getById(req.params.id);
  if (!listing) return res.status(404).json({ error: "NOT_FOUND" });
  const requester = req.user;
  const isOwner = listing.sellerId === requester.id;
  const isSubscriber = requester.subscription?.active === true;
  if (isOwner || isSubscriber) return res.json(listing);
  return res.json({
    ...listing,
    contactPhone: listing.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
    contactWechat: null,
  });
}));

export default router;
