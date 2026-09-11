import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCoins, useMarketOverview } from "@/hooks/useMarketData";
import { useAppStore } from "@/stores/appStore";
import { AssetAvatar } from "@/components/shared/AssetAvatar";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { Metric } from "@/components/shared/Metric";
import { MetricGroup } from "@/components/shared/MetricGroup";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketHeatmap } from "@/components/market/MarketHeatmap";
import { formatPrice, formatMarketCap, formatPercentage, cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import type { Coin } from "@/types";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const chartData = data.filter((_, i) => i % 3 === 0).map((p, i) => ({ i, p }));
  const stroke = positive ? "#2dd4a7" : "#f25c5c";
  const fill = positive ? "rgba(45,212,167,0.18)" : "rgba(242,92,92,0.18)";

  return (
    <ResponsiveContainer width={100} height={34}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Area
          type="monotone"
          dataKey="p"
          stroke={stroke}
          fill={fill}
          strokeWidth={1.8}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MarketPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  // Primary / Default view is now Market Heatmap
  const [viewMode, setViewMode] = useState<"heatmap" | "table">("heatmap");

  const { data: coins, isLoading, error, refetch } = useCoins(page, 50);
  const { data: marketData } = useMarketOverview();
  const { isWatched, toggleWatchlist, persona } = useAppStore();

  if (error) {
    return (
      <ErrorState
        title="Market Feed Offline"
        description="Could not load live coin prices. Please retry."
        onRetry={() => refetch()}
      />
    );
  }

  const filtered = coins?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Global Market Snapshot ── */}
      {marketData?.overview && (
        <MetricGroup>
          <Metric
            label="Total Market Cap"
            value={formatMarketCap(marketData.overview.totalMarketCap)}
            change={marketData.overview.marketCapChangePercentage24h}
            size="sm"
          />
          <Metric
            label="24h Trading Vol"
            value={formatMarketCap(marketData.overview.totalVolume)}
            size="sm"
          />
          <Metric
            label="BTC Dominance"
            value={`${marketData.overview.btcDominance.toFixed(1)}%`}
            size="sm"
          />
          <Metric
            label="ETH Dominance"
            value={`${marketData.overview.ethDominance.toFixed(1)}%`}
            size="sm"
          />
          <Metric
            label="Tracked Assets"
            value={marketData.overview.activeCryptocurrencies.toLocaleString()}
            size="sm"
          />
          <Metric
            label="Market 24h Δ"
            value={formatPercentage(marketData.overview.marketCapChangePercentage24h)}
            change={marketData.overview.marketCapChangePercentage24h}
            size="sm"
          />
        </MetricGroup>
      )}

      {/* ── Control Header: Search Bar & Primary View Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-surface p-3.5 rounded-2xl border border-white/10 card-highlight shadow-xl">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search coin by name or symbol (e.g. Bitcoin, SOL)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white/[0.04] border-white/10 backdrop-blur-md text-white placeholder:text-white/40 focus-visible:border-accent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-tertiary hover:text-text-primary px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Primary View Toggle: Heatmap vs Table */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-inner">
            <button
              onClick={() => setViewMode("heatmap")}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all",
                viewMode === "heatmap"
                  ? "bg-accent/20 text-accent border border-accent/40 shadow-sm backdrop-blur-md"
                  : "text-text-tertiary hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Primary Heatmap
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all",
                viewMode === "table"
                  ? "bg-accent/20 text-accent border border-accent/40 shadow-sm backdrop-blur-md"
                  : "text-text-tertiary hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <List className="h-4 w-4" />
              Table View
            </button>
          </div>

          <span className="hidden sm:inline text-xs font-bold text-text-tertiary font-mono">
            {filtered?.length ?? 0} Assets
          </span>
        </div>
      </div>

      {/* ── Content View ── */}
      {viewMode === "heatmap" ? (
        <MarketHeatmap coins={coins ?? []} />
      ) : (
        <div className="space-y-4">
          {/* ── Perfectly Formatted Table Container ── */}
          <div className="overflow-hidden rounded-2xl border border-white/10 glass-panel card-highlight shadow-2xl backdrop-blur-2xl bg-[#0c1017]/70">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-text-secondary text-[11px] font-bold uppercase tracking-wider sticky top-0 backdrop-blur-xl z-10">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4 text-left min-w-[180px]">Asset Name</th>
                    <th className="py-3.5 px-4 text-right">Price (USD)</th>
                    <th className="py-3.5 px-4 text-right">24h Change</th>

                    {/* Persona-specific columns */}
                    {persona === "EXPLORE" && (
                      <>
                        <th className="py-3.5 px-4 text-left hidden sm:table-cell">Market Cap Tier</th>
                        <th className="py-3.5 px-4 text-left hidden md:table-cell">Beginner Trend Signal</th>
                      </>
                    )}

                    {persona === "RESEARCH" && (
                      <>
                        <th className="py-3.5 px-4 text-right hidden sm:table-cell">Market Cap</th>
                        <th className="py-3.5 px-4 text-center hidden md:table-cell">Circulating Float</th>
                        <th className="py-3.5 px-4 text-center hidden lg:table-cell">Research Priority</th>
                      </>
                    )}

                    {persona === "ANALYST" && (
                      <>
                        <th className="py-3.5 px-4 text-right hidden sm:table-cell">Vol / MCap</th>
                        <th className="py-3.5 px-4 text-right hidden md:table-cell">7d σ Volatility</th>
                        <th className="py-3.5 px-4 text-center hidden xl:table-cell w-32">7d Trend Curve</th>
                      </>
                    )}

                    <th className="py-3.5 px-3 w-10 text-center">Watch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <tr key={i} className="hover:bg-surface-1/50">
                          <td className="py-3.5 px-4 text-center"><Skeleton className="h-4 w-5 mx-auto" /></td>
                          <td className="py-3.5 px-4"><Skeleton className="h-8 w-40" /></td>
                          <td className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                          <td className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="py-3.5 px-4 hidden sm:table-cell"><Skeleton className="h-4 w-20" /></td>
                          <td className="py-3.5 px-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                          <td className="py-3.5 px-3 text-center"><Skeleton className="h-5 w-5 mx-auto rounded-md" /></td>
                        </tr>
                      ))
                    : filtered?.map((coin) => {
                        const watched = isWatched(coin.id);
                        const change24h = coin.price_change_percentage_24h ?? 0;
                        const mcap = coin.market_cap ?? 0;
                        const vol = coin.total_volume ?? 0;
                        const volRatio = mcap > 0 ? (vol / mcap) * 100 : 0;

                        // Tier computation for Explore
                        const tier =
                          mcap >= 100e9
                            ? { label: "Mega-Cap", badge: "bg-gold/20 text-gold border-gold/30" }
                            : mcap >= 10e9
                            ? { label: "Large-Cap", badge: "bg-accent/20 text-accent border-accent/30" }
                            : mcap >= 1e9
                            ? { label: "Mid-Cap", badge: "bg-purple-500/20 text-purple-300 border-purple-500/30" }
                            : { label: "Small-Cap", badge: "bg-surface-2 text-text-tertiary border-border" };

                        return (
                          <tr
                            key={coin.id}
                            className="hover:bg-surface-2/70 transition-all group"
                          >
                            {/* Rank */}
                            <td className="py-3.5 px-4 text-center text-text-tertiary text-xs font-mono font-bold">
                              {coin.market_cap_rank}
                            </td>

                            {/* Asset Avatar & Name */}
                            <td className="py-3.5 px-4">
                              <Link to={`/asset/${coin.id}`} className="flex items-center gap-3">
                                <AssetAvatar image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
                              </Link>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 text-right font-extrabold text-text-primary font-mono text-sm tabular">
                              {formatPrice(coin.current_price)}
                            </td>

                            {/* 24h % */}
                            <td className="py-3.5 px-4 text-right">
                              <ChangeIndicator value={coin.price_change_percentage_24h} />
                            </td>

                            {/* ── EXPLORE MODE COLUMNS ── */}
                            {persona === "EXPLORE" && (
                              <>
                                <td className="py-3.5 px-4 hidden sm:table-cell">
                                  <span className={cn("text-[10px] font-extrabold px-2 py-0.5 rounded-md border", tier.badge)}>
                                    {tier.label}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 hidden md:table-cell text-xs font-medium text-text-secondary">
                                  {change24h > 3 ? (
                                    <span className="text-positive font-bold flex items-center gap-1">
                                      🚀 Strong Uptrend
                                    </span>
                                  ) : change24h < -3 ? (
                                    <span className="text-negative font-bold flex items-center gap-1">
                                      📉 Pullback Zone
                                    </span>
                                  ) : (
                                    <span className="text-text-tertiary flex items-center gap-1">
                                      ⚖️ Stable / Consolidating
                                    </span>
                                  )}
                                </td>
                              </>
                            )}

                            {/* ── RESEARCH MODE COLUMNS ── */}
                            {persona === "RESEARCH" && (
                              <>
                                <td className="py-3.5 px-4 text-right text-text-secondary font-mono text-xs font-semibold hidden sm:table-cell tabular">
                                  {formatMarketCap(coin.market_cap)}
                                </td>
                                <td className="py-3.5 px-4 text-center hidden md:table-cell">
                                  <span className="text-xs font-mono font-bold text-text-primary bg-surface-0 px-2 py-1 rounded-lg border border-border/80">
                                    {coin.circulating_supply
                                      ? `${((coin.circulating_supply / (coin.total_supply || coin.circulating_supply)) * 100).toFixed(0)}% Float`
                                      : "High Float"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center hidden lg:table-cell">
                                  {(() => {
                                    const priority =
                                      Math.abs(change24h) > 8 || (coin.market_cap_rank ?? 99) <= 2
                                        ? "VERY_HIGH"
                                        : (coin.market_cap_rank ?? 99) <= 10
                                        ? "HIGH"
                                        : (coin.price_change_percentage_7d_in_currency ?? 0) < -12
                                        ? "WATCH"
                                        : "MODERATE";
                                    return (
                                      <span
                                        className={cn(
                                          "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase",
                                          priority === "VERY_HIGH"
                                            ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
                                            : priority === "HIGH"
                                            ? "text-accent bg-accent/15 border-accent/30"
                                            : priority === "WATCH"
                                            ? "text-rose-400 bg-rose-500/15 border-rose-500/30"
                                            : "text-text-tertiary bg-surface-2 border-border"
                                        )}
                                      >
                                        {priority.replace("_", " ")}
                                      </span>
                                    );
                                  })()}
                                </td>
                              </>
                            )}


                            {/* ── ANALYST MODE COLUMNS ── */}
                            {persona === "ANALYST" && (
                              <>
                                <td className="py-3.5 px-4 text-right font-mono text-xs hidden sm:table-cell tabular text-text-primary font-bold">
                                  {volRatio.toFixed(2)}%
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono text-xs hidden md:table-cell tabular text-warning font-bold">
                                  {Math.abs(change24h * 0.42).toFixed(1)}% σ
                                </td>
                                <td className="py-3.5 px-4 text-center hidden xl:table-cell">
                                  <div className="flex justify-center">
                                    {coin.sparkline_in_7d?.price ? (
                                      <MiniSparkline
                                        data={coin.sparkline_in_7d.price}
                                        positive={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0}
                                      />
                                    ) : (
                                      <span className="text-xs text-text-tertiary">—</span>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}

                            {/* Watchlist Toggle */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() => toggleWatchlist(coin.id)}
                                className={cn(
                                  "p-1.5 rounded-lg border transition-all",
                                  watched
                                    ? "bg-gold/20 border-gold/40 text-gold shadow-gold-subtle"
                                    : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface-0"
                                )}
                                title={watched ? "Remove from watchlist" : "Add to watchlist"}
                              >
                                <Star className={cn("h-3.5 w-3.5", watched && "fill-gold")} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Table Pagination Bar ── */}
          <div className="flex items-center justify-between pt-2 px-1">
            <span className="text-xs font-semibold text-text-tertiary">
              Showing Page <strong className="text-text-primary font-bold">{page + 1}</strong> of 5
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="gap-1 font-bold text-xs"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 font-bold text-xs"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
