/**
 * CryptoVision Asset Identifier Normalization
 * Creates canonical CryptoVision Asset IDs with cross-provider mappings.
 * Do NOT use ticker symbols as unique identifiers.
 */

export interface AssetIdentity {
  /** CryptoVision canonical ID (usually CoinGecko ID as default) */
  cvId: string;
  symbol: string;
  name: string;
  /** CoinGecko slug */
  coingeckoId: string | null;
  /** CoinMarketCap numeric ID */
  cmcId: number | null;
  /** DeFiLlama protocol slug */
  defillamaSlug: string | null;
  /** GitHub repositories [owner/repo] */
  githubRepos: string[];
  /** Contract addresses by chain */
  contracts: Record<string, string>;   // chain → address
  /** Primary chain */
  primaryChain: string | null;
}

/**
 * Known asset identity mappings.
 * CoinGecko IDs are used as the canonical CryptoVision ID.
 * This map is extended at runtime when providers return new assets.
 */
const KNOWN_ASSETS: Map<string, AssetIdentity> = new Map<string, AssetIdentity>([
  ["bitcoin", {
    cvId: "bitcoin", symbol: "BTC", name: "Bitcoin",
    coingeckoId: "bitcoin", cmcId: 1,
    defillamaSlug: null, githubRepos: ["bitcoin/bitcoin"],
    contracts: {} as Record<string, string>, primaryChain: "bitcoin",
  }],
  ["ethereum", {
    cvId: "ethereum", symbol: "ETH", name: "Ethereum",
    coingeckoId: "ethereum", cmcId: 1027,
    defillamaSlug: "ethereum", githubRepos: ["ethereum/go-ethereum", "ethereum/solidity"],
    contracts: {} as Record<string, string>, primaryChain: "ethereum",
  }],
  ["solana", {
    cvId: "solana", symbol: "SOL", name: "Solana",
    coingeckoId: "solana", cmcId: 5426,
    defillamaSlug: "solana", githubRepos: ["solana-labs/solana"],
    contracts: {} as Record<string, string>, primaryChain: "solana",
  }],
  ["binancecoin", {
    cvId: "binancecoin", symbol: "BNB", name: "BNB",
    coingeckoId: "binancecoin", cmcId: 1839,
    defillamaSlug: null, githubRepos: [],
    contracts: {} as Record<string, string>, primaryChain: "bsc",
  }],
  ["ripple", {
    cvId: "ripple", symbol: "XRP", name: "XRP",
    coingeckoId: "ripple", cmcId: 52,
    defillamaSlug: null, githubRepos: ["ripple/rippled"],
    contracts: {} as Record<string, string>, primaryChain: "xrp",
  }],
  ["cardano", {
    cvId: "cardano", symbol: "ADA", name: "Cardano",
    coingeckoId: "cardano", cmcId: 2010,
    defillamaSlug: "cardano", githubRepos: ["cardano-foundation/cardano-node"],
    contracts: {} as Record<string, string>, primaryChain: "cardano",
  }],
  ["avalanche-2", {
    cvId: "avalanche-2", symbol: "AVAX", name: "Avalanche",
    coingeckoId: "avalanche-2", cmcId: 5805,
    defillamaSlug: "avalanche", githubRepos: ["ava-labs/avalanchego"],
    contracts: {} as Record<string, string>, primaryChain: "avalanche",
  }],
  ["chainlink", {
    cvId: "chainlink", symbol: "LINK", name: "Chainlink",
    coingeckoId: "chainlink", cmcId: 1975,
    defillamaSlug: "chainlink", githubRepos: ["smartcontractkit/chainlink"],
    contracts: { ethereum: "0x514910771af9ca656af840dff83e8264ecf986ca" }, primaryChain: "ethereum",
  }],
  ["uniswap", {
    cvId: "uniswap", symbol: "UNI", name: "Uniswap",
    coingeckoId: "uniswap", cmcId: 7083,
    defillamaSlug: "uniswap", githubRepos: ["Uniswap/v3-core", "Uniswap/interface"],
    contracts: { ethereum: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" }, primaryChain: "ethereum",
  }],
  ["aave", {
    cvId: "aave", symbol: "AAVE", name: "Aave",
    coingeckoId: "aave", cmcId: 7278,
    defillamaSlug: "aave", githubRepos: ["aave/aave-v3-core"],
    contracts: { ethereum: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9" }, primaryChain: "ethereum",
  }],
  ["near", {
    cvId: "near", symbol: "NEAR", name: "NEAR Protocol",
    coingeckoId: "near", cmcId: 6535,
    defillamaSlug: "near", githubRepos: ["near/nearcore"],
    contracts: {} as Record<string, string>, primaryChain: "near",
  }],
  ["bittensor", {
    cvId: "bittensor", symbol: "TAO", name: "Bittensor",
    coingeckoId: "bittensor", cmcId: 22974,
    defillamaSlug: null, githubRepos: ["opentensor/bittensor"],
    contracts: {} as Record<string, string>, primaryChain: "bittensor",
  }],
  ["render-token", {
    cvId: "render-token", symbol: "RENDER", name: "Render",
    coingeckoId: "render-token", cmcId: 5690,
    defillamaSlug: null, githubRepos: ["rendernetwork/RNP"],
    contracts: { ethereum: "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24" }, primaryChain: "ethereum",
  }],
  ["fetch-ai", {
    cvId: "fetch-ai", symbol: "FET", name: "Artificial Superintelligence Alliance",
    coingeckoId: "fetch-ai", cmcId: 3773,
    defillamaSlug: null, githubRepos: ["fetchai/fetchd"],
    contracts: { ethereum: "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85" }, primaryChain: "ethereum",
  }],
  ["akash-network", {
    cvId: "akash-network", symbol: "AKT", name: "Akash Network",
    coingeckoId: "akash-network", cmcId: 7431,
    defillamaSlug: null, githubRepos: ["akash-network/node"],
    contracts: {} as Record<string, string>, primaryChain: "cosmos",
  }],
  ["pyth-network", {
    cvId: "pyth-network", symbol: "PYTH", name: "Pyth Network",
    coingeckoId: "pyth-network", cmcId: 28177,
    defillamaSlug: null, githubRepos: ["pyth-network/pyth-sdk-solidity"],
    contracts: {} as Record<string, string>, primaryChain: "solana",
  }],
]);

// Runtime-extended mappings
const dynamicAssets: Map<string, AssetIdentity> = new Map();

// Reverse lookups
const cmcIdToCV: Map<number, string> = new Map();
const symbolToCV: Map<string, string[]> = new Map(); // symbol → multiple possible CV IDs

// Build reverse indexes from known assets
for (const [cvId, asset] of KNOWN_ASSETS) {
  if (asset.cmcId) cmcIdToCV.set(asset.cmcId, cvId);
  const sym = asset.symbol.toUpperCase();
  if (!symbolToCV.has(sym)) symbolToCV.set(sym, []);
  symbolToCV.get(sym)!.push(cvId);
}

/** Get canonical asset identity */
export function getAssetIdentity(cvId: string): AssetIdentity | null {
  return KNOWN_ASSETS.get(cvId) || dynamicAssets.get(cvId) || null;
}

/** Resolve CoinGecko ID → CryptoVision ID (usually identical) */
export function resolveFromCoinGecko(coingeckoId: string): string {
  return coingeckoId; // CoinGecko ID IS the canonical ID
}

/** Resolve CoinMarketCap ID → CryptoVision ID */
export function resolveFromCMC(cmcId: number): string | null {
  return cmcIdToCV.get(cmcId) || null;
}

/** Resolve symbol to CryptoVision ID (may be ambiguous) */
export function resolveFromSymbol(symbol: string): string[] {
  return symbolToCV.get(symbol.toUpperCase()) || [];
}

/** Get DeFiLlama slug for a CryptoVision asset */
export function getDefillamaSlug(cvId: string): string | null {
  return getAssetIdentity(cvId)?.defillamaSlug || null;
}

/** Get GitHub repos for a CryptoVision asset */
export function getGithubRepos(cvId: string): string[] {
  return getAssetIdentity(cvId)?.githubRepos || [];
}

/** Get Binance trading symbol for a CryptoVision asset */
export function getBinanceSymbol(cvId: string): string | null {
  const identity = getAssetIdentity(cvId);
  if (!identity) return null;
  return `${identity.symbol.toUpperCase()}USDT`;
}

/** Register a new asset identity discovered from a provider at runtime */
export function registerAsset(identity: AssetIdentity): void {
  dynamicAssets.set(identity.cvId, identity);
  if (identity.cmcId) cmcIdToCV.set(identity.cmcId, identity.cvId);
  const sym = identity.symbol.toUpperCase();
  if (!symbolToCV.has(sym)) symbolToCV.set(sym, []);
  const arr = symbolToCV.get(sym)!;
  if (!arr.includes(identity.cvId)) arr.push(identity.cvId);
}

/** Get all known asset IDs */
export function getAllAssetIds(): string[] {
  return [...KNOWN_ASSETS.keys(), ...dynamicAssets.keys()];
}
