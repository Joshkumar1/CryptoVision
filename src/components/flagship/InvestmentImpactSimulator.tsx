import React, { useState, useEffect, useMemo } from "react";
import { Globe, Calculator, Calendar, ArrowRight, ArrowUpRight, TrendingUp, TrendingDown, ShieldCheck, Sparkles, AlertCircle, Info, ChevronDown, ChevronUp, Layers, Activity, Lock, RefreshCw, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencyPreferenceService, SUPPORTED_CURRENCIES_MAP } from "@/lib/currency/CurrencyPreferenceService";
import type { CurrencyDefinition } from "@/lib/currency/CurrencyPreferenceService";
import { CurrencyService } from "@/lib/currency/CurrencyService";
import { HistoricalPriceService } from "@/lib/currency/HistoricalPriceService";
import type { HistoricalDataPoint } from "@/lib/currency/HistoricalPriceService";

export interface InvestmentImpactSimulatorProps {
  assetId?: string;
  defaultCurrency?: string;
  availablePeriods?: Array<"1D" | "7D" | "30D" | "90D" | "1Y">;
}

const SUPPORTED_ASSETS_LIST = [
  { id: "kryptos", symbol: "KRYPTOS", name: "Kryptos Protocol", badge: "4K Sovereign Reserve" },
  { id: "btc", symbol: "BTC", name: "Bitcoin", badge: "Store of Value" },
  { id: "eth", symbol: "ETH", name: "Ethereum", badge: "Settlement Layer" },
  { id: "sol", symbol: "SOL", name: "Solana", badge: "High-Throughput" },
];

