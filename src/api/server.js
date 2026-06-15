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
import { requestId } from "./middleware/requestId.js";
import { initializeDefaultUsers } from "./services/userStore.js";

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = express();

app.use(requestId);
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(",") || "*" }));
app.use(helmet());
app.use(pinoHttp({ logger, genReqId: (req) => req.headers["x-request-id"] || randomUUID() }));

app.use(
  "/api/auth",
  rateLimit({ windowMs: 60_000, max: 10, keyFn: (req) => req.ip }),
  authRouter
);

app.get("/api/health", async (req, res) => {
  // Check Redis connectivity
  let redisStatus = 'unknown';
  try {
    const redis = await import('./services/redisClient.js');
    await redis.default.ping();
    redisStatus = 'connected';
  } catch (err) {
    redisStatus = 'disconnected';
  }
  
  res.json({ 
    status: "active", 
    service: "zerocom-api", 
    requestId: req.id,
    redis: redisStatus
  });
});

app.use("/api/listings", listingsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`ZeroCom API running on port ${PORT}`);
  // Initialize default users on startup
  initializeDefaultUsers().catch(err => logger.error('Failed to initialize default users:', err));
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
    logger.info('Server closed gracefully');
    
    // Close Redis connection
    import('./services/redisClient.js').then(async (redisModule) => {
      await redisModule.default.quit();
      logger.info('Redis connection closed');
      process.exit(0);
    }).catch(err => {
      logger.error('Error closing Redis connection:', err);
      process.exit(1);
    });
  });
  
  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
