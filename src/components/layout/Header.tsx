import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Star,
  Activity,
  Bell,
  Trash2,
  Plus,
  ArrowRightLeft,
  X,
  CheckCircle,
  AlertTriangle,
  Flame,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketOverview, useCoins } from "@/hooks/useMarketData";
import { useAppStore } from "@/stores/appStore";
import { formatPrice, cn } from "@/lib/utils";
import type { Coin } from "@/types";

const pageNames: Record<string, string> = {
  "/overview": "Home Overview",
  "/discover": "Discover (Before The Hype)",
  "/opportunities": "Discover (Before The Hype)",
  "/news": "News & Catalyst Intelligence",
  "/projects": "Projects Explorer",
  "/market": "Projects Explorer",
  "/narratives": "Emerging Narratives",
  "/compare": "Asset Comparison Lab",
  "/research-lab": "Research Lab",
  "/ai-research": "Research Lab",
  "/backtest": "Research Lab",
  "/learn": "Financial Modeling & Learning Lab",
  "/watchlist": "Portfolio & Watchlist",
  "/risk": "Risk Radar",
  "/settings": "System Settings",
};

const regimeStyles = {
  BULLISH: {
    bg: "bg-positive/10 border-positive/30 text-positive shadow-[0_0_12px_rgba(45,212,167,0.15)]",
    dot: "bg-positive animate-pulse",
  },
  BEARISH: {
    bg: "bg-negative/10 border-negative/30 text-negative shadow-[0_0_12px_rgba(242,92,92,0.15)]",
    dot: "bg-negative animate-pulse",
  },
  HIGH_VOLATILITY: {
    bg: "bg-warning/10 border-warning/30 text-warning shadow-[0_0_12px_rgba(240,164,41,0.15)]",
    dot: "bg-warning animate-ping",
  },
  NEUTRAL: {
    bg: "bg-accent/10 border-accent/30 text-accent shadow-[0_0_12px_rgba(79,142,247,0.15)]",
    dot: "bg-accent",
  },
};

