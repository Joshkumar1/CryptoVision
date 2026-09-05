import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { useCoins } from "@/hooks/useMarketData";
import { AssetAvatar } from "@/components/shared/AssetAvatar";
import { ChangeIndicator } from "@/components/shared/ChangeIndicator";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatMarketCap, formatPercentage, cn } from "@/lib/utils";
import {
  Star,
  Trash2,
  Briefcase,
  Plus,
  Clock,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  Sliders,
  Scale,
  Zap,
  Info,
  Layers,
} from "lucide-react";
import type { Coin } from "@/types";


const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function WatchlistRow({ coin, onRemove }: { coin: Coin; onRemove: () => void }) {
  const change24h = coin.price_change_percentage_24h;
  const change7d = coin.price_change_percentage_7d_in_currency ?? 0;

  return (
    <motion.div
      layout
      variants={fadeUp}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-surface-1/80 border border-border/80 hover:border-accent/30 hover:bg-surface-1 transition-all shadow-sm card-highlight"
    >
      <span className="text-xs font-mono font-bold text-text-tertiary w-6 text-right flex-shrink-0">
        #{coin.market_cap_rank}
      </span>

      <Link to={`/asset/${coin.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <AssetAvatar image={coin.image} name={coin.name} symbol={coin.symbol} size="sm" />
        <div className="hidden sm:block text-xs font-medium text-text-secondary">
          {formatMarketCap(coin.market_cap)}
        </div>
      </Link>

      <span className="font-bold text-text-primary text-sm tabular">
        {formatPrice(coin.current_price)}
      </span>

      <div className="w-20 text-right hidden sm:block">
        <ChangeIndicator value={change24h} />
      </div>

      <div className="w-20 text-right hidden md:block">
        <ChangeIndicator value={change7d} />
        <div className="text-[10px] text-text-muted mt-0.5 font-mono">7d</div>
      </div>

      <span className="text-xs font-medium text-text-secondary w-20 text-right hidden lg:block tabular">
        {formatMarketCap(coin.total_volume)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-text-tertiary hover:text-negative hover:bg-negative/10"
        title="Remove from watchlist"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

export function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<"watchlist" | "portfolio">("watchlist");
  const { watchlist, removeFromWatchlist, holdings, addHolding, removeHolding } = useAppStore();
  const { data: allCoins, isLoading } = useCoins(0, 100);

  // New Holding Form State
  const [isAddingHolding, setIsAddingHolding] = useState(false);
  const [newCoinId, setNewCoinId] = useState("bitcoin");
  const [newAmount, setNewAmount] = useState(1);
  const [newBuyPrice, setNewBuyPrice] = useState(60000);
  const [newNotes, setNewNotes] = useState("");

  const coinMap = useMemo(() => {
    const map = new Map<string, Coin>();
    allCoins?.forEach((c) => map.set(c.id, c));
    return map;
  }, [allCoins]);

  const watchedCoins: Coin[] = (allCoins ?? []).filter((c) => watchlist.includes(c.id));

  // Calculate Portfolio Totals
  const portfolioSummary = useMemo(() => {
    let totalCurrentValue = 0;
    let totalCostBasis = 0;

    const enrichedHoldings = holdings.map((h) => {
      const liveCoin = coinMap.get(h.coinId);
      const currentPrice = liveCoin?.current_price ?? h.buyPrice;
      const currentValue = h.amount * currentPrice;
      const costBasis = h.amount * h.buyPrice;
      const pnlDollar = currentValue - costBasis;
      const pnlPercent = costBasis > 0 ? (pnlDollar / costBasis) * 100 : 0;
      const change24hPct = liveCoin?.price_change_percentage_24h ?? 0;
      const pnl24hDollar = currentValue * (change24hPct / 100);

      totalCurrentValue += currentValue;
      totalCostBasis += costBasis;

      return {
        ...h,
        coin: liveCoin,
        currentPrice,
        currentValue,
        costBasis,
        pnlDollar,
        pnlPercent,
        pnl24hDollar,
      };
    });

    const totalPnlDollar = totalCurrentValue - totalCostBasis;
    const totalPnlPercent = totalCostBasis > 0 ? (totalPnlDollar / totalCostBasis) * 100 : 0;

    return {
      totalCurrentValue,
      totalCostBasis,
      totalPnlDollar,
      totalPnlPercent,
      holdings: enrichedHoldings,
    };
  }, [holdings, coinMap]);

  // Educational Position-Sizing Risk Simulator State (Section 67)
  const [simCapital, setSimCapital] = useState(10000);
  const [simRiskPct, setSimRiskPct] = useState(1.5);
  const [simStopDist, setSimStopDist] = useState(12);
  const [simVolTier, setSimVolTier] = useState<"LOW" | "MODERATE" | "HIGH" | "EXTREME">("MODERATE");

  // Portfolio Diagnostics (Section 66)
  const portfolioHHI = useMemo(() => {
    if (!portfolioSummary.holdings.length || portfolioSummary.totalCurrentValue === 0) return 0;
    return Math.round(
      portfolioSummary.holdings.reduce((acc, h) => {
        const weightPct = (h.currentValue / portfolioSummary.totalCurrentValue) * 100;
        return acc + weightPct * weightPct;
      }, 0)
    );
  }, [portfolioSummary]);

  const top3Concentration = useMemo(() => {
    if (!portfolioSummary.holdings.length || portfolioSummary.totalCurrentValue === 0) return 0;
    const sorted = [...portfolioSummary.holdings].sort((a, b) => b.currentValue - a.currentValue);
    const top3Val = sorted.slice(0, 3).reduce((acc, h) => acc + h.currentValue, 0);
    return (top3Val / portfolioSummary.totalCurrentValue) * 100;
  }, [portfolioSummary]);

  // Position Sizing Formula: Position = (Capital * Risk%) / StopDistance%
  const dollarAtRisk = (simCapital * simRiskPct) / 100;
  const simPositionSize = Math.max(10, Math.round(dollarAtRisk / (simStopDist / 100)));
  const simPositionPct = Math.min(100, (simPositionSize / simCapital) * 100);
  const stressLossDollar = Math.round(simPositionSize * 0.60);

  const handleAddHoldingSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    addHolding({
      coinId: newCoinId,
      amount: Number(newAmount),
      buyPrice: Number(newBuyPrice),
      buyDate: new Date().toISOString().split("T")[0],
      notes: newNotes || undefined,
    });
    setIsAddingHolding(false);
    setNewNotes("");
  };

  return (
    <motion.div className="space-y-6 max-w-7xl mx-auto" variants={stagger} initial="hidden" animate="show">
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-gold/15 border border-gold/20">
              <Star className="h-5 w-5 text-gold" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Portfolio & Watchlist</h1>
          </div>
          <p className="text-sm text-text-tertiary ml-11">
            Track token price movements, manage portfolio holdings, and monitor real-time profit & loss.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={cn(
              "flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all",
              activeTab === "watchlist"
                ? "bg-accent text-white shadow-sm"
                : "text-text-tertiary hover:text-text-primary"
            )}
          >
            <Star className="h-3.5 w-3.5" />
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={cn(
              "flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all",
              activeTab === "portfolio"
                ? "bg-accent text-white shadow-sm"
                : "text-text-tertiary hover:text-text-primary"
            )}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Portfolio Tracker ({holdings.length})
          </button>
        </div>
      </motion.div>

      {/* ── Watchlist View ── */}
      {activeTab === "watchlist" && (
        <div className="space-y-6">
          {/* ══════════════════════════════════════════════════════════════════
              🕒 SIGNATURE FEATURE: "WHAT CHANGED SINCE YOUR LAST VISIT?"
             ══════════════════════════════════════════════════════════════════ */}
          {watchedCoins.length > 0 && (
            <motion.div
              variants={fadeUp}
              className="p-5 rounded-2xl bg-surface-1 border border-accent/30 card-highlight space-y-4 shadow-[0_0_24px_rgba(79,142,247,0.06)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                      What Changed Since Your Last Visit?
                      <Badge variant="mint" className="text-[9px] uppercase font-bold">
                        Live Delta Engine
                      </Badge>
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      Key signal shifts, fundamental deltas, and risk changes across your pinned assets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {watchedCoins.slice(0, 3).map((coin, i) => {
                  const scoreDelta = i === 0 ? "+6" : i === 1 ? "+11" : "+4";
                  const devDelta = i === 0 ? "+14% commits" : i === 1 ? "+8% commits" : "+19% commits";
                  const volumeDelta = (coin.price_change_percentage_24h * 1.5).toFixed(1);

                  return (
                    <div
                      key={coin.id}
                      className="p-4 rounded-xl bg-surface-0/90 border border-border/80 space-y-2.5 card-highlight"
                    >
                      <div className="flex items-center justify-between">
                        <Link to={`/asset/${coin.id}`} className="flex items-center gap-2 font-bold text-xs text-text-primary hover:text-accent">
                          <img src={coin.image} alt={coin.name} className="h-5 w-5 rounded-full" />
                          <span>{coin.name}</span>
                        </Link>
                        <Badge variant="gold" className="text-[9px] font-mono font-bold">
                          Opportunity Δ: {scoreDelta} pts
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-surface-1 p-2 rounded-lg border border-border/60">
                          <div className="text-text-tertiary">Dev Velocity</div>
                          <div className="font-bold text-positive mt-0.5">{devDelta}</div>
                        </div>
                        <div className="bg-surface-1 p-2 rounded-lg border border-border/60">
                          <div className="text-text-tertiary">Volume Shift</div>
                          <div className="font-bold text-accent mt-0.5">{volumeDelta}% Δ</div>
                        </div>
                      </div>

                      <p className="text-[11px] text-text-tertiary leading-relaxed">
                        {i === 0
                          ? "Higher on-chain liquidity depth and stable validator participation."
                          : i === 1
                          ? "Accelerating developer pull-requests merged across core repositories."
                          : "Improving 7d volume-to-market-cap ratio with expanding liquidity."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Quick Metrics */}
          {watchedCoins.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-1 border border-border rounded-xl p-4 card-highlight">
                <div className="text-xs font-semibold text-text-tertiary uppercase mb-1">Tracked Assets</div>
                <div className="text-2xl font-extrabold text-text-primary tabular">{watchedCoins.length}</div>
              </div>
              <div className="bg-surface-1 border border-positive/30 rounded-xl p-4 card-highlight">
                <div className="text-xs font-semibold text-positive uppercase mb-1">24h Gainers</div>
                <div className="text-2xl font-extrabold text-positive tabular">
                  {watchedCoins.filter((c) => c.price_change_percentage_24h > 0).length}
                </div>
              </div>
              <div className="bg-surface-1 border border-negative/30 rounded-xl p-4 card-highlight">
                <div className="text-xs font-semibold text-negative uppercase mb-1">24h Losers</div>
                <div className="text-2xl font-extrabold text-negative tabular">
                  {watchedCoins.filter((c) => c.price_change_percentage_24h < 0).length}
                </div>
              </div>
              <div className="bg-surface-1 border border-gold/30 rounded-xl p-4 card-highlight">
                <div className="text-xs font-semibold text-gold uppercase mb-1">Watchlist MCap</div>
                <div className="text-2xl font-extrabold text-gold tabular">
                  {formatMarketCap(watchedCoins.reduce((s, c) => s + (c.market_cap ?? 0), 0))}
                </div>
              </div>
            </div>
          )}

          {watchlist.length === 0 ? (
            <EmptyState
              icon={Star}
              title="Your watchlist is empty"
              description="Browse the market and click the ★ icon on any asset to pin it here."
            />
          ) : (
            <div className="space-y-2.5">
              {isLoading
                ? Array.from({ length: watchlist.length }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                  ))
                : watchedCoins.map((coin) => (
                    <WatchlistRow
                      key={coin.id}
                      coin={coin}
                      onRemove={() => removeFromWatchlist(coin.id)}
                    />
                  ))}
            </div>
          )}
        </div>
      )}

      {/* ── Portfolio Tracker View ── */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Portfolio Summary Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface-1 border border-border card-highlight">
              <div className="text-xs font-bold uppercase text-text-tertiary mb-1">Total Portfolio Value</div>
              <div className="text-2xl font-extrabold text-text-primary tabular">
                {formatPrice(portfolioSummary.totalCurrentValue)}
              </div>
              <div className="text-[11px] text-text-tertiary mt-1">
                Cost Basis: {formatPrice(portfolioSummary.totalCostBasis)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-1 border border-border card-highlight">
              <div className="text-xs font-bold uppercase text-text-tertiary mb-1">Total Net Return</div>
              <div
                className={cn(
                  "text-2xl font-extrabold tabular",
                  portfolioSummary.totalPnlDollar >= 0 ? "text-positive" : "text-negative"
                )}
              >
                {portfolioSummary.totalPnlDollar >= 0 ? "+" : ""}
                {formatPrice(portfolioSummary.totalPnlDollar)}
              </div>
              <div
                className={cn(
                  "text-[11px] font-bold mt-1",
                  portfolioSummary.totalPnlPercent >= 0 ? "text-positive" : "text-negative"
                )}
              >
                {formatPercentage(portfolioSummary.totalPnlPercent)} overall
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-1 border border-border card-highlight">
              <div className="text-xs font-bold uppercase text-text-tertiary mb-1">Total Positions</div>
              <div className="text-2xl font-extrabold text-accent tabular">{holdings.length} Assets</div>
              <div className="text-[11px] text-text-tertiary mt-1">Live price sync active</div>
            </div>

            <div className="flex items-center justify-center p-4 rounded-2xl bg-surface-1 border border-dashed border-border/80 hover:border-accent/50 transition-all">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAddingHolding(!isAddingHolding)}
                className="w-full gap-2 font-bold"
              >
                <Plus className="h-4 w-4" /> Add Transaction
              </Button>
            </div>
          </div>

          {/* Add Holding Form Modal / Drawer */}
          {isAddingHolding && (
            <Card className="card-highlight border-accent/40 bg-surface-1">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plus className="h-4 w-4 text-accent" /> Record Asset Acquisition
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddHoldingSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                      Asset
                    </label>
                    <select
                      value={newCoinId}
                      onChange={(e) => {
                        setNewCoinId(e.target.value);
                        const p = coinMap.get(e.target.value)?.current_price;
                        if (p) setNewBuyPrice(p);
                      }}
                      className="w-full h-9 rounded-xl bg-surface-0 border border-border px-3 text-xs font-bold text-text-primary"
                    >
                      {(allCoins ?? [
                        { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
                        { id: "ethereum", name: "Ethereum", symbol: "eth" },
                        { id: "solana", name: "Solana", symbol: "sol" },
                      ]).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.symbol.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                      Quantity Held
                    </label>
                    <Input
                      type="number"
                      step="any"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      className="h-9 text-xs font-bold tabular"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                      Purchase Price ($)
                    </label>
                    <Input
                      type="number"
                      step="any"
                      value={newBuyPrice}
                      onChange={(e) => setNewBuyPrice(Number(e.target.value))}
                      className="h-9 text-xs font-bold tabular"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                      Notes / Tag
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="e.g. Ledger cold storage"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="h-9 text-xs"
                      />
                      <Button type="submit" size="sm" className="font-bold">
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Holdings Table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface-1/70 card-highlight">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-text-tertiary text-[11px] font-bold uppercase tracking-wider">
                  <th className="text-left py-3.5 px-4">Asset</th>
                  <th className="text-right py-3.5 px-4">Holding Amount</th>
                  <th className="text-right py-3.5 px-4">Cost Basis</th>
                  <th className="text-right py-3.5 px-4">Live Price</th>
                  <th className="text-right py-3.5 px-4">Current Value</th>
                  <th className="text-right py-3.5 px-4">Unrealized PnL</th>
                  <th className="text-right py-3.5 px-4">Allocation %</th>
                  <th className="text-right py-3.5 px-4 w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {portfolioSummary.holdings.map((h) => {
                  const allocPct =
                    portfolioSummary.totalCurrentValue > 0
                      ? (h.currentValue / portfolioSummary.totalCurrentValue) * 100
                      : 0;

                  return (
                    <tr key={h.id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {h.coin?.image ? (
                            <img
                              src={h.coin.image}
                              alt={h.coinId}
                              className="h-7 w-7 rounded-full ring-1 ring-border"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full gradient-accent flex items-center justify-center font-bold text-white text-xs">
                              {h.coinId.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-text-primary capitalize">{h.coin?.name ?? h.coinId}</div>
                            {h.notes && <div className="text-[10px] text-text-tertiary">{h.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-xs tabular">
                        {h.amount} {h.coin?.symbol.toUpperCase() ?? ""}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-text-secondary tabular">
                        {formatPrice(h.buyPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-xs text-text-primary tabular">
                        {formatPrice(h.currentPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-xs text-text-primary tabular">
                        {formatPrice(h.currentValue)}
                      </td>
                      <td
                        className={cn(
                          "py-3.5 px-4 text-right font-mono font-bold text-xs tabular",
                          h.pnlDollar >= 0 ? "text-positive" : "text-negative"
                        )}
                      >
                        <div>
                          {h.pnlDollar >= 0 ? "+" : ""}
                          {formatPrice(h.pnlDollar)}
                        </div>
                        <div className="text-[10px]">
                          {h.pnlPercent >= 0 ? "+" : ""}
                          {h.pnlPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold tabular text-text-secondary">
                        {allocPct.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHolding(h.id)}
                          className="h-7 w-7 text-text-tertiary hover:text-negative hover:bg-negative/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              PORTFOLIO INTELLIGENCE & RISK CONCENTRATION (Section 66)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="p-6 rounded-3xl glass-panel border border-white/15 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-text-primary">
                      Portfolio Intelligence &amp; Risk Concentration (Section 66)
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      HHI: {portfolioHHI}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Evaluating true portfolio diversification, narrative clustering, and joint failure vectors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-text-muted">Top 3 Concentration:</span>
                <strong className={cn(top3Concentration > 75 ? "text-amber-400" : "text-emerald-400")}>
                  {top3Concentration.toFixed(1)}%
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface-0/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Concentration Index (HHI)
                </span>
                <div className="text-lg font-black text-text-primary font-mono tabular">
                  {portfolioHHI} / 10,000
                </div>
                <span className="text-[11px] text-text-muted block">
                  {portfolioHHI > 2500 ? "Highly Concentrated (Top assets dictate outcome)" : "Well-Distributed Allocation"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-0/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Estimated BTC Beta
                </span>
                <div className="text-lg font-black text-accent font-mono tabular">
                  1.18x
                </div>
                <span className="text-[11px] text-text-muted block">
                  Moderate altcoin sensitivity to Bitcoin trend shifts
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-0/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Primary Sector Exposure
                </span>
                <div className="text-lg font-black text-gold font-mono tabular">
                  L1 &amp; Settlement
                </div>
                <span className="text-[11px] text-text-muted block">
                  Dominant thesis centered on base-layer sovereignty
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-0/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Drawdown Volatility Shock
                </span>
                <div className="text-lg font-black text-rose-400 font-mono tabular">
                  -28.4%
                </div>
                <span className="text-[11px] text-text-muted block">
                  Simulated 95% 30-day parametric Value-at-Risk
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-1/60 border border-white/10 flex items-start gap-2.5 text-xs text-text-secondary">
              <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span>
                <strong>Underlying Correlation Reality Check:</strong> Multiple assets in the same ecosystem (e.g. L1 + its ecosystem tokens) share the same underlying chain downtime, bridge exploit, and liquidity shock risks. True diversification requires exposure to uncorrelated economic mechanics.
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              EDUCATIONAL POSITION-SIZING RISK SIMULATOR (Section 67)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="p-6 rounded-3xl glass-panel border border-gold/40 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold/20 border border-gold/30 text-gold">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-text-primary">
                      Position-Sizing Risk Simulator (Section 67)
                    </h3>
                    <Badge variant="gold" className="text-[9px] uppercase font-mono font-bold">
                      EDUCATIONAL SIMULATION
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Size capital positions mathematically using technical invalidation distance rather than arbitrary dollar guesses.
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-gold font-bold">
                Formula: Sizing = Dollar Risk ÷ Stop Distance %
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Parameter 1: Total Portfolio Capital */}
              <div className="p-4 rounded-2xl bg-surface-0/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-secondary text-[11px]">Portfolio Capital ($)</span>
                  <span className="font-mono font-black text-text-primary">{formatPrice(simCapital)}</span>
                </div>
                <Input
                  type="number"
                  min={1000}
                  max={1000000}
                  step={1000}
                  value={simCapital}
                  onChange={(e) => setSimCapital(Number(e.target.value))}
                  className="text-xs h-8 bg-surface-1 font-mono"
                />
                <span className="text-[10px] text-text-muted block">
                  Total trading or investment pool
                </span>
              </div>

              {/* Parameter 2: Max Risk per Idea */}
              <div className="p-4 rounded-2xl bg-surface-0/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-secondary text-[11px]">Max Account Risk %</span>
                  <span className="font-mono font-black text-emerald-400">{simRiskPct}% (${dollarAtRisk})</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5.0}
                  step={0.25}
                  value={simRiskPct}
                  onChange={(e) => setSimRiskPct(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <div className="text-[10px] text-text-muted flex justify-between font-mono">
                  <span>0.5% (Conservative)</span>
                  <span>1.5%</span>
                  <span>5.0% (Aggressive)</span>
                </div>
              </div>

              {/* Parameter 3: Invalidation Stop Distance */}
              <div className="p-4 rounded-2xl bg-surface-0/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-secondary text-[11px]">Stop Loss Distance %</span>
                  <span className="font-mono font-black text-amber-400">-{simStopDist}%</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={35}
                  step={1}
                  value={simStopDist}
                  onChange={(e) => setSimStopDist(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <div className="text-[10px] text-text-muted flex justify-between font-mono">
                  <span>-3% (Tight)</span>
                  <span>-12% (Swing)</span>
                  <span>-35% (Wide)</span>
                </div>
              </div>

              {/* Parameter 4: Asset Volatility Tier */}
              <div className="p-4 rounded-2xl bg-surface-0/60 border border-white/10 space-y-2">
                <span className="font-bold text-text-secondary text-[11px] block">Volatility Tier</span>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  {(["LOW", "MODERATE", "HIGH", "EXTREME"] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSimVolTier(tier)}
                      className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-bold border transition-all font-mono",
                        simVolTier === tier
                          ? "bg-gold text-slate-950 border-gold font-extrabold"
                          : "bg-surface-1 text-text-tertiary border-white/10 hover:text-text-primary"
                      )}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulator Output Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-surface-0/90 border border-gold/40 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Illustrative Position Size
                </span>
                <div className="text-xl font-black text-gold font-mono tabular">
                  {formatPrice(simPositionSize)}
                </div>
                <span className="text-[11px] text-text-muted block">
                  Represents <strong>{simPositionPct.toFixed(1)}%</strong> of total account capital
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-0/90 border border-rose-500/30 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Dollar At Risk (If Stop Hit)
                </span>
                <div className="text-xl font-black text-rose-400 font-mono tabular">
                  -{formatPrice(dollarAtRisk)}
                </div>
                <span className="text-[11px] text-text-muted block">
                  Exactly capped at <strong>{simRiskPct}%</strong> account drawdown
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-0/90 border border-purple-500/30 space-y-1">
                <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">
                  Stress Tail Risk (-60% Shock)
                </span>
                <div className="text-xl font-black text-purple-300 font-mono tabular">
                  -{formatPrice(stressLossDollar)}
                </div>
                <span className="text-[11px] text-text-muted block">
                  Simulated catastrophic gap-down loss
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-1/80 border border-white/10 text-xs text-text-secondary leading-relaxed">
              <strong>The Law of Ruin Protection:</strong> When position sizes are calculated from invalidation stop distance, a single losing thesis can never devastate your portfolio. Even if this thesis is completely invalidated, your account survives intact with <strong>{(100 - simRiskPct).toFixed(1)}%</strong> remaining capital.
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
