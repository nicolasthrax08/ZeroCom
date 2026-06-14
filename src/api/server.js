import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import requestId from "./middleware/requestId.js";
import authRouter from "./routes/auth.js";
import researchRouter from "./routes/research.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { destination: 1 }, // stdout
      },
      {
        target: "pino-roll",
        options: { 
          file: "logs/research-sessionB.log", 
          frequency: "daily", 
          mkdir: true 
        },
      },
    ],
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestId);
app.use(pinoHttp({
  logger,
  customProps: (req) => ({ reqId: req.id }),
  serializers: {
    req: (req) => {
      const { headers, ...rest } = req;
      if (headers) {
        const { authorization, cookie, ...safeHeaders } = headers;
        return { ...rest, headers: safeHeaders };
      }
      return req;
    },
  },
}));

app.use("/api/auth", authRouter);
app.use("/api/research", researchRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "active", message: "Zerocom API is online" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
