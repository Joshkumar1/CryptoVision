/**
 * DeFiLlama Integration
 * Free API — no key required. Provides TVL data for DeFi protocols.
 * https://defillama.com/docs/api
 */

import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 1800 }); // 30 minute cache

const BASE_URL = "https://api.llama.fi";

// Map of CoinGecko IDs to DeFiLlama protocol slugs
// Extend this list as needed
const COINGECKO_TO_DEFILLAMA: Record<string, string> = {
  "uniswap": "uniswap",
  "aave": "aave",
  "makerdao": "makerdao",
  "compound-governance-token": "compound",
  "curve-dao-token": "curve",
  "lido-dao": "lido",
  "pancakeswap-token": "pancakeswap",
  "chainlink": "chainlink",
  "ethereum": "ethereum",
  "bitcoin": null as any,
  "solana": "solana",
  "avalanche-2": "avalanche",
  "matic-network": "polygon",
  "arbitrum": "arbitrum",
  "optimism": "optimism",
  "synthetix-network-token": "synthetix",
  "yearn-finance": "yearn-finance",
  "sushi": "sushiswap",
  "1inch": "1inch",
  "balancer": "balancer",
  "the-graph": "the-graph",
  "injective-protocol": "injective",
  "thorchain": "thorchain",
  "osmosis": "osmosis",
  "gmx": "gmx",
  "dydx": "dydx",
  "stargate-finance": "stargate",
  "rocket-pool": "rocket-pool",
};

interface DefiLlamaProtocol {
  tvl: number;
  name: string;
  symbol: string;
  change_1d?: number;
  change_7d?: number;
}

export async function getTVL(coinGeckoId: string): Promise<number | null> {
  const slug = COINGECKO_TO_DEFILLAMA[coinGeckoId.toLowerCase()];
  if (!slug) return null;   // Not a tracked DeFi protocol

  const cacheKey = `tvl:${slug}`;
  const cached = cache.get<number>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${BASE_URL}/protocol/${slug}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const data = await res.json() as { tvl?: { date: number; totalLiquidityUSD: number }[] };
    if (!data.tvl || data.tvl.length === 0) return null;

    const latestTVL = data.tvl[data.tvl.length - 1].totalLiquidityUSD;
    cache.set(cacheKey, latestTVL);
    return latestTVL;
  } catch {
    return null;
  }
}

export async function getTopProtocols(limit = 20): Promise<DefiLlamaProtocol[]> {
  const cacheKey = `top-protocols:${limit}`;
  const cached = cache.get<DefiLlamaProtocol[]>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${BASE_URL}/protocols`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];

    const data = await res.json() as DefiLlamaProtocol[];
    const sorted = data.sort((a, b) => b.tvl - a.tvl).slice(0, limit);
    cache.set(cacheKey, sorted);
    return sorted;
  } catch {
    return [];
  }
}
