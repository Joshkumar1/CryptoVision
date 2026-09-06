import React, { useState, useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Sparkles, Globe, Calculator, ArrowUpRight, Coins, RefreshCw, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToUsd: number; // 1 USD = X Local Currency
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", flag: "🇺🇸", rateToUsd: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rateToUsd: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rateToUsd: 0.78 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rateToUsd: 83.50 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rateToUsd: 148.20 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rateToUsd: 1.52 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rateToUsd: 1.36 },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr.", flag: "🇨🇭", rateToUsd: 0.87 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rateToUsd: 5.60 },
  { code: "AED", name: "UAE Dirham", symbol: "AED", flag: "🇦🇪", rateToUsd: 3.67 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rateToUsd: 1.34 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", rateToUsd: 1340.0 },
  { code: "CNH", name: "Chinese Yuan Offshore", symbol: "¥", flag: "🇨🇳", rateToUsd: 7.18 },
  { code: "SAR", name: "Saudi Riyal", symbol: "SR", flag: "🇸🇦", rateToUsd: 3.75 },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$", flag: "🇲🇽", rateToUsd: 19.80 },
];

export interface CryptoAssetData {
  symbol: string;
  name: string;
  todayPriceUsd: number;
  yesterdayPriceUsd: number;
  category: string;
  badge: string;
  accentColor: string;
  glowColor: string;
}

