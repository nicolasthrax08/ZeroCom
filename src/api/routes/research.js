import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/trends", asyncHandler(async (req, res) => {
  // Mock market research data
  const mockTrends = [
    { id: 1, category: "Electronics", growth: "+15%", trend: "Increasing" },
    { id: 2, category: "Fashion", growth: "-5%", trend: "Decreasing" },
    { id: 3, category: "Home Decor", growth: "+22%", trend: "Rapidly Increasing" },
  ];

  res.json({
    success: true,
    data: mockTrends,
  });
}));

export default router;
