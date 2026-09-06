/**
 * CryptoVision Rate Limiter & Circuit Breaker
 * Per-provider request throttling with exponential backoff,
 * deduplication, and circuit breaker patterns.
 */

interface RateLimiterConfig {
  /** Maximum requests per window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Minimum interval between requests (ms) */
  minIntervalMs: number;
  /** Maximum retries on failure */
  maxRetries: number;
  /** Initial retry delay (ms) — doubles each retry */
  retryDelayMs: number;
  /** Request timeout (ms) */
  timeoutMs: number;
  /** Failures before circuit opens */
  circuitBreakerThreshold: number;
  /** How long circuit stays open (ms) */
  circuitBreakerResetMs: number;
}

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface ProviderState {
  config: RateLimiterConfig;
  requestTimestamps: number[];
  consecutiveFailures: number;
  circuitState: CircuitState;
  circuitOpenedAt: number;
  lastRequestAt: number;
  totalRequests: number;
  totalErrors: number;
  totalRetries: number;
  /** In-flight dedup: key → Promise */
  inflight: Map<string, Promise<unknown>>;
}

const providers: Map<string, ProviderState> = new Map();

/** Provider presets */
export const RATE_LIMITS: Record<string, RateLimiterConfig> = {
  coingecko: {
    maxRequests: 25,          // free tier ~30/min
    windowMs: 60_000,
    minIntervalMs: 2000,
    maxRetries: 2,
    retryDelayMs: 3000,
    timeoutMs: 10_000,
    circuitBreakerThreshold: 5,
    circuitBreakerResetMs: 60_000,
  },
  coingecko_pro: {
    maxRequests: 450,         // paid tier
    windowMs: 60_000,
    minIntervalMs: 200,
    maxRetries: 3,
    retryDelayMs: 1000,
    timeoutMs: 10_000,
    circuitBreakerThreshold: 10,
    circuitBreakerResetMs: 30_000,
  },
  coinmarketcap: {
    maxRequests: 25,
    windowMs: 60_000,
    minIntervalMs: 2500,
    maxRetries: 2,
    retryDelayMs: 5000,
    timeoutMs: 10_000,
    circuitBreakerThreshold: 5,
    circuitBreakerResetMs: 60_000,
  },
  defillama: {
    maxRequests: 60,
    windowMs: 60_000,
    minIntervalMs: 500,
    maxRetries: 2,
    retryDelayMs: 2000,
    timeoutMs: 8_000,
    circuitBreakerThreshold: 8,
    circuitBreakerResetMs: 30_000,
  },
  github: {
    maxRequests: 55,          // authenticated: 5000/hr → ~83/min
    windowMs: 60_000,
    minIntervalMs: 500,
    maxRetries: 2,
    retryDelayMs: 2000,
    timeoutMs: 10_000,
    circuitBreakerThreshold: 5,
    circuitBreakerResetMs: 60_000,
  },
  binance: {
    maxRequests: 1100,        // 1200/min limit
    windowMs: 60_000,
    minIntervalMs: 100,
    maxRetries: 2,
    retryDelayMs: 1000,
    timeoutMs: 5_000,
    circuitBreakerThreshold: 10,
    circuitBreakerResetMs: 30_000,
  },
  cryptopanic: {
    maxRequests: 5,           // free tier is very restrictive
    windowMs: 60_000,
    minIntervalMs: 12_000,
    maxRetries: 1,
    retryDelayMs: 15_000,
    timeoutMs: 10_000,
    circuitBreakerThreshold: 3,
    circuitBreakerResetMs: 120_000,
  },
  goplus: {
    maxRequests: 30,
    windowMs: 60_000,
    minIntervalMs: 2000,
    maxRetries: 2,
    retryDelayMs: 3000,
    timeoutMs: 10_000,
    circuitBreakerThreshold: 5,
    circuitBreakerResetMs: 60_000,
  },
  alternativeme: {
    maxRequests: 20,
    windowMs: 60_000,
    minIntervalMs: 3000,
    maxRetries: 1,
    retryDelayMs: 5000,
    timeoutMs: 5_000,
    circuitBreakerThreshold: 3,
    circuitBreakerResetMs: 120_000,
  },
  alchemy: {
    maxRequests: 300,
    windowMs: 60_000,
    minIntervalMs: 100,
    maxRetries: 3,
    retryDelayMs: 1000,
    timeoutMs: 15_000,
    circuitBreakerThreshold: 10,
    circuitBreakerResetMs: 30_000,
  },
};

function getOrCreateState(provider: string): ProviderState {
  let state = providers.get(provider);
  if (!state) {
    state = {
      config: RATE_LIMITS[provider] || RATE_LIMITS.defillama,
      requestTimestamps: [],
      consecutiveFailures: 0,
      circuitState: "CLOSED",
      circuitOpenedAt: 0,
      lastRequestAt: 0,
      totalRequests: 0,
      totalErrors: 0,
      totalRetries: 0,
      inflight: new Map(),
    };
    providers.set(provider, state);
  }
  return state;
}

