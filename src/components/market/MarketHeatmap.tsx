import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, formatMarketCap, formatPercentage, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Flame,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  BarChart2,
  PieChart,
  Zap,
} from "lucide-react";
import type { Coin } from "@/types";

export const FALLBACK_TOP_COINS: Coin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 96450,
    market_cap: 1900000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 2025000000000,
    total_volume: 48200000000,
    high_24h: 97800,
    low_24h: 94500,
    price_change_24h: 2025,
    price_change_percentage_24h: 2.14,
    price_change_percentage_7d_in_currency: 5.4,
    circulating_supply: 19790000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 108900,
    ath_change_percentage: -11.4,
    atl: 67.81,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2740,
    market_cap: 330000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 330000000000,
    total_volume: 24200000000,
    high_24h: 2810,
    low_24h: 2690,
    price_change_24h: 42,
    price_change_percentage_24h: 1.56,
    price_change_percentage_7d_in_currency: 3.2,
    circulating_supply: 120450000,
    total_supply: 120450000,
    max_supply: null,
    ath: 4878,
    ath_change_percentage: -43.8,
    atl: 0.43,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 188.5,
    market_cap: 89000000000,
    market_cap_rank: 3,
    fully_diluted_valuation: 110000000000,
    total_volume: 8500000000,
    high_24h: 194.2,
    low_24h: 181.0,
    price_change_24h: 10.4,
    price_change_percentage_24h: 5.82,
    price_change_percentage_7d_in_currency: 12.8,
    circulating_supply: 472000000,
    total_supply: 588000000,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -27.5,
    atl: 0.5,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 652.1,
    market_cap: 95000000000,
    market_cap_rank: 4,
    fully_diluted_valuation: 95000000000,
    total_volume: 1850000000,
    high_24h: 660.0,
    low_24h: 645.0,
    price_change_24h: 6.1,
    price_change_percentage_24h: 0.95,
    price_change_percentage_7d_in_currency: 2.1,
    circulating_supply: 145000000,
    total_supply: 145000000,
    max_supply: 200000000,
    ath: 717.48,
    ath_change_percentage: -9.1,
    atl: 0.0398,
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 2.42,
    market_cap: 138000000000,
    market_cap_rank: 5,
    fully_diluted_valuation: 242000000000,
    total_volume: 7200000000,
    high_24h: 2.55,
    low_24h: 2.28,
    price_change_24h: 0.18,
    price_change_percentage_24h: 8.15,
    price_change_percentage_7d_in_currency: 14.5,
    circulating_supply: 57000000000,
    total_supply: 99990000000,
    max_supply: 100000000000,
    ath: 3.84,
    ath_change_percentage: -36.9,
    atl: 0.00268,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.78,
    market_cap: 27800000000,
    market_cap_rank: 6,
    fully_diluted_valuation: 35100000000,
    total_volume: 1420000000,
    high_24h: 0.82,
    low_24h: 0.75,
    price_change_24h: 0.026,
    price_change_percentage_24h: 3.4,
    price_change_percentage_7d_in_currency: 8.9,
    circulating_supply: 35700000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -74.7,
    atl: 0.0192,
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 34.2,
    market_cap: 14200000000,
    market_cap_rank: 7,
    fully_diluted_valuation: 24600000000,
    total_volume: 850000000,
    high_24h: 35.8,
    low_24h: 32.9,
    price_change_24h: 1.35,
    price_change_percentage_24h: 4.12,
    price_change_percentage_7d_in_currency: 6.4,
    circulating_supply: 415000000,
    total_supply: 720000000,
    max_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -76.4,
    atl: 2.8,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.26,
    market_cap: 38500000000,
    market_cap_rank: 8,
    fully_diluted_valuation: 38500000000,
    total_volume: 3400000000,
    high_24h: 0.28,
    low_24h: 0.24,
    price_change_24h: 0.029,
    price_change_percentage_24h: 12.4,
    price_change_percentage_7d_in_currency: 18.2,
    circulating_supply: 147000000000,
    total_supply: 147000000000,
    max_supply: null,
    ath: 0.7315,
    ath_change_percentage: -64.4,
    atl: 0.0000869,
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 18.4,
    market_cap: 11200000000,
    market_cap_rank: 9,
    fully_diluted_valuation: 18400000000,
    total_volume: 780000000,
    high_24h: 19.1,
    low_24h: 17.5,
    price_change_24h: 1.09,
    price_change_percentage_24h: 6.3,
    price_change_percentage_7d_in_currency: 9.8,
    circulating_supply: 608000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    ath: 52.7,
    ath_change_percentage: -65.1,
    atl: 0.148,
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    current_price: 9.45,
    market_cap: 5670000000,
    market_cap_rank: 10,
    fully_diluted_valuation: 9450000000,
    total_volume: 380000000,
    high_24h: 9.8,
    low_24h: 9.15,
    price_change_24h: 0.22,
    price_change_percentage_24h: 2.38,
    price_change_percentage_7d_in_currency: 7.4,
    circulating_supply: 600000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    ath: 44.92,
    ath_change_percentage: -78.9,
    atl: 1.03,
  },
  {
    id: "bittensor",
    symbol: "tao",
    name: "Bittensor",
    image: "https://assets.coingecko.com/coins/images/28549/large/tao.png",
    current_price: 485.0,
    market_cap: 3580000000,
    market_cap_rank: 11,
    fully_diluted_valuation: 10185000000,
    total_volume: 185000000,
    high_24h: 512.0,
    low_24h: 462.0,
    price_change_24h: 60.5,
    price_change_percentage_24h: 14.2,
    price_change_percentage_7d_in_currency: 22.5,
    circulating_supply: 7380000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 757.6,
    ath_change_percentage: -36.0,
    atl: 30.4,
  },
  {
    id: "render-token",
    symbol: "render",
    name: "Render",
    image: "https://assets.coingecko.com/coins/images/11636/large/rndr.png",
    current_price: 6.85,
    market_cap: 3540000000,
    market_cap_rank: 12,
    fully_diluted_valuation: 3650000000,
    total_volume: 320000000,
    high_24h: 7.2,
    low_24h: 6.4,
    price_change_24h: 0.5,
    price_change_percentage_24h: 7.9,
    price_change_percentage_7d_in_currency: 11.2,
    circulating_supply: 518000000,
    total_supply: 532000000,
    max_supply: 532000000,
    ath: 13.53,
    ath_change_percentage: -49.4,
    atl: 0.0366,
  },
];

