/**
 * CryptoVision Shared HTTP Client
 * Wraps axios with rate-limited requests, caching integration,
 * and automatic error handling for all provider adapters.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { rateLimitedRequest } from "./rateLimiter.js";
import { cacheGet, cacheSet, cacheGetWithFallback, buildCacheKey, type CacheTier } from "./cache.js";

export interface HttpClientConfig {
  /** Provider name (used for rate limiting and cache namespacing) */
  provider: string;
  /** Base URL */
  baseUrl: string;
  /** Default headers */
  headers?: Record<string, string>;
  /** Timeout in ms */
  timeout?: number;
}

export class HttpClient {
  private client: AxiosInstance;
  private provider: string;

  constructor(config: HttpClientConfig) {
    this.provider = config.provider;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 10_000,
      headers: {
        accept: "application/json",
        ...config.headers,
      },
    });
  }

  /**
   * GET request with rate limiting, caching, and fallback.
   * @param path URL path
   * @param params Query parameters
   * @param cacheTier Cache tier (determines TTL)
   * @param dedupKey Optional deduplication key
   */
  async get<T>(
    path: string,
    params?: Record<string, unknown>,
    cacheTier?: CacheTier,
    dedupKey?: string
  ): Promise<{ data: T; isStale: boolean; source: string } | null> {
    const cacheKey = buildCacheKey(this.provider, path, params);

    // Check cache first
    if (cacheTier) {
      const cached = cacheGetWithFallback<T>(cacheKey);
      if (cached && !cached.isStale) {
        return { data: cached.data, isStale: false, source: `${this.provider}:cache` };
      }

      // Try fresh fetch, fall back to stale if it fails
      try {
        const freshData = await this.fetchWithRateLimit<T>(path, params, dedupKey || cacheKey);
        cacheSet(cacheKey, freshData, cacheTier);
        return { data: freshData, isStale: false, source: this.provider };
      } catch (err) {
        // Return stale data if available
        if (cached) {
          console.warn(`[${this.provider}] Using stale cache for ${path}: ${(err as Error).message}`);
          return { data: cached.data, isStale: true, source: `${this.provider}:stale` };
        }
        console.error(`[${this.provider}] Failed ${path}: ${(err as Error).message}`);
        return null;
      }
    }

    // No caching — direct fetch
    try {
      const data = await this.fetchWithRateLimit<T>(path, params, dedupKey);
      return { data, isStale: false, source: this.provider };
    } catch (err) {
      console.error(`[${this.provider}] Failed ${path}: ${(err as Error).message}`);
      return null;
    }
  }

  /**
   * POST request with rate limiting.
   */
  async post<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      return await rateLimitedRequest(this.provider, async () => {
        const res = await this.client.post<T>(path, body, config);
        return res.data;
      });
    } catch (err) {
      console.error(`[${this.provider}] POST failed ${path}: ${(err as Error).message}`);
      return null;
    }
  }

  private async fetchWithRateLimit<T>(
    path: string,
    params?: Record<string, unknown>,
    dedupKey?: string
  ): Promise<T> {
    return rateLimitedRequest(
      this.provider,
      async () => {
        const res = await this.client.get<T>(path, { params });
        return res.data;
      },
      dedupKey
    );
  }
}
