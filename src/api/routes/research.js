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
