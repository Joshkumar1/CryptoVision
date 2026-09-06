/**
 * Sentiment API Routes
 */

import { Router, type Request, type Response } from "express";
import { getSentimentProvider } from "../providers/registry.js";
import { getFeature } from "../pipeline/scheduler.js";

const router = Router();

/**
 * GET /api/sentiment/fear-greed
 * Current Fear & Greed Index.
 */
router.get("/fear-greed", async (_req: Request, res: Response) => {
  try {
    // Try feature store first (background pipeline)
    const cached = getFeature("sentiment:fear-greed");
    if (cached) {
      return res.json({ ...cached.data as object, source: cached.source, updatedAt: new Date(cached.updatedAt).toISOString() });
    }

    // Direct fetch
    const provider = getSentimentProvider();
    if (!provider) {
      return res.json({
        value: null,
        classification: "UNAVAILABLE",
        message: "Sentiment provider not configured.",
      });
    }

    const data = await provider.getFearAndGreed();
    if (!data) {
      return res.json({
        value: null,
        classification: "UNAVAILABLE",
        message: "Could not fetch Fear & Greed data.",
      });
    }

    res.json({ ...data, source: provider.name });
  } catch (err: any) {
    res.status(500).json({ error: "Sentiment fetch failed", message: err.message });
  }
});

/**
 * GET /api/sentiment/fear-greed/history
 * Historical Fear & Greed data.
 */
router.get("/fear-greed/history", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string, 10) || 30;
    const provider = getSentimentProvider();
    if (!provider) {
      return res.json({ history: [], message: "Sentiment provider not configured." });
    }

    const history = await provider.getFearAndGreedHistory(Math.min(days, 90));
    res.json({ history, source: provider.name });
  } catch (err: any) {
    res.status(500).json({ error: "Sentiment history failed", message: err.message });
  }
});

export default router;
