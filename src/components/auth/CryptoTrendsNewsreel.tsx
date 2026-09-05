import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { CryptoTrendNews } from "@/types";
import {
  TrendingUp,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export const CRYPTO_TREND_STORIES: CryptoTrendNews[] = [
  {
    id: "trend-btc-etf",
    title: "Institutional Bitcoin Accumulation Breaks Record Highs",
    subtitle: "Spot ETF net inflows exceed $1.8B weekly as sovereign wealth and multi-asset pension funds initiate on-chain custody allocations.",
    category: "INSTITUTIONAL FLOWS",
    badge: "🔥 Supercharged Inflows",
    badgeColor: "bg-gold/20 text-gold border-gold/40 shadow-gold-subtle",
    image: "/trends/bitcoin-etf.jpg",
    impactScore: 96,
    publishedAt: "Live Telemetry • 12m ago",
    coins: [
      { symbol: "BTC", name: "Bitcoin", price: 91450, change24h: 3.84 },
      { symbol: "MSTR", name: "MicroStrategy", price: 420.5, change24h: 8.12 },
      { symbol: "IBIT", name: "BlackRock ETF", price: 52.8, change24h: 4.15 },
    ],
    keyTakeaways: [
      "Over 42,000 BTC removed from liquid exchange reserves in 14 days.",
      "Cost basis distribution shows massive institutional cluster between $84k and $89k.",
      "Mining hash rate reaches 720 EH/s, confirming rock-solid network security.",
    ],
    institutionalSignal: "BULLISH ACCUMULATION",
  },
  {
    id: "trend-sol-defi",
    title: "High-Velocity Layer 1s Outpace Centralized Orderbooks",
    subtitle: "Sub-second execution networks and fee compression trigger massive liquidity migration into decentralized automated market makers.",
    category: "L1 DEFI VELOCITY",
    badge: "⚡ 65,000 TPS Scalability",
    badgeColor: "bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-md",
    image: "/trends/solana-speed.jpg",
    impactScore: 92,
    publishedAt: "Live Telemetry • 28m ago",
    coins: [
      { symbol: "SOL", name: "Solana", price: 218.4, change24h: 6.95 },
      { symbol: "JUP", name: "Jupiter", price: 1.42, change24h: 12.3 },
      { symbol: "RAY", name: "Raydium", price: 5.85, change24h: 9.4 },
    ],
    keyTakeaways: [
      "DEX volume on high-speed chains surpasses $4.2B in 24-hour trading turnover.",
      "Active daily unique transacting wallets cross 4.8 million mark.",
      "Developer commit velocity up +34% quarter-over-quarter across Rust toolchains.",
    ],
    institutionalSignal: "VOLUME BREAKOUT",
  },
  {
    id: "trend-ai-depin",
    title: "AI Autonomous Agents & Decentralized Compute Infrastructure",
    subtitle: "Autonomous LLM agents execute on-chain smart contracts while decentralized physical GPU networks distribute machine learning inference.",
    category: "AI & DEPIN INFRA",
    badge: "🤖 Next-Gen Intelligence",
    badgeColor: "bg-accent/20 text-accent border-accent/40 shadow-accent-subtle",
    image: "/trends/ai-depin.jpg",
    impactScore: 94,
    publishedAt: "Live Telemetry • 45m ago",
    coins: [
      { symbol: "NEAR", name: "NEAR Protocol", price: 7.25, change24h: 8.75 },
      { symbol: "RENDER", name: "Render", price: 9.6, change24h: 11.2 },
      { symbol: "TAO", name: "Bittensor", price: 585.0, change24h: 5.4 },
    ],
    keyTakeaways: [
      "On-chain AI agent transaction count surges +280% in the last 30 days.",
      "Decentralized compute clusters supply 45,000+ active enterprise GPUs.",
      "Multi-agent payment protocols standardize micropayments via Layer 2s.",
    ],
    institutionalSignal: "EXPONENTIAL GROWTH",
  },
  {
    id: "trend-zk-rollup",
    title: "Zero-Knowledge Cryptography & Layer 2 Ethereum Finality",
    subtitle: "Mathematical validity proofs enable instant settlement, private confidential transactions, and unprecedented horizontal rollup throughput.",
    category: "ZK CRYPTOGRAPHY",
    badge: "🛡️ Mathematical Privacy",
    badgeColor: "bg-mint/20 text-mint border-mint/40 shadow-mint",
    image: "/trends/zk-scaling.jpg",
    impactScore: 91,
    publishedAt: "Live Telemetry • 1h ago",
    coins: [
      { symbol: "ETH", name: "Ethereum", price: 3450.0, change24h: 3.12 },
      { symbol: "OP", name: "Optimism", price: 2.15, change24h: 5.6 },
      { symbol: "ARB", name: "Arbitrum", price: 1.05, change24h: 4.8 },
    ],
    keyTakeaways: [
      "Layer 2 gas fees decrease by 94% following Blob space optimization.",
      "Zero-knowledge proof generation times drop from minutes to sub-second provers.",
      "Total value locked across verified Ethereum rollups exceeds $48 Billion.",
    ],
    institutionalSignal: "FOUNDATIONAL EXPANSION",
  },
];

interface CryptoTrendsNewsreelProps {
  autoPlayInterval?: number;
  compact?: boolean;
}

export function CryptoTrendsNewsreel({
  autoPlayInterval = 6000,
  compact = false,
}: CryptoTrendsNewsreelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const story = CRYPTO_TREND_STORIES[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const stepMs = 50;
    const increment = (stepMs / autoPlayInterval) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % CRYPTO_TREND_STORIES.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, currentIndex]);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CRYPTO_TREND_STORIES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CRYPTO_TREND_STORIES.length) % CRYPTO_TREND_STORIES.length);
    setProgress(0);
  };

  return (
    <div className="relative flex flex-col justify-between h-full w-full rounded-3xl overflow-hidden border border-gold/30 bg-surface-1/90 shadow-2xl card-highlight">
      {/* ── Background Imagery with Velvet Violet & Gold Gradient Overlay ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={story.id}
            src={story.image}
            alt={story.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="w-full h-full object-cover object-center filter brightness-90 saturate-125"
          />
        </AnimatePresence>
        {/* Gradients for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-1/80 to-transparent" />
        <div className="absolute inset-0 bg-radial at-top-left from-purple-900/30 via-transparent to-surface-0/95" />
      </div>

      {/* ── Top Header Controls & Live Ticker ── */}
      <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-3 border-b border-border/40 bg-surface-0/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-gold/20 text-gold border border-gold/40 animate-pulse">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-gold">
                Live Trend Newsreel
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-ping" />
            </div>
            <span className="text-[10px] text-text-tertiary font-mono">
              {story.publishedAt}
            </span>
          </div>
        </div>

        {/* Play / Pause & Slide Controls */}
        <div className="flex items-center gap-1.5 bg-surface-0/80 p-1 rounded-xl border border-border/60 shadow-inner">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-gold hover:bg-surface-2 transition-all"
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-all"
            title="Previous Trend"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-all"
            title="Next Trend"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main News Showcase Body ── */}
      <div className="relative z-10 p-5 sm:p-7 flex-1 flex flex-col justify-end space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-3.5"
          >
            {/* Category & Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider border-gold/40 text-gold">
                {story.category}
              </Badge>
              <span className={cn("text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border", story.badgeColor)}>
                {story.badge}
              </span>
              <span className="text-[10px] font-mono font-bold text-mint bg-mint/15 px-2 py-0.5 rounded-lg border border-mint/30">
                Signal: {story.institutionalSignal}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight leading-tight drop-shadow-sm">
                {story.title}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl drop-shadow-sm">
                {story.subtitle}
              </p>
            </div>

            {/* Impacted Token Capsules */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-text-tertiary">Market Movers:</span>
              {story.coins.map((c) => (
                <div
                  key={c.symbol}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-0/85 border border-border/80 text-xs shadow-xs"
                >
                  <span className="font-extrabold text-text-primary text-[11px]">{c.symbol}</span>
                  <span className="font-mono text-text-secondary text-[11px]">${c.price.toLocaleString()}</span>
                  <span
                    className={cn(
                      "text-[10px] font-bold font-mono",
                      c.change24h >= 0 ? "text-positive" : "text-negative"
                    )}
                  >
                    {c.change24h >= 0 ? "+" : ""}
                    {c.change24h}%
                  </span>
                </div>
              ))}
            </div>

            {/* Key Takeaways Bullets (shown when not ultra-compact) */}
            {!compact && (
              <div className="p-3.5 rounded-2xl bg-surface-0/80 border border-border/70 backdrop-blur-md space-y-1.5 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Institutional Intelligence Briefing
                </span>
                <ul className="space-y-1 text-xs text-text-secondary leading-relaxed">
                  {story.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold font-bold text-xs mt-0.5">✦</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Thumbnail Navigation & Progress Bar ── */}
      <div className="relative z-10 p-4 sm:p-5 border-t border-border/60 bg-surface-0/60 backdrop-blur-md space-y-3">
        {/* Progress bar */}
        <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-gold to-mint rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Thumbnail Selector Pills */}
        <div className="grid grid-cols-4 gap-2">
          {CRYPTO_TREND_STORIES.map((item, index) => {
            const isSelected = currentIndex === index;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(index)}
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all overflow-hidden group",
                  isSelected
                    ? "bg-gradient-to-r from-surface-1 to-surface-2 border-gold/70 shadow-gold-subtle"
                    : "bg-surface-0/70 border-border/60 hover:border-accent/40 opacity-70 hover:opacity-100"
                )}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-8 w-8 rounded-lg object-cover flex-shrink-0 ring-1 ring-border group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 hidden sm:block">
                  <div className="text-[10px] font-bold text-text-primary truncate">
                    {item.coins[0]?.symbol} Trend
                  </div>
                  <div className="text-[9px] text-text-tertiary truncate">
                    {item.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
