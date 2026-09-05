import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEmergingProjects } from "@/hooks/useEmerging";
import { useCoins } from "@/hooks/useMarketData";
import { useAppStore } from "@/stores/appStore";
import { PersonaSegmentBanner } from "@/components/shared/PersonaSegmentBanner";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMarketCap, formatPrice, cn } from "@/lib/utils";
import {
  Radar,
  Sparkles,
  Star,
  TrendingUp,
  BarChart2,
  ShieldCheck,
  Flame,
  Sprout,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { EmergingProject, RiskLevel, Coin } from "@/types";
import type { Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const RISK_FILTERS: (RiskLevel | "ALL")[] = ["ALL", "MODERATE", "HIGH", "VERY_HIGH"];

const signalIcons: Record<string, string> = {
  DEVELOPER_ACTIVITY_INCREASING: "💻",
  VOLUME_UPTICK: "📈",
  PRICE_MOMENTUM: "🚀",
  MARKET_CAP_OPPORTUNITY: "💎",
  LIQUIDITY_IMPROVING: "💧",
  FUNDAMENTAL_STRENGTH: "🏗️",
  RELATIVE_STRENGTH: "⚡",
  NARRATIVE_STRENGTH: "🌊",
};

function EmergingProjectCard({
  project,
  coin,
  highlight = false,
}: {
  project: EmergingProject;
  coin?: Coin;
  highlight?: boolean;
}) {
  const { isWatched, toggleWatchlist, persona } = useAppStore();
  const watched = isWatched(project.coinId);

  return (
    <motion.div variants={fadeUp}>
      <div
        className={cn(
          "relative rounded-2xl p-5 transition-all duration-300 group h-full flex flex-col justify-between card-highlight glass-sheen glass-card",
          highlight
            ? "border-amber-400/40 shadow-[0_16px_40px_-8px_rgba(242,201,76,0.18)] hover:border-amber-400/70"
            : "border-white/10 hover:border-accent/45 hover:shadow-[0_20px_48px_-6px_rgba(0,220,130,0.15)]"
        )}
      >
        {/* Top row */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <Link to={`/asset/${project.coinId}`} className="flex items-center gap-3 group/link min-w-0">
              {coin?.image ? (
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-10 w-10 rounded-full ring-2 ring-border/80 object-cover group-hover/link:scale-105 transition-transform flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center font-bold text-white text-sm ring-2 ring-border/80 flex-shrink-0">
                  {project.coinId.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-text-primary group-hover/link:text-accent transition-colors truncate">
                    {coin?.name ?? project.coinId}
                  </span>
                  {coin?.symbol && (
                    <span className="text-[10px] text-text-tertiary uppercase font-mono flex-shrink-0">
                      {coin.symbol}
                    </span>
                  )}
                </div>
                {coin?.current_price && (
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary tabular font-semibold">
                    <span>{formatPrice(coin.current_price)}</span>
                    {coin.price_change_percentage_24h !== undefined && (
                      <span
                        className={cn(
                          "font-bold",
                          coin.price_change_percentage_24h >= 0 ? "text-positive" : "text-negative"
                        )}
                      >
                        {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchlist(project.coinId);
                }}
                className={cn(
                  "p-1.5 rounded-lg border transition-all",
                  watched
                    ? "bg-gold/20 border-gold/40 text-gold shadow-gold-subtle"
                    : "border-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-2"
                )}
                title={watched ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <Star className={cn("h-4 w-4", watched && "fill-gold")} />
              </button>
              <ScoreRing score={project.score} size={42} strokeWidth={3.5} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <RiskBadge level={project.riskLevel} />
            {project.isBeforeTheHype && (
              <Badge variant="gold" className="text-[10px] font-bold px-2 py-0.5 gap-1.5 shadow-xs">
                <Sparkles className="h-3 w-3 text-gold" /> Early Research
              </Badge>
            )}

            {/* Persona-specific badge */}
            {persona === "EXPLORE" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold/15 text-gold border border-gold/30">
                Beginner Pick
              </span>
            )}
            {persona === "RESEARCH" && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-mint/15 text-mint border border-mint/30">
                ✓ On-Chain Verified
              </span>
            )}
            {persona === "ANALYST" && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-400/30">
                Z-Score: +2.14
              </span>
            )}
          </div>

          {/* Why on radar */}
          <Link to={`/asset/${project.coinId}`} className="block">
            <p className="text-xs text-text-secondary leading-relaxed bg-surface-0/60 rounded-xl p-3 border border-border/60 mb-3.5 hover:border-accent/30 transition-colors">
              {project.whyOnRadar}
            </p>
          </Link>

          {/* Signals */}
          {project.signals.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.signals.slice(0, 4).map((sig) => (
                <div
                  key={sig.type}
                  className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg bg-surface-2/70 text-text-secondary border border-border/60"
                  title={sig.detail}
                >
                  <span>{signalIcons[sig.type] ?? "•"}</span>
                  <span>{sig.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer stats */}
        {coin && (
          <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[11px] text-text-tertiary">
            <span>
              MCap: <strong className="text-text-secondary">{formatMarketCap(coin.market_cap)}</strong>
            </span>
            <span>
              Vol: <strong className="text-text-secondary">{formatMarketCap(coin.total_volume)}</strong>
            </span>
            <span>
              Rank: <strong className="text-text-secondary">#{coin.market_cap_rank}</strong>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function OpportunitiesPage() {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const { data: emergingData, isLoading, error, refetch } = useEmergingProjects();
  const { data: coins } = useCoins(0, 100);

  if (isLoading) return <LoadingState message="Running multi-signal opportunity scanner..." />;
  if (error) return <ErrorState title="Radar Offline" description="Could not scan signals." onRetry={() => refetch()} />;

  const allProjects = emergingData?.projects ?? [];
  const beforeTheHype = emergingData?.beforeTheHype ?? [];

  const coinMap = new Map<string, Coin>();
  coins?.forEach((c) => coinMap.set(c.id, c));

  const filtered =
    riskFilter === "ALL"
      ? allProjects
      : allProjects.filter((p) => p.riskLevel === riskFilter);

  return (
    <motion.div className="space-y-7 max-w-7xl mx-auto" variants={stagger} initial="hidden" animate="show">
      {/* ── Active Persona Segment Controller ── */}
      <motion.div variants={fadeUp}>
        <PersonaSegmentBanner />
      </motion.div>

      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
              <Radar className="h-5 w-5 text-accent animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Opportunity & Emerging Radar</h1>
          </div>
          <p className="text-xs sm:text-sm text-text-tertiary ml-11">
            Identify early measurable inflection points before retail and public attention arrives.
          </p>
        </div>
      </motion.div>

      {/* ── 🌱 SIGNATURE BEFORE-THE-HYPE FORMULA HERO ── */}
      <motion.div
        variants={fadeUp}
        className="p-5 sm:p-6 rounded-2xl glass-surface border border-accent/30 card-highlight shadow-xl space-y-3"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 backdrop-blur-md">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                "Before The Hype" Research Framework
                <Badge variant="mint" className="text-[9px] uppercase font-bold">
                  Signature Pillar
                </Badge>
              </h3>
              <p className="text-xs text-text-tertiary">
                Finding projects where underlying on-chain activity is improving faster than public attention.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-mono text-text-secondary flex items-center gap-2 self-start md:self-auto shadow-inner">
            <span className="text-text-tertiary">Formula:</span>
            <span className="text-text-primary font-bold">Low/Moderate Attention</span>
            <span className="text-accent">+</span>
            <span className="text-positive font-bold">Improving Fundamentals</span>
            <span className="text-accent">+</span>
            <span className="text-gold font-bold">Growing Activity</span>
            <span className="text-accent">=</span>
            <span className="text-mint font-extrabold">Early Research Candidate</span>
          </div>
        </div>

        <div className="text-[11px] text-text-tertiary flex items-center gap-2 pt-1 border-t border-white/10">
          <CheckCircle2 className="h-3.5 w-3.5 text-positive flex-shrink-0" />
          <span>
            <strong>Zero Hype Policy:</strong> We do not predict "next 100x" speculative gains. We surface deterministic engineering velocity, liquidity inflows, and supply tokenomics.
          </span>
        </div>
      </motion.div>

      {/* Stats Bar */}
      {emergingData && (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-surface border border-white/10 rounded-xl p-4 card-highlight shadow-md hover:border-white/20 transition-all">
            <div className="text-xs font-semibold uppercase text-text-tertiary mb-1 flex items-center gap-1.5">
              <Radar className="h-3.5 w-3.5 text-accent" /> Total Active Signals
            </div>
            <div className="text-2xl font-extrabold text-text-primary tabular">{emergingData.total}</div>
          </div>
          <div className="glass-surface border border-amber-400/30 rounded-xl p-4 card-highlight glass-glow-gold shadow-md hover:border-amber-400/50 transition-all">
            <div className="text-xs font-semibold uppercase text-gold mb-1 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-gold" /> "Before The Hype" Setups
            </div>
            <div className="text-2xl font-extrabold text-gold tabular">{beforeTheHype.length}</div>
          </div>
          <div className="glass-surface border border-positive/30 rounded-xl p-4 card-highlight glass-glow-emerald shadow-md hover:border-positive/50 transition-all">
            <div className="text-xs font-semibold uppercase text-positive mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-positive" /> Moderate Risk Ranked
            </div>
            <div className="text-2xl font-extrabold text-positive tabular">
              {allProjects.filter((p) => p.riskLevel === "MODERATE").length}
            </div>
          </div>
        </motion.div>
      )}

      {/* Before The Hype Spotlight */}
      {beforeTheHype.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-2">
            <Flame className="h-4 w-4 text-gold animate-bounce" /> Early Signal Spotlight (Before The Hype)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beforeTheHype.slice(0, 3).map((p) => (
              <EmergingProjectCard
                key={p.coinId}
                project={p}
                coin={coinMap.get(p.coinId)}
                highlight
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters & Grid */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-accent" /> All Radar Hits ({filtered.length})
          </h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {RISK_FILTERS.map((r) => (
              <Button
                key={r}
                variant={riskFilter === r ? "default" : "ghost"}
                size="sm"
                onClick={() => setRiskFilter(r)}
                className="text-xs h-7 px-3 font-semibold"
              >
                {r === "ALL" ? "All Risk" : r.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Radar}
            title="No signals in this filter category"
            description="Try selecting a different risk tier."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <EmergingProjectCard
                key={p.coinId}
                project={p}
                coin={coinMap.get(p.coinId)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
