import { motion } from "framer-motion";
import { useCoins, useMarketOverview, useTrending } from "@/hooks/useMarketData";
import { useAppStore } from "@/stores/appStore";
import { PersonaSegmentBanner } from "@/components/shared/PersonaSegmentBanner";
import { Metric } from "@/components/shared/Metric";
import { MetricGroup } from "@/components/shared/MetricGroup";
import { AssetAvatar } from "@/components/shared/AssetAvatar";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMarketCap, formatPrice, formatPercentage, cn } from "@/lib/utils";
import { Link } from "react-router-dom";
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
} from "lucide-react";

import type { Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function OverviewPage() {
  const { data: marketData, isLoading: marketLoading, error: marketError, refetch } = useMarketOverview();
  const { data: coins, isLoading: coinsLoading } = useCoins(0, 10);
  const { data: trending, isLoading: trendingLoading } = useTrending();
  const persona = useAppStore((s) => s.persona);

  if (marketError) {
    return (
      <ErrorState
        title="Market data offline"
        description="Could not connect to live market feed. Check API connection."
        onRetry={() => refetch()}
      />
    );
  }

  const regime = marketData?.regime;

  return (
    <motion.div className="space-y-7 max-w-7xl mx-auto" variants={stagger} initial="hidden" animate="show">
      {/* ── Active Persona Segment Controller ── */}
      <motion.div variants={fadeUp}>
        <PersonaSegmentBanner />
      </motion.div>

      {/* ── Market Regime Hero Banner ── */}
      <motion.div variants={fadeUp}>
        {marketLoading ? (
          <Skeleton className="h-20 w-full rounded-2xl" />
        ) : regime ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl p-5 sm:p-6 border card-highlight transition-all",
              regime.state === "BULLISH"
                ? "bg-gradient-to-r from-positive/15 via-positive/5 to-surface-1 border-positive/30 shadow-[0_0_30px_rgba(45,212,167,0.08)]"
                : regime.state === "BEARISH"
                ? "bg-gradient-to-r from-negative/15 via-negative/5 to-surface-1 border-negative/30 shadow-[0_0_30px_rgba(242,92,92,0.08)]"
                : regime.state === "HIGH_VOLATILITY"
                ? "bg-gradient-to-r from-warning/15 via-warning/5 to-surface-1 border-warning/30 shadow-[0_0_30px_rgba(240,164,41,0.08)]"
                : "bg-gradient-to-r from-accent/15 via-accent/5 to-surface-1 border-accent/30 shadow-[0_0_30px_rgba(79,142,247,0.08)]"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-surface-0/60 border border-border">
                    <Activity className="h-4 w-4 text-accent animate-pulse" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                    Current Market Regime
                  </span>
                  <Badge
                    variant={
                      regime.state === "BULLISH"
                        ? "positive"
                        : regime.state === "BEARISH"
                        ? "negative"
                        : regime.state === "HIGH_VOLATILITY"
                        ? "warning"
                        : "secondary"
                    }
                    className="font-bold tracking-wider uppercase text-xs"
                  >
                    {regime.state.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-text-secondary leading-relaxed max-w-2xl">
                  {regime.description}
                </p>
              </div>

              <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-border/80 pt-3 sm:pt-0 sm:pl-6">
                <div>
                  <div className="text-xs text-text-tertiary font-semibold uppercase tracking-wider">
                    Model Confidence
                  </div>
                  <div className="text-xl font-extrabold text-text-primary tabular">
                    {Math.round(regime.confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* ── Market Snapshot Metrics ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-accent" /> Global Market Snapshot
          </h2>
        </div>
        {marketLoading ? (
          <MetricGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </MetricGroup>
        ) : marketData?.overview ? (
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
        ) : null}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Top Assets Table ── */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <TrendingUp className="h-4 w-4 text-accent" /> Top Capital Assets
              </CardTitle>
              <Link
                to="/market"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1 group"
              >
                Full Market <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent>
              {coinsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : coins ? (
                <div className="space-y-1">
                  {coins.slice(0, 8).map((coin, i) => (
                    <Link
                      key={coin.id}
                      to={`/asset/${coin.id}`}
                      className="flex items-center gap-4 px-3.5 py-2.5 rounded-xl hover:bg-surface-2/80 transition-all group border border-transparent hover:border-border/60"
                    >
                      <span className="text-xs font-mono font-bold text-text-tertiary w-5 text-right">
                        {i + 1}
                      </span>
                      <AssetAvatar image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
                      <div className="ml-auto text-right">
                        <div className="text-sm font-bold text-text-primary tabular">
                          {formatPrice(coin.current_price)}
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <ChangeIndicator value={coin.price_change_percentage_24h} />
                      </div>
                      <span className="text-xs font-medium text-text-secondary w-20 text-right hidden sm:block tabular">
                        {formatMarketCap(coin.market_cap)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Trending Spotlight ── */}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Flame className="h-4 w-4 text-warning" /> High Search Momentum
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trendingLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : trending ? (
                <div className="space-y-1">
                  {trending.slice(0, 7).map((t) => (
                    <Link
                      key={t.item.id}
                      to={`/asset/${t.item.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2/80 transition-all border border-transparent hover:border-border/60 group"
                    >
                      <img
                        src={t.item.thumb}
                        alt={t.item.name}
                        className="h-7 w-7 rounded-full ring-1 ring-border group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-text-primary block truncate group-hover:text-accent transition-colors">
                          {t.item.name}
                        </span>
                        <span className="text-[10px] font-mono text-text-tertiary uppercase">
                          {t.item.symbol}
                        </span>
                      </div>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        #{t.item.market_cap_rank ?? "—"}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Trust & Transparency Disclaimer ── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-1/40 border border-border/60 text-[11px] text-text-tertiary max-w-4xl"
      >
        <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0" />
        <span>
          CryptoVision models are probabilistic and powered by verifiable market data. Outputs do not constitute personalized financial advice.
        </span>
      </motion.div>
    </motion.div>
  );
}
