import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import researchRoutes from "./routes/research.js";
import authRouter from "./routes/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/research", researchRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "active", workspace: "Session B (Research)" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Research Server running on port ${PORT}`));
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
  res.json({ status: "active", workspace: "Session B (Auth)" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Server running on port ${PORT}`));
