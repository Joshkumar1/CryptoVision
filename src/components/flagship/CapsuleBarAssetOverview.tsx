import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MonthlyDataPoint {
  month: string;
  value: number; // Value in thousands (e.g. 55 = 55k)
  displayValue: string;
  inflow: string;
  volume: string;
}

export interface AssetOverviewDataset {
  symbol: string;
  name: string;
  price: string;
  gain30d: string;
  loss30d: string;
  maxValue: number; // e.g. 200
  dataPoints: MonthlyDataPoint[];
  detailsRoute: string;
}

const DEFAULT_ASSETS: AssetOverviewDataset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$57,860.54",
    gain30d: "+$5,000 ↑",
    loss30d: "-$2,000 ↓",
    maxValue: 200,
    detailsRoute: "/market?asset=btc",
    dataPoints: [
      { month: "Jan", value: 55, displayValue: "$55,200", inflow: "+$12.4M", volume: "42.1k BTC" },
      { month: "Feb", value: 30, displayValue: "$30,400", inflow: "+$8.2M", volume: "28.5k BTC" },
      { month: "Mar", value: 110, displayValue: "$110,800", inflow: "+$38.6M", volume: "84.2k BTC" },
      { month: "Apr", value: 70, displayValue: "$70,100", inflow: "+$19.4M", volume: "52.8k BTC" },
      { month: "May", value: 55, displayValue: "$55,600", inflow: "+$14.1M", volume: "41.6k BTC" },
      { month: "Jun", value: 65, displayValue: "$65,900", inflow: "+$18.8M", volume: "49.3k BTC" },
      { month: "Jul", value: 55, displayValue: "$55,000", inflow: "+$13.5M", volume: "39.8k BTC" },
    ],
  },
  {
    symbol: "KRYPTOS",
    name: "Kryptos Protocol",
    price: "$104,250.00",
    gain30d: "+$12,400 ↑",
    loss30d: "-$3,150 ↓",
    maxValue: 200,
    detailsRoute: "/market?asset=kryptos",
    dataPoints: [
      { month: "Jan", value: 60, displayValue: "$60,500", inflow: "+$24.2M", volume: "18.4k KRYPTOS" },
      { month: "Feb", value: 45, displayValue: "$45,200", inflow: "+$16.8M", volume: "14.1k KRYPTOS" },
      { month: "Mar", value: 140, displayValue: "$140,000", inflow: "+$62.4M", volume: "42.9k KRYPTOS" },
      { month: "Apr", value: 95, displayValue: "$95,800", inflow: "+$34.1M", volume: "26.3k KRYPTOS" },
      { month: "May", value: 70, displayValue: "$70,400", inflow: "+$22.7M", volume: "19.5k KRYPTOS" },
      { month: "Jun", value: 90, displayValue: "$90,100", inflow: "+$31.8M", volume: "25.7k KRYPTOS" },
      { month: "Jul", value: 80, displayValue: "$80,200", inflow: "+$28.5M", volume: "22.1k KRYPTOS" },
    ],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,420.50",
    gain30d: "+$420 ↑",
    loss30d: "-$180 ↓",
    maxValue: 200,
    detailsRoute: "/market?asset=eth",
    dataPoints: [
      { month: "Jan", value: 50, displayValue: "$2,850", inflow: "+$18.5M", volume: "310k ETH" },
      { month: "Feb", value: 35, displayValue: "$2,420", inflow: "+$9.4M", volume: "240k ETH" },
      { month: "Mar", value: 125, displayValue: "$3,950", inflow: "+$44.2M", volume: "580k ETH" },
      { month: "Apr", value: 80, displayValue: "$3,200", inflow: "+$24.1M", volume: "390k ETH" },
      { month: "May", value: 60, displayValue: "$2,980", inflow: "+$16.8M", volume: "310k ETH" },
      { month: "Jun", value: 75, displayValue: "$3,350", inflow: "+$22.5M", volume: "360k ETH" },
      { month: "Jul", value: 65, displayValue: "$3,420", inflow: "+$19.1M", volume: "330k ETH" },
    ],
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$218.40",
    gain30d: "+$38 ↑",
    loss30d: "-$14 ↓",
    maxValue: 200,
    detailsRoute: "/market?asset=sol",
    dataPoints: [
      { month: "Jan", value: 45, displayValue: "$165", inflow: "+$14.2M", volume: "4.2M SOL" },
      { month: "Feb", value: 25, displayValue: "$130", inflow: "+$7.8M", volume: "3.1M SOL" },
      { month: "Mar", value: 135, displayValue: "$245", inflow: "+$52.1M", volume: "9.8M SOL" },
      { month: "Apr", value: 85, displayValue: "$195", inflow: "+$28.4M", volume: "6.4M SOL" },
      { month: "May", value: 50, displayValue: "$172", inflow: "+$15.9M", volume: "4.8M SOL" },
      { month: "Jun", value: 70, displayValue: "$205", inflow: "+$23.6M", volume: "5.7M SOL" },
      { month: "Jul", value: 60, displayValue: "$218", inflow: "+$20.4M", volume: "5.1M SOL" },
    ],
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: "$42.15",
    gain30d: "+$6.40 ↑",
    loss30d: "-$2.80 ↓",
    maxValue: 200,
    detailsRoute: "/market?asset=avax",
    dataPoints: [
      { month: "Jan", value: 38, displayValue: "$34.20", inflow: "+$6.2M", volume: "840k AVAX" },
      { month: "Feb", value: 22, displayValue: "$26.80", inflow: "+$3.4M", volume: "610k AVAX" },
      { month: "Mar", value: 115, displayValue: "$54.00", inflow: "+$28.9M", volume: "1.9M AVAX" },
      { month: "Apr", value: 68, displayValue: "$38.50", inflow: "+$14.2M", volume: "1.1M AVAX" },
      { month: "May", value: 42, displayValue: "$32.10", inflow: "+$8.6M", volume: "790k AVAX" },
      { month: "Jun", value: 58, displayValue: "$39.40", inflow: "+$12.8M", volume: "950k AVAX" },
      { month: "Jul", value: 52, displayValue: "$42.15", inflow: "+$11.3M", volume: "890k AVAX" },
    ],
  },
];