/** Check if we can make a request right now */
function canRequest(state: ProviderState): boolean {
  const now = Date.now();

  // Circuit breaker check
  if (state.circuitState === "OPEN") {
    if (now - state.circuitOpenedAt > state.config.circuitBreakerResetMs) {
      state.circuitState = "HALF_OPEN";
    } else {
      return false;
    }
  }

  // Min interval check
  if (now - state.lastRequestAt < state.config.minIntervalMs) {
    return false;
  }

  // Window rate limit check
  state.requestTimestamps = state.requestTimestamps.filter((ts) => now - ts < state.config.windowMs);
  return state.requestTimestamps.length < state.config.maxRequests;
}

/** Wait until we can make a request */
async function waitForSlot(state: ProviderState): Promise<void> {
  const maxWait = 30_000; // Never wait more than 30s
  const start = Date.now();

  while (!canRequest(state)) {
    if (Date.now() - start > maxWait) {
      throw new Error("Rate limiter timeout: waited too long for request slot");
    }
    await sleep(Math.min(500, state.config.minIntervalMs));
  }
}

function recordSuccess(state: ProviderState): void {
  state.consecutiveFailures = 0;
  if (state.circuitState === "HALF_OPEN") {
    state.circuitState = "CLOSED";
  }
}

function recordFailure(state: ProviderState): void {
  state.consecutiveFailures++;
  state.totalErrors++;
  if (state.consecutiveFailures >= state.config.circuitBreakerThreshold) {
    state.circuitState = "OPEN";
    state.circuitOpenedAt = Date.now();
  }
}

/**
 * Execute a request through the rate limiter with retry and circuit breaker.
 * Supports request deduplication — concurrent calls with the same dedupKey
 * share a single in-flight promise.
 */
export async function rateLimitedRequest<T>(
  provider: string,
  fn: () => Promise<T>,
  dedupKey?: string
): Promise<T> {
  const state = getOrCreateState(provider);

  // Request deduplication
  if (dedupKey && state.inflight.has(dedupKey)) {
    return state.inflight.get(dedupKey) as Promise<T>;
  }

  const execute = async (): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= state.config.maxRetries; attempt++) {
      if (attempt > 0) {
        state.totalRetries++;
        const delay = state.config.retryDelayMs * Math.pow(2, attempt - 1);
        await sleep(Math.min(delay, 30_000));
      }

      try {
        await waitForSlot(state);
        state.requestTimestamps.push(Date.now());
        state.lastRequestAt = Date.now();
        state.totalRequests++;

        const result = await Promise.race([
          fn(),
          timeoutPromise<T>(state.config.timeoutMs),
        ]);

        recordSuccess(state);
        return result;
      } catch (err: any) {
        lastError = err;
        const status = err.response?.status;

        // 429 = rate limited — always retry
        if (status === 429) {
          recordFailure(state);
          continue;
        }

        // 5xx = server error — retry
        if (status && status >= 500) {
          recordFailure(state);
          continue;
        }

        // 4xx (not 429) = client error — don't retry
        if (status && status >= 400) {
          recordFailure(state);
          throw err;
        }

        // Network / timeout error — retry
        recordFailure(state);
      }
    }

    throw lastError || new Error(`${provider}: max retries exhausted`);
  };

  const promise = execute().finally(() => {
    if (dedupKey) state.inflight.delete(dedupKey);
  });

  if (dedupKey) state.inflight.set(dedupKey, promise);
  return promise;
}

/**
 * Get rate limiter stats for a provider (for health dashboard).
 */
export function getRateLimiterStats(provider: string) {
  const state = providers.get(provider);
  if (!state) return null;
  return {
    provider,
    circuitState: state.circuitState,
    consecutiveFailures: state.consecutiveFailures,
    totalRequests: state.totalRequests,
    totalErrors: state.totalErrors,
    totalRetries: state.totalRetries,
    errorRate: state.totalRequests > 0
      ? ((state.totalErrors / state.totalRequests) * 100).toFixed(1) + "%"
      : "0%",
    windowUsage: `${state.requestTimestamps.filter((ts) => Date.now() - ts < state.config.windowMs).length}/${state.config.maxRequests}`,
  };
}

/** Get stats for all registered providers */
export function getAllRateLimiterStats() {
  const result: Record<string, ReturnType<typeof getRateLimiterStats>> = {};
  for (const key of providers.keys()) {
    result[key] = getRateLimiterStats(key);
  }
  return result;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function timeoutPromise<T>(ms: number): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  );
}
