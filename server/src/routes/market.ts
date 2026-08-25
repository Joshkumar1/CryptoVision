import { Router } from "express";
import { coingecko } from "../services/coingecko.js";
import { detectRegime } from "../services/regime.js";

export const marketRouter = Router();

// GET /api/market/overview — Market snapshot + regime
marketRouter.get("/overview", async (_req, res) => {
  try {
    const [overview, btcData] = await Promise.all([
      coingecko.getGlobal(),
      coingecko.getBtcData(),
    ]);

    const regime = detectRegime(btcData);

    res.json({ overview, regime });
  } catch (err) {
    console.error("[Market Overview]", err);
    res.status(500).json({ success: false, message: "Failed to fetch market overview" });
  }
});

// GET /api/market/coins — Paginated coin list
marketRouter.get("/coins", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const perPage = Math.min(parseInt(req.query.per_page as string) || 50, 250);
    const currency = (req.query.currency as string) || "usd";
    const sparkline = req.query.sparkline === "true";

    const coins = await coingecko.getCoins(page, perPage, currency, sparkline);
    res.json(coins || []);
  } catch (err) {
    console.error("[Market Coins]", err);
    res.status(500).json({ success: false, message: "Failed to fetch coins" });
  }
});

// GET /api/market/trending
marketRouter.get("/trending", async (_req, res) => {
  try {
    const trending = await coingecko.getTrending();
    res.json(trending || []);
  } catch (err) {
    console.error("[Trending]", err);
    res.status(500).json({ success: false, message: "Failed to fetch trending" });
  }
});

// GET /api/market/search
marketRouter.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string) || "";
    const results = await coingecko.search(q);
    res.json(results || { coins: [] });
  } catch (err) {
    console.error("[Search]", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
});
