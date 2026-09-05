import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCoins, useMarketOverview, useTrending } from "@/hooks/useMarketData";
import { useEmergingProjects } from "@/hooks/useEmerging";
import { useRedFlags } from "@/hooks/useIntelligence";
import { useAppStore } from "@/stores/appStore";
import { PersonaSegmentBanner } from "@/components/shared/PersonaSegmentBanner";
import { Metric } from "@/components/shared/Metric";
import { MetricGroup } from "@/components/shared/MetricGroup";
import { AssetAvatar } from "@/components/shared/AssetAvatar";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMarketCap, formatPrice, formatPercentage, formatConfidence, cn } from "@/lib/utils";
import {
  TrendingUp,
  Flame,
  ArrowRight,
  Activity,
  ShieldCheck,
  Zap,
  Compass,
  Lightbulb,
  BarChart2,
  Lock,
  ArrowUpRight,
  Star,
  Sparkles,
  Brain,
  FlaskConical,
  AlertTriangle,
  AlertOctagon,
  Scale,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  TrendingDown,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

import type { Variants } from "framer-motion";
import type { Coin, ResearchPriorityState } from "@/types";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const chartData = data.filter((_, i) => i % 3 === 0).map((p, i) => ({ i, p }));
  const stroke = positive ? "#10b981" : "#f43f5e";
  const fill = positive ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)";

  return (
    <div className="w-20 h-7 flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Area
            type="monotone"
            dataKey="p"
            stroke={stroke}
            fill={fill}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OverviewPage() {
  const { data: marketData, isLoading: marketLoading, refetch } = useMarketOverview();
  const { data: coins, isLoading: coinsLoading } = useCoins(0, 10);
  const { data: trending, isLoading: trendingLoading } = useTrending();
  const { data: emerging, isLoading: emergingLoading } = useEmergingProjects();
  const { data: redFlags, isLoading: flagsLoading } = useRedFlags(coins?.[0]?.id);
  const { isWatched, toggleWatchlist, persona } = useAppStore();


  const [activeQuestion, setActiveQuestion] = useState<string>("ALL");

  const regime = marketData?.regime;

  const scrollToSection = (id: string) => {
    setActiveQuestion(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div className="space-y-8 max-w-7xl mx-auto pb-12" variants={stagger} initial="hidden" animate="show">
      {/* ── Active Persona Banner ── */}
      <motion.div variants={fadeUp}>
        <PersonaSegmentBanner />
      </motion.div>

      {/* ── The 5 Core Institutional Research Questions Navigation Ribbon ── */}
      <motion.div variants={fadeUp} className="sticky top-14 z-20 py-2.5 backdrop-blur-xl bg-[#080809]/80">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-lg no-scrollbar">
          {[
            { id: "happening", label: "1. What is Happening?", icon: Activity },
            { id: "investigate", label: "2. What Should I Investigate?", icon: Zap },
            { id: "changed", label: "3. What Changed?", icon: Clock },
            { id: "risky", label: "4. What is Risky?", icon: AlertTriangle },
            { id: "learn", label: "5. What Can I Learn?", icon: Lightbulb },
          ].map((q) => {
            const Icon = q.icon;
            const isSelected = activeQuestion === q.id;
            return (
              <button
                key={q.id}
                onClick={() => scrollToSection(q.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all",
                  isSelected
                    ? "bg-white text-black font-semibold shadow-md"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{q.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          ── SECTION 1: WHAT IS HAPPENING? (Market Regime & Pulse) ──
          ══════════════════════════════════════════════════════════ */}
      <section id="happening" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <Activity className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-ranade text-2xl sm:text-3xl text-white font-bold tracking-tight">
                1. What is Happening in the Market Right Now?
              </h2>
              <p className="text-xs text-white/50">
                Macro market regime, global liquidity breadth, and real-time capital turnover velocity.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] hidden sm:inline-flex bg-white/[0.04] text-white/50 border border-white/10 px-3 py-1 rounded-full">
            Macro Telemetry
          </span>
        </div>

        {/* Market Regime Hero Banner (Editorial Serene Card) */}
        {regime && (
          <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 serene-card border border-white/10 shadow-xl transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-white/10 border border-white/15 text-white">
                    <Activity className="h-4 w-4 animate-pulse" />
                  </span>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50">
                    Current Market Regime
                  </span>
                  <span
                    className={cn(
                      "font-mono font-bold tracking-wider uppercase text-xs px-2.5 py-0.5 rounded-full border",
                      regime.state === "BULLISH"
                        ? "bg-[#00dc82]/10 text-[#00dc82] border-[#00dc82]/30"
                        : regime.state === "BEARISH"
                        ? "bg-[#ff5b5b]/10 text-[#ff5b5b] border-[#ff5b5b]/30"
                        : "bg-[#f2c94c]/10 text-[#f2c94c] border-[#f2c94c]/30"
                    )}
                  >
                    {regime.state.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm font-sans text-white/70 leading-relaxed max-w-2xl">
                  {regime.description}
                </p>
              </div>

              <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-[#262b3d] pt-3 sm:pt-0 sm:pl-6">
                <div>
                  <div className="text-xs text-[#8f9cae] font-semibold uppercase tracking-wider">
                    Model Confidence
                  </div>
                  <div className="text-xl font-extrabold text-white tabular mt-0.5">
                    {formatConfidence(regime.confidence)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Market Snapshot */}
        {marketData?.overview && (
          <MetricGroup>
            <Metric
              label="Total Market Cap"
              value={formatMarketCap(marketData.overview.totalMarketCap)}
              change={marketData.overview.marketCapChangePercentage24h}
            />
            <Metric
              label="24h Volume"
              value={formatMarketCap(marketData.overview.totalVolume)}
            />
            <Metric
              label="BTC Dominance"
              value={`${marketData.overview.btcDominance.toFixed(1)}%`}
            />
            <Metric
              label="ETH Dominance"
              value={`${marketData.overview.ethDominance.toFixed(1)}%`}
            />
            <Metric
              label="Active Assets"
              value={marketData.overview.activeCryptocurrencies.toLocaleString()}
            />
            <Metric
              label="Market 24h Δ"
              value={formatPercentage(marketData.overview.marketCapChangePercentage24h)}
              change={marketData.overview.marketCapChangePercentage24h}
            />
          </MetricGroup>
        )}

        {/* Live Capital Assets Pulse Table */}
        <div className="serene-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#00dc82]" /> Top Capital Assets &amp; Research Priority
            </div>
            <Link to="/market" className="text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-1">
              Explore 100+ Assets <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4 sm:p-5">
            {coinsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-xl" />
                ))}
              </div>
            ) : coins ? (
              <div className="space-y-1">
                {coins.slice(0, 7).map((coin, i) => {
                  const sparkline = coin.sparkline_in_7d?.price;
                  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
                  const priority: ResearchPriorityState =
                    i === 0 || Math.abs(coin.price_change_percentage_24h ?? 0) > 6
                      ? "VERY_HIGH"
                      : i <= 2
                      ? "HIGH"
                      : (coin.price_change_percentage_7d_in_currency ?? 0) < -10
                      ? "WATCH"
                      : "MODERATE";

                  return (
                    <Link
                      key={coin.id}
                      to={`/asset/${coin.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2/80 transition-all border border-transparent hover:border-border/60 group"
                    >
                      <span className="text-xs font-mono font-bold text-text-tertiary w-5 text-right flex-shrink-0">
                        #{coin.market_cap_rank}
                      </span>
                      <AssetAvatar image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
                      {sparkline && sparkline.length > 5 && (
                        <div className="hidden sm:block ml-2">
                          <MiniSparkline data={sparkline} positive={isPositive} />
                        </div>
                      )}
                      <div className="ml-auto text-right flex-shrink-0">
                        <div className="text-sm font-bold text-text-primary tabular">
                          {formatPrice(coin.current_price)}
                        </div>
                      </div>
                      <div className="w-20 text-right flex-shrink-0">
                        <ChangeIndicator value={coin.price_change_percentage_24h} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary w-24 text-right hidden md:block tabular flex-shrink-0">
                        {formatMarketCap(coin.market_cap)}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase hidden lg:inline-flex flex-shrink-0",
                          priority === "VERY_HIGH"
                            ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
                            : priority === "HIGH"
                            ? "text-gold bg-gold/15 border-gold/30"
                            : priority === "WATCH"
                            ? "text-rose-400 bg-rose-500/15 border-rose-500/30"
                            : "text-text-tertiary bg-surface-2 border-border"
                        )}
                      >
                        {priority}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── SECTION 2: WHAT SHOULD I INVESTIGATE? (Priority Radar) ──
          ══════════════════════════════════════════════════════════ */}
      <section id="investigate" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-ranade text-2xl sm:text-3xl text-white font-bold tracking-tight">
                2. What Should I Investigate? (Research Priority Radar)
              </h2>
              <p className="text-xs text-white/50">
                Assets ranked by research urgency based on information velocity, fundamental changes, and catalysts.
              </p>
            </div>
          </div>
          <Link to="/opportunities" className="text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-1">
            Discover Radar <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Priority: VERY HIGH */}
          <div className="p-5 rounded-2xl serene-card border border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00dc82] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#00dc82] uppercase tracking-wider">
                  VERY HIGH RESEARCH PRIORITY
                </span>
              </div>
              <span className="text-[10px] text-[#00dc82] bg-[#00dc82]/10 border border-[#00dc82]/20 px-2.5 py-0.5 rounded-full font-mono">
                Immediate Deep-Dive
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Significant fundamental acceleration or impending catalyst with asymmetric risk-reward profile.
            </p>
            <div className="space-y-2 pt-1">
              {[
                { id: "bitcoin", name: "Bitcoin", symbol: "BTC", reason: "Institutional ETF absorption vs. post-halving supply elasticity" },
                { id: "solana", name: "Solana", symbol: "SOL", reason: "Surging organic DEX fee capture & Firedancer client milestone" },
              ].map((item) => (
                <Link
                  key={item.id}
                  to={`/asset/${item.id}`}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 flex flex-col gap-1 transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-[#00dc82] transition-colors">
                      {item.name} ({item.symbol})
                    </span>
                    <ArrowRight className="h-3 w-3 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[11px] text-white/50 leading-snug">{item.reason}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Priority: HIGH */}
          <div className="p-5 rounded-2xl serene-card border border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f2c94c]" />
                <span className="text-xs font-mono font-bold text-[#f2c94c] uppercase tracking-wider">
                  HIGH RESEARCH PRIORITY
                </span>
              </div>
              <span className="text-[10px] text-[#f2c94c] bg-[#f2c94c]/10 border border-[#f2c94c]/20 px-2.5 py-0.5 rounded-full font-mono">
                Active Diligence
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Strong developer velocity and ecosystem adoption requiring verification of token value capture.
            </p>
            <div className="space-y-2 pt-1">
              {[
                { id: "ethereum", name: "Ethereum", symbol: "ETH", reason: "Blob space fee economics and L2 value accrual verification" },
                { id: "aave", name: "Aave", symbol: "AAVE", reason: "Protocol revenue expansion and GHO stablecoin peg stability" },
              ].map((item) => (
                <Link
                  key={item.id}
                  to={`/asset/${item.id}`}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 flex flex-col gap-1 transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-[#f2c94c] transition-colors">
                      {item.name} ({item.symbol})
                    </span>
                    <ArrowRight className="h-3 w-3 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[11px] text-white/50 leading-snug">{item.reason}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Priority: WATCH / ASYMMETRIC */}
          <div className="p-5 rounded-2xl serene-card border border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/70" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  WATCH / DILUTION RISK
                </span>
              </div>
              <span className="text-[10px] text-white/70 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full font-mono">
                Overhang Watch
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              High search hype or narrative momentum coupled with upcoming float expansion or unlock cliffs.
            </p>
            <div className="space-y-2 pt-1">
              {[
                { id: "chainlink", name: "Chainlink", symbol: "LINK", reason: "CCIP cross-chain volume adoption vs. node operator subsidies" },
                { id: "uniswap", name: "Uniswap", symbol: "UNI", reason: "Fee switch governance proposal audit and regulatory risk vector" },
              ].map((item) => (
                <Link
                  key={item.id}
                  to={`/asset/${item.id}`}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 flex flex-col gap-1 transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-white transition-colors">
                      {item.name} ({item.symbol})
                    </span>
                    <ArrowRight className="h-3 w-3 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[11px] text-white/50 leading-snug">{item.reason}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── SECTION 3: WHAT CHANGED? (Why Projects Matter Now) ──
          ══════════════════════════════════════════════════════════ */}
      <section id="changed" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-ranade text-2xl sm:text-3xl text-white font-bold tracking-tight">
                3. What Changed? (Why Projects Matter Now)
              </h2>
              <p className="text-xs text-white/50">
                Recent 30-day velocity deviations, protocol upgrades, and verified catalyst milestones.
              </p>
            </div>
          </div>
          <Link to="/news" className="text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-1">
            News &amp; Catalysts <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl serene-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase bg-[#00dc82]/10 text-[#00dc82] border border-[#00dc82]/20 px-2.5 py-0.5 rounded-full">
                Adoption Surge
              </span>
              <span className="text-[10px] text-white/40 font-mono">2 days ago</span>
            </div>
            <h4 className="text-xs font-bold text-white">Solana Daily Fees +44%</h4>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Organic transaction priority fees hit 3-month highs, overtaking baseline validator subsidies.
            </p>
            <div className="text-[10px] text-[#00dc82] pt-2 border-t border-white/10 font-mono">
              Impact: Fundamental-Led Growth
            </div>
          </div>

          <div className="p-5 rounded-2xl serene-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase bg-[#f2c94c]/10 text-[#f2c94c] border border-[#f2c94c]/20 px-2.5 py-0.5 rounded-full">
                Institutional Inflow
              </span>
              <span className="text-[10px] text-white/40 font-mono">3 days ago</span>
            </div>
            <h4 className="text-xs font-bold text-white">Bitcoin ETF Net Inflows Exceed $1.2B</h4>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Custody wallet accumulation velocity exceeds miners' daily issuance by a 4:1 ratio.
            </p>
            <div className="text-[10px] text-[#f2c94c] pt-2 border-t border-white/10 font-mono">
              Impact: Supply Absorption Positive
            </div>
          </div>

          <div className="p-5 rounded-2xl serene-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase bg-white/10 text-white/80 border border-white/15 px-2.5 py-0.5 rounded-full">
                Unlock Overhang
              </span>
              <span className="text-[10px] text-white/40 font-mono">5 days left</span>
            </div>
            <h4 className="text-xs font-bold text-white">Arbitrum $85M Cliff Unlock</h4>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Upcoming team and investor unlock represents 4.2% of circulating float, testing liquidity depth.
            </p>
            <div className="text-[10px] text-white/50 pt-2 border-t border-white/10 font-mono">
              Impact: Potential Supply Pressure
            </div>
          </div>

          <div className="p-5 rounded-2xl serene-card border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase bg-white/10 text-white/80 border border-white/15 px-2.5 py-0.5 rounded-full">
                Governance Vote
              </span>
              <span className="text-[10px] text-white/40 font-mono">Active</span>
            </div>
            <h4 className="text-xs font-bold text-white">Aave V3 Umbrella Staking Activation</h4>
            <p className="text-[11px] text-white/60 font-sans leading-relaxed">
              Protocol safety module restructured to decouple native token liquidation from bad debt coverage.
            </p>
            <div className="text-[10px] text-[#00dc82] pt-2 border-t border-white/10 font-mono">
              Impact: Moat &amp; Risk Strengthening
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── SECTION 4: WHAT IS RISKY? (Red Flags & Divergences) ──
          ══════════════════════════════════════════════════════════ */}
      <section id="risky" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-ranade text-2xl sm:text-3xl text-white font-bold tracking-tight">
                4. What is Risky? (Red Flags &amp; Signal Divergences)
              </h2>
              <p className="text-xs text-white/50">
                Structural dilution cliffs, insider centralization, and Price vs. Fundamental divergences.
              </p>
            </div>
          </div>
          <Link to="/risk-radar" className="text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-1">
            Red Flag Radar <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Signal Divergences Card */}
          <div className="p-6 rounded-2xl serene-card border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-[#ff5b5b]" />
                <span className="text-xs font-mono font-bold uppercase text-[#ff5b5b] tracking-wide">
                  Market / Fundamental Divergence
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#ff5b5b] bg-[#ff5b5b]/10 border border-[#ff5b5b]/20 px-2.5 py-0.5 rounded-full">
                Investigation Required
              </span>
            </div>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              The system detects when price action is disconnected from underlying on-chain economic reality:
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                <TrendingUp className="h-4 w-4 text-[#ff5b5b] mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <strong className="text-white block font-medium">Price ↑ / On-Chain Users ↓ (Speculative Dislocation)</strong>
                  <span className="text-white/50 text-[11px]">
                    Token price appreciated +32% over 30d while active transacting addresses fell -14%. Hype-driven rally with vulnerable retention.
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                <TrendingDown className="h-4 w-4 text-[#00dc82] mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <strong className="text-white block font-medium">Price ↓ / Protocol Revenue ↑ (Contrarian Asymmetry)</strong>
                  <span className="text-white/50 text-[11px]">
                    Token dropped -18% during broader market correction, yet daily protocol fee capture accelerated +24%.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Red Flags Preview */}
          <div className="p-6 rounded-2xl serene-card border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#f2c94c]" />
                <span className="text-xs font-mono font-bold uppercase text-[#f2c94c] tracking-wide">
                  Structural Dilution &amp; Centralization Warnings
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#f2c94c] bg-[#f2c94c]/10 border border-[#f2c94c]/20 px-2.5 py-0.5 rounded-full">
                Live Audit
              </span>
            </div>
            <div className="space-y-2">
              {[
                { title: "Low Float / High FDV Overhang", desc: "Top 50 asset with only 18% circulating float and $6.2B theoretical FDV cliff." },
                { title: "Whale Centralization Alert", desc: "Top 10 non-exchange wallets hold >64% of total liquid supply." },
                { title: "Developer Dormancy Risk", desc: "GitHub core repository commit velocity declined >70% over the last 90 days." },
              ].map((rf, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-white block">{rf.title}</span>
                    <span className="text-[11px] text-white/50">{rf.desc}</span>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white/70 ml-2 flex-shrink-0">
                    Audited
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── SECTION 5: WHAT CAN I LEARN? (Academy & Trust) ──
          ══════════════════════════════════════════════════════════ */}
      <section id="learn" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-ranade text-2xl sm:text-3xl text-white font-bold tracking-tight">
                5. What Can I Learn? (Interactive Academy &amp; Trust Center)
              </h2>
              <p className="text-xs text-white/50">
                Master professional due-diligence concepts, position-sizing discipline, and deterministic grounding.
              </p>
            </div>
          </div>
          <Link to="/learn" className="text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-1">
            Financial Academy <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl serene-card border border-white/10 space-y-3">
            <span className="text-xl">⚖️</span>
            <h4 className="text-sm font-bold text-white">The Law of Ruin &amp; Position Sizing</h4>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              A 50% account drawdown requires a 100% gain to break even. Learn how professional quants size positions using dollar-risk invalidation stops.
            </p>
            <Link to="/learn" className="text-xs text-[#00dc82] font-mono font-semibold flex items-center gap-1 pt-2">
              Interactive Risk Simulator <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl serene-card border border-white/10 space-y-3">
            <span className="text-xl">📦</span>
            <h4 className="text-sm font-bold text-white">Tokenomics: Circulating Float vs. FDV</h4>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Why high Fully Diluted Valuation causes structural retail underperformance when foundation and investor vesting unlocks hit spot orderbooks.
            </p>
            <Link to="/learn" className="text-xs text-[#00dc82] font-mono font-semibold flex items-center gap-1 pt-2">
              Read Dilution Case Study <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl serene-card border border-white/10 space-y-3">
            <span className="text-xl">🛡️</span>
            <h4 className="text-sm font-bold text-white">Deterministic Grounding Methodology</h4>
            <p className="text-xs text-white/60 font-sans leading-relaxed">
              How CryptoVision cross-examines social narrative claims against on-chain block explorers, DeFiLlama TVL, and GitHub commit trees.
            </p>
            <Link to="/trust" className="text-xs text-[#00dc82] font-mono font-semibold flex items-center gap-1 pt-2">
              Explore Trust Center <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Platform Grounding & Disclaimer Footer ── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-2xl glass-panel border border-white/15 text-xs text-text-tertiary shadow-sm"
      >
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
        <div>
          <strong className="text-text-primary block font-bold">
            CryptoVision Institutional Intelligence Philosophy
          </strong>
          <span>
            Don't just follow the coin. Investigate the project. Research the story, verify the evidence, challenge the thesis, understand the risk, and form your own conclusion.
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
