import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEmergingProjects } from "@/hooks/useEmerging";
import { useCoins } from "@/hooks/useMarketData";
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
  return (
    <motion.div variants={fadeUp}>
      <Link to={`/asset/${project.coinId}`} className="block h-full">
        <div
          className={cn(
            "relative rounded-2xl p-5 transition-all duration-200 group cursor-pointer h-full flex flex-col justify-between card-highlight",
            highlight
              ? "bg-gradient-to-b from-surface-1 to-surface-2/90 border border-gold/40 shadow-[0_0_24px_rgba(240,164,41,0.12)] hover:border-gold/70"
              : "bg-surface-1/80 border border-border/80 hover:border-accent/40 hover:bg-surface-1 shadow-md hover:shadow-lg"
          )}
        >
          {/* Top row */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-3">
                {coin?.image ? (
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-10 w-10 rounded-full ring-2 ring-border/80 object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center font-bold text-white text-sm ring-2 ring-border/80">
                    {project.coinId.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary group-hover:text-accent transition-colors">
                      {coin?.name ?? project.coinId}
                    </span>
                    {coin?.symbol && (
                      <span className="text-[10px] text-text-tertiary uppercase font-mono">
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
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <ScoreRing score={project.score} size={46} strokeWidth={4} />
                <RiskBadge level={project.riskLevel} />
              </div>
            </div>

            {project.isBeforeTheHype && (
              <div className="mb-3">
                <Badge variant="gold" className="text-[10px] font-bold px-2 py-0.5 gap-1.5 shadow-xs">
                  <Sparkles className="h-3 w-3 text-gold" /> Early Research Candidate
                </Badge>
              </div>
            )}

            {/* Why on radar */}
            <p className="text-xs text-text-secondary leading-relaxed bg-surface-0/60 rounded-xl p-3 border border-border/60 mb-3.5">
              {project.whyOnRadar}
            </p>

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
      </Link>
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
        className="p-5 rounded-2xl bg-surface-1 border border-accent/30 card-highlight shadow-md space-y-3"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
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

          <div className="p-3 rounded-xl bg-surface-0 border border-border/80 text-xs font-mono text-text-secondary flex items-center gap-2 self-start md:self-auto">
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

        <div className="text-[11px] text-text-tertiary flex items-center gap-2 pt-1 border-t border-border/60">
          <CheckCircle2 className="h-3.5 w-3.5 text-positive flex-shrink-0" />
          <span>
            <strong>Zero Hype Policy:</strong> We do not predict "next 100x" speculative gains. We surface deterministic engineering velocity, liquidity inflows, and supply tokenomics.
          </span>
        </div>
      </motion.div>

      {/* Stats Bar */}
      {emergingData && (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface-1 border border-border rounded-xl p-4 card-highlight">
            <div className="text-xs font-semibold uppercase text-text-tertiary mb-1 flex items-center gap-1.5">
              <Radar className="h-3.5 w-3.5 text-accent" /> Total Active Signals
            </div>
            <div className="text-2xl font-extrabold text-text-primary tabular">{emergingData.total}</div>
          </div>
          <div className="bg-surface-1 border border-gold/30 rounded-xl p-4 card-highlight shadow-[0_0_20px_rgba(240,164,41,0.06)]">
            <div className="text-xs font-semibold uppercase text-gold mb-1 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-gold" /> "Before The Hype" Setups
            </div>
            <div className="text-2xl font-extrabold text-gold tabular">{beforeTheHype.length}</div>
          </div>
          <div className="bg-surface-1 border border-positive/30 rounded-xl p-4 card-highlight">
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
