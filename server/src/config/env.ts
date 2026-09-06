/**
 * CryptoVision Environment Configuration
 * Single source of truth for all environment variables.
 * Never import process.env directly elsewhere — use this module.
 */

import dotenv from "dotenv";
dotenv.config();

function env(key: string, fallback = ""): string {
  return process.env[key]?.trim() || fallback;
}

function envBool(key: string, fallback = false): boolean {
  const val = process.env[key]?.trim().toLowerCase();
  if (!val) return fallback;
  return val === "true" || val === "1" || val === "yes";
}

function envInt(key: string, fallback: number): number {
  const val = parseInt(process.env[key] || "", 10);
  return isNaN(val) ? fallback : val;
}

export const config = {
  // ── Server ──
  port: envInt("PORT", 4000),
  nodeEnv: env("NODE_ENV", "development"),
  isDev: env("NODE_ENV", "development") === "development",

  // ── Market Data: CoinGecko ──
  coingecko: {
    apiKey: env("COINGECKO_API_KEY"),
    baseUrl: env("COINGECKO_BASE_URL", "https://api.coingecko.com/api/v3"),
    get enabled() { return envBool("ENABLE_COINGECKO", true); },
    get hasKey() { return !!env("COINGECKO_API_KEY"); },
  },

  // ── Market Data: CoinMarketCap ──
  coinmarketcap: {
    apiKey: env("COINMARKETCAP_API_KEY"),
    baseUrl: "https://pro-api.coinmarketcap.com",
    get enabled() { return envBool("ENABLE_CMC", true) && !!env("COINMARKETCAP_API_KEY"); },
    get hasKey() { return !!env("COINMARKETCAP_API_KEY"); },
  },

  // ── DeFi / Fundamentals: DeFiLlama ──
  defillama: {
    baseUrl: "https://api.llama.fi",
    feesUrl: "https://fees.llama.fi",
    yieldsUrl: "https://yields.llama.fi",
    stablecoinsUrl: "https://stablecoins.llama.fi",
    get enabled() { return envBool("ENABLE_DEFILLAMA", true); },
    // DeFiLlama is free — no key required
  },

  // ── On-Chain: Alchemy ──
  alchemy: {
    apiKey: env("ALCHEMY_API_KEY"),
    get enabled() { return envBool("ENABLE_ONCHAIN", true) && !!env("ALCHEMY_API_KEY"); },
    get hasKey() { return !!env("ALCHEMY_API_KEY"); },
    getBaseUrl(network = "eth-mainnet") {
      return `https://${network}.g.alchemy.com/v2/${env("ALCHEMY_API_KEY")}`;
    },
  },

  // ── On-Chain: QuickNode (future) ──
  quicknode: {
    apiKey: env("QUICKNODE_API_KEY"),
    get enabled() { return !!env("QUICKNODE_API_KEY"); },
  },

  // ── Developer: GitHub ──
  github: {
    token: env("GITHUB_TOKEN"),
    baseUrl: "https://api.github.com",
    get enabled() { return envBool("ENABLE_GITHUB", true) && !!env("GITHUB_TOKEN"); },
    get hasKey() { return !!env("GITHUB_TOKEN"); },
  },

  // ── Exchange: Binance ──
  binance: {
    apiKey: env("BINANCE_API_KEY"),
    apiSecret: env("BINANCE_API_SECRET"),
    baseUrl: "https://api.binance.com",
    get enabled() { return envBool("ENABLE_BINANCE", true); },
    // Public endpoints work without keys
    get hasKey() { return !!env("BINANCE_API_KEY"); },
  },

  // ── News: CryptoPanic ──
  cryptopanic: {
    apiKey: env("CRYPTOPANIC_API_KEY"),
    baseUrl: "https://cryptopanic.com/api/free/v1",
    get enabled() { return envBool("ENABLE_NEWS", true) && !!env("CRYPTOPANIC_API_KEY"); },
    get hasKey() { return !!env("CRYPTOPANIC_API_KEY"); },
  },

  // ── News: NewsData ──
  newsdata: {
    apiKey: env("NEWSDATA_API_KEY"),
    baseUrl: "https://newsdata.io/api/1",
    get enabled() { return !!env("NEWSDATA_API_KEY"); },
    get hasKey() { return !!env("NEWSDATA_API_KEY"); },
  },

  // ── Security: GoPlus ──
  goplus: {
    apiKey: env("GOPLUS_API_KEY"),
    baseUrl: "https://api.gopluslabs.io/api/v1",
    get enabled() { return envBool("ENABLE_SECURITY", true) && !!env("GOPLUS_API_KEY"); },
    get hasKey() { return !!env("GOPLUS_API_KEY"); },
  },

  // ── Sentiment: Alternative.me (free, no key) ──
  alternativeme: {
    baseUrl: "https://api.alternative.me",
    get enabled() { return true; }, // Always available — free public API
  },

  // ── AI: Gemini ──
  gemini: {
    apiKey: env("GEMINI_API_KEY"),
    get enabled() { return !!env("GEMINI_API_KEY"); },
  },

  // ── AI: OpenAI ──
  openai: {
    apiKey: env("OPENAI_API_KEY"),
    get enabled() { return !!env("OPENAI_API_KEY"); },
  },

  // ── Optional Professional Providers ──
  messari: {
    apiKey: env("MESSARI_API_KEY"),
    get enabled() { return envBool("ENABLE_MESSARI", false) && !!env("MESSARI_API_KEY"); },
  },
  kaiko: {
    apiKey: env("KAIKO_API_KEY"),
    get enabled() { return envBool("ENABLE_KAIKO", false) && !!env("KAIKO_API_KEY"); },
  },
  coinmetrics: {
    apiKey: env("COINMETRICS_API_KEY"),
    get enabled() { return envBool("ENABLE_COINMETRICS", false) && !!env("COINMETRICS_API_KEY"); },
  },

  // ── Database ──
  mongodb: {
    uri: env("MONGODB_URI", "mongodb://localhost:27017/cryptovision"),
  },

  // ── JWT ──
  jwt: {
    secret: env("JWT_SECRET", "cryptovision-dev-secret-change-in-production"),
    expiresIn: env("JWT_EXPIRES_IN", "7d"),
  },

  // ── Redis ──
  redis: {
    url: env("REDIS_URL"),
    get enabled() { return !!env("REDIS_URL"); },
  },
} as const;

