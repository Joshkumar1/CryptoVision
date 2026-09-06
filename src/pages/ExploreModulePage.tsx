import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, TrendingUp, TrendingDown, Flame, Search, Filter,
  Sparkles, Activity, Layers, ArrowUpRight, ArrowDownRight, Globe, CheckCircle2, ChevronRight
} from "lucide-react";
import { AssetIntelligenceService } from "@/lib/intelligence/AssetIntelligenceService";
import type { AssetIntelligence } from "@/types/intelligence";
import { CurrencyPreferenceService } from "@/lib/currency/CurrencyPreferenceService";
import { CurrencyService } from "@/lib/currency/CurrencyService";
import { ExpertiseSelector } from "@/components/shared/ExpertiseSelector";
import { useExpertiseStore } from "@/stores/expertiseStore";
import { cn } from "@/lib/utils";

// Mini Sparkline SVG Renderer for Explore Cards
function QuickSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 36;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  const color = isPositive ? "#00dc82" : "#ff5b5b";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export const ExploreModulePage: React.FC = () => {
  const navigate = useNavigate();
  const { level } = useExpertiseStore();
  const [selectedTab, setSelectedTab] = useState<"TRENDING" | "GAINERS" | "LOSERS" | "MOST_TRADED" | "NEW" | "CATEGORIES">("TRENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [minMarketCap, setMinMarketCap] = useState<number>(0);
  const [selectedPerf, setSelectedPerf] = useState<"ALL" | "GAINERS" | "LOSERS">("ALL");

  const currency = CurrencyPreferenceService.getSelectedCurrency();
  const assets = AssetIntelligenceService.getAllAssets();

  // Filtered asset dataset
  const filteredAssets = useMemo(() => {
    return assets.filter((ast) => {
      const matchesSearch =
        ast.identity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ast.identity.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "ALL" || ast.identity.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesCap = ast.market.marketCapUsd >= minMarketCap;

      let matchesPerf = true;
      if (selectedPerf === "GAINERS") matchesPerf = ast.market.priceChange24h > 0;
      if (selectedPerf === "LOSERS") matchesPerf = ast.market.priceChange24h < 0;

      return matchesSearch && matchesCategory && matchesCap && matchesPerf;
    });
  }, [assets, searchQuery, selectedCategory, minMarketCap, selectedPerf]);

  return (
    <div className="space-y-8 pb-16">
      {/* ── MODULE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
              <Compass className="h-5 w-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              MODULE 1 — DISCOVERY & AWARENESS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            ✦ EXPLORE MARKET INTELLIGENCE
          </h1>
          <p className="text-xs font-sans text-white/60 mt-1 max-w-xl">
            Answers: <strong className="text-white">"What is happening in the market right now?"</strong> Optimized for fast scanning, real-time market awareness, and instant visual discovery.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <ExpertiseSelector />
        </div>
      </div>

      {/* ── 1. GLOBAL MARKET OVERVIEW BAR ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            Total Market Cap
          </span>
          <span className="text-sm font-bold font-mono text-white">
            {CurrencyService.formatValue(2.85e12, currency)}
          </span>
          <span className="text-[10px] font-mono text-[#00dc82] block mt-0.5">+2.48% (24H)</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            24h Market Volume
          </span>
          <span className="text-sm font-bold font-mono text-white">
            {CurrencyService.formatValue(1.14e11, currency)}
          </span>
          <span className="text-[10px] font-mono text-white/40 block mt-0.5">Global Spot + Derivatives</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            BTC Dominance
          </span>
          <span className="text-sm font-bold font-mono text-amber-400">57.4%</span>
          <span className="text-[10px] font-mono text-white/40 block mt-0.5">Sovereign Layer 1 Share</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            ETH Dominance
          </span>
          <span className="text-sm font-bold font-mono text-cyan-400">15.2%</span>
          <span className="text-[10px] font-mono text-white/40 block mt-0.5">Smart Contract Share</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            Fear & Greed Index
          </span>
          <span className="text-sm font-bold font-mono text-[#00dc82]">74 — Greed</span>
          <span className="text-[10px] font-mono text-[#00dc82]/80 block mt-0.5">Bullish Sentiment</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            Tracked Assets
          </span>
          <span className="text-sm font-bold font-mono text-white">12,480</span>
          <span className="text-[10px] font-mono text-white/40 block mt-0.5">Verified Exchanges</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
            Market Regime
          </span>
          <span className="text-xs font-bold font-mono text-[#00dc82] uppercase flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Bull Expansion
          </span>
          <span className="text-[10px] font-mono text-white/40 block mt-0.5">High Participation</span>
        </div>
      </div>

      {/* ── 2. DISCOVERY TABS & SEARCH FILTERS ── */}
      <div className="p-5 rounded-3xl bg-[#0a0d16] border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Discovery Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full lg:w-auto">
            {[
              { id: "TRENDING", label: "🔥 Trending" },
              { id: "GAINERS", label: "📈 Top Gainers" },
              { id: "LOSERS", label: "📉 Top Losers" },
              { id: "MOST_TRADED", label: "⚡ Most Traded" },
              { id: "NEW", label: "✦ Recently Added" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap",
                  selectedTab === tab.id
                    ? "bg-white text-black font-bold shadow-lg"
                    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search asset name or symbol..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#00dc82]/50"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-white/50">
            <Filter className="h-3.5 w-3.5 text-amber-400" />
            <span>Filters:</span>
          </div>

          {/* Performance Filter */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setSelectedPerf("ALL")}
              className={cn("px-2.5 py-1 rounded-lg text-[10px]", selectedPerf === "ALL" ? "bg-white/15 text-white font-bold" : "text-white/50")}
            >
              All Perf
            </button>
            <button
              onClick={() => setSelectedPerf("GAINERS")}
              className={cn("px-2.5 py-1 rounded-lg text-[10px]", selectedPerf === "GAINERS" ? "bg-[#00dc82]/20 text-[#00dc82] font-bold" : "text-white/50")}
            >
              Gainers (+24h)
            </button>
            <button
              onClick={() => setSelectedPerf("LOSERS")}
              className={cn("px-2.5 py-1 rounded-lg text-[10px]", selectedPerf === "LOSERS" ? "bg-rose-500/20 text-rose-400 font-bold" : "text-white/50")}
            >
              Losers (-24h)
            </button>
          </div>

          {/* Market Cap Filter */}
          <select
            value={minMarketCap}
            onChange={(e) => setMinMarketCap(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-white/80 focus:outline-none"
          >
            <option value={0} className="bg-[#0b0e17]">All Market Caps</option>
            <option value={100000000000} className="bg-[#0b0e17]">Large Cap (&gt;$100B)</option>
            <option value={10000000000} className="bg-[#0b0e17]">Mid Cap (&gt;$10B)</option>
          </select>
        </div>
      </div>

      {/* ── 3. QUICK ASSET DISCOVERY CARDS GRID ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white/70 flex items-center gap-2">
            <span>Market Assets Overview</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/60">
              {filteredAssets.length} Assets
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const isPos = asset.market.priceChange24h >= 0;
            const priceFormatted = CurrencyService.formatValue(asset.market.priceUsd, currency);
            const mcapFormatted = CurrencyService.formatValue(asset.market.marketCapUsd, currency);
            const volFormatted = CurrencyService.formatValue(asset.market.volume24hUsd, currency);

            return (
              <div
                key={asset.identity.id}
                className="p-5 rounded-3xl bg-[#090c14] border border-white/10 hover:border-white/25 transition-all space-y-4 group relative"
              >
                {/* Header: Logo, Name, Symbol */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={asset.identity.logo}
                      alt={asset.identity.name}
                      className="h-10 w-10 rounded-full border border-white/10 p-0.5 bg-white/5"
                    />
                    <div>
                      <h3 className="text-base font-bold font-mono text-white group-hover:text-[#00dc82] transition-colors flex items-center gap-2">
                        {asset.identity.name}
                        <span className="text-xs font-mono text-white/40 uppercase">
                          {asset.identity.symbol}
                        </span>
                      </h3>
                      <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        {asset.identity.category}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline preview */}
                  <div className="opacity-90">
                    <QuickSparkline data={asset.market.sparkline7d} isPositive={isPos} />
                  </div>
                </div>

                {/* Price & 24h Change */}
                <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="text-xl font-bold font-mono text-white">
                      {priceFormatted}
                    </span>
                  </div>

                  <div className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold",
                    isPos ? "bg-[#00dc82]/15 text-[#00dc82] border border-[#00dc82]/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                  )}>
                    {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    <span>{isPos ? "+" : ""}{asset.market.priceChange24h.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Market Cap & Volume */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 block">Market Cap</span>
                    <span className="text-white/90 font-bold">{mcapFormatted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">24h Volume</span>
                    <span className="text-white/90 font-bold">{volFormatted}</span>
                  </div>
                </div>

                {/* Contextual Action Pills for Seamless Module Transitions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/research/${asset.identity.id}`)}
                    className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-amber-400/20 hover:text-amber-400 text-white/80 font-mono text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🔥 Research</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/analyze/${asset.identity.id}`)}
                    className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-cyan-400/20 hover:text-cyan-400 text-white/80 font-mono text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>〽 Analyze</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
