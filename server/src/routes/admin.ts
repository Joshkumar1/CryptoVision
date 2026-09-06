/**
 * CryptoVision Admin & Health Routes
 */

import { Router, type Request, type Response } from "express";
import { getHealthDashboard } from "../monitoring/providerHealth.js";
import { getProviderStatus } from "../config/env.js";
import { getRegistrySummary } from "../providers/registry.js";
import { getPipelineStatus } from "../pipeline/scheduler.js";

const router = Router();

/**
 * GET /api/admin/health
 * API Health Dashboard — shows provider status, rate limiter stats,
 * cache performance, and pipeline status.
 */
router.get("/health", (_req: Request, res: Response) => {
  try {
    const dashboard = getHealthDashboard();
    const registry = getRegistrySummary();
    const pipeline = getPipelineStatus();

    res.json({
      status: "ok",
      ...dashboard,
      registry,
      pipeline,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Health check failed", message: err.message });
  }
});

/**
 * GET /api/admin/providers
 * List configured providers and their status.
 */
router.get("/providers", (_req: Request, res: Response) => {
  res.json({
    providers: getProviderStatus(),
    registry: getRegistrySummary(),
  });
});

export default router;
