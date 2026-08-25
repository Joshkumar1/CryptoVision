import { useState } from "react";
import { motion } from "framer-motion";
import { useNarratives } from "@/hooks/useNarratives";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPercentage, cn } from "@/lib/utils";
import { Search, Layers, TrendingUp, Sparkles, Activity } from "lucide-react";
import type { Narrative } from "@/types";
import type { Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

interface NarrativeWithMetrics {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  momentum: number;
  strength?: number;
  totalVolume?: number;
  weekChange?: number;
  monthChange?: number;
  assetCount?: number;
  coinIds?: string[];
  assets?: string[];
}

function StrengthBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const gradient =
    pct >= 70
      ? "from-mint via-emerald-400 to-teal-300"
      : pct >= 45
      ? "from-gold via-amber-400 to-yellow-300"
      : "from-negative via-rose-500 to-red-400";

  return (
    <div className="relative h-2 w-full rounded-full bg-surface-2 overflow-hidden">
      <motion.div
        className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", gradient)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function NarrativeCard({ narrative }: { narrative: NarrativeWithMetrics }) {
  const weekChange = narrative.weekChange ?? narrative.momentum ?? 0;
  const strength = narrative.strength ?? 50;

  return (
    <motion.div variants={fadeUp}>
      <div className="rounded-2xl p-5 bg-surface-1/80 border border-border/80 hover:border-accent/40 hover:bg-surface-1 transition-all duration-200 shadow-sm hover:shadow-lg card-highlight group flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              {narrative.emoji ? (
                <span className="text-2xl p-2 rounded-xl bg-surface-2 border border-border/60 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {narrative.emoji}
                </span>
              ) : (
                <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
                  <Layers className="h-5 w-5 text-accent" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors">
                  {narrative.name}
                </h3>
                {narrative.description && (
                  <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-2 leading-relaxed">
                    {narrative.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <ChangeIndicator value={weekChange} />
              <span className="text-[10px] text-text-muted font-mono">7d Avg</span>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-[11px] font-semibold uppercase text-text-tertiary">
                Sector Strength
              </span>
              <span className="font-extrabold text-text-primary tabular">{strength}/100</span>
            </div>
            <StrengthBar value={strength} />
          </div>
        </div>

        {/* Metrics & Tags */}
        <div>
          <div className="flex items-center justify-between text-xs text-text-tertiary pt-3 border-t border-border/60 mb-3">
            {narrative.assetCount !== undefined && (
              <span>
                <strong className="text-text-primary font-semibold">{narrative.assetCount}</strong> coins tracked
              </span>
            )}
            {narrative.monthChange !== undefined && (
              <span>
                30d:{" "}
                <strong
                  className={cn(
                    "font-semibold",
                    narrative.monthChange >= 0 ? "text-positive" : "text-negative"
                  )}
                >
                  {formatPercentage(narrative.monthChange)}
                </strong>
              </span>
            )}
          </div>

          {narrative.coinIds && narrative.coinIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {narrative.coinIds.slice(0, 5).map((a) => (
                <Badge
                  key={a}
                  variant="secondary"
                  className="text-[10px] font-medium px-2 py-0.5"
                >
                  {a.replace(/-/g, " ")}
                </Badge>
              ))}
              {narrative.coinIds.length > 5 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 text-text-muted">
                  +{narrative.coinIds.length - 5}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NarrativesPage() {
  const [search, setSearch] = useState("");
  const { data: narratives, isLoading, error, refetch } = useNarratives();

  if (isLoading) return <LoadingState message="Computing sector momentum & strength scores..." />;
  if (error) return <ErrorState title="Narratives Offline" description="Could not load narrative intelligence." onRetry={() => refetch()} />;

  const filtered = (narratives as NarrativeWithMetrics[] | undefined)?.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const sorted = [...filtered].sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  const hotNarratives = sorted.filter((n) => (n.weekChange ?? n.momentum ?? 0) > 5).slice(0, 4);

  return (
    <motion.div className="space-y-7 max-w-7xl mx-auto" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
            <Layers className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Emerging Narratives</h1>
        </div>
        <p className="text-sm text-text-tertiary ml-11">
          Algorithmic sector tracking — measuring aggregate strength, 7d/30d momentum, and capital flow.
        </p>
      </motion.div>

      {/* Hot Narratives Banner */}
      {hotNarratives.length > 0 && (
        <motion.div variants={fadeUp} className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-positive flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-positive" /> High Momentum Sectors
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {hotNarratives.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-positive/10 border border-positive/25 text-xs font-semibold text-text-primary shadow-[0_0_15px_rgba(45,212,167,0.1)]"
              >
                {n.emoji && <span>{n.emoji}</span>}
                <span>{n.name}</span>
                <span className="text-positive font-bold">
                  +{formatPercentage(n.weekChange ?? n.momentum ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Input */}
      <motion.div variants={fadeUp} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <Input
          placeholder="Filter narratives (e.g. AI, RWA, DePIN)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-surface-1 border-border"
        />
      </motion.div>

      {/* Narrative Cards Grid */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No narrative matching query"
          description="Try a different sector keyword."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((n) => (
            <NarrativeCard key={n.id} narrative={n} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
