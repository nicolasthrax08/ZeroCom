import express from 'express';
import { z } from 'zod';
import * as listingService from '../services/listingService.js';
import { requireTier } from '../middleware/requireTier.js';
import { quotaGate } from '../middleware/quotaGate.js';

const router = express.Router();

const listingSchema = z.object({
  title: z.string(),
  description: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string(),
  priceWan: z.number(),
  areaSqm: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  photos: z.array(z.string()),
  contactPhone: z.string(),
  contactWechat: z.string().optional()
});

router.post('/', requireTier(2), (req, res) => {
  const validation = listingSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const listing = listingService.create({ ...validation.data, sellerId: req.user.id });
  res.status(201).json(listing);
});

router.get('/', (req, res) => {
  const { city, district, minPrice, maxPrice, page, pageSize } = req.query;
  const listings = listingService.list({ 
    city, 
    district, 
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined
  });

  const maskedListings = listings.map(l => ({
    ...l,
    contactPhone: l.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    contactWechat: null
  }));

  res.json(maskedListings);
});

router.get('/:id', quotaGate, (req, res) => {
  const listing = listingService.getById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Not found' });

  const requester = req.user;
  const isOwner = listing.sellerId === requester.id;
  const isSubscriber = requester.subscription.active === true;

  if (isOwner || isSubscriber) {
    return res.json(listing);
  }

  return res.json({
    ...listing,
    contactPhone: listing.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    contactWechat: null
  });
});

export default router;