interface CapsuleBarAssetOverviewProps {
  initialAssetSymbol?: string;
  showAssetTabs?: boolean;
  className?: string;
}

export const CapsuleBarAssetOverview: React.FC<CapsuleBarAssetOverviewProps> = ({
  initialAssetSymbol = "BTC",
  showAssetTabs = true,
  className = "",
}) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetOverviewDataset>(
    DEFAULT_ASSETS.find((a) => a.symbol.toUpperCase() === initialAssetSymbol.toUpperCase()) || DEFAULT_ASSETS[0]
  );
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyDataPoint | null>(null);

  // Sync state if initialAssetSymbol changes from parent
  React.useEffect(() => {
    const found = DEFAULT_ASSETS.find((a) => a.symbol.toUpperCase() === initialAssetSymbol.toUpperCase());
    if (found) {
      setSelectedAsset(found);
    }
  }, [initialAssetSymbol]);

  // Y-axis increments (matching reference: 200k, 100k, 50k, 10k, 0)
  const yAxisTicks = [
    { label: "200k", percent: 100 },
    { label: "100k", percent: 50 },
    { label: "50k", percent: 25 },
    { label: "10k", percent: 5 },
    { label: "0", percent: 0 },
  ];

  return (
    <div
      className={`relative w-full max-w-xl mx-auto rounded-[2.2rem] sm:rounded-[2.6rem] bg-[#171719] text-white p-6 sm:p-8 md:p-10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] border border-white/[0.08] select-none ${className}`}
    >
      
      {/* ══════════════════════════════════════════════════════════════
          1. HEADER ROW: "Asset Overview" & "View details"
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-sans font-medium text-white/60 tracking-tight">
            Asset Overview
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.06]">
            {selectedAsset.symbol}
          </span>
        </div>

        <Link
          to={selectedAsset.detailsRoute}
          className="group inline-flex items-center gap-1 text-xs sm:text-sm font-sans text-white/40 hover:text-white transition-colors"
        >
          <span>View details</span>
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. METRIC VALUE & DUAL 30-DAY DIRECTIONAL INDICATORS
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 sm:mb-10">
        
        {/* Main Price Headline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAsset.price}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white tracking-tight"
          >
            {selectedAsset.price}
          </motion.div>
        </AnimatePresence>

        {/* Directional 30-Day Delta Columns (Matching UI Screenshot) */}
        <div className="flex items-center gap-5 sm:gap-6 flex-shrink-0">
          
          {/* Positive Delta: +$5,000 ↑ vs last 30 days */}
          <div className="flex flex-col items-start">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-[#10b981] flex items-center gap-1 leading-tight">
              <span>{selectedAsset.gain30d}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans text-white/40 mt-0.5">
              vs last 30 days
            </span>
          </div>

          {/* Negative Delta: -$2,000 ↓ vs last 30 days */}
          <div className="flex flex-col items-start">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-[#f87171] flex items-center gap-1 leading-tight">
              <span>{selectedAsset.loss30d}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans text-white/40 mt-0.5">
              vs last 30 days
            </span>
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. CAPSULE BAR CHART WITH DUAL BACKGROUND TRACK & SUNSET FILL
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative pt-2 pb-2">
        
        {/* Chart Canvas Area */}
        <div className="relative h-56 sm:h-64 flex items-end pl-10 sm:pl-12 pr-1">
          
          {/* Y-Axis Guidelines & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2">
            {yAxisTicks.map((tick) => (
              <div key={tick.label} className="relative flex items-center w-full">
                <span className="absolute -left-10 sm:-left-12 text-[11px] font-sans text-white/35 w-8 sm:w-10 text-right pr-2">
                  {tick.label}
                </span>
                <div className="w-full h-px border-b border-dashed border-white/[0.07]" />
              </div>
            ))}
          </div>

          {/* 7 Vertical Capsule Columns */}
          <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 sm:gap-3.5 md:gap-4 px-1">
            {selectedAsset.dataPoints.map((item, idx) => {
              // Calculate fill height percentage (value / 200 * 100)
              const heightPercent = Math.min(Math.max((item.value / selectedAsset.maxValue) * 100, 8), 98);
              const isHovered = hoveredMonth?.month === item.month;

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredMonth(item)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="group relative flex-1 h-full flex flex-col items-center justify-end cursor-pointer"
                >
                  
                  {/* Floating Tooltip upon Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute -top-12 z-30 pointer-events-none px-2.5 py-1.5 rounded-xl bg-black/95 border border-white/20 text-[10px] font-mono text-white shadow-2xl whitespace-nowrap"
                      >
                        <div className="font-bold text-[#ff7a18]">{item.displayValue}</div>
                        <div className="text-[9px] text-white/60">Inflow: {item.inflow}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Outer Dark Translucent Capsule Track */}
                  <div className="w-full max-w-[34px] sm:max-w-[42px] md:max-w-[46px] h-full rounded-2xl bg-[#232326] border border-white/[0.04] overflow-hidden relative flex flex-col justify-end p-0 shadow-inner group-hover:border-white/20 transition-all duration-300">
                    
                    {/* Top Subtle Track Specular Shimmer */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

                    {/* Sunset-to-Magenta Animated Filled Capsule Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{
                        duration: 0.75,
                        delay: idx * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        background: "linear-gradient(180deg, #d946ef 0%, #ff5277 50%, #f97316 100%)",
                      }}
                      className="w-full rounded-2xl relative shadow-[0_0_20px_rgba(249,115,22,0.3)] group-hover:brightness-110 group-hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-300"
                    >
                      {/* Top Soft Rounded Inner Highlight */}
                      <div className="absolute top-1 inset-x-1 h-1.5 rounded-full bg-white/40 blur-[0.5px]" />
                    </motion.div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* X-Axis Month Labels */}
        <div className="flex items-center justify-between pl-10 sm:pl-12 pr-1 mt-4">
          {selectedAsset.dataPoints.map((item) => (
            <div
              key={item.month}
              className={`flex-1 text-center text-xs font-sans transition-colors ${
                hoveredMonth?.month === item.month ? "text-white font-semibold" : "text-white/45"
              }`}
            >
              {item.month}
            </div>
          ))}
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. OPTIONAL ASSET SWITCHER PILL TABS
          ══════════════════════════════════════════════════════════════ */}
      {showAssetTabs && (
        <div className="mt-8 pt-5 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            {DEFAULT_ASSETS.map((asset) => {
              const isSelected = selectedAsset.symbol === asset.symbol;
              return (
                <button
                  key={asset.symbol}
                  type="button"
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-bold shadow-md"
                      : "bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {asset.symbol}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
            <Sparkles className="h-3 w-3 text-[#f97316]" />
            <span>CAPSULE INFLOW TELEMETRY</span>
          </div>
        </div>
      )}

    </div>
  );
};
