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
  User,
  LogIn,
  LogOut,
  Shield,
  Sun,
  Moon,
  Globe,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketOverview, useCoins } from "@/hooks/useMarketData";
import { useAppStore } from "@/stores/appStore";
import { formatPrice, cn } from "@/lib/utils";
import type { Coin } from "@/types";

const pageNames: Record<string, string> = {
  "/explore": "✦ Explore Market Intelligence",
  "/research": "🔥 Research Asset Intelligence",
  "/analyze": "〽 Quantitative Analysis Workspace",
  "/overview": "Explore Market Intelligence",
  "/discover": "Explore Market Intelligence",
  "/opportunities": "Explore Market Intelligence",
  "/news": "News & Catalysts",
  "/projects": "Projects Explorer",
  "/market": "Projects Explorer",
  "/narratives": "Emerging Narratives",
  "/compare": "Asset Comparison",
  "/research-lab": "Research Lab",
  "/ai-research": "Research Lab",
  "/backtest": "Research Lab",
  "/learn": "Institutional Academy",
  "/watchlist": "Portfolio & Watchlist",
  "/risk": "Risk Radar",
  "/due-diligence": "Due Diligence",
  "/trust": "Trust Center",
  "/settings": "Settings",
};

const regimeStyles = {
  BULLISH: {
    bg: "bg-positive/15 border-positive/30 text-positive shadow-[0_0_16px_rgba(16,185,129,0.20)]",
    dot: "bg-positive animate-pulse",
  },
  BEARISH: {
    bg: "bg-negative/15 border-negative/30 text-negative shadow-[0_0_16px_rgba(244,63,94,0.20)]",
    dot: "bg-negative animate-pulse",
  },
  HIGH_VOLATILITY: {
    bg: "bg-gold/15 border-gold/40 text-gold shadow-[0_0_16px_rgba(245,197,66,0.25)]",
    dot: "bg-gold animate-ping",
  },
  NEUTRAL: {
    bg: "bg-gold/15 border-gold/40 text-gold shadow-[0_0_16px_rgba(245,197,66,0.20)]",
    dot: "bg-gold animate-pulse",
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
            ? "bg-[#1c1f2e] border-[#262b3d] text-white shadow-sm"
            : "border-transparent text-[#8f9cae] hover:text-white hover:bg-white/[0.04]"
        )}
        title="Alert Notifications"
      >
        <Bell className="h-4 w-4" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#2f80ed] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-80 sm:w-96 rounded-2xl glass-panel border border-white/15 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Price Target Alerts
              </h3>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              <Plus className="h-3 w-3" />
              {isAdding ? "Cancel" : "New Alert"}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddAlertSubmit} className="p-3 mb-3 rounded-xl bg-surface-2/60 border border-border/80 space-y-2.5">
              <div className="text-xs font-semibold text-text-secondary">Set Custom Alert</div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={targetCoin}
                  onChange={(e) => setTargetCoin(e.target.value)}
                  className="h-8 rounded-lg bg-surface-1 border border-border px-2 text-xs font-medium text-text-primary focus:outline-none focus:border-accent"
                >
                  {(coins ?? []).slice(0, 20).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol.toUpperCase()})
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
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
        <Input
          placeholder="Search coins, tokens..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-32 sm:w-44 md:w-52 pl-8.5 h-8 text-xs bg-white/[0.04] border border-white/10 text-white placeholder:text-white/40 hover:border-white/25 focus:border-white/40 rounded-full transition-colors"
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
        <div className="absolute top-full mt-2 right-0 z-50 w-80 rounded-2xl glass-panel border border-white/15 shadow-2xl p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                        (change24h ?? 0) >= 0 ? "text-positive" : "text-negative"
                      )}
                    >
                      {(change24h ?? 0) >= 0 ? "+" : ""}
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

