import express from "express";
import cors from "cors";
import helmet from "helmet";
import { randomUUID } from "node:crypto";
import pinoHttp from "pino-http";
import pino from "pino";

import authRouter from "./routes/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import listingsRouter from "./routes/listings.js";
import { errorHandler } from "./middleware/errorHandler.js";

const logger = pino({ transport: { target: "pino-pretty" } });

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(",") || "*" }));
app.use(helmet());
app.use(pinoHttp({ logger, genReqId: (req) => req.headers["x-request-id"] || randomUUID() }));

app.use(
  "/api/auth",
  rateLimit({ windowMs: 60_000, max: 10, keyFn: (req) => req.ip }),
  authRouter
);

app.get("/api/health", (req, res) => {
  res.json({ status: "active", service: "zerocom-api", requestId: req.id });
});

app.use("/api/listings", listingsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => logger.info(`ZeroCom API running on port ${PORT}`));
