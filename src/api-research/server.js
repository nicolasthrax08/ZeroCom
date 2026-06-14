import express from "express";
import cors from "cors";
import helmet from "helmet";
import { randomUUID } from "node:crypto";
import researchRouter from "./routes/research.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use((req, _res, next) => { req.id = randomUUID(); next(); });

app.get("/api/health", (req, res) => {
  res.json({ status: "active", service: "zerocom-research", port: 3002, requestId: req.id });
});

app.use("/api/research", researchRouter);

app.use((err, req, res, _next) => {
  res.status(500).json({ error: "INTERNAL", requestId: req.id });
});

const PORT = process.env.RESEARCH_PORT || 3002;
app.listen(PORT, () => console.log(`ZeroCom Research API running on port ${PORT}`));
