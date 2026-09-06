/**
 * CryptoVision Provider Health Monitoring
 * Tracks per-provider status, latency, errors, and fallback usage.
 * Powers the API Health Dashboard.
 */

import { getAllRateLimiterStats } from "../infra/rateLimiter.js";
import { getCacheStats } from "../infra/cache.js";
import { getProviderStatus } from "../config/env.js";

export interface ProviderHealthRecord {
  provider: string;
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "NOT_CONFIGURED";
  lastSuccessfulRequest: string | null;
  lastError: string | null;
  lastErrorTime: string | null;
  averageLatencyMs: number;
  errorRate: string;
  fallbackUsageCount: number;
  lastDataRefresh: string | null;
}

// In-memory health records
const healthRecords: Map<string, {
  successes: number;
  errors: number;
  latencies: number[];
  lastSuccess: number | null;
  lastError: string | null;
  lastErrorTime: number | null;
  lastDataRefresh: number | null;
  fallbackCount: number;
}> = new Map();

const TRACKED_PROVIDERS = [
  "coingecko", "coinmarketcap", "defillama", "github",
  "alchemy", "binance", "cryptopanic", "newsdata",
  "goplus", "alternativeme",
];

function ensureRecord(provider: string) {
  if (!healthRecords.has(provider)) {
    healthRecords.set(provider, {
      successes: 0, errors: 0, latencies: [],
      lastSuccess: null, lastError: null, lastErrorTime: null,
      lastDataRefresh: null, fallbackCount: 0,
    });
  }
  return healthRecords.get(provider)!;
}

/** Record a successful provider request */
export function recordProviderSuccess(provider: string, latencyMs: number): void {
  const rec = ensureRecord(provider);
  rec.successes++;
  rec.lastSuccess = Date.now();
  rec.lastDataRefresh = Date.now();
  rec.latencies.push(latencyMs);
  if (rec.latencies.length > 100) rec.latencies.shift();
}

/** Record a provider error */
export function recordProviderError(provider: string, error: string): void {
  const rec = ensureRecord(provider);
  rec.errors++;
  rec.lastError = error;
  rec.lastErrorTime = Date.now();
}

/** Record a fallback being used */
export function recordFallbackUsage(provider: string): void {
  const rec = ensureRecord(provider);
  rec.fallbackCount++;
}

/** Get health status for a single provider */
export function getProviderHealth(provider: string): ProviderHealthRecord {
  const providerStatuses = getProviderStatus();
  const provStatus = providerStatuses[provider];

  if (!provStatus || provStatus.status === "NO_KEY") {
    return {
      provider,
      status: "NOT_CONFIGURED",
      lastSuccessfulRequest: null,
      lastError: null,
      lastErrorTime: null,
      averageLatencyMs: 0,
      errorRate: "N/A",
      fallbackUsageCount: 0,
      lastDataRefresh: null,
    };
  }

  const rec = ensureRecord(provider);
  const total = rec.successes + rec.errors;
  const avgLatency = rec.latencies.length > 0
    ? Math.round(rec.latencies.reduce((a, b) => a + b, 0) / rec.latencies.length)
    : 0;

  let status: ProviderHealthRecord["status"] = "HEALTHY";
  if (total === 0) {
    status = provStatus.status === "DISABLED" ? "NOT_CONFIGURED" : "HEALTHY";
  } else {
    const errRate = rec.errors / total;
    if (errRate > 0.5) status = "DOWN";
    else if (errRate > 0.1) status = "DEGRADED";
  }

  return {
    provider,
    status,
    lastSuccessfulRequest: rec.lastSuccess ? new Date(rec.lastSuccess).toISOString() : null,
    lastError: rec.lastError,
    lastErrorTime: rec.lastErrorTime ? new Date(rec.lastErrorTime).toISOString() : null,
    averageLatencyMs: avgLatency,
    errorRate: total > 0 ? ((rec.errors / total) * 100).toFixed(1) + "%" : "0%",
    fallbackUsageCount: rec.fallbackCount,
    lastDataRefresh: rec.lastDataRefresh ? new Date(rec.lastDataRefresh).toISOString() : null,
  };
}

/** Get full health dashboard data */
export function getHealthDashboard() {
  const providers: ProviderHealthRecord[] = TRACKED_PROVIDERS.map(getProviderHealth);
  const rateLimiterStats = getAllRateLimiterStats();
  const cacheStats = getCacheStats();
  const providerConfig = getProviderStatus();

  return {
    timestamp: new Date().toISOString(),
    providers,
    rateLimiter: rateLimiterStats,
    cache: cacheStats,
    configuration: providerConfig,
    summary: {
      healthy: providers.filter((p) => p.status === "HEALTHY").length,
      degraded: providers.filter((p) => p.status === "DEGRADED").length,
      down: providers.filter((p) => p.status === "DOWN").length,
      notConfigured: providers.filter((p) => p.status === "NOT_CONFIGURED").length,
    },
  };
}
