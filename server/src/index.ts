import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { marketRouter } from "./routes/market.js";
import { assetsRouter } from "./routes/assets.js";
import intelligenceRouter from "./routes/intelligence.js";
import emergingRouter from "./routes/emerging.js";
import narrativesRouter from "./routes/narratives.js";
import newsRouter from "./routes/news.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/market", marketRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/intelligence", intelligenceRouter);
app.use("/api/emerging", emergingRouter);
app.use("/api/narratives", narrativesRouter);
app.use("/api/news", newsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`CryptoVision AI API v2.5 running on http://localhost:${PORT}`);
});