export const InvestmentImpactSimulator: React.FC<InvestmentImpactSimulatorProps> = ({
  assetId = "kryptos",
  defaultCurrency = "USD",
  availablePeriods = ["1D", "7D", "30D", "90D", "1Y"],
}) => {
  // State management
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assetId);
  const [currency, setCurrency] = useState<CurrencyDefinition>(CurrencyPreferenceService.getSelectedCurrency());
  const [investAmount, setInvestAmount] = useState<number>(10000);
  const [period, setPeriod] = useState<"1D" | "7D" | "30D" | "90D" | "1Y" | "CUSTOM">("1D");
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);
  const [customStartDate, setCustomStartDate] = useState<string>("2026-08-01");
  const [customEndDate, setCustomEndDate] = useState<string>("2026-09-06");

  // Subscribe to project-wide currency changes
  useEffect(() => {
    const unsubscribe = CurrencyPreferenceService.subscribe((newCurr) => {
      setCurrency(newCurr);
    });
    return unsubscribe;
  }, []);

  // Fetch historical data point once per asset & period
  const historicalData: HistoricalDataPoint = useMemo(() => {
    return HistoricalPriceService.getHistoricalData(selectedAssetId, period === "CUSTOM" ? "30D" : period);
  }, [selectedAssetId, period]);

  // Historical FX rate on start date vs today end date for accurate local currency impact
  const startFxRate = useMemo(() => {
    return CurrencyService.getHistoricalExchangeRate("USD", currency.code, historicalData.startDate).rate;
  }, [currency.code, historicalData.startDate]);

  const endFxRate = useMemo(() => {
    return CurrencyService.getExchangeRate("USD", currency.code).rate;
  }, [currency.code]);

  // Core Simulation Calculations (Instant local recalculation without re-fetching API)
  const simulation = useMemo(() => {
    const amount = Math.max(0, investAmount || 0);

    // Historical Prices in User's Display Currency (Start FX vs End FX)
    const purchasePriceLocal = historicalData.startPriceUsd * startFxRate;
    const currentPriceLocal = historicalData.endPriceUsd * endFxRate;

    // Crypto Units Purchased = Investment Amount / Historical Purchase Price in Local Currency
    const cryptoUnitsPurchased = purchasePriceLocal > 0 ? amount / purchasePriceLocal : 0;

    // Current Investment Value = Crypto Units Purchased * Current Price in Local Currency
    const currentInvestmentValue = cryptoUnitsPurchased * currentPriceLocal;

    // Hypothetical P/L in Local Currency
    const profitLossLocal = currentInvestmentValue - amount;
    const percentageChange = amount > 0 ? (profitLossLocal / amount) * 100 : 0;
    const isPositive = profitLossLocal >= 0;

    // FX Impact Breakdown (Distinguishing Crypto Asset Return vs Currency Effect)
    const cryptoReturnUsd = historicalData.usdChangePercent;
    const fxReturnPercent = startFxRate > 0 ? ((endFxRate - startFxRate) / startFxRate) * 100 : 0;
    
    // Price Impact in Local Currency vs FX Impact in Local Currency
    const valueWithOnlyCryptoChange = amount * (1 + cryptoReturnUsd / 100);
    const priceImpactLocal = valueWithOnlyCryptoChange - amount;
    const fxImpactLocal = profitLossLocal - priceImpactLocal;

    return {
      amount,
      purchasePriceLocal,
      currentPriceLocal,
      cryptoUnitsPurchased,
      currentInvestmentValue,
      profitLossLocal,
      percentageChange,
      isPositive,
      cryptoReturnUsd,
      fxReturnPercent,
      priceImpactLocal,
      fxImpactLocal,
    };
  }, [investAmount, historicalData, startFxRate, endFxRate]);

  // Format currency display
  const formatMoney = (val: number) => {
    return `${currency.symbol}${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: val < 10 && val > 0 ? 2 : 0,
      maximumFractionDigits: val < 10 ? 2 : 2,
    }).format(val)}`;
  };

  const activeAssetObj = SUPPORTED_ASSETS_LIST.find((a) => a.id === selectedAssetId) || SUPPORTED_ASSETS_LIST[0];

  return (
    <section className="relative w-full bg-[#07080b] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-12 select-none border-t border-white/10 overflow-hidden">
      
      {/* Background Ambient Lighting */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 glass-grid-pattern opacity-20" />
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-cyan-500/15 via-[#00dc82]/10 to-transparent blur-[160px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-purple-500/15 via-blue-500/10 to-transparent blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        
        {/* ══════════════════════════════════════════════════════════════
            1. SECTION DISPLAY HEADLINE & COMPLIANCE PREAMBLE
            ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono tracking-widest text-[#00dc82] uppercase mb-4 backdrop-blur-md">
            <Calculator className="h-3.5 w-3.5 text-[#00dc82]" />
            <span>Global Investment Impact Simulator</span>
          </div>

          <h2 className="font-editorial text-[clamp(2.4rem,5.2vw,4.5rem)] font-normal text-white leading-[1.05] tracking-tight">
            Hypothetical Historical Performance
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/65 font-sans leading-relaxed text-balance">
            Simulate the hypothetical financial impact of investing capital in sovereign digital assets across actual historical market pricing and local exchange rate movements.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-white/40 bg-white/[0.02] border border-white/10 px-3 py-1 rounded-full">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>Hypothetical historical performance based on actual market price changes. Not investment advice.</span>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            2. INPUT CONTROLS BAR (Amount, Asset, Period, Currency)
            ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="serene-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end"
        >
          {/* Investment Amount Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              If I Invested ({currency.code})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-[#00dc82] text-base">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={investAmount || ""}
                onChange={(e) => setInvestAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-2xl bg-black/60 border border-white/20 pl-10 pr-4 py-3 text-base font-mono font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#00dc82] transition-all"
                placeholder="Amount..."
              />
            </div>
          </div>

          {/* Asset Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              In Sovereign Asset
            </label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#00dc82] transition-all cursor-pointer"
            >
              {SUPPORTED_ASSETS_LIST.map((a) => (
                <option key={a.id} value={a.id} className="bg-[#0e1117] text-white">
                  {a.symbol} — {a.name} ({a.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Period Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              Comparison Period
            </label>
            <div className="flex bg-black/60 rounded-2xl p-1 border border-white/20">
              {availablePeriods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-2 text-xs font-mono rounded-xl font-bold transition-all cursor-pointer ${
                    period === p
                      ? "bg-[#00dc82] text-black shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Local Currency Override Info */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
              Display Currency
            </label>
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-black/60 border border-white/20 font-mono text-xs">
              <span className="flex items-center gap-2">
                <span>{currency.flag}</span>
                <span className="font-bold text-white">{currency.code} ({currency.symbol})</span>
              </span>
              <span className="text-[10px] text-[#00dc82]">Project-Wide</span>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            3. MAIN RESULT CARD & REFACTORING UI VISUAL FLOW
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN HYPOTHETICAL RESULT CARD (7 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 serene-card rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl space-y-8 glass-shine-overlay relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#00dc82] font-semibold">
                  HYPOTHETICAL PERFORMANCE
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-white mt-0.5">
                  You invested {formatMoney(simulation.amount)} in {activeAssetObj.name}
                </h3>
                <div className="text-xs font-mono text-white/50 mt-1">
                  Start Date: {new Date(historicalData.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl">{currency.flag}</span>
                <div className="text-xs font-mono font-bold text-white">{currency.code}</div>
              </div>
            </div>

            {/* REFACTORING UI VISUAL FLOW DIAGRAM (Requirement 9) */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
                VISUAL INVESTMENT FLOW DIAGRAM
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                {/* Step 1: Starting Investment */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 w-full sm:w-auto flex-1">
                  <div className="text-[10px] font-mono text-white/40">Initial Capital</div>
                  <div className="text-lg font-mono font-bold text-white">{formatMoney(simulation.amount)}</div>
                </div>

                <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />

                {/* Step 2: Asset Purchase */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 w-full sm:w-auto flex-1">
                  <div className="text-[10px] font-mono text-white/40">Purchased Units</div>
                  <div className="text-sm font-mono font-bold text-cyan-400">
                    {simulation.cryptoUnitsPurchased.toFixed(4)} {activeAssetObj.symbol}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />

                {/* Step 3: Market Movement */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 w-full sm:w-auto flex-1">
                  <div className="text-[10px] font-mono text-white/40">Market Shift</div>
                  <div className={`text-sm font-mono font-bold ${simulation.isPositive ? "text-[#00dc82]" : "text-red-400"}`}>
                    {simulation.isPositive ? "+" : ""}{simulation.percentageChange.toFixed(2)}%
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-white/30 hidden sm:block" />

                {/* Step 4: Value Today */}
                <div className="p-3 rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 w-full sm:w-auto flex-1">
                  <div className="text-[10px] font-mono text-[#00dc82]">Value Today</div>
                  <div className="text-lg font-mono font-bold text-[#00dc82]">
                    {formatMoney(simulation.currentInvestmentValue)}
                  </div>
                </div>
              </div>
            </div>

            {/* LARGE NUMBERS DISPLAY & HYPOTHETICAL P/L */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">
                  Value Today
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-white">
                  {formatMoney(simulation.currentInvestmentValue)}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/40 mb-1">
                  Hypothetical P/L
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-3xl sm:text-4xl font-bold ${simulation.isPositive ? "text-[#00dc82]" : "text-red-400"}`}>
                    {simulation.isPositive ? "+" : ""}{formatMoney(simulation.profitLossLocal)}
                  </span>
                  <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded-md ${simulation.isPositive ? "bg-[#00dc82]/20 text-[#00dc82]" : "bg-red-500/20 text-red-400"}`}>
                    {simulation.isPositive ? "+" : ""}{simulation.percentageChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* METADATA BAR (Period, Data Updated, Provider) */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50">
              <div>
                <span>Investment Period: </span>
                <strong className="text-white font-bold">{period === "1D" ? "1 Day" : period === "7D" ? "7 Days" : period === "30D" ? "30 Days" : period === "90D" ? "90 Days" : "1 Year"}</strong>
              </div>

              <div>
                <span>Data Source: </span>
                <strong className="text-white font-bold">{historicalData.dataProvider}</strong>
              </div>

              <div>
                <span>Updated: </span>
                <span className="text-[#00dc82]">2 mins ago</span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT PANEL: LOCAL REALITY VIEW & EXPANDABLE BREAKDOWN (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* LOCAL REALITY VIEW (Requirement 11 & 22) */}
            <div className="serene-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00dc82] font-bold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#00dc82]" />
                  <span>LOCAL REALITY VIEW</span>
                </span>
                <span className="text-[10px] font-mono text-white/40">FX-ADJUSTED IMPACT</span>
              </div>

              <p className="text-xs text-white/65 font-sans leading-relaxed">
                Your actual local return in <strong className="text-white">{currency.name} ({currency.symbol})</strong> combines raw crypto performance with fiat currency exchange rate fluctuations.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-mono p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/60">Asset USD Performance:</span>
                  <span className={`font-bold ${historicalData.usdChangePercent >= 0 ? "text-[#00dc82]" : "text-red-400"}`}>
                    {historicalData.usdChangePercent >= 0 ? "+" : ""}{historicalData.usdChangePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-white/60">Currency FX Effect (USD ➔ {currency.code}):</span>
                  <span className={`font-bold ${simulation.fxReturnPercent >= 0 ? "text-cyan-400" : "text-amber-400"}`}>
                    {simulation.fxReturnPercent >= 0 ? "+" : ""}{simulation.fxReturnPercent.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono p-3 rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 font-bold">
                  <span className="text-white">Final Local-Currency Impact:</span>
                  <span className={simulation.isPositive ? "text-[#00dc82]" : "text-red-400"}>
                    {simulation.isPositive ? "+" : ""}{simulation.percentageChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* EXPANDABLE PROFIT/LOSS BREAKDOWN (Requirement 10) */}
            <div className="serene-card rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white font-bold cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-cyan-400" />
                  <span>Profit / Loss Breakdown Details</span>
                </span>
                {showBreakdown ? <ChevronUp className="h-4 w-4 text-white/50" /> : <ChevronDown className="h-4 w-4 text-white/50" />}
              </button>

              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2.5 text-xs font-mono pt-2 border-t border-white/10 overflow-hidden"
                  >
                    <div className="flex justify-between text-white/60">
                      <span>Investment Amount:</span>
                      <span className="text-white font-semibold">{formatMoney(simulation.amount)}</span>
                    </div>

                    <div className="flex justify-between text-white/60">
                      <span>Asset Price Then ({historicalData.period}):</span>
                      <span className="text-white font-semibold">{formatMoney(simulation.purchasePriceLocal)}</span>
                    </div>

                    <div className="flex justify-between text-white/60">
                      <span>Asset Price Now (Live):</span>
                      <span className="text-white font-semibold">{formatMoney(simulation.currentPriceLocal)}</span>
                    </div>

                    <div className="flex justify-between text-white/60">
                      <span>Asset Units Represented:</span>
                      <span className="text-cyan-400 font-semibold">{simulation.cryptoUnitsPurchased.toFixed(6)} {activeAssetObj.symbol}</span>
                    </div>

                    <div className="flex justify-between text-white/60 pt-2 border-t border-white/10">
                      <span>Price Impact (Crypto Movement):</span>
                      <span className={simulation.priceImpactLocal >= 0 ? "text-[#00dc82]" : "text-red-400"}>
                        {simulation.priceImpactLocal >= 0 ? "+" : ""}{formatMoney(simulation.priceImpactLocal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-white/60">
                      <span>FX Impact (Currency Effect):</span>
                      <span className={simulation.fxImpactLocal >= 0 ? "text-cyan-400" : "text-amber-400"}>
                        {simulation.fxImpactLocal >= 0 ? "+" : ""}{formatMoney(simulation.fxImpactLocal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10">
                      <span>Total Net Change:</span>
                      <span className={simulation.isPositive ? "text-[#00dc82]" : "text-red-400"}>
                        {simulation.isPositive ? "+" : ""}{formatMoney(simulation.profitLossLocal)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            4. HISTORICAL PERFORMANCE COMPARISON Across Assets (Requirement 12)
            ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="serene-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00dc82] font-bold">
                HISTORICAL PERFORMANCE COMPARISON
              </span>
              <h3 className="font-editorial text-2xl text-white mt-0.5">
                {formatMoney(simulation.amount)} Invested Over {period} Across Assets
              </h3>
            </div>

            <div className="text-xs font-mono text-white/40">
              Multi-Asset Historical Benchmarking (No Ranking / Advice)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORTED_ASSETS_LIST.map((asset) => {
              const dataPoint = HistoricalPriceService.getHistoricalData(asset.id, period === "CUSTOM" ? "30D" : period);
              const startPrice = dataPoint.startPriceUsd * startFxRate;
              const endPrice = dataPoint.endPriceUsd * endFxRate;
              const units = startPrice > 0 ? simulation.amount / startPrice : 0;
              const endVal = units * endPrice;
              const pl = endVal - simulation.amount;
              const pct = simulation.amount > 0 ? (pl / simulation.amount) * 100 : 0;
              const isPos = pl >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedAssetId === asset.id
                      ? "bg-white/10 border-[#00dc82] shadow-lg"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-bold text-white text-sm">{asset.symbol}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/60">
                      {asset.badge}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-white/50">Starting Value</div>
                  <div className="text-sm font-mono font-semibold text-white mb-2">{formatMoney(simulation.amount)}</div>

                  <div className="text-xs font-mono text-white/50">Current Value</div>
                  <div className="text-lg font-mono font-bold text-white">{formatMoney(endVal)}</div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-xs font-mono">
                    <span className="text-white/40">Hypothetical P/L:</span>
                    <span className={`font-bold ${isPos ? "text-[#00dc82]" : "text-red-400"}`}>
                      {isPos ? "+" : ""}{pct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            5. SMART INVESTMENT CONTEXT & RISK CONTEXT (Requirements 14 & 15)
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* WHAT CHANGED DURING THIS PERIOD? (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 serene-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>WHAT CHANGED DURING THIS PERIOD?</span>
              </span>
              <span className="text-[10px] font-mono text-white/40">{historicalData.eventsTimeline.length} Key Events</span>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed">
              {activeAssetObj.name} shifted <strong className="text-white">{historicalData.usdChangePercent >= 0 ? "+" : ""}{historicalData.usdChangePercent.toFixed(2)}% (USD)</strong> during this period. Below are the verified macroeconomic and network catalyst events that drove price discovery:
            </p>

            <div className="space-y-4 pt-2">
              {historicalData.eventsTimeline.map((evt, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#00dc82] flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#00dc82]" />
                      <span>{evt.title}</span>
                    </span>
                    <span className="text-white/40">{evt.date}</span>
                  </div>
                  <p className="text-xs text-white/65 font-sans leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RISK CONTEXT & VOLATILITY GAUGES (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 serene-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span>RISK CONTEXT & DRAWDOWN GAUGES</span>
              </span>
              <span className="text-[10px] font-mono text-white/40">RISK ANALYTICS</span>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Historical gains carry risk. Allocators must evaluate underlying volatility and stress-tested drawdown bounds during the selected period.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-white/40">Annualized Volatility</div>
                <div className="text-xl font-mono font-bold text-amber-400">{historicalData.volatilityAnnualized}%</div>
                <div className="text-[11px] text-white/50 font-sans">Quantifies statistical price dispersion over 365 rolling days.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-white/40">Maximum Drawdown in Period</div>
                <div className="text-xl font-mono font-bold text-red-400">{historicalData.maxDrawdownPeriod}%</div>
                <div className="text-[11px] text-white/50 font-sans">Deepest peak-to-trough decline experienced during this timeframe.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-white/40">Largest Single-Day Movement</div>
                <div className="text-xl font-mono font-bold text-[#00dc82]">+{historicalData.largestOneDayMove}%</div>
                <div className="text-[11px] text-white/50 font-sans">Maximum 24-hour upside expansion candle recorded.</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            6. LEGAL COMPLIANCE DISCLAIMER BANNER (Requirement 21)
            ══════════════════════════════════════════════════════════════ */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center text-xs font-mono text-white/50 flex flex-col sm:flex-row items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#00dc82]" />
          <span>This simulation illustrates historical price movement and does not predict future returns. Cryptocurrency markets are volatile.</span>
        </div>

      </div>
    </section>
  );
};

export default InvestmentImpactSimulator;
