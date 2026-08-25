import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { motion } from "framer-motion";
import { useCoinDetail, useCoinChart } from "@/hooks/useMarketData";
import { TechnicalSection } from "@/components/asset/TechnicalSection";
import { IntelligenceSection } from "@/components/asset/IntelligenceSection";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Metric } from "@/components/shared/Metric";
import { MetricGroup } from "@/components/shared/MetricGroup";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatMarketCap, formatPercentage, cn } from "@/lib/utils";
import { ArrowLeft, Star, Globe, Code, LineChart as ChartIcon, Sparkles } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/types";

const timeframes = [
  { label: "1D", value: "1" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
  { label: "1Y", value: "365" },
];

function PriceChart({ data, days }: { data: ChartDataPoint[]; days: string }) {
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    if (days === "1") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const isUp = (data[data.length - 1]?.price ?? 0) >= (data[0]?.price ?? 0);
  const strokeColor = isUp ? "#2dd4a7" : "#f25c5c";
  const gradId = `price-grad-${days}-${isUp ? "up" : "down"}`;

  return (
    <ResponsiveContainer width="100%" height={380}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="85%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#182d50" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatDate}
          tick={{ fill: "#4d6a96", fontSize: 11, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          minTickGap={45}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fill: "#4d6a96", fontSize: 11, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatPrice(v)}
          width={80}
          orientation="right"
        />
        <Tooltip
          contentStyle={{
            background: "#091428",
            border: "1px solid #182d50",
            borderRadius: "12px",
            fontSize: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
          labelFormatter={(label: any) => formatDate(label as number)}
          formatter={(value: any) => [formatPrice(value as number), "Price"]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2.5}
          fill={`url(#${gradId})`}
          dot={false}
          animationDuration={600}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function WatchlistButton({ coinId }: { coinId: string }) {
  const { isWatched, toggleWatchlist } = useAppStore();
  const watched = isWatched(coinId);
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => toggleWatchlist(coinId)}
      className={cn(
        "gap-1.5 font-semibold transition-all",
        watched
          ? "border-gold/40 text-gold bg-gold/15 shadow-[0_0_15px_rgba(240,164,41,0.15)]"
          : "text-text-secondary hover:text-gold"
      )}
      title={watched ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star className={cn("h-4 w-4 transition-all", watched ? "fill-gold" : "")} />
      <span>{watched ? "Watched" : "Watch"}</span>
    </Button>
  );
}

export function AssetDetailPage() {
  const { coinId } = useParams<{ coinId: string }>();
  const [days, setDays] = useState("7");
  const { data: coin, isLoading, error, refetch } = useCoinDetail(coinId || "");
  const { data: chartData, isLoading: chartLoading } = useCoinChart(coinId || "", days);

  if (isLoading) return <LoadingState message="Fetching deep asset intelligence..." />;
  if (error || !coin) {
    return (
      <ErrorState
        title="Asset Data Offline"
        description="Could not load metrics for this cryptocurrency."
        onRetry={() => refetch()}
      />
    );
  }

  const md = coin.market_data;
  const price = md.current_price.usd;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-7 max-w-7xl mx-auto"
    >
      {/* ── Breadcrumb Back Link ── */}
      <Link
        to="/market"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-tertiary hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Market Explorer
      </Link>

      {/* ── Asset Header Hero ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 p-6 rounded-2xl bg-surface-1 border border-border/80 card-highlight">
        <div className="flex items-center gap-4">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="h-16 w-16 rounded-full ring-2 ring-border/80 shadow-md flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {coin.name}
              </h1>
              <Badge variant="secondary" className="font-mono text-xs uppercase font-bold">
                {coin.symbol}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                Rank #{coin.market_cap_rank}
              </Badge>
            </div>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-text-primary tabular">
                {formatPrice(price)}
              </span>
              <ChangeIndicator value={md.price_change_percentage_24h} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {coin.links.homepage[0] && (
            <Button variant="secondary" size="sm" asChild className="gap-1.5 font-semibold">
              <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer">
                <Globe className="h-4 w-4 text-accent" /> Website
              </a>
            </Button>
          )}
          <WatchlistButton coinId={coinId || ""} />
        </div>
      </div>

      {/* ── Price Chart Section ── */}
      <Card className="card-highlight">
        <CardHeader className="flex-row items-center justify-between pb-3 border-b border-border/60">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ChartIcon className="h-4 w-4 text-accent" /> Price Trajectory
          </CardTitle>
          <div className="flex gap-1 bg-surface-0/60 p-1 rounded-xl border border-border/60">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setDays(tf.value)}
                className={cn(
                  "text-xs font-bold px-3 py-1 rounded-lg transition-all",
                  days === tf.value
                    ? "bg-accent text-white shadow-sm"
                    : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {chartLoading ? (
            <Skeleton className="h-[380px] w-full rounded-xl" />
          ) : chartData ? (
            <PriceChart data={chartData} days={days} />
          ) : null}
        </CardContent>
      </Card>

      {/* ── Market Data Grid ── */}
      <Card className="card-highlight">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-text-tertiary">
            Fundamental Market Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MetricGroup>
            <Metric label="Market Capitalization" value={formatMarketCap(md.market_cap.usd)} />
            <Metric
              label="Fully Diluted Valuation"
              value={md.fully_diluted_valuation?.usd ? formatMarketCap(md.fully_diluted_valuation.usd) : "—"}
            />
            <Metric label="24h Trading Volume" value={formatMarketCap(md.total_volume.usd)} />
            <Metric label="Circulating Supply" value={md.circulating_supply?.toLocaleString() ?? "—"} />
            <Metric label="Total Supply" value={md.total_supply?.toLocaleString() ?? "∞"} />
            <Metric label="Max Supply Cap" value={md.max_supply?.toLocaleString() ?? "∞"} />
          </MetricGroup>
        </CardContent>
      </Card>

      {/* ── Price Performance Multi-Horizon ── */}
      <Card className="card-highlight">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-text-tertiary">
            Multi-Horizon Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MetricGroup>
            <Metric
              label="24 Hours"
              value={formatPercentage(md.price_change_percentage_24h)}
              change={md.price_change_percentage_24h}
            />
            <Metric
              label="7 Days"
              value={formatPercentage(md.price_change_percentage_7d)}
              change={md.price_change_percentage_7d}
            />
            <Metric
              label="30 Days"
              value={formatPercentage(md.price_change_percentage_30d)}
              change={md.price_change_percentage_30d}
            />
            <Metric
              label="1 Year"
              value={formatPercentage(md.price_change_percentage_1y)}
              change={md.price_change_percentage_1y}
            />
            <Metric
              label="All-Time High"
              value={formatPrice(md.ath.usd)}
              change={md.ath_change_percentage.usd}
            />
            <Metric label="All-Time Low" value={formatPrice(md.atl.usd)} />
          </MetricGroup>
        </CardContent>
      </Card>

      {/* ── Technical Indicators ── */}
      <TechnicalSection coinId={coinId || ""} currentPrice={price} />

      {/* ── Multi-Signal Intelligence Analysis Section ── */}
      <IntelligenceSection coinId={coinId || ""} />

      {/* ── Developer Activity ── */}
      {coin.developer_data && coin.developer_data.commit_count_4_weeks > 0 && (
        <Card className="card-highlight">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Code className="h-4 w-4 text-accent" /> Developer & Repository Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MetricGroup>
              <Metric label="4w Commits" value={coin.developer_data.commit_count_4_weeks.toString()} />
              <Metric label="GitHub Stars" value={coin.developer_data.stars.toLocaleString()} />
              <Metric label="Forks" value={coin.developer_data.forks.toLocaleString()} />
              <Metric label="Merged PRs" value={coin.developer_data.pull_requests_merged.toLocaleString()} />
              <Metric label="Closed Issues" value={coin.developer_data.closed_issues.toLocaleString()} />
              <Metric label="Total Issues" value={coin.developer_data.total_issues.toLocaleString()} />
            </MetricGroup>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
