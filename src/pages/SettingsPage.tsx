import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { useCoins } from "@/hooks/useMarketData";
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Settings,
  Globe,
  DollarSign,
  CheckCircle,
  Palette,
  ArrowRightLeft,
} from "lucide-react";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

// Mock live exchange rates against USD for instant calculator conversions
const FIAT_RATES: Record<string, number> = {
  usd: 1.0,
  inr: 86.5,
  eur: 0.92,
  gbp: 0.78,
  aed: 3.67,
  jpy: 154.2,
  sgd: 1.34,
};

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-xl bg-accent/15 border border-accent/20 flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function SelectionGrid<T extends { code: string; name: string; symbol?: string; nativeName?: string }>({
  options,
  selected,
  onSelect,
  renderLabel,
}: {
  options: T[];
  selected: string;
  onSelect: (code: string) => void;
  renderLabel: (opt: T) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {options.map((opt) => {
        const isSelected = opt.code === selected;
        return (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            className={cn(
              "flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-left transition-all",
              isSelected
                ? "border-accent bg-accent/15 text-accent shadow-xs font-bold"
                : "border-border/80 bg-surface-0/60 text-text-secondary hover:border-accent/40 hover:bg-surface-2"
            )}
          >
            <span className="text-sm font-medium">{renderLabel(opt)}</span>
            {isSelected && <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsPage() {
  const { currency, language, setCurrency, setLanguage, theme, setTheme } = useAppStore();
  const { data: coins } = useCoins(0, 30);


  // Quick Currency Converter State
  const [convertAmount, setConvertAmount] = useState(1);
  const [convertCrypto, setConvertCrypto] = useState("bitcoin");
  const [convertFiat, setConvertFiat] = useState(currency);

  const selectedCrypto = coins?.find((c) => c.id === convertCrypto) ?? {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    current_price: 96000,
  };

  const fiatRate = FIAT_RATES[convertFiat.toLowerCase()] ?? 1.0;
  const fiatSymbol = SUPPORTED_CURRENCIES.find((c) => c.code === convertFiat.toLowerCase())?.symbol ?? "$";
  const convertedTotal = convertAmount * selectedCrypto.current_price * fiatRate;

  return (
    <motion.div className="space-y-8 max-w-4xl mx-auto" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
            <Settings className="h-5 w-5 text-accent animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">System Settings & Tools</h1>
        </div>
        <p className="text-sm text-text-tertiary ml-11">
          Global currency preferences, real-time conversion rates, language selection, and platform diagnostics.
        </p>
      </motion.div>

      {/* Real-time Crypto to Fiat Currency Converter */}
      <motion.div variants={fadeUp} className="bg-surface-1 border border-accent/30 rounded-2xl p-6 card-highlight shadow-[0_0_24px_rgba(79,142,247,0.06)]">
        <SectionHeader
          icon={ArrowRightLeft}
          title="Instant Multi-Currency Converter"
          description="Convert real-time token valuations against major fiat reserve currencies."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
              Token Quantity
            </label>
            <Input
              type="number"
              step="any"
              value={convertAmount}
              onChange={(e) => setConvertAmount(Math.max(0, Number(e.target.value)))}
              className="h-10 text-sm font-bold tabular bg-surface-0"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
              Source Cryptocurrency
            </label>
            <select
              value={convertCrypto}
              onChange={(e) => setConvertCrypto(e.target.value)}
              className="w-full h-10 rounded-xl bg-surface-0 border border-border px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {(coins ?? [
                { id: "bitcoin", name: "Bitcoin", symbol: "btc", current_price: 96000 },
                { id: "ethereum", name: "Ethereum", symbol: "eth", current_price: 2700 },
                { id: "solana", name: "Solana", symbol: "sol", current_price: 180 },
              ]).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
              Target Currency
            </label>
            <select
              value={convertFiat}
              onChange={(e) => setConvertFiat(e.target.value)}
              className="w-full h-10 rounded-xl bg-surface-0 border border-border px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.symbol} {c.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Output Box */}
        <div className="mt-4 p-4 rounded-xl bg-surface-0/90 border border-border flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              Converted Valuation
            </div>
            <div className="text-2xl font-extrabold text-positive tabular mt-0.5">
              {fiatSymbol}
              {convertedTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {convertFiat.toUpperCase()}
            </div>
          </div>
          <div className="text-right text-xs text-text-tertiary font-mono">
            1 {selectedCrypto.symbol.toUpperCase()} = {fiatSymbol}{(selectedCrypto.current_price * fiatRate).toLocaleString()} {convertFiat.toUpperCase()}
          </div>
        </div>
      </motion.div>

      {/* Currency Preferences */}
      <motion.div variants={fadeUp} className="bg-surface-1 border border-border rounded-2xl p-6 card-highlight">
        <SectionHeader
          icon={DollarSign}
          title="Default Display Currency"
          description="Default fiat representation across price feeds and portfolio calculations."
        />
        <SelectionGrid
          options={SUPPORTED_CURRENCIES}
          selected={currency}
          onSelect={setCurrency}
          renderLabel={(opt) => (
            <span className="flex items-center gap-2">
              <span className="text-text-muted font-mono text-xs w-5 font-bold">{opt.symbol}</span>
              <span>{opt.name}</span>
            </span>
          )}
        />
      </motion.div>

      {/* Language */}
      <motion.div variants={fadeUp} className="bg-surface-1 border border-border rounded-2xl p-6 card-highlight">
        <SectionHeader
          icon={Globe}
          title="Interface Language"
          description="Localization preference for number formatting and date rendering."
        />
        <SelectionGrid
          options={SUPPORTED_LANGUAGES}
          selected={language}
          onSelect={setLanguage}
          renderLabel={(opt) => (
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{opt.nativeName}</span>
              <span className="text-[10px] text-text-muted">{opt.name}</span>
            </span>
          )}
        />
      </motion.div>

      {/* Theme Presets */}
      <motion.div variants={fadeUp} className="glass-panel border border-white/12 rounded-2xl p-6 card-highlight shadow-xl">
        <SectionHeader icon={Palette} title="Visual Theme" description="Color grading, frosted glass refraction, and contrast scheme." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "light",
              label: "Light Crystal Glass",
              description: "Frosted white porcelain glass, razor-sharp typography, and warm amber gold accents.",
              primary: "#f4f3fa",
              cardBg: "#ffffff",
              accent: "#7c3aed",
            },
            {
              id: "dark",
              label: "Dark Imperial Glass",
              description: "Deep amethyst cosmic void, luminous neon purple highlights, and radiant gold glints.",
              primary: "#090317",
              cardBg: "#1e0b40",
              accent: "#c084fc",
            },
          ].map((themeOption) => {
            const isSelected = theme === themeOption.id;
            return (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as "light" | "dark")}
                className={cn(
                  "relative flex flex-col gap-3 p-4 rounded-2xl border transition-all text-left glass-card-hover",
                  isSelected
                    ? "border-gold/70 bg-gold/10 shadow-lg shadow-gold/10"
                    : "border-border/60 bg-surface-0/60 hover:border-accent/40"
                )}
              >
                <div
                  className="h-16 w-full rounded-xl flex items-center justify-center gap-2 p-2 border"
                  style={{ background: themeOption.primary, borderColor: themeOption.accent + "40" }}
                >
                  <div
                    className="h-9 w-24 rounded-lg flex items-center justify-center gap-1.5 border shadow-sm"
                    style={{ background: themeOption.cardBg, borderColor: themeOption.accent + "60" }}
                  >
                    <div className="h-2 w-2 rounded-full" style={{ background: themeOption.accent }} />
                    <div className="h-1 w-10 rounded-full" style={{ background: themeOption.accent + "80" }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-text-primary block">{themeOption.label}</span>
                    <span className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">{themeOption.description}</span>
                  </div>
                  {isSelected && <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>


      {/* Platform Diagnostics */}
      <motion.div variants={fadeUp} className="bg-surface-1 border border-border rounded-2xl p-6 card-highlight">
        <h2 className="text-sm font-bold text-text-primary mb-4">CryptoVision Platform Information</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-text-tertiary">Version</div>
            <div className="font-mono font-bold text-text-primary mt-0.5">2.5.0 Enterprise</div>
          </div>
          <div>
            <div className="text-text-tertiary">Connected Feeds</div>
            <div className="font-bold text-text-primary mt-0.5">CoinGecko, DeFiLlama</div>
          </div>
          <div>
            <div className="text-text-tertiary">Analytics Engine</div>
            <div className="font-bold text-mint mt-0.5">Multi-Signal Deterministic</div>
          </div>
          <div>
            <div className="text-text-tertiary">Storage Engine</div>
            <div className="font-bold text-accent mt-0.5">Client Indexed Cache</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