interface MarketHeatmapProps {
  coins: Coin[];
  onSwitchToTelemetry?: () => void;
}

type SectorFilter = "ALL" | "L1" | "DEFI" | "AI" | "INFRA" | "MEME";
type PerformancePeriod = "24h" | "7d";

const SECTORS: Record<SectorFilter, { label: string; coinIds: string[] }> = {
  ALL: { label: "All Sectors", coinIds: [] },
  L1: {
    label: "Layer 1s",
    coinIds: [
      "bitcoin", "ethereum", "solana", "binancecoin", "ripple", "cardano",
      "avalanche-2", "polkadot", "near", "sui", "aptos", "tron", "fantom",
    ],
  },
  DEFI: {
    label: "DeFi",
    coinIds: [
      "uniswap", "aave", "maker", "curve-dao-token", "compound-governance-token",
      "synthetix-network-token", "lido-dao", "pancakeswap-token", "jupiter-exchange-solana",
      "injective-protocol", "thorchain", "gmx",
    ],
  },
  AI: {
    label: "AI & DePIN",
    coinIds: [
      "bittensor", "render-token", "fetch-ai", "singularitynet", "ocean-protocol",
      "akash-network", "helium", "filecoin", "livepeer", "hivemapper",
    ],
  },
  INFRA: {
    label: "Infrastructure",
    coinIds: [
      "chainlink", "the-graph", "arweave", "celestia", "eigenlayer", "pyth-network",
      "api3", "immutable-x", "arbitrum", "optimism", "polygon-ecosystem-token",
    ],
  },
  MEME: {
    label: "Memecoins",
    coinIds: ["dogecoin", "shiba-inu", "pepe", "bonk", "dogwifcoin", "floki"],
  },
};