function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openAuthModal, setPersona } = useAppStore();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          to="/login"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 border border-gold/40 hover:border-gold text-gold font-bold text-xs shadow-gold-subtle hover:bg-gold/25 transition-all"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Sign In / News</span>
        </Link>
        <button
          onClick={openAuthModal}
          className="p-2 rounded-xl bg-surface-1 border border-border/80 text-text-tertiary hover:text-gold hover:border-gold/40 transition-all sm:hidden"
          title="Sign In"
        >
          <LogIn className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-border/80 bg-surface-1/90 hover:border-gold/50 transition-all shadow-sm group"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-6 w-6 rounded-lg object-cover ring-1 ring-gold/40 flex-shrink-0"
        />
        <span className="text-xs font-bold text-text-primary hidden xl:inline max-w-[100px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <Badge variant="gold" className="text-[9px] px-1 py-0 uppercase font-mono hidden md:inline">
          {user.tier}
        </Badge>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-72 rounded-2xl glass-panel border border-gold/40 shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150 space-y-3">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-0/60 backdrop-blur-md border border-white/10">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-gold/50"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-xs text-text-primary truncate">{user.name}</div>
              <div className="text-[10px] text-text-tertiary truncate font-mono">{user.email}</div>
              <div className="text-[9px] text-gold font-bold uppercase mt-0.5">{user.role}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1 text-xs">
            <Link
              to="/news?tab=newsreel"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-gold" />
                <span>Crypto Trends Newsreel</span>
              </span>
              <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-bold">Watch</span>
            </Link>


            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span>Account & Permissions</span>
              </span>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-border/60">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-negative hover:bg-negative/10 text-xs font-bold transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useAppStore();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-8 w-8 rounded-xl glass-pill hover:border-gold/50 text-text-secondary hover:text-gold transition-all shadow-sm group"
      title={`Switch to ${theme === "light" ? "Dark Imperial Glass" : "Light Crystal Glass"} mode`}
      aria-label="Toggle visual theme"
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-amber-500 group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="h-4 w-4 text-accent group-hover:-rotate-12 transition-transform" />
      )}
    </button>
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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#080b12]/75 backdrop-blur-2xl px-4 sm:px-6 gap-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-colors">
      {/* Left: Page Title & Breadcrumb Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <h1 className="text-sm sm:text-base font-bold text-white tracking-tight whitespace-nowrap flex items-center gap-2">
          <span>{pageName}</span>
        </h1>
        <span className="hidden 2xl:inline-block text-xs text-white/40 font-mono">
          // Evidence-grounded multi-model alpha
        </span>
      </div>

      {/* Right: Actions, Regime & Search */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Tri-Persona Mode Indicator Pill */}
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.05] backdrop-blur-md border border-white/10 p-0.5 rounded-full text-xs shadow-inner">

          {(["EXPLORE", "RESEARCH", "ANALYST"] as const).map((p) => {
            const isSelected = persona === p;
            return (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={cn(
                  "px-3 py-1 rounded-full font-mono text-[10px] uppercase font-semibold transition-all flex items-center gap-1.5",
                  isSelected
                    ? "bg-white text-black shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                )}
                title={
                  p === "EXPLORE"
                    ? "Explore Mode: Visual analogies & plain English for beginners"
                    : p === "RESEARCH"
                    ? "Research Mode: Structured claims & evidence verification audits"
                    : "Analyst Mode: Advanced raw quant telemetry & sensitivity models"
                }
              >
                {p === "EXPLORE" && <Sparkles className="h-3 w-3" />}
                {p === "RESEARCH" && <Flame className="h-3 w-3" />}
                {p === "ANALYST" && <Activity className="h-3 w-3" />}
                <span>{p.toLowerCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Live Market Regime Pill */}
        {regime && (
          <div
            className={cn(
              "hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-medium tracking-wide transition-all",
              regime.state === "BULLISH"
                ? "bg-[#00dc82]/10 text-[#00dc82] border-[#00dc82]/30"
                : regime.state === "BEARISH"
                ? "bg-[#ff5b5b]/10 text-[#ff5b5b] border-[#ff5b5b]/30"
                : "bg-[#f2c94c]/10 text-[#f2c94c] border-[#f2c94c]/30"
            )}
            title={regime.description}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", regime.state === "BULLISH" ? "bg-[#00dc82]" : regime.state === "BEARISH" ? "bg-[#ff5b5b]" : "bg-[#f2c94c]")} />
            <span>{regime.state.replace("_", " ")}</span>
          </div>
        )}

        {/* Link to Institutional Flagship Landing Page */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 hover:border-white/30 text-white/80 hover:text-white text-xs font-semibold transition-all shadow-sm group"
          title="Return to Editorial Flagship Canvas"
        >
          <Globe className="h-3.5 w-3.5 text-white/60 group-hover:text-white group-hover:rotate-12 transition-transform" />
          <span className="hidden xl:inline text-[11px] uppercase tracking-wider font-mono">Flagship</span>
        </Link>

        <ThemeToggleButton />
        <NotificationDropdown />
        <GlobalSearch />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
