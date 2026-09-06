/**
 * CryptoVision Unified Cache System
 * Tiered TTL caching that replaces per-service NodeCache instances.
 * All provider adapters and engines use this module for consistency.
 */

import NodeCache from "node-cache";

export type CacheTier =
  | "REALTIME"      // 30-60s — order book, live prices
  | "MARKET"        // 2-5 min — market snapshot, trending
  | "FUNDAMENTAL"   // 15-60 min — TVL, fees, revenue
  | "DEVELOPER"     // 6-24h — commits, contributors
  | "TOKENOMICS"    // 6-24h or event-driven — supply, unlocks
  | "HISTORICAL"    // Long cache — historical data
  | "NEWS"          // 2-5 min + event refresh
  | "SECURITY";     // 1h — security scans

const TTL_MAP: Record<CacheTier, number> = {
  REALTIME:     45,
  MARKET:       180,
  FUNDAMENTAL:  1800,
  DEVELOPER:    21600,
  TOKENOMICS:   21600,
  HISTORICAL:   86400,
  NEWS:         180,
  SECURITY:     3600,
};

/** Primary cache with automatic TTL expiry */
const primaryCache = new NodeCache({ stdTTL: 300, checkperiod: 60, useClones: false });

/** Fallback storage — stale data is better than no data */
const fallbackStore = new Map<string, { data: unknown; storedAt: number }>();

/** Cache statistics for monitoring */
const stats = {
  hits: 0,
  misses: 0,
  fallbackHits: 0,
  sets: 0,
};

/**
 * Get a cached value. Returns null if nothing is cached.
 */
export function cacheGet<T>(key: string): T | null {
  const cached = primaryCache.get<T>(key);
  if (cached !== undefined) {
    stats.hits++;
    return cached;
  }
  stats.misses++;
  return null;
}

/**
 * Get a cached value with fallback to stale data.
 * Returns { data, isStale } so callers can label stale responses.
 */
export function cacheGetWithFallback<T>(key: string): { data: T; isStale: boolean } | null {
  const fresh = cacheGet<T>(key);
  if (fresh !== null) return { data: fresh, isStale: false };

  const stale = fallbackStore.get(key);
  if (stale) {
    stats.fallbackHits++;
    return { data: stale.data as T, isStale: true };
  }

  return null;
}

/**
 * Set a cached value with tier-appropriate TTL.
 * Also stores in fallback for stale-data recovery.
 */
export function cacheSet<T>(key: string, data: T, tier: CacheTier): void {
  const ttl = TTL_MAP[tier];
  primaryCache.set(key, data, ttl);
  fallbackStore.set(key, { data, storedAt: Date.now() });
  stats.sets++;
}

/**
 * Set a cached value with explicit TTL in seconds.
 */
export function cacheSetTTL<T>(key: string, data: T, ttlSeconds: number): void {
  primaryCache.set(key, data, ttlSeconds);
  fallbackStore.set(key, { data, storedAt: Date.now() });
  stats.sets++;
}

/**
 * Invalidate a specific cache key.
 */
export function cacheInvalidate(key: string): void {
  primaryCache.del(key);
  // Keep fallback — it's intentionally stale-safe
}

/**
 * Invalidate all keys matching a prefix.
 */
export function cacheInvalidatePrefix(prefix: string): void {
  const keys = primaryCache.keys().filter((k) => k.startsWith(prefix));
  for (const key of keys) primaryCache.del(key);
}

/**
 * Get cache statistics for the health dashboard.
 */
export function getCacheStats() {
  return {
    ...stats,
    primaryKeys: primaryCache.keys().length,
    fallbackKeys: fallbackStore.size,
    hitRate: stats.hits + stats.misses > 0
      ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) + "%"
      : "N/A",
  };
}

/**
 * Build a namespaced cache key.
 * Example: buildCacheKey("coingecko", "coins/markets", { page: 1 })
 */
export function buildCacheKey(namespace: string, endpoint: string, params?: Record<string, unknown>): string {
  const paramStr = params ? ":" + JSON.stringify(params) : "";
  return `${namespace}:${endpoint}${paramStr}`;
}
