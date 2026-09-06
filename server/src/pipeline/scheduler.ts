/**
 * Background Data Pipeline — Scheduler & Feature Store
 * Runs provider fetches in the background, NOT synchronously on page load.
 * Pre-computes metrics for instant consumption.
 */

import { config } from "../config/env.js";
import { getMarketProviders, getNewsProviders, getSentimentProvider, getDeFiProvider } from "../providers/registry.js";
import { cacheSet } from "../infra/cache.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";

// ── Feature Store ─────────────────────────────────────────────────────

interface FeatureStoreEntry {
  data: unknown;
  updatedAt: number;
  source: string;
}

const featureStore: Map<string, FeatureStoreEntry> = new Map();

/** Get a pre-computed feature */
export function getFeature<T>(key: string): { data: T; updatedAt: number; source: string } | null {
  const entry = featureStore.get(key);
  if (!entry) return null;
  return { data: entry.data as T, updatedAt: entry.updatedAt, source: entry.source };
}

/** Store a pre-computed feature */
export function setFeature(key: string, data: unknown, source: string): void {
  featureStore.set(key, { data, updatedAt: Date.now(), source });
}

/** Get all feature keys (for diagnostics) */
export function getFeatureKeys(): string[] {
  return [...featureStore.keys()];
}

/** Get feature store summary */
export function getFeatureStoreSummary(): { totalFeatures: number; oldestMs: number; newestMs: number } {
  const entries = [...featureStore.values()];
  if (entries.length === 0) return { totalFeatures: 0, oldestMs: 0, newestMs: 0 };
  const now = Date.now();
  const ages = entries.map((e) => now - e.updatedAt);
  return {
    totalFeatures: entries.length,
    oldestMs: Math.max(...ages),
    newestMs: Math.min(...ages),
  };
}

// ── Scheduled Tasks ───────────────────────────────────────────────────

interface ScheduledTask {
  name: string;
  intervalMs: number;
  fn: () => Promise<void>;
  lastRun: number;
  running: boolean;
  errors: number;
}

const tasks: ScheduledTask[] = [];
let pipelineRunning = false;

/**
 * Register a scheduled task.
 */
function registerTask(name: string, intervalMs: number, fn: () => Promise<void>): void {
  tasks.push({ name, intervalMs, fn, lastRun: 0, running: false, errors: 0 });
}

/**
 * Run the pipeline loop.
 */
async function runPipelineLoop(): Promise<void> {
  if (pipelineRunning) return;
  pipelineRunning = true;

  console.log("[Pipeline] Background data pipeline started");

  const tick = async () => {
    const now = Date.now();
    for (const task of tasks) {
      if (task.running) continue;
      if (now - task.lastRun < task.intervalMs) continue;

      task.running = true;
      task.lastRun = now;

      try {
        await task.fn();
      } catch (err: any) {
        task.errors++;
        console.error(`[Pipeline] Task "${task.name}" failed:`, err.message);
      } finally {
        task.running = false;
      }
    }
  };

  // Initial run
  await tick();

  // Subsequent runs every 30 seconds
  setInterval(tick, 30_000);
}

// ── Task Definitions ──────────────────────────────────────────────────

function registerDefaultTasks(): void {
  // Market data refresh (every 2 minutes)
  registerTask("market-snapshot", 120_000, async () => {
    const providers = getMarketProviders();
    if (providers.length === 0) return;

    const primary = providers[0];
    try {
      const coins = await primary.getCoinsMarket({ perPage: 100 });
      if (coins.length > 0) {
        setFeature("market:top100", coins, primary.name);
        cacheSet("pipeline:market:top100", coins, "MARKET");
      }
    } catch (err: any) {
      console.warn(`[Pipeline] market-snapshot failed: ${err.message}`);
    }
  });

  // Global market data (every 3 minutes)
  registerTask("global-market", 180_000, async () => {
    const providers = getMarketProviders();
    for (const provider of providers) {
      try {
        const global = await provider.getGlobalMarketData();
        if (global) {
          setFeature(`global:${provider.name}`, global, provider.name);
          break; // First success is enough
        }
      } catch {
        // Try next provider
      }
    }
  });

  // Trending coins (every 5 minutes)
  registerTask("trending", 300_000, async () => {
    const providers = getMarketProviders();
    if (providers.length === 0) return;

    try {
      const trending = await providers[0].getTrending();
      if (trending.length > 0) {
        setFeature("market:trending", trending, providers[0].name);
      }
    } catch {
      // Non-critical
    }
  });

  // Fear & Greed (every 10 minutes)
  registerTask("fear-greed", 600_000, async () => {
    const sentiment = getSentimentProvider();
    if (!sentiment) return;

    try {
      const fng = await sentiment.getFearAndGreed();
      if (fng) {
        setFeature("sentiment:fear-greed", fng, sentiment.name);
      }
    } catch {
      // Non-critical
    }
  });

  // News refresh (every 3 minutes)
  registerTask("news", 180_000, async () => {
    const providers = getNewsProviders();
    if (providers.length === 0) return;

    try {
      const allArticles: any[] = [];
      const results = await Promise.allSettled(
        providers.map((p) => p.getLatestNews({ limit: 20 }))
      );
      for (const result of results) {
        if (result.status === "fulfilled") allArticles.push(...result.value);
      }
      if (allArticles.length > 0) {
        setFeature("news:latest", allArticles, "multi");
      }
    } catch {
      // Non-critical
    }
  });
}

// ── Initialization ────────────────────────────────────────────────────

/**
 * Initialize and start the background data pipeline.
 * Call this after all providers are registered.
 */
export function startPipeline(): void {
  registerDefaultTasks();
  // Don't await — runs in background
  runPipelineLoop().catch((err) => {
    console.error("[Pipeline] Fatal pipeline error:", err);
  });
}

/** Get pipeline status for health dashboard */
export function getPipelineStatus() {
  return {
    running: pipelineRunning,
    tasks: tasks.map((t) => ({
      name: t.name,
      intervalMs: t.intervalMs,
      lastRun: t.lastRun ? new Date(t.lastRun).toISOString() : null,
      running: t.running,
      errors: t.errors,
    })),
    featureStore: getFeatureStoreSummary(),
  };
}
