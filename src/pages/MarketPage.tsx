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
  const { isWatched, toggleWatchlist } = useAppStore();

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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-1/70 p-3 rounded-2xl border border-border card-highlight">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search coin by name or symbol (e.g. Bitcoin, SOL)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-surface-0 border-border"
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
          <div className="flex items-center gap-1 bg-surface-0 p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode("heatmap")}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg transition-all",
                viewMode === "heatmap"
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
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
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
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
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-1/80 card-highlight shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface-2/80 text-text-tertiary text-[11px] font-bold uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4 text-left min-w-[200px]">Asset Name</th>
                    <th className="py-3.5 px-4 text-right">Price (USD)</th>
                    <th className="py-3.5 px-4 text-right hidden sm:table-cell">1h Change</th>
                    <th className="py-3.5 px-4 text-right">24h Change</th>
                    <th className="py-3.5 px-4 text-right hidden md:table-cell">7d Change</th>
                    <th className="py-3.5 px-4 text-right hidden lg:table-cell">24h Volume</th>
                    <th className="py-3.5 px-4 text-right hidden lg:table-cell">Market Cap</th>
                    <th className="py-3.5 px-4 text-center hidden xl:table-cell w-32">7d Trend</th>
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
                          <td className="py-3.5 px-4 hidden sm:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="py-3.5 px-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="py-3.5 px-4 hidden md:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></td>
                          <td className="py-3.5 px-4 hidden lg:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></td>
                          <td className="py-3.5 px-4 hidden lg:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></td>
                          <td className="py-3.5 px-4 hidden xl:table-cell"><Skeleton className="h-8 w-24 mx-auto" /></td>
                          <td className="py-3.5 px-3 text-center"><Skeleton className="h-5 w-5 mx-auto rounded-md" /></td>
                        </tr>
                      ))
                    : filtered?.map((coin) => {
                        const watched = isWatched(coin.id);
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

                            {/* 1h % */}
                            <td className="py-3.5 px-4 text-right hidden sm:table-cell">
                              <ChangeIndicator value={coin.price_change_percentage_1h_in_currency} />
                            </td>

                            {/* 24h % */}
                            <td className="py-3.5 px-4 text-right">
                              <ChangeIndicator value={coin.price_change_percentage_24h} />
                            </td>

                            {/* 7d % */}
                            <td className="py-3.5 px-4 text-right hidden md:table-cell">
                              <ChangeIndicator value={coin.price_change_percentage_7d_in_currency} />
                            </td>

                            {/* 24h Volume */}
                            <td className="py-3.5 px-4 text-right text-text-secondary font-mono text-xs hidden lg:table-cell tabular">
                              {formatMarketCap(coin.total_volume)}
                            </td>

                            {/* Market Cap */}
                            <td className="py-3.5 px-4 text-right text-text-secondary font-mono text-xs font-semibold hidden lg:table-cell tabular">
                              {formatMarketCap(coin.market_cap)}
                            </td>

                            {/* 7d Mini Sparkline */}
                            <td className="py-3.5 px-4 text-center hidden xl:table-cell">
                              <div className="flex justify-center">
                                {coin.sparkline_in_7d?.price ? (
                                  <MiniSparkline
                                    data={coin.sparkline_in_7d.price}
                                    positive={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0}
                                  />
                                ) : (
                                  <span className="text-text-muted text-xs">—</span>
                                )}
                              </div>
                            </td>

                            {/* Watchlist Star Toggle */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() => toggleWatchlist(coin.id)}
                                className={cn(
                                  "p-1.5 rounded-lg transition-colors",
                                  watched
                                    ? "text-gold"
                                    : "text-text-muted hover:text-gold hover:bg-gold/10"
                                )}
                                title={watched ? "Remove from watchlist" : "Add to watchlist"}
                              >
                                <Star className={cn("h-4 w-4", watched ? "fill-gold" : "")} />
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
