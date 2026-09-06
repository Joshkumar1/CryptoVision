/**
 * Security API Routes
 */

import { Router, type Request, type Response } from "express";
import { analyzeSecurityReality } from "../engine/securityReality.js";

const router = Router();

/**
 * GET /api/security/:coinId
 * Get security analysis for a token by contract address.
 */
router.get("/:coinId", async (req: Request, res: Response) => {
  try {
    const coinId = String(req.params.coinId);
    const chain = String(req.query.chain || "ethereum");
    const contractAddress = req.query.contract ? String(req.query.contract) : undefined;

    if (!contractAddress) {
      return res.json({
        assetId: coinId,
        overallRisk: "UNKNOWN",
        signals: [],
        knownRisks: [],
        unknowns: ["No contract address provided for security analysis."],
        source: "none",
        analyzedAt: new Date().toISOString(),
      });
    }

    const report = await analyzeSecurityReality(coinId, contractAddress, chain);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: "Security analysis failed", message: err.message });
  }
});

export default router;
