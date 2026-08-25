import { Router } from "express";
import { coingecko } from "../services/coingecko.js";
import { generateTechnicalSummary } from "../services/technical.js";
import { computeIntelligenceScore } from "../services/intelligence.js";
import { generateRealityCheck } from "../services/realityCheck.js";
import { detectRedFlags } from "../services/redFlags.js";
import { getTVL } from "../services/defiLlama.js";
import NodeCache from "node-cache";

const router = Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// Helper: assemble scoring input from CoinGecko + technical data
async function assembleScoringInput(coinId: string) {
  const [detail, prices] = await Promise.all([
    coingecko.getCoinDetail(coinId),
    coingecko.getRawPrices(coinId, 90),
  ]);

  if (!detail) return null;

  const ta = prices.length > 14 ? generateTechnicalSummary(prices) : null;
  const tvl = await getTVL(coinId);

  const md = detail.market_data;
  const dev = detail.developer_data;

  return {
    scoringInput: {
      marketCap: md.market_cap?.usd,
      fdv: md.fully_diluted_valuation?.usd,
      volume24h: md.total_volume?.usd,
      priceChange24h: md.price_change_percentage_24h,
      priceChange7d: md.price_change_percentage_7d,
      priceChange30d: md.price_change_percentage_30d,
      athChangePercent: md.ath_change_percentage?.usd,
      circulatingSupply: md.circulating_supply,
      totalSupply: md.total_supply,
      maxSupply: md.max_supply,
      rsi: ta?.rsi?.value,
      macdHistogram: ta?.macd?.histogram,
      aboveSma20: ta?.movingAverages?.aboveSma20,
      aboveSma50: ta?.movingAverages?.aboveSma50,
      bollingerWidth: ta?.bollingerBands?.width,
      commitCount4Weeks: dev?.commit_count_4_weeks,
      stars: dev?.stars,
      forks: dev?.forks,
      prsMerged: dev?.pull_requests_merged,
      closedIssues: dev?.closed_issues,
      totalIssues: dev?.total_issues,
      tvl,
    },
    coinData: {
      id: coinId,
      name: detail.name,
      marketCap: md.market_cap?.usd,
      fdv: md.fully_diluted_valuation?.usd,
      volume24h: md.total_volume?.usd,
      priceChange24h: md.price_change_percentage_24h,
      priceChange7d: md.price_change_percentage_7d,
      priceChange30d: md.price_change_percentage_30d,
      circulatingSupply: md.circulating_supply,
      totalSupply: md.total_supply,
      maxSupply: md.max_supply,
      commitCount4Weeks: dev?.commit_count_4_weeks,
      stars: dev?.stars,
      forks: dev?.forks,
      rsi: ta?.rsi?.value,
      tvl,
    },
  };
}

// GET /api/intelligence/:coinId/score
router.get("/:coinId/score", async (req, res) => {
  try {
    const { coinId } = req.params;
    const cacheKey = `score:${coinId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const assembled = await assembleScoringInput(coinId);
    if (!assembled) return res.status(404).json({ success: false, message: "Coin not found" });

    const score = computeIntelligenceScore(assembled.scoringInput);
    cache.set(cacheKey, score);
    res.json({ success: true, data: score });
  } catch (err) {
    console.error("Intelligence score error:", err);
    res.status(500).json({ success: false, message: "Failed to compute score" });
  }
});

// GET /api/intelligence/:coinId/reality-check
router.get("/:coinId/reality-check", async (req, res) => {
  try {
    const { coinId } = req.params;
    const cacheKey = `rc:${coinId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const assembled = await assembleScoringInput(coinId);
    if (!assembled) return res.status(404).json({ success: false, message: "Coin not found" });

    const rc = generateRealityCheck(assembled.coinData);
    cache.set(cacheKey, rc);
    res.json({ success: true, data: rc });
  } catch (err) {
    console.error("Reality check error:", err);
    res.status(500).json({ success: false, message: "Failed to generate reality check" });
  }
});

// GET /api/intelligence/:coinId/red-flags
router.get("/:coinId/red-flags", async (req, res) => {
  try {
    const { coinId } = req.params;
    const cacheKey = `rf:${coinId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const assembled = await assembleScoringInput(coinId);
    if (!assembled) return res.status(404).json({ success: false, message: "Coin not found" });

    const flags = detectRedFlags(assembled.scoringInput);
    cache.set(cacheKey, flags);
    res.json({ success: true, data: flags });
  } catch (err) {
    console.error("Red flags error:", err);
    res.status(500).json({ success: false, message: "Failed to detect red flags" });
  }
});

// GET /api/intelligence/:coinId — full bundle
router.get("/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params;
    const cacheKey = `intel:${coinId}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const assembled = await assembleScoringInput(coinId);
    if (!assembled) return res.status(404).json({ success: false, message: "Coin not found" });

    const [score, realityCheck, redFlags] = await Promise.all([
      computeIntelligenceScore(assembled.scoringInput),
      generateRealityCheck(assembled.coinData),
      detectRedFlags(assembled.scoringInput),
    ]);

    const bundle = { score, realityCheck, redFlags, coinId };
    cache.set(cacheKey, bundle);
    res.json({ success: true, data: bundle });
  } catch (err) {
    console.error("Intelligence bundle error:", err);
    res.status(500).json({ success: false, message: "Failed to generate intelligence report" });
  }
});

export default router;
