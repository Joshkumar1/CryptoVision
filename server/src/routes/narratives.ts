import { Router } from "express";
import { coingecko } from "../services/coingecko.js";
import { NARRATIVES, computeNarrativeMetrics, getNarrativeById } from "../services/narratives.js";
import NodeCache from "node-cache";

const router = Router();
const cache = new NodeCache({ stdTTL: 900 }); // 15 min cache

// GET /api/narratives — all narratives with computed metrics
router.get("/", async (req, res) => {
  try {
    const cacheKey = "narratives:all";
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    // Get top 250 coins for price/volume data
    const [page1, page2] = await Promise.all([
      coingecko.getCoins(1, 100, "usd"),
      coingecko.getCoins(2, 100, "usd"),
    ]);
    const coins = [...(page1 ?? []), ...(page2 ?? [])];

    const coinData = coins.map((c: any) => ({
      id: c.id,
      priceChange7d: c.price_change_percentage_7d_in_currency,
      priceChange30d: undefined,
      volume24h: c.total_volume,
    }));

    const narrativesWithMetrics = NARRATIVES.map((n) =>
      computeNarrativeMetrics(n, coinData)
    );

    const result = narrativesWithMetrics.sort((a, b) => b.strength - a.strength);
    cache.set(cacheKey, result);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Narratives error:", err);
    res.status(500).json({ success: false, message: "Failed to load narratives" });
  }
});

// GET /api/narratives/:narrativeId — narrative detail with coin data
router.get("/:narrativeId", async (req, res) => {
  try {
    const { narrativeId } = req.params;
    const narrative = getNarrativeById(narrativeId);
    if (!narrative) return res.status(404).json({ success: false, message: "Narrative not found" });

    const cacheKey = `narrative:${narrativeId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    // Fetch coins for this narrative
    const [page1, page2] = await Promise.all([
      coingecko.getCoins(1, 100, "usd"),
      coingecko.getCoins(2, 100, "usd"),
    ]);
    const allCoins = [...(page1 ?? []), ...(page2 ?? [])];
    const memberCoins = allCoins.filter((c: any) => narrative.coinIds.includes(c.id));

    const coinData = allCoins.map((c: any) => ({
      id: c.id,
      priceChange7d: c.price_change_percentage_7d_in_currency,
      priceChange30d: undefined,
      volume24h: c.total_volume,
    }));

    const metrics = computeNarrativeMetrics(narrative, coinData);

    const result = {
      ...metrics,
      topCoins: memberCoins.slice(0, 10),
    };

    cache.set(cacheKey, result);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Narrative detail error:", err);
    res.status(500).json({ success: false, message: "Failed to load narrative" });
  }
});

export default router;