/** Summary of which providers are currently active */
export function getProviderStatus(): Record<string, { enabled: boolean; hasKey: boolean; status: string }> {
  return {
    coingecko:      { enabled: config.coingecko.enabled,      hasKey: config.coingecko.hasKey,      status: config.coingecko.enabled ? "ACTIVE" : "DISABLED" },
    coinmarketcap:  { enabled: config.coinmarketcap.enabled,  hasKey: config.coinmarketcap.hasKey,  status: config.coinmarketcap.enabled ? "ACTIVE" : config.coinmarketcap.hasKey ? "DISABLED" : "NO_KEY" },
    defillama:      { enabled: config.defillama.enabled,      hasKey: true,                          status: config.defillama.enabled ? "ACTIVE" : "DISABLED" },
    alchemy:        { enabled: config.alchemy.enabled,        hasKey: config.alchemy.hasKey,        status: config.alchemy.enabled ? "ACTIVE" : config.alchemy.hasKey ? "DISABLED" : "NO_KEY" },
    github:         { enabled: config.github.enabled,         hasKey: config.github.hasKey,         status: config.github.enabled ? "ACTIVE" : config.github.hasKey ? "DISABLED" : "NO_KEY" },
    binance:        { enabled: config.binance.enabled,        hasKey: config.binance.hasKey,        status: config.binance.enabled ? "ACTIVE" : "DISABLED" },
    cryptopanic:    { enabled: config.cryptopanic.enabled,    hasKey: config.cryptopanic.hasKey,    status: config.cryptopanic.enabled ? "ACTIVE" : config.cryptopanic.hasKey ? "DISABLED" : "NO_KEY" },
    newsdata:       { enabled: config.newsdata.enabled,       hasKey: config.newsdata.hasKey,       status: config.newsdata.enabled ? "ACTIVE" : "NO_KEY" },
    goplus:         { enabled: config.goplus.enabled,         hasKey: config.goplus.hasKey,         status: config.goplus.enabled ? "ACTIVE" : config.goplus.hasKey ? "DISABLED" : "NO_KEY" },
    alternativeme:  { enabled: config.alternativeme.enabled,  hasKey: true,                          status: "ACTIVE" },
    gemini:         { enabled: config.gemini.enabled,         hasKey: config.gemini.enabled,        status: config.gemini.enabled ? "ACTIVE" : "NO_KEY" },
  };
}
