/**
 * Narrative Categorization Service
 * Seeded coin-to-narrative mapping. No AI hallucination.
 * Narratives are manually curated and updated.
 */

export interface Narrative {
  id: string;
  name: string;
  description: string;
  emoji: string;
  coinIds: string[];
}

export interface NarrativeWithMetrics extends Narrative {
  momentum: number;         // computed from price changes of member coins
  strength: number;         // 0–100
  totalVolume: number;
  weekChange: number;
  monthChange: number;
  assetCount: number;
}

// ── Seeded Narrative Definitions ──────────────────────────────────────────

export const NARRATIVES: Narrative[] = [
  {
    id: "ai-crypto",
    name: "AI & Crypto",
    description: "Projects combining artificial intelligence with blockchain infrastructure.",
    emoji: "🤖",
    coinIds: [
      "fetch-ai", "singularitynet", "ocean-protocol", "near", "render-token",
      "bittensor", "worldcoin-wld", "akash-network", "aleph-im",
    ],
  },
  {
    id: "rwa",
    name: "Real World Assets",
    description: "Tokenization of real-world assets including real estate, bonds, and commodities.",
    emoji: "🏦",
    coinIds: [
      "ondo-finance", "centrifuge", "goldfinch", "clearpool", "realtoken-s",
      "mantra-dao", "provenance-blockchain",
    ],
  },
  {
    id: "depin",
    name: "DePIN",
    description: "Decentralized Physical Infrastructure Networks — incentivizing real-world hardware.",
    emoji: "📡",
    coinIds: [
      "helium", "filecoin", "render-token", "hivemapper", "akash-network",
      "iotex", "livepeer", "grass",
    ],
  },
  {
    id: "defi",
    name: "DeFi",
    description: "Decentralized financial protocols including DEXs, lending, and derivatives.",
    emoji: "💱",
    coinIds: [
      "uniswap", "aave", "curve-dao-token", "compound-governance-token",
      "maker", "synthetix-network-token", "1inch", "balancer", "yearn-finance",
      "gmx", "dydx", "sushi", "pancakeswap-token",
    ],
  },
  {
    id: "l1",
    name: "Layer 1 Blockchains",
    description: "Base layer blockchain networks providing security and settlement.",
    emoji: "⛓️",
    coinIds: [
      "bitcoin", "ethereum", "solana", "avalanche-2", "cardano", "polkadot",
      "cosmos", "algorand", "tezos", "near", "sui", "aptos",
      "fantom", "injective-protocol",
    ],
  },
  {
    id: "l2",
    name: "Layer 2 Scaling",
    description: "Scaling solutions built on top of existing base layers.",
    emoji: "⚡",
    coinIds: [
      "matic-network", "arbitrum", "optimism", "immutable-x", "loopring",
      "zksync", "starknet", "base",
    ],
  },
  {
    id: "gaming",
    name: "Gaming & Metaverse",
    description: "Blockchain gaming, NFT gaming, and virtual world platforms.",
    emoji: "🎮",
    coinIds: [
      "axie-infinity", "the-sandbox", "decentraland", "illuvium", "gala",
      "immutable-x", "gods-unchained", "beam-2", "ronin",
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Cross-chain bridges, oracles, data availability, and developer tools.",
    emoji: "🔧",
    coinIds: [
      "chainlink", "the-graph", "api3", "band-protocol", "filecoin",
      "storj", "arweave", "celestia", "eigenlayer", "lido-dao",
    ],
  },
  {
    id: "stablecoins",
    name: "Stablecoins",
    description: "Price-stable assets pegged to fiat currencies or other assets.",
    emoji: "💵",
    coinIds: [
      "tether", "usd-coin", "dai", "frax", "trueusd", "usdd",
    ],
  },
  {
    id: "memecoins",
    name: "Memecoins",
    description: "Community-driven tokens originally created as jokes or cultural references.",
    emoji: "🐕",
    coinIds: [
      "dogecoin", "shiba-inu", "pepe", "bonk", "floki", "dogwifcoin",
      "book-of-meme",
    ],
  },
];

// ── Lookup utilities ──────────────────────────────────────────────────────

export function getNarrativesForCoin(coinId: string): Narrative[] {
  const lower = coinId.toLowerCase();
  return NARRATIVES.filter((n) => n.coinIds.includes(lower));
}

export function getNarrativeById(id: string): Narrative | undefined {
  return NARRATIVES.find((n) => n.id === id);
}

/**
 * Compute narrative metrics from live coin data.
 * Momentum is computed from the average price change of member coins.
 */
export function computeNarrativeMetrics(
  narrative: Narrative,
  coinData: Array<{
    id: string;
    priceChange7d?: number;
    priceChange30d?: number;
    volume24h?: number;
  }>
): NarrativeWithMetrics {
  const memberCoins = coinData.filter((c) => narrative.coinIds.includes(c.id));

  const changes7d = memberCoins
    .map((c) => c.priceChange7d)
    .filter((v): v is number => v !== undefined);
  const changes30d = memberCoins
    .map((c) => c.priceChange30d)
    .filter((v): v is number => v !== undefined);
  const volumes = memberCoins
    .map((c) => c.volume24h)
    .filter((v): v is number => v !== undefined);

  const weekChange = changes7d.length > 0
    ? changes7d.reduce((a, b) => a + b, 0) / changes7d.length
    : 0;
  const monthChange = changes30d.length > 0
    ? changes30d.reduce((a, b) => a + b, 0) / changes30d.length
    : 0;
  const totalVolume = volumes.reduce((a, b) => a + b, 0);

  // Momentum: blend of 7d and 30d performance
  const momentum = weekChange * 0.6 + monthChange * 0.4;

  // Strength: how many member coins are available + momentum
  const coverage = memberCoins.length / Math.max(narrative.coinIds.length, 1);
  const strength = Math.min(
    Math.round(50 + momentum * 0.5 + coverage * 20),
    100
  );

  return {
    ...narrative,
    momentum: parseFloat(momentum.toFixed(2)),
    strength: Math.max(0, strength),
    totalVolume,
    weekChange: parseFloat(weekChange.toFixed(2)),
    monthChange: parseFloat(monthChange.toFixed(2)),
    assetCount: memberCoins.length,
  };
}