function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [targetCoin, setTargetCoin] = useState("bitcoin");
  const [targetPrice, setTargetPrice] = useState(98000);
  const ref = useRef<HTMLDivElement>(null);

  const { alerts, removeAlert, addAlert } = useAppStore();
  const { data: coins } = useCoins(0, 50);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setIsAdding(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAddAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coinObj = coins?.find((c) => c.id === targetCoin);
    addAlert({
      coinId: targetCoin,
      coinName: coinObj?.name ?? targetCoin,
      type: "PRICE_ABOVE",
      targetValue: Number(targetPrice),
      message: `${coinObj?.name ?? targetCoin} target alert above $${Number(targetPrice).toLocaleString()}`,
    });
    setIsAdding(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative p-2 rounded-xl border transition-all",
          open || alerts.length > 0
            ? "bg-surface-1 border-border text-text-primary"
            : "border-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-1"
        )}
        title="Alert Notifications"
      >
        <Bell className="h-4 w-4" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 sm:w-96 rounded-2xl glass border border-border/80 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Active Price & Risk Triggers ({alerts.length})
              </span>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> New Alert
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddAlertSubmit} className="p-3 rounded-xl bg-surface-0 border border-border mb-3 space-y-2.5">
              <div className="text-xs font-bold text-text-primary">Configure Price Target Alert</div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={targetCoin}
                  onChange={(e) => setTargetCoin(e.target.value)}
                  className="h-8 rounded-lg bg-surface-1 border border-border px-2 text-xs font-semibold text-text-primary"
                >
                  {(coins ?? [{ id: "bitcoin", name: "Bitcoin" }, { id: "ethereum", name: "Ethereum" }]).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  placeholder="Target Price $"
                  className="h-8 text-xs font-bold"
                />
              </div>
              <Button type="submit" size="sm" className="w-full text-xs font-bold">
                Set Alert Trigger
              </Button>
            </form>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-6">
                No active alerts set. Click "New Alert" to monitor price targets.
              </p>
            ) : (
              alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-surface-0/70 border border-border/70 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">{alt.coinName}</span>
                      <Badge variant="mint" className="text-[9px] font-bold uppercase">
                        {alt.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5">{alt.message}</p>
                  </div>
                  <button
                    onClick={() => removeAlert(alt.id)}
                    className="text-text-tertiary hover:text-negative p-1 rounded-md opacity-60 hover:opacity-100"
                    title="Remove alert"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: coins } = useCoins(0, 100);
  const { watchlist } = useAppStore();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered: Coin[] =
    query.trim().length < 1
      ? []
      : (coins ?? [])
          .filter(
            (c) =>
              c.name.toLowerCase().includes(query.toLowerCase()) ||
              c.symbol.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6);

  const handleSelect = (coin: Coin) => {
    navigate(`/asset/${coin.id}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        <Input
          placeholder="Search coins, tokens..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-44 sm:w-64 pl-8 h-8 text-xs bg-surface-1/90 border-border/80 hover:border-border-hover focus:border-accent"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-xs"
          >
            ✕
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted bg-surface-2 border border-border px-1.5 py-0.5 rounded font-mono">
            /
          </kbd>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 rounded-2xl glass border border-border/80 shadow-2xl p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-3 py-1.5">
            Quick Navigation ({filtered.length})
          </div>
          <div className="space-y-0.5">
            {filtered.map((coin) => {
              const isWatched = watchlist.includes(coin.id);
              const change24h = coin.price_change_percentage_24h;
              return (
                <button
                  key={coin.id}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-2/90 transition-all text-left group"
                  onClick={() => handleSelect(coin)}
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-7 w-7 rounded-full flex-shrink-0 ring-1 ring-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                        {coin.name}
                      </span>
                      {isWatched && (
                        <Star className="h-3 w-3 text-gold fill-gold flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-text-tertiary uppercase">
                      {coin.symbol}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-text-primary tabular">
                      {formatPrice(coin.current_price)}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] font-semibold tabular",
                        change24h >= 0 ? "text-positive" : "text-negative"
                      )}
                    >
                      {change24h >= 0 ? "+" : ""}
                      {change24h?.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const { data } = useMarketOverview();
  const { persona, setPersona } = useAppStore();

  let pageName = pageNames[location.pathname] ?? "CryptoVision AI";
  if (location.pathname.startsWith("/asset/")) pageName = "Asset Intelligence";

  const regime = data?.regime;
  const regimeStyle = regime ? regimeStyles[regime.state] ?? regimeStyles.NEUTRAL : null;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/70 glass px-6 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight truncate flex items-center gap-2">
          <span>{pageName}</span>
        </h1>
        <span className="hidden xl:inline-block text-xs text-text-tertiary font-medium">
          — Don't just follow the coin. Investigate the story behind it.
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* ── Tri-Persona Mode Switcher ── */}
        <div className="hidden lg:flex items-center gap-1 bg-surface-1/90 p-0.5 rounded-xl border border-border/80 text-xs">
          {(["EXPLORE", "RESEARCH", "ANALYST"] as const).map((p) => {
            const isSelected = persona === p;
            return (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all capitalize",
                  isSelected
                    ? p === "EXPLORE"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs"
                      : p === "RESEARCH"
                      ? "bg-accent/20 text-accent border border-accent/30 shadow-xs"
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-xs"
                    : "text-text-tertiary hover:text-text-primary"
                )}
                title={
                  p === "EXPLORE"
                    ? "Explore Mode: Beginner-friendly & visual analogies"
                    : p === "RESEARCH"
                    ? "Research Mode: Structured claims & evidence metrics"
                    : "Analyst Mode: Advanced raw telemetry & sensitivity models"
                }
              >
                {p.toLowerCase()}
              </button>
            );
          })}
        </div>

        {regime && regimeStyle && (
          <div
            className={cn(
              "hidden md:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-semibold tracking-wide transition-all",
              regimeStyle.bg
            )}
            title={regime.description}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", regimeStyle.dot)} />
            <span>{regime.state.replace("_", " ")}</span>
          </div>
        )}

        <NotificationDropdown />
        <GlobalSearch />
      </div>
    </header>
  );
}

