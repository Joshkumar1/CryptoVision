import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCoins, useCoinChart } from "@/hooks/useMarketData";
import { AssetAvatar } from "@/components/shared/AssetAvatar";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatMarketCap, formatPercentage } from "@/lib/utils";
import { GitCompareArrows, X, Plus, Search, TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import type { Coin, ChartDataPoint } from "@/types";

const CHART_COLORS = ["#3b82f6", "#34d399", "#f59e0b", "#f472b6"];
const MAX_COMPARE = 4;

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// ── Normalised chart (rebased to 100 at t=0) ─────────────────────────────

interface NormalisedSeries {
  timestamp: number;
  [coinId: string]: number;
}

function buildNormalisedSeries(
  chartMap: Record<string, ChartDataPoint[]>
): NormalisedSeries[] {
  const ids = Object.keys(chartMap);
  if (!ids.length) return [];

  // Use the first coin's timestamps as the x-axis
  const base = chartMap[ids[0]] ?? [];

  return base.map((point, i) => {
    const entry: NormalisedSeries = { timestamp: point.timestamp };
    for (const id of ids) {
      const series = chartMap[id] ?? [];
      const first = series[0]?.price ?? 1;
      const current = series[i]?.price ?? first;
      entry[id] = parseFloat(((current / first) * 100).toFixed(2));
    }
    return entry;
  });
}

// ── Coin picker ───────────────────────────────────────────────────────────

function CoinPicker({
  coins,
  selected,
  onSelect,
}: {
  coins: Coin[];
  selected: string[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = coins
    .filter(
      (c) =>
        !selected.includes(c.id) &&
        (c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.symbol.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 8);

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-accent/50 bg-surface-1 cursor-pointer transition-colors"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 text-text-muted" />
        <span className="text-sm text-text-tertiary">Add asset to compare</span>
      </div>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 w-72 bg-surface-1 border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <Input
                autoFocus
                placeholder="Search coins..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">No results</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-2 transition-colors text-left"
                  onClick={() => { onSelect(c.id); setOpen(false); setQuery(""); }}
                >
                  <img src={c.image} alt={c.name} className="h-6 w-6 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">{c.name}</div>
                    <div className="text-[10px] text-text-tertiary uppercase">{c.symbol}</div>
                  </div>
                  <span className="text-xs text-text-muted">#{c.market_cap_rank}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chart data loader for a single coin ──────────────────────────────────

function useMultiChart(coinIds: string[], days: string) {
  // Call hooks for up to 4 slots unconditionally
  const r0 = useCoinChart(coinIds[0] ?? "", days);
  const r1 = useCoinChart(coinIds[1] ?? "", days);
  const r2 = useCoinChart(coinIds[2] ?? "", days);
  const r3 = useCoinChart(coinIds[3] ?? "", days);

  const results = [r0, r1, r2, r3].slice(0, coinIds.length);
  const isLoading = results.some((r) => r.isLoading);

  const chartMap: Record<string, ChartDataPoint[]> = {};
  coinIds.forEach((id, i) => {
    if (results[i]?.data) chartMap[id] = results[i].data!;
  });

  return { chartMap, isLoading };
}

// ── Comparison metrics table ──────────────────────────────────────────────

function MetricsTable({ coins, colors }: { coins: Coin[]; colors: string[] }) {
  const rows = [
    { label: "Price", fn: (c: Coin) => formatPrice(c.current_price) },
    { label: "Market Cap", fn: (c: Coin) => formatMarketCap(c.market_cap) },
    { label: "24h Volume", fn: (c: Coin) => formatMarketCap(c.total_volume) },
    { label: "24h Change", fn: (c: Coin) => formatPercentage(c.price_change_percentage_24h), isChange: true },
    { label: "7d Change", fn: (c: Coin) => formatPercentage(c.price_change_percentage_7d_in_currency ?? 0), isChange: true },
    { label: "Rank", fn: (c: Coin) => `#${c.market_cap_rank}` },
    { label: "ATH", fn: (c: Coin) => formatPrice(c.ath) },
    { label: "ATH Δ", fn: (c: Coin) => formatPercentage(c.ath_change_percentage), isChange: true },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2">
            <th className="text-left px-4 py-3 text-[11px] font-medium text-text-tertiary uppercase tracking-wider w-32">
              Metric
            </th>
            {coins.map((c, i) => (
              <th key={c.id} className="text-right px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <img src={c.image} alt={c.name} className="h-5 w-5 rounded-full" />
                  <span className="font-semibold text-sm" style={{ color: colors[i] }}>
                    {c.symbol.toUpperCase()}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, fn, isChange }) => (
            <tr key={label} className="border-b border-border/50 hover:bg-surface-1 transition-colors">
              <td className="px-4 py-2.5 text-xs text-text-tertiary">{label}</td>
              {coins.map((c, i) => {
                const val = fn(c);
                const numVal = parseFloat(val.replace(/[^0-9.-]/g, ""));
                const best = isChange
                  ? coins.reduce((b, x) => {
                      const v = parseFloat(fn(x).replace(/[^0-9.-]/g, ""));
                      return v > parseFloat(fn(b).replace(/[^0-9.-]/g, "")) ? x : b;
                    }, coins[0])
                  : null;
                return (
                  <td
                    key={c.id}
                    className={`px-4 py-2.5 text-right font-medium text-sm ${
                      isChange
                        ? numVal > 0 ? "text-positive" : numVal < 0 ? "text-negative" : "text-text-secondary"
                        : "text-text-primary"
                    }`}
                  >
                    {val}
                    {isChange && best?.id === c.id && coins.length > 1 && (
                      <span className="ml-1 text-[9px] bg-positive/15 text-positive rounded px-1">best</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

const timeframes = [
  { label: "1D", value: "1" },
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
  { label: "1Y", value: "365" },
];

export function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [days, setDays] = useState("30");

  const { data: allCoins, isLoading: coinsLoading } = useCoins(0, 100);
  const { chartMap, isLoading: chartLoading } = useMultiChart(selectedIds, days);

  const selectedCoins = selectedIds
    .map((id) => allCoins?.find((c) => c.id === id))
    .filter(Boolean) as Coin[];

  const normSeries = buildNormalisedSeries(chartMap);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    if (days === "1") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <motion.div className="space-y-6" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-accent/10">
            <GitCompareArrows className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-text-primary">Compare Assets</h1>
        </div>
        <p className="text-sm text-text-tertiary ml-11">
          Overlay normalised price charts and compare metrics side-by-side. Up to {MAX_COMPARE} assets.
        </p>
      </motion.div>

      {/* Selected chips + picker */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        {selectedCoins.map((coin, i) => (
          <div
            key={coin.id}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border"
            style={{ borderColor: CHART_COLORS[i] + "60", background: CHART_COLORS[i] + "15" }}
          >
            <img src={coin.image} alt={coin.name} className="h-5 w-5 rounded-full" />
            <span className="text-xs font-semibold" style={{ color: CHART_COLORS[i] }}>
              {coin.symbol.toUpperCase()}
            </span>
            <button
              onClick={() => setSelectedIds((ids) => ids.filter((id) => id !== coin.id))}
              className="text-text-muted hover:text-negative transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {selectedIds.length < MAX_COMPARE && !coinsLoading && (
          <CoinPicker
            coins={allCoins ?? []}
            selected={selectedIds}
            onSelect={(id) => setSelectedIds((prev) => [...prev, id])}
          />
        )}
      </motion.div>

      {/* Empty state */}
      {selectedIds.length === 0 && (
        <motion.div variants={fadeUp}>
          <EmptyState
            icon={GitCompareArrows}
            title="No assets selected"
            description="Use the picker above to add 2–4 assets and compare their performance."
          />
        </motion.div>
      )}

      {/* Normalised Chart */}
      {selectedIds.length >= 1 && (
        <motion.div variants={fadeUp} className="bg-surface-1 border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-text-primary">Normalised Performance</h3>
              <p className="text-[11px] text-text-tertiary mt-0.5">Rebased to 100 at start — shows relative % gain/loss</p>
            </div>
            <div className="flex gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={days === tf.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDays(tf.value)}
                  className="text-xs h-7 px-2.5"
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-4">
            {chartLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : normSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={normSeries} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                  <CartesianGrid stroke="#1e3158" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatDate}
                    tick={{ fill: "#506090", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={50}
                  />
                  <YAxis
                    tick={{ fill: "#506090", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v.toFixed(0)}`}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0d1a35",
                      border: "1px solid #1e3158",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    labelFormatter={(label) => formatDate(label as number)}
                    formatter={(val: any, name: any) => {
                      const coin = selectedCoins.find((c) => c.id === name);
                      const num = Number(val);
                      return [!isNaN(num) ? num.toFixed(2) : String(val), coin?.symbol.toUpperCase() ?? String(name)];
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const coin = selectedCoins.find((c) => c.id === value);
                      return coin?.symbol.toUpperCase() ?? value;
                    }}
                  />
                  {selectedIds.map((id, i) => (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={id}
                      stroke={CHART_COLORS[i]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-text-muted text-center py-16">Loading chart data…</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Metrics table */}
      {selectedCoins.length >= 1 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-xs font-medium text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-accent" /> Side-by-Side Metrics
          </h2>
          <MetricsTable coins={selectedCoins} colors={CHART_COLORS} />
        </motion.div>
      )}
    </motion.div>
  );
}
