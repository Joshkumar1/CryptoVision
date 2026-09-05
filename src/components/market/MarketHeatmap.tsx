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
} from "lucide-react";
import type { Coin } from "@/types";

interface MarketHeatmapProps {
  coins: Coin[];
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

export function MarketHeatmap({ coins }: MarketHeatmapProps) {
  const [sector, setSector] = useState<SectorFilter>("ALL");
  const [period, setPeriod] = useState<PerformancePeriod>("24h");

  const filteredCoins = useMemo(() => {
    const list =
      sector === "ALL"
        ? coins.slice(0, 36)
        : coins.filter((c) => SECTORS[sector].coinIds.includes(c.id)).slice(0, 36);

    return list.sort((a, b) => b.market_cap - a.market_cap);
  }, [coins, sector]);

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

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 backdrop-blur-md self-start sm:self-auto shadow-inner">
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