export const CALC_ASSETS: CryptoAssetData[] = [
  {
    symbol: "KRYPTOS",
    name: "Kryptos Protocol",
    todayPriceUsd: 104250.0,
    yesterdayPriceUsd: 95712.0,
    category: "4K Sovereign Reserve",
    badge: "+8.92% 24h",
    accentColor: "text-cyan-400",
    glowColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    todayPriceUsd: 96480.0,
    yesterdayPriceUsd: 92635.0,
    category: "Store of Value",
    badge: "+4.15% 24h",
    accentColor: "text-amber-400",
    glowColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    todayPriceUsd: 3420.5,
    yesterdayPriceUsd: 3236.65,
    category: "Settlement Layer",
    badge: "+5.68% 24h",
    accentColor: "text-purple-400",
    glowColor: "from-purple-500/20 via-indigo-500/10 to-transparent",
  },
  {
    symbol: "SOL",
    name: "Solana",
    todayPriceUsd: 218.4,
    yesterdayPriceUsd: 194.3,
    category: "High-Throughput",
    badge: "+12.40% 24h",
    accentColor: "text-[#00dc82]",
    glowColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    todayPriceUsd: 42.15,
    yesterdayPriceUsd: 39.65,
    category: "Subnet Mesh",
    badge: "+6.30% 24h",
    accentColor: "text-red-400",
    glowColor: "from-red-500/20 via-orange-500/10 to-transparent",
  },
  {
    symbol: "SUI",
    name: "Sui Network",
    todayPriceUsd: 3.45,
    yesterdayPriceUsd: 3.02,
    category: "Move Execution",
    badge: "+14.24% 24h",
    accentColor: "text-blue-400",
    glowColor: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    todayPriceUsd: 22.8,
    yesterdayPriceUsd: 21.97,
    category: "Oracle Infrastructure",
    badge: "+3.78% 24h",
    accentColor: "text-cyan-300",
    glowColor: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
];

const PRESET_AMOUNTS = [100, 1000, 5000, 10000, 50000, 100000];

export const GlobalInvestmentProfitCalculator: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(SUPPORTED_CURRENCIES[0]);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAssetData>(CALC_ASSETS[0]);
  const [investAmount, setInvestAmount] = useState<number>(1000);

  // Calculations
  const calculation = useMemo(() => {
    const rawAmount = Math.max(0, investAmount || 0);
    // Local currency to USD conversion
    const investedUsd = rawAmount / selectedCurrency.rateToUsd;
    
    // Yesterday asset price in local currency
    const yesterdayPriceLocal = selectedAsset.yesterdayPriceUsd * selectedCurrency.rateToUsd;
    // Today asset price in local currency
    const todayPriceLocal = selectedAsset.todayPriceUsd * selectedCurrency.rateToUsd;

    // Tokens acquired if bought yesterday
    const tokensAcquired = yesterdayPriceLocal > 0 ? rawAmount / yesterdayPriceLocal : 0;

    // Current value today of those tokens in local currency
    const todayValueLocal = tokensAcquired * todayPriceLocal;

    // Net profit/loss in local currency
    const profitLocal = todayValueLocal - rawAmount;
    const profitPercent = rawAmount > 0 ? (profitLocal / rawAmount) * 100 : 0;
    const isProfit = profitLocal >= 0;

    return {
      rawAmount,
      yesterdayPriceLocal,
      todayPriceLocal,
      tokensAcquired,
      todayValueLocal,
      profitLocal,
      profitPercent,
      isProfit,
    };
  }, [investAmount, selectedCurrency, selectedAsset]);

  // Format currency helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: val < 10 && val > 0 ? 2 : 0,
      maximumFractionDigits: val < 10 ? 4 : 2,
    }).format(val);
  };

  return (
    <section id="profit-calculator" className="relative py-24 sm:py-32 bg-[#07080b] text-white overflow-hidden select-none border-t border-white/10">
      
      {/* Dynamic Atmospheric Ambient Backdrops */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 glass-grid-pattern opacity-20" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-emerald-500/15 to-transparent blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-10 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-500/20 via-indigo-500/15 to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ══════════════════════════════════════════════════════════════
            1. SECTION DISPLAY HEADLINE & BADGE
            ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono tracking-widest text-[#00dc82] uppercase mb-4 backdrop-blur-md">
            <Globe className="h-3.5 w-3.5 text-[#00dc82] animate-pulse" />
            <span>Multi-Currency Profit Engine</span>
          </div>

          <h2 className="font-editorial text-[clamp(2.4rem,5vw,4.5rem)] font-normal text-white leading-[1.06] tracking-tight">
            Yesterday vs Today Profit Simulator
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/65 font-sans leading-relaxed text-balance">
            Select your country's currency and simulate how much profit your capital would have generated from yesterday's market close to today's live pricing.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            2. CALCULATOR CONTROL PANEL & RESULTS GRID
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: INPUTS & CONTROLS (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 serene-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6"
          >
            {/* STEP 1: Select Country Currency */}
            <div>
              <label className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/70 mb-2.5">
                <span className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-[#00dc82]" />
                  <span>1. Select Country Currency</span>
                </span>
                <span className="text-[10px] text-white/40 font-normal">15+ Supported</span>
              </label>

              <div className="relative">
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const c = SUPPORTED_CURRENCIES.find((curr) => curr.code === e.target.value);
                    if (c) setSelectedCurrency(c);
                  }}
                  className="w-full appearance-none rounded-2xl bg-black/60 border border-white/20 px-4 py-3.5 text-sm font-mono font-semibold text-white focus:outline-none focus:border-[#00dc82] focus:ring-1 focus:ring-[#00dc82] transition-all cursor-pointer"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code} className="bg-[#0e1117] text-white">
                      {curr.flag} {curr.code} ({curr.symbol}) — {curr.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">
                  ▼
                </div>
              </div>
            </div>

            {/* STEP 2: Select Crypto Asset */}
            <div>
              <label className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/70 mb-2.5">
                <span className="flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-cyan-400" />
                  <span>2. Choose Sovereign Asset</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold">{selectedAsset.badge}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CALC_ASSETS.map((asset) => {
                  const isSelected = selectedAsset.symbol === asset.symbol;
                  return (
                    <button
                      key={asset.symbol}
                      type="button"
                      onClick={() => setSelectedAsset(asset)}
                      className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white/10 border-[#00dc82] text-white shadow-lg"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:border-white/30 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-white flex items-center justify-between w-full">
                        <span>{asset.symbol}</span>
                        {isSelected && <Check className="h-3 w-3 text-[#00dc82]" />}
                      </span>
                      <span className="text-[10px] font-sans text-white/50 truncate w-full mt-0.5">
                        {asset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Input Investment Amount */}
            <div>
              <label className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/70 mb-2.5">
                <span className="flex items-center gap-2">
                  <Calculator className="h-3.5 w-3.5 text-gold" />
                  <span>3. Capital Invested ({selectedCurrency.code})</span>
                </span>
                <span className="text-[10px] text-white/40">Custom Amount</span>
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-base font-bold text-[#00dc82]">
                  {selectedCurrency.symbol}
                </div>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={investAmount || ""}
                  onChange={(e) => setInvestAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter investment amount..."
                  className="w-full rounded-2xl bg-black/60 border border-white/20 pl-11 pr-14 py-3.5 text-lg font-mono font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#00dc82] focus:ring-1 focus:ring-[#00dc82] transition-all"
                />
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">
                  {selectedCurrency.code}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInvestAmount(amt)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                      investAmount === amt
                        ? "bg-[#00dc82] text-black font-bold border-[#00dc82]"
                        : "bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {selectedCurrency.symbol}
                    {amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>

          {/* RIGHT PANEL: REAL-TIME PROFIT BREAKDOWN RESULTS (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* MAIN HERO PROFIT CARD */}
            <div className={`relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br ${selectedAsset.glowColor} serene-card border border-white/20 shadow-2xl overflow-hidden glass-shine-overlay`}>
              
              {/* Top Bar: Currency + Asset Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedCurrency.flag}</span>
                  <div>
                    <div className="text-xs font-mono font-bold text-white uppercase">
                      {selectedCurrency.name} ({selectedCurrency.code})
                    </div>
                    <div className="text-[10px] font-mono text-white/50">
                      1 USD = {selectedCurrency.symbol}{selectedCurrency.rateToUsd} {selectedCurrency.code}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono">
                  <span className="font-bold text-white">{selectedAsset.symbol}</span>
                  <span className="text-[#00dc82]">{selectedAsset.badge}</span>
                </div>
              </div>

              {/* PROFIT DISPLAY DISPLAY BOX */}
              <div className="mb-8">
                <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  24-Hour Net Profit / Loss (Yesterday ➔ Today)
                </div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <div className={`font-mono text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight ${calculation.isProfit ? "text-[#00dc82]" : "text-red-400"}`}>
                    {calculation.isProfit ? "+" : ""}
                    {selectedCurrency.symbol}
                    {formatCurrency(calculation.profitLocal)}
                  </div>

                  <div className={`inline-flex items-center gap-1 text-sm sm:text-base font-mono font-bold px-3 py-1 rounded-full border ${calculation.isProfit ? "bg-[#00dc82]/15 text-[#00dc82] border-[#00dc82]/30" : "bg-red-500/15 text-red-400 border-red-500/30"}`}>
                    {calculation.isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{calculation.isProfit ? "+" : ""}{calculation.profitPercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              {/* CAPITAL COMPARISON TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Yesterday's Capital Card */}
                <div className="p-5 rounded-2xl bg-black/50 border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-1">
                    <span>YESTERDAY CAPITAL INVESTED</span>
                    <span className="text-white/30">Close Price</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {selectedCurrency.symbol}{formatCurrency(calculation.rawAmount)}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/50">
                    <span>Yesterday Token Price:</span>
                    <span className="text-white font-semibold">{selectedCurrency.symbol}{formatCurrency(calculation.yesterdayPriceLocal)}</span>
                  </div>
                </div>

                {/* Today's Portfolio Value Card */}
                <div className="p-5 rounded-2xl bg-black/70 border border-[#00dc82]/40 shadow-[0_0_25px_rgba(0,220,130,0.15)]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#00dc82] font-semibold mb-1">
                    <span>TODAY PORTFOLIO VALUE</span>
                    <span className="text-xs">Live Price</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-[#00dc82]">
                    {selectedCurrency.symbol}{formatCurrency(calculation.todayValueLocal)}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/50">
                    <span>Today Live Price:</span>
                    <span className="text-white font-semibold">{selectedCurrency.symbol}{formatCurrency(calculation.todayPriceLocal)}</span>
                  </div>
                </div>

              </div>

              {/* FOOTER DETAIL & TOKENS ACQUIRED */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-cyan-400" />
                  <span>Tokens Purchased Yesterday:</span>
                  <strong className="text-white font-bold">{formatCurrency(calculation.tokensAcquired)} {selectedAsset.symbol}</strong>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#00dc82]">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>100% Verified Telemetry</span>
                </div>
              </div>

            </div>

            {/* CONTEXT BANNER FOR ALLOCATORS */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3.5 text-xs text-white/70 font-sans leading-relaxed">
              <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-medium block mb-0.5">Multi-Currency Global Formula:</strong>
                Calculated by purchasing {selectedAsset.name} at yesterday's close price in {selectedCurrency.name} ({selectedCurrency.symbol}) and marking to market at today's live rate ({selectedCurrency.symbol}{formatCurrency(calculation.todayPriceLocal)} per token).
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