function getHeatmapColor(change: number | undefined): {
  bg: string;
  border: string;
  text: string;
  badge: string;
  glow: string;
} {
  if (change == null) {
    return {
      bg: "bg-surface-2/40 backdrop-blur-xl",
      border: "border-white/10",
      text: "text-text-tertiary",
      badge: "bg-white/5 text-text-tertiary border border-white/10",
      glow: "",
    };
  }
  if (change >= 10) {
    return {
      bg: "bg-gradient-to-br from-emerald-500/25 via-emerald-600/15 to-[#05140d]/80 backdrop-blur-xl",
      border: "border-emerald-400/50 hover:border-emerald-300",
      text: "text-emerald-300",
      badge: "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 backdrop-blur-md shadow-sm",
      glow: "shadow-[0_8px_25px_rgba(0,220,130,0.22),inset_0_1px_0_rgba(255,255,255,0.25)]",
    };
  }
  if (change >= 3) {
    return {
      bg: "bg-gradient-to-br from-emerald-500/18 via-emerald-600/10 to-[#07130e]/75 backdrop-blur-xl",
      border: "border-emerald-500/35 hover:border-emerald-400/60",
      text: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md",
      glow: "shadow-[0_4px_20px_rgba(0,220,130,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]",
    };
  }
  if (change > 0) {
    return {
      bg: "bg-emerald-500/10 backdrop-blur-xl hover:bg-emerald-500/15",
      border: "border-emerald-500/25 hover:border-emerald-500/45",
      text: "text-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
      glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    };
  }
  if (change <= -10) {
    return {
      bg: "bg-gradient-to-br from-rose-500/25 via-rose-600/15 to-[#160608]/80 backdrop-blur-xl",
      border: "border-rose-400/50 hover:border-rose-300",
      text: "text-rose-300",
      badge: "bg-rose-500/25 text-rose-300 border border-rose-400/40 backdrop-blur-md shadow-sm",
      glow: "shadow-[0_8px_25px_rgba(255,91,91,0.22),inset_0_1px_0_rgba(255,255,255,0.25)]",
    };
  }
  if (change <= -3) {
    return {
      bg: "bg-gradient-to-br from-rose-500/18 via-rose-600/10 to-[#14080a]/75 backdrop-blur-xl",
      border: "border-rose-500/35 hover:border-rose-400/60",
      text: "text-rose-400",
      badge: "bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md",
      glow: "shadow-[0_4px_20px_rgba(255,91,91,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]",
    };
  }
  return {
    bg: "bg-rose-500/10 backdrop-blur-xl hover:bg-rose-500/15",
    border: "border-rose-500/25 hover:border-rose-500/45",
    text: "text-rose-400",
    badge: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
    glow: "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  };
}

export function MarketHeatmap({ coins, onSwitchToTelemetry }: MarketHeatmapProps) {
  const [sector, setSector] = useState<SectorFilter>("ALL");
  const [period, setPeriod] = useState<PerformancePeriod>("24h");

  // If live query returns 0 coins (rate limit / initial boot), use rich curated fallback tokens
  const activeCoins = useMemo(() => {
    return coins && coins.length > 0 ? coins : FALLBACK_TOP_COINS;
  }, [coins]);

  const filteredCoins = useMemo(() => {
    const list =
      sector === "ALL"
        ? activeCoins.slice(0, 36)
        : activeCoins.filter((c) => SECTORS[sector].coinIds.includes(c.id)).slice(0, 36);

    return list.sort((a, b) => b.market_cap - a.market_cap);
  }, [activeCoins, sector]);

  // Statistics
  const gainers = filteredCoins.filter((c) => {
    const val = period === "24h" ? c.price_change_percentage_24h : c.price_change_percentage_7d_in_currency ?? 0;
    return val > 0;
  });

  const losers = filteredCoins.filter((c) => {
    const val = period === "24h" ? c.price_change_percentage_24h : c.price_change_percentage_7d_in_currency ?? 0;
    return val < 0;
  });

  return (
    <div className="space-y-4">
      {/* ── Heatmap Stats Bar (Glassmorphic Specular Cards) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl glass-surface border border-white/10 card-highlight shadow-lg hover:border-white/20 transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
            Visualized Assets
          </div>
          <div className="text-xl font-extrabold text-text-primary tabular mt-0.5">
            {filteredCoins.length} Coins
          </div>
        </div>
        <div className="p-3.5 rounded-2xl glass-surface border border-positive/30 card-highlight glass-glow-emerald hover:border-positive/50 shadow-lg transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-positive">
            Advancing Tokens ({period.toUpperCase()})
          </div>
          <div className="text-xl font-extrabold text-positive tabular mt-0.5">
            {gainers.length} Assets
          </div>
        </div>
        <div className="p-3.5 rounded-2xl glass-surface border border-negative/30 card-highlight glass-glow-rose hover:border-negative/50 shadow-lg transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-negative">
            Declining Tokens ({period.toUpperCase()})
          </div>
          <div className="text-xl font-extrabold text-negative tabular mt-0.5">
            {losers.length} Assets
          </div>
        </div>
        <div className="p-3.5 rounded-2xl glass-surface border border-accent/30 card-highlight glass-glow-emerald hover:border-accent/50 shadow-lg transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
            Sector Breadth
          </div>
          <div className="text-xl font-extrabold text-accent tabular mt-0.5">
            {filteredCoins.length > 0 ? `${((gainers.length / filteredCoins.length) * 100).toFixed(0)}% Green` : "—"}
          </div>
        </div>
      </div>

      {/* ── Heatmap Controls (Frosted Glass Control Dock) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-surface p-3.5 rounded-2xl border border-white/10 card-highlight shadow-xl">
        {/* Sector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(SECTORS) as SectorFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-xl transition-all",
                sector === s
                  ? "bg-accent/20 text-accent border border-accent/40 shadow-sm backdrop-blur-md"
                  : "text-text-tertiary hover:text-text-primary hover:bg-white/[0.06] border border-transparent"
              )}
            >
              {SECTORS[s].label}
            </button>
          ))}
        </div>

        {/* Period Selector & Quick Telemetry Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onSwitchToTelemetry && (
            <button
              type="button"
              onClick={onSwitchToTelemetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all cursor-pointer shadow-sm"
              title="Switch to 3D Event Operations Telemetry"
            >
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>3D Dashboard</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-inner">
            <button
              onClick={() => setPeriod("24h")}
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-lg transition-all",
                period === "24h"
                  ? "bg-white/[0.12] text-white border border-white/20 shadow-xs backdrop-blur-sm"
                  : "text-text-tertiary hover:text-white"
              )}
            >
              24H Heatmap
            </button>
            <button
              onClick={() => setPeriod("7d")}
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-lg transition-all",
                period === "7d"
                  ? "bg-white/[0.12] text-white border border-white/20 shadow-xs backdrop-blur-sm"
                  : "text-text-tertiary hover:text-white"
              )}
            >
              7D Trend Map
            </button>
          </div>
        </div>
      </div>

      {/* ── Dynamic Treemap Tiles (Frosted Glass Tiles with Specular Sheen) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 min-h-[500px]">
        {filteredCoins.map((coin, index) => {
          const changeVal =
            period === "24h"
              ? coin.price_change_percentage_24h
              : coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_24h;

          const color = getHeatmapColor(changeVal);

          // Top market cap coins span wider visual grids
          const isTopTier = index === 0;
          const isSecondTier = index === 1 || index === 2;

          return (
            <motion.div
              key={coin.id}
              layout
              className={cn(
                "relative rounded-2xl p-4 border transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden card-highlight glass-sheen hover:scale-[1.02] hover:z-20 shadow-lg",
                color.bg,
                color.border,
                color.glow,               color.glow,
                isTopTier && "col-span-2 sm:col-span-2 min-h-[165px]",
                isSecondTier && "col-span-2 sm:col-span-2 min-h-[165px]",
                !isTopTier && !isSecondTier && "min-h-[145px]"
              )}
            >
              <Link to={`/asset/${coin.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {coin.name}</span>
              </Link>

              {/* Tile Header */}
              <div className="flex items-start justify-between gap-2 relative z-0">
                <div className="flex items-center gap-2.5">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className={cn(
                      "rounded-full ring-2 ring-border/80 object-cover flex-shrink-0 group-hover:scale-110 transition-transform",
                      isTopTier ? "h-11 w-11" : isSecondTier ? "h-8 w-8" : "h-7 w-7"
                    )}
                  />
                  <div>
                    <div className="font-extrabold text-sm text-text-primary tracking-tight leading-tight group-hover:text-accent transition-colors">
                      {coin.name}
                    </div>
                    <div className="text-[10px] font-mono text-text-tertiary uppercase mt-0.5">
                      {coin.symbol}
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-border/80">
                  #{coin.market_cap_rank}
                </Badge>
              </div>

              {/* Price & Change Metrics */}
              <div className="pt-3 relative z-0">
                <div
                  className={cn(
                    "font-extrabold tabular tracking-tight text-text-primary",
                    isTopTier ? "text-2xl sm:text-3xl" : isSecondTier ? "text-xl" : "text-base"
                  )}
                >
                  {formatPrice(coin.current_price)}
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span
                    className={cn(
                      "text-xs font-extrabold tabular px-2 py-0.5 rounded-lg inline-flex items-center gap-0.5",
                      color.badge
                    )}
                  >
                    {changeVal >= 0 ? "+" : ""}
                    {changeVal?.toFixed(2)}%
                  </span>

                  <span className="text-[10px] text-text-tertiary font-mono hidden sm:inline tabular">
                    {formatMarketCap(coin.market_cap)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
