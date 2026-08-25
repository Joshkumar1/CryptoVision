import { Router } from "express";
import { newsCatalystService } from "../services/news.js";

const router = Router();

// GET /api/news — all structured news catalysts
router.get("/", (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const coinId = req.query.coinId as string | undefined;

    const catalysts = newsCatalystService.getAllCatalysts(category, coinId);
    res.json({
      success: true,
      data: catalysts,
      count: catalysts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("News router error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch news catalysts" });
  }
});

// GET /api/news/impact/:coinId — news catalysts impacting a specific coin
router.get("/impact/:coinId", (req, res) => {
  try {
    const { coinId } = req.params;
    const catalysts = newsCatalystService.getImpactForCoin(coinId);
    res.json({
      success: true,
      data: catalysts,
      coinId,
    });
  } catch (err) {
    console.error("News impact router error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch coin news impacts" });
  }
});

export default router;
