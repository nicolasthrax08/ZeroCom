import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import researchRoutes from "./routes/research.js";

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
