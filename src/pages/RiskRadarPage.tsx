import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCoins } from "@/hooks/useMarketData";
import { useRedFlags } from "@/hooks/useIntelligence";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { AssetAvatar } from "@/components/shared/AssetAvatar";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatMarketCap, cn } from "@/lib/utils";
import { ShieldAlert, AlertTriangle, Info, ChevronRight, ShieldCheck, AlertOctagon } from "lucide-react";
import type { Coin, RedFlag, RedFlagSeverity } from "@/types";
import type { Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const SEV_META: Record<
  RedFlagSeverity,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  HIGH: {
    label: "High Risk",
    color: "text-negative",
    bg: "bg-negative/10",
    border: "border-negative/30",
    icon: AlertOctagon,
  },
  MEDIUM: {
    label: "Medium Risk",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: AlertTriangle,
  },
  LOW: {
    label: "Low Risk",
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
    icon: Info,
  },
};

function RedFlagRow({ flag }: { flag: RedFlag }) {
  const meta = SEV_META[flag.severity];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "flex gap-3 p-3.5 rounded-xl border transition-colors",
        meta.bg,
        meta.border
      )}
    >
      <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", meta.color)} />
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-primary">{flag.title}</span>
          <Badge
            variant="outline"
            className={cn("text-[9px] font-bold px-1.5 py-0 uppercase", meta.color, meta.border)}
          >
            {flag.severity}
          </Badge>
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed">{flag.description}</p>
        {flag.evidence && (
          <p className="text-[10px] text-text-muted font-mono bg-surface-0/70 rounded-md px-2 py-1 border border-border/40">
            {flag.evidence}
          </p>
        )}
      </div>
    </div>
  );
}

function CoinRiskCard({ coin }: { coin: Coin }) {
  const { data: flags, isLoading } = useRedFlags(coin.id);
  const highFlags = flags?.filter((f) => f.severity === "HIGH") ?? [];
  const totalFlags = flags?.length ?? 0;

  if (!isLoading && totalFlags === 0) return null;

  return (
    <motion.div variants={fadeUp}>
      <Link to={`/asset/${coin.id}`} className="block">
        <div className="rounded-2xl bg-surface-1 border border-border/80 hover:border-negative/40 hover:bg-surface-1 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-lg card-highlight group">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <AssetAvatar image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
              <div>
                <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                  {coin.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-text-secondary tabular">
                    {formatPrice(coin.current_price)}
                  </span>
                  <ChangeIndicator value={coin.price_change_percentage_24h} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-5 w-20 rounded-md" />
              ) : (
                <>
                  {highFlags.length > 0 && (
                    <Badge variant="destructive" className="font-bold text-[10px]">
                      {highFlags.length} CRITICAL
                    </Badge>
                  )}
                  <Badge variant="secondary" className="font-bold text-[10px]">
                    {totalFlags} Flag{totalFlags !== 1 ? "s" : ""}
                  </Badge>
                </>
              )}
              <ChevronRight className="h-4 w-4 text-text-tertiary group-hover:translate-x-0.5 group-hover:text-accent transition-all" />
            </div>
          </div>

          {/* Warning Flag List */}
          <div className="p-4 space-y-2.5">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : (
              flags?.slice(0, 3).map((f) => <RedFlagRow key={f.id} flag={f} />)
            )}
            {!isLoading && (flags?.length ?? 0) > 3 && (
              <p className="text-[11px] font-semibold text-accent text-center pt-1 hover:underline">
                +{(flags?.length ?? 0) - 3} more risk indicators on asset page
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RiskRadarPage() {
  const { data: coins, isLoading, error, refetch } = useCoins(0, 50);

  if (isLoading) return <LoadingState message="Scanning top assets for structural risk signals..." />;
  if (error) return <ErrorState title="Risk Feed Offline" description="Could not scan assets." onRetry={() => refetch()} />;

  const topCoins = coins?.slice(0, 25) ?? [];

  return (
    <motion.div className="space-y-7 max-w-7xl mx-auto" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-negative/15 border border-negative/20">
            <ShieldAlert className="h-5 w-5 text-negative animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Risk Radar</h1>
        </div>
        <p className="text-sm text-text-tertiary ml-11">
          Algorithmic anomaly detection — scanning low liquidity, extreme FDV unlocks, supply centralization, and RSI anomalies.
        </p>
      </motion.div>

      {/* Threat Tiers Legend */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
        {(Object.entries(SEV_META) as [RedFlagSeverity, typeof SEV_META[RedFlagSeverity]][]).map(
          ([sev, meta]) => {
            const Icon = meta.icon;
            return (
              <div
                key={sev}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                  meta.bg,
                  meta.border,
                  meta.color
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{meta.label}</span>
              </div>
            );
          }
        )}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-1 border border-border text-text-tertiary">
          <ShieldCheck className="h-3.5 w-3.5 text-positive" />
          <span>Zero-flag assets auto-filtered</span>
        </div>
      </motion.div>

      {/* Coin Risk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {topCoins.map((coin) => (
          <CoinRiskCard key={coin.id} coin={coin} />
        ))}
      </div>
    </motion.div>
  );
}
