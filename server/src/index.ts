import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Existing route imports
import { marketRouter } from "./routes/market.js";
import { assetsRouter } from "./routes/assets.js";
import intelligenceRouter from "./routes/intelligence.js";
import emergingRouter from "./routes/emerging.js";
import narrativesRouter from "./routes/narratives.js";
import newsRouter from "./routes/news.js";

// New infrastructure imports
import { initializeProviders } from "./providers/init.js";
import { startPipeline } from "./pipeline/scheduler.js";
import { config } from "./config/env.js";

// New route imports
import adminRouter from "./routes/admin.js";
import securityRouter from "./routes/security.js";
import sentimentRouter from "./routes/sentiment.js";

dotenv.config();

const app = express();
const PORT = config.port;

app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Initialize Provider Infrastructure ────────────────────────────────
const { registered, skipped } = initializeProviders();

// ── Existing Routes (preserved) ───────────────────────────────────────
app.use("/api/market", marketRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/intelligence", intelligenceRouter);
app.use("/api/emerging", emergingRouter);
app.use("/api/narratives", narrativesRouter);
app.use("/api/news", newsRouter);

// ── New Routes ────────────────────────────────────────────────────────
app.use("/api/admin", adminRouter);
app.use("/api/security", securityRouter);
app.use("/api/sentiment", sentimentRouter);

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate frontend build directory (whether run from root or from server/)
const candidateDistPaths = [
  path.resolve(__dirname, "../../dist"),
  path.resolve(process.cwd(), "dist"),
  path.resolve(process.cwd(), "../dist"),
];
const clientDistPath = candidateDistPaths.find((p) => fs.existsSync(p));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), providers: registered.length });
});

if (clientDistPath) {
  console.log(`[CryptoVision] Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Catch-all route for client-side Single Page Application (SPA) routing (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      message: "CryptoVision AI API Server is running (API mode)",
      version: "3.0",
      frontendUrl: "http://localhost:3000",
      providers: { registered, skipped },
      endpoints: [
        "/health",
        "/api/market",
        "/api/assets",
        "/api/intelligence",
        "/api/emerging",
        "/api/narratives",
        "/api/news",
        "/api/admin/health",
        "/api/admin/providers",
        "/api/security/:coinId",
        "/api/sentiment/fear-greed",
        "/api/sentiment/fear-greed/history",
      ]
    });
  });
}

// ── Start Server & Background Pipeline ────────────────────────────────
app.listen(PORT, () => {
  console.log(`CryptoVision AI API v3.0 running on http://localhost:${PORT}`);
  console.log(`Providers: ${registered.length} active, ${skipped.length} skipped`);

  // Start background data pipeline after server is listening
  startPipeline();
});
