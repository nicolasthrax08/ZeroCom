import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { requestId } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/errorHandler.js";
import listingsRouter from "./routes/listings.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(requestId);
// Placeholder for future pino-http middleware
app.use((req, res, next) => {
  next();
});

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    keyFn: (req) => req.ip,
  }),
  authRouter
);

app.get("/api/health", (req, res) => {
  res.json({ status: "active", service: "zerocom-api", version: "1.0.0", requestId: req.id });
});

app.use(errorHandler);
app.use('/api/listings', listingsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ZeroCom API running on port ${PORT}`));
