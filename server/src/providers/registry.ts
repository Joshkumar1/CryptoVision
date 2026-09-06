/**
 * CryptoVision Provider Registry
 * Manages provider adapters, lifecycle, and fallback chains.
 */

import type {
  MarketDataProvider,
  OnChainDataProvider,
  NewsProvider,
  DeveloperDataProvider,
  SecurityDataProvider,
  DeFiFundamentalsProvider,
  SentimentProvider,
} from "./interfaces.js";

type ProviderType =
  | "market"
  | "onchain"
  | "news"
  | "developer"
  | "security"
  | "defi"
  | "sentiment";

// Provider instances keyed by type, ordered by priority (primary first)
const registry: Record<ProviderType, unknown[]> = {
  market: [],
  onchain: [],
  news: [],
  developer: [],
  security: [],
  defi: [],
  sentiment: [],
};

/** Register a provider adapter */
export function registerProvider(type: ProviderType, provider: unknown): void {
  registry[type].push(provider);
  console.log(`[Registry] Registered ${type} provider: ${(provider as any).name}`);
}

/** Get primary provider of a given type */
export function getPrimaryProvider<T>(type: ProviderType): T | null {
  return (registry[type][0] as T) || null;
}

/** Get all providers of a given type (for fallback iteration) */
export function getProviders<T>(type: ProviderType): T[] {
  return registry[type] as T[];
}

/** Get primary market data provider */
export function getMarketProvider(): MarketDataProvider | null {
  return getPrimaryProvider<MarketDataProvider>("market");
}

/** Get all market data providers (for cross-validation) */
export function getMarketProviders(): MarketDataProvider[] {
  return getProviders<MarketDataProvider>("market");
}

/** Get primary on-chain provider */
export function getOnChainProvider(): OnChainDataProvider | null {
  return getPrimaryProvider<OnChainDataProvider>("onchain");
}

/** Get primary news provider */
export function getNewsProvider(): NewsProvider | null {
  return getPrimaryProvider<NewsProvider>("news");
}

/** Get all news providers */
export function getNewsProviders(): NewsProvider[] {
  return getProviders<NewsProvider>("news");
}

/** Get primary developer data provider */
export function getDeveloperProvider(): DeveloperDataProvider | null {
  return getPrimaryProvider<DeveloperDataProvider>("developer");
}

/** Get primary security provider */
export function getSecurityProvider(): SecurityDataProvider | null {
  return getPrimaryProvider<SecurityDataProvider>("security");
}

/** Get primary DeFi fundamentals provider */
export function getDeFiProvider(): DeFiFundamentalsProvider | null {
  return getPrimaryProvider<DeFiFundamentalsProvider>("defi");
}

/** Get primary sentiment provider */
export function getSentimentProvider(): SentimentProvider | null {
  return getPrimaryProvider<SentimentProvider>("sentiment");
}

/** Get a summary of all registered providers */
export function getRegistrySummary(): Record<ProviderType, string[]> {
  const result: Record<ProviderType, string[]> = {
    market: [], onchain: [], news: [], developer: [],
    security: [], defi: [], sentiment: [],
  };
  for (const type of Object.keys(registry) as ProviderType[]) {
    result[type] = registry[type].map((p) => (p as any).name || "unknown");
  }
  return result;
}

/**
 * Execute a provider call with fallback chain.
 * Tries each provider in order until one succeeds.
 */
export async function withFallback<T>(
  type: ProviderType,
  fn: (provider: any) => Promise<T | null>
): Promise<{ data: T; provider: string; fallbackUsed: boolean } | null> {
  const providers = registry[type];
  for (let i = 0; i < providers.length; i++) {
    try {
      const result = await fn(providers[i]);
      if (result !== null) {
        return {
          data: result,
          provider: (providers[i] as any).name || `provider-${i}`,
          fallbackUsed: i > 0,
        };
      }
    } catch (err) {
      console.warn(`[Registry] ${type} provider ${i} failed:`, (err as Error).message);
    }
  }
  return null;
}
