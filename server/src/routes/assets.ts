import { Router } from "express";
import { coingecko } from "../services/coingecko.js";
import { generateTechnicalSummary } from "../services/technical.js";

export const assetsRouter = Router();

// GET /api/assets/:coinId — Full coin detail
assetsRouter.get("/:coinId", async (req, res) => {
  try {
    const detail = await coingecko.getCoinDetail(req.params.coinId);
    if (!detail) {
      res.status(404).json({ success: false, message: "Asset not found" });
      return;
    }
    res.json(detail);
  } catch (err) {
    console.error("[Asset Detail]", err);
    res.status(500).json({ success: false, message: "Failed to fetch asset" });
  }
});

// GET /api/assets/:coinId/chart — Price chart data
assetsRouter.get("/:coinId/chart", async (req, res) => {
  try {
    const days = (req.query.days as string) || "7";
    const chart = await coingecko.getCoinChart(req.params.coinId, days);
    if (!chart) {
      res.status(404).json({ success: false, message: "Chart data not found" });
      return;
    }
    res.json(chart);
  } catch (err) {
    console.error("[Chart]", err);
    res.status(500).json({ success: false, message: "Failed to fetch chart" });
  }
});

// GET /api/assets/:coinId/technical — Technical indicators
assetsRouter.get("/:coinId/technical", async (req, res) => {
  try {
    // Fetch 90 days of data for accurate TA calculations
    const chart = await coingecko.getCoinChart(req.params.coinId, "90");
    if (!chart || chart.length < 30) {
      res.status(404).json({ success: false, message: "Insufficient data for technical analysis" });
      return;
    }

    const prices = chart.map((d: any) => d.price);
    const summary = generateTechnicalSummary(prices);
    res.json(summary);
  } catch (err) {
    console.error("[Technical]", err);
    res.status(500).json({ success: false, message: "Failed to compute technical indicators" });
  }
});
