/**
 * Provider Initialization
 * Registers all configured providers into the registry.
 * Called once at server startup.
 */

import { config } from "../config/env.js";
import { registerProvider } from "./registry.js";

// Provider adapters
import { CoinMarketCapProvider } from "./coinmarketcap.js";
import { BinanceProvider } from "./binance.js";
import { AlternativeMeProvider } from "./alternativeme.js";
import { GitHubProvider } from "./github.js";
import { CryptoPanicProvider } from "./cryptopanic.js";
import { NewsDataProvider } from "./newsdata.js";
import { GoPlusProvider } from "./goplus.js";
import { AlchemyProvider } from "./alchemy.js";

/**
 * Initialize and register all enabled providers.
 * CoinGecko is registered separately since it has a different adapter structure.
 */
export function initializeProviders(): { registered: string[]; skipped: string[] } {
  const registered: string[] = [];
  const skipped: string[] = [];

  // Note: CoinGecko is handled by the existing coingecko.ts service
  // which is adapted in the market routes. It's registered as a provider
  // through a wrapper — see coingeckoAdapter.ts

  // CoinMarketCap (secondary market data)
  if (config.coinmarketcap.enabled) {
    registerProvider("market", new CoinMarketCapProvider());
    registered.push("CoinMarketCap");
  } else {
    skipped.push("CoinMarketCap" + (!config.coinmarketcap.hasKey ? " (no API key)" : " (disabled)"));
  }

  // Binance (market microstructure — specialized, NOT a generic MarketDataProvider)
  // Registered separately for direct use by the microstructure engine
  if (config.binance.enabled) {
    // Binance is used directly by marketMicrostructure engine, not through registry
    registered.push("Binance");
  } else {
    skipped.push("Binance (disabled)");
  }

  // Alternative.me (sentiment — always available)
  if (config.alternativeme.enabled) {
    registerProvider("sentiment", new AlternativeMeProvider());
    registered.push("Alternative.me");
  }

  // GitHub (developer intelligence)
  if (config.github.enabled) {
    registerProvider("developer", new GitHubProvider());
    registered.push("GitHub");
  } else {
    skipped.push("GitHub" + (!config.github.hasKey ? " (no token)" : " (disabled)"));
  }

  // CryptoPanic (primary news)
  if (config.cryptopanic.enabled) {
    registerProvider("news", new CryptoPanicProvider());
    registered.push("CryptoPanic");
  } else {
    skipped.push("CryptoPanic" + (!config.cryptopanic.hasKey ? " (no API key)" : " (disabled)"));
  }

  // NewsData (fallback news)
  if (config.newsdata.enabled) {
    registerProvider("news", new NewsDataProvider());
    registered.push("NewsData");
  } else {
    skipped.push("NewsData (no API key)");
  }

  // GoPlus (security)
  if (config.goplus.enabled) {
    registerProvider("security", new GoPlusProvider());
    registered.push("GoPlus");
  } else {
    skipped.push("GoPlus" + (!config.goplus.hasKey ? " (no API key)" : " (disabled)"));
  }

  // Alchemy (on-chain)
  if (config.alchemy.enabled) {
    registerProvider("onchain", new AlchemyProvider());
    registered.push("Alchemy");
  } else {
    skipped.push("Alchemy" + (!config.alchemy.hasKey ? " (no API key)" : " (disabled)"));
  }

  console.log("[Providers] Registered:", registered.join(", ") || "none");
  if (skipped.length > 0) {
    console.log("[Providers] Skipped:", skipped.join(", "));
  }

  return { registered, skipped };
}
