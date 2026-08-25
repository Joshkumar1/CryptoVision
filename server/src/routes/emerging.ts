import { Router } from "express";
import { coingecko } from "../services/coingecko.js";
import { detectEmergingProjects } from "../services/emerging.js";
import NodeCache from "node-cache";

const router = Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// GET /api/emerging — all emerging projects
router.get("/", async (req, res) => {
  try {
    const cacheKey = "emerging:all";
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    // Fetch coins
    const coins = await coingecko.getCoins(0, 100, "usd", true);
    const emerging = detectEmergingProjects((coins || []) as any[]);

    const result = {
      projects: emerging.slice(0, 30),
      beforeTheHype: emerging.filter((p) => p.isBeforeTheHype).slice(0, 10),
      total: emerging.length,
      computedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, result);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Emerging error:", err);
    res.status(500).json({ success: false, message: "Failed to detect emerging projects" });
  }
});

// GET /api/emerging/before-the-hype
router.get("/before-the-hype", async (req, res) => {
  try {
    const cacheKey = "emerging:bth";
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const coins = await coingecko.getCoins(0, 100, "usd", true);
    const emerging = detectEmergingProjects((coins || []) as any[]);
    const bth = emerging.filter((p) => p.isBeforeTheHype).slice(0, 15);

    cache.set(cacheKey, bth);
    res.json({ success: true, data: bth });
  } catch (err) {
    console.error("Before the hype error:", err);
    res.status(500).json({ success: false, message: "Failed to detect before-the-hype projects" });
  }
});

export default router;
