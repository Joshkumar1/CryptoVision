import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart as ChartIcon, Calculator, Activity, ArrowUpRight, ArrowDownRight,
  Sparkles, ShieldAlert, GitCompareArrows, RefreshCw, Calendar, Globe, AlertCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AssetIntelligenceService } from "@/lib/intelligence/AssetIntelligenceService";
import { CurrencyPreferenceService } from "@/lib/currency/CurrencyPreferenceService";
import { CurrencyService } from "@/lib/currency/CurrencyService";
import { HistoricalPriceService } from "@/lib/currency/HistoricalPriceService";
import { ExpertiseSelector } from "@/components/shared/ExpertiseSelector";
import { useExpertiseStore } from "@/stores/expertiseStore";
import { cn } from "@/lib/utils";

export const AnalyzeModulePage: React.FC = () => {
  const { assetId = "bitcoin" } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { level } = useExpertiseStore();

  const asset = AssetIntelligenceService.getAssetIntelligence(assetId);
  const allAssets = AssetIntelligenceService.getAllAssets();
  const currency = CurrencyPreferenceService.getSelectedCurrency();

  // Investment Simulator State
  const [investAmount, setInvestAmount] = useState<number>(10000);
  const [selectedPeriod, setSelectedPeriod] = useState<"1D" | "7D" | "30D" | "6M" | "1Y">("1Y");

  // Multi-Asset Comparison Selection
  const [compareAssetId, setCompareAssetId] = useState<string>("ethereum");
  const compareAsset = AssetIntelligenceService.getAssetIntelligence(compareAssetId);

  // Calculate Investment Simulator ROI
  const simCalculation = React.useMemo(() => {
    let multiplier = 1.862; // Default 1Y return +86.2%
    let periodLabel = "1 Year Ago";

    switch (selectedPeriod) {
      case "1D":
        multiplier = 1 + asset.market.priceChange24h / 100;
        periodLabel = "Yesterday";
        break;
      case "7D":
        multiplier = 1 + asset.market.priceChange7d / 100;
        periodLabel = "7 Days Ago";
        break;
      case "30D":
        multiplier = 1 + asset.market.priceChange30d / 100;
        periodLabel = "30 Days Ago";
        break;
      case "6M":
        multiplier = 1 + asset.market.priceChange90d * 2 / 100;
        periodLabel = "6 Months Ago";
        break;
      case "1Y":
        multiplier = 1 + asset.market.priceChange1y / 100;
        periodLabel = "1 Year Ago";
        break;
    }

    const initialUsd = investAmount / currency.rateToUsd;
    const historicalPriceUsd = asset.market.priceUsd / multiplier;
    const quantityReceived = initialUsd / historicalPriceUsd;
    const currentValUsd = quantityReceived * asset.market.priceUsd;
    const currentValLocal = currentValUsd * currency.rateToUsd;
    const profitLocal = currentValLocal - investAmount;
    const roiPercentage = ((multiplier - 1) * 100);

    return {
      periodLabel,
      initialLocal: investAmount,
      historicalPriceLocal: historicalPriceUsd * currency.rateToUsd,
      currentPriceLocal: asset.market.priceUsd * currency.rateToUsd,
      quantityReceived,
      currentValLocal,
      profitLocal,
      roiPercentage,
    };
  }, [investAmount, selectedPeriod, asset, currency]);

  // Historical Chart mock data
  const chartPoints = [
    { label: "Jan", price: asset.market.priceUsd * 0.55 },
    { label: "Mar", price: asset.market.priceUsd * 0.65 },
    { label: "May", price: asset.market.priceUsd * 0.82 },
    { label: "Jul", price: asset.market.priceUsd * 0.74 },
    { label: "Sep", price: asset.market.priceUsd * 1.0 },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* ── MODULE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-cyan-400/15 text-cyan-400 border border-cyan-400/30">
              <ChartIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              MODULE 3 — QUANTITATIVE DATA EVALUATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            〽 ANALYZE QUANTITATIVE WORKSPACE
          </h1>
          <p className="text-xs font-sans text-white/60 mt-1 max-w-xl">
            Answers: <strong className="text-white">"What does the historical and current data tell me?"</strong> Quantitative evaluation workspace with performance horizons, historical investment simulations, risk metrics, and multi-asset comparisons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExpertiseSelector />
        </div>
      </div>

      {/* ── ASSET SELECTOR & CROSS-MODULE NAVIGATION ── */}
      <div className="p-4 rounded-2xl bg-[#0a0d16] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={asset.identity.logo} alt={asset.identity.name} className="h-8 w-8 rounded-full" />
          <span className="text-base font-bold font-mono text-white">{asset.identity.name} ({asset.identity.symbol})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/40">Select Asset:</span>
          <select
            value={asset.identity.id}
            onChange={(e) => navigate(`/analyze/${e.target.value}`)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-white focus:outline-none"
          >
            {allAssets.map((ast) => (
              <option key={ast.identity.id} value={ast.identity.id} className="bg-[#0a0d16]">
                {ast.identity.name} ({ast.identity.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/explore" className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-white/80">
            ✦ Explore Market
          </Link>
          <Link to={`/research/${asset.identity.id}`} className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-mono font-bold">
            🔥 Research Asset
          </Link>
        </div>
      </div>

      {/* ── SECTION A — PERFORMANCE ANALYSIS ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" /> SECTION A — MULTI-HORIZON PERFORMANCE ANALYSIS
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          {[
            { label: "1H", val: asset.market.priceChange1h },
            { label: "24H", val: asset.market.priceChange24h },
            { label: "7D", val: asset.market.priceChange7d },
            { label: "30D", val: asset.market.priceChange30d },
            { label: "90D", val: asset.market.priceChange90d },
            { label: "1Y", val: asset.market.priceChange1y },
            { label: "All-Time", val: asset.market.priceChangeAllTime },
          ].map((item) => {
            const pos = item.val >= 0;
            return (
              <div key={item.label} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] text-white/40 block uppercase">{item.label} Return</span>
                <span className={cn("font-bold text-sm block", pos ? "text-[#00dc82]" : "text-rose-400")}>
                  {pos ? "+" : ""}{item.val.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION B — HISTORICAL INVESTMENT SIMULATOR ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-amber-400/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold font-mono text-amber-400">
            <Calculator className="h-4 w-4" />
            <span>SECTION B — INTERACTIVE HISTORICAL INVESTMENT SIMULATOR</span>
          </div>
          <span className="text-[10px] font-mono text-white/50 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            Hypothetical Historical Performance Only
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1">
                Investment Amount ({currency.symbol} {currency.code})
              </label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-2">Historical Entry Date Preset</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "1D", label: "Yesterday" },
                  { id: "7D", label: "7 Days Ago" },
                  { id: "30D", label: "30 Days Ago" },
                  { id: "6M", label: "6 Months Ago" },
                  { id: "1Y", label: "1 Year Ago" },
                ].map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setSelectedPeriod(period.id as any)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer",
                      selectedPeriod === period.id
                        ? "bg-amber-400 text-black font-bold"
                        : "bg-white/[0.05] text-white/60 hover:text-white"
                    )}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-[10px] font-mono text-amber-300/80 leading-relaxed">
              <strong>Notice:</strong> This simulator demonstrates historical asset price movement based on past market data. It does NOT predict future performance or constitute investment advice.
            </div>
          </div>

          {/* Output Dashboard */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-white/50">Initial Investment</span>
              <span className="text-white font-bold">{CurrencyService.formatValue(simCalculation.initialLocal, currency)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/50">{asset.identity.symbol} Price ({simCalculation.periodLabel})</span>
              <span className="text-white/80">{CurrencyService.formatValue(simCalculation.historicalPriceLocal, currency)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/50">Asset Quantity Received</span>
              <span className="text-cyan-400 font-bold">{simCalculation.quantityReceived.toFixed(4)} {asset.identity.symbol}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/50">Current Asset Price</span>
              <span className="text-white/80">{CurrencyService.formatValue(simCalculation.currentPriceLocal, currency)}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-white/70 font-bold">Current Investment Value</span>
              <span className="text-white text-base font-bold">{CurrencyService.formatValue(simCalculation.currentValLocal, currency)}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-white/70 font-bold">Absolute Profit / Loss</span>
              <span className={cn("text-base font-bold", simCalculation.profitLocal >= 0 ? "text-[#00dc82]" : "text-rose-400")}>
                {simCalculation.profitLocal >= 0 ? "+" : ""}{CurrencyService.formatValue(simCalculation.profitLocal, currency)} ({simCalculation.roiPercentage >= 0 ? "+" : ""}{simCalculation.roiPercentage.toFixed(2)}% ROI)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION C — QUANTITATIVE RISK METRICS ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-400" /> SECTION C — QUANTITATIVE RISK METRICS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block uppercase">30D Volatility</span>
            <span className="text-base font-bold text-amber-400 block">42.8% (Moderate)</span>
            <p className="text-[10px] text-white/60 font-sans mt-1">Experiences larger-than-average price movements compared to legacy indexes.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block uppercase">Max Historical Drawdown</span>
            <span className="text-base font-bold text-rose-400 block">
              -{asset.historical.drawdownPeriods[0]?.dropPercentage || 77.5}%
            </span>
            <p className="text-[10px] text-white/60 font-sans mt-1">Peak-to-trough decline experienced during major market corrections.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block uppercase">Sharpe Ratio (1Y)</span>
            <span className="text-base font-bold text-[#00dc82] block">2.45</span>
            <p className="text-[10px] text-white/60 font-sans mt-1">Risk-adjusted return ratio measuring excess performance per unit of risk.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] text-white/40 block uppercase">Downside Risk Exposure</span>
            <span className="text-base font-bold text-cyan-400 block">Low-Moderate</span>
            <p className="text-[10px] text-white/60 font-sans mt-1">High liquidity buffers mitigate severe flash crash contagion risk.</p>
          </div>
        </div>
      </div>

      {/* ── SECTION D — HISTORICAL ANALYSIS CHART ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <ChartIcon className="h-4 w-4 text-[#00dc82]" /> SECTION D — HISTORICAL PRICE TRAJECTORY
          </h3>
        </div>

        <div className="h-[280px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00dc82" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00dc82" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="label" stroke="#ffffff40" tickLine={false} />
              <YAxis stroke="#ffffff40" tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#0b0e17", borderColor: "#ffffff20", borderRadius: 12 }} />
              <Area type="monotone" dataKey="price" stroke="#00dc82" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SECTION E — MULTI-ASSET COMPARISON WORKSPACE ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <GitCompareArrows className="h-4 w-4 text-purple-400" /> SECTION E — MULTI-ASSET COMPARISON WORKSPACE
          </h3>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white/40">Compare against:</span>
            <select
              value={compareAssetId}
              onChange={(e) => setCompareAssetId(e.target.value)}
              className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none"
            >
              {allAssets.filter((a) => a.identity.id !== asset.identity.id).map((ast) => (
                <option key={ast.identity.id} value={ast.identity.id} className="bg-[#090c14]">
                  {ast.identity.name} ({ast.identity.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                <th className="py-2.5">Dimension</th>
                <th className="py-2.5 text-amber-400">{asset.identity.name} ({asset.identity.symbol})</th>
                <th className="py-2.5 text-cyan-400">{compareAsset.identity.name} ({compareAsset.identity.symbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              <tr>
                <td className="py-3 font-bold text-white/50">Market Capitalization</td>
                <td className="py-3 text-white font-bold">{CurrencyService.formatValue(asset.market.marketCapUsd, currency)}</td>
                <td className="py-3 text-white font-bold">{CurrencyService.formatValue(compareAsset.market.marketCapUsd, currency)}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white/50">1-Year Performance</td>
                <td className="py-3 text-[#00dc82] font-bold">+{asset.market.priceChange1y}%</td>
                <td className="py-3 text-[#00dc82] font-bold">+{compareAsset.market.priceChange1y}%</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white/50">24h Trading Volume</td>
                <td className="py-3">{CurrencyService.formatValue(asset.market.volume24hUsd, currency)}</td>
                <td className="py-3">{CurrencyService.formatValue(compareAsset.market.volume24hUsd, currency)}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white/50">Market Risk Classification</td>
                <td className="py-3">{asset.risk.marketRisk.level} Risk</td>
                <td className="py-3">{compareAsset.risk.marketRisk.level} Risk</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-white/50">4-Week Dev Commits</td>
                <td className="py-3">{asset.fundamentals.developerActivity.commits4Weeks} Commits</td>
                <td className="py-3">{compareAsset.fundamentals.developerActivity.commits4Weeks} Commits</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION F — PROGRESSIVE TECHNICAL ANALYSIS ── */}
      {level === "ADVANCED" && (
        <div className="p-6 rounded-3xl bg-[#090c14] border border-cyan-400/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span>SECTION F — ADVANCED TECHNICAL ANALYSIS (RSI / MACD / MA)</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
              Advanced Mode Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block mb-1">RSI (14-Period)</span>
              <span className="text-lg font-bold text-amber-400">62.4 — Neutral Bullish</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block mb-1">MACD Crossover</span>
              <span className="text-lg font-bold text-[#00dc82]">Positive Histogram (+14.2)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-white/40 block mb-1">200-Day Moving Average</span>
              <span className="text-lg font-bold text-cyan-400">Above MA200 (Bullish Support)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
