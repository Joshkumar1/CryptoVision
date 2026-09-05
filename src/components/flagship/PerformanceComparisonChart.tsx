import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface BarItem {
  name: string;
  ticker: string;
  percentage: number;
  heightPercent: number;
  highlight?: boolean;
  colorGradient: string;
  metricLabel: string;
}

const comparisonData: BarItem[] = [
  {
    name: "CryptoVision Alpha Engine",
    ticker: "$CV-ALPHA",
    percentage: 142,
    heightPercent: 96,
    highlight: true,
    colorGradient: "linear-gradient(180deg, #00dc82 0%, #10b981 60%, #047857 100%)",
    metricLabel: "Automated Multi-Model Strategy",
  },
  {
    name: "Bitcoin (Direct Holding)",
    ticker: "BTC/USD",
    percentage: 56,
    heightPercent: 48,
    colorGradient: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 100%)",
    metricLabel: "Spot Buy & Hold",
  },
  {
    name: "Nasdaq-100 Index",
    ticker: "QQQ",
    percentage: 21,
    heightPercent: 24,
    colorGradient: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 100%)",
    metricLabel: "Tech Equities Benchmark",
  },
  {
    name: "S&P 500 Index",
    ticker: "SPX",
    percentage: 14,
    heightPercent: 18,
    colorGradient: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)",
    metricLabel: "Broad Market Benchmark",
  },
];

export const PerformanceComparisonChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* ── Visual Bar Chart Container (Glassmorphic Obsidian Specular Panel) ── */}
      <div className="relative w-full rounded-xl glass-card-premium p-6 md:p-10 shadow-2xl">
        
        {/* Top Header inside card */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#00dc82]/15 pb-6 mb-8">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#00dc82]">
              ANNUALIZED ALPHA SPREAD
            </div>
            <div className="font-display text-xl md:text-2xl font-bold uppercase text-white mt-1">
              Risk-Adjusted Performance Comparison
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#00dc82] shadow-sm shadow-[#00dc82]"></span>
            <span className="font-mono text-xs font-bold text-white/90 uppercase">
              CryptoVision Systematic Advantage
            </span>
          </div>
        </div>

        {/* ── 4 Animated Pillars (Jade Cobra Palette) ── */}
        <div className="relative flex h-[340px] w-full justify-center gap-3 sm:gap-6 md:h-[440px] md:gap-8 items-end pb-4 border-b border-white/10">
          {comparisonData.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.ticker}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative flex h-full flex-1 flex-col items-center justify-end cursor-pointer group"
              >
                {/* Floating percentage badge above bar (Frosted Dark Glass Pill) */}
                <div
                  className={`mb-2 font-mono text-xs sm:text-sm md:text-base font-black px-2.5 py-0.5 rounded glass-pill-badge shadow-sm transition-transform duration-300 ${
                    item.highlight
                      ? "text-[#00dc82] border-[#00dc82]/40 scale-110 shadow-lg shadow-[#00dc82]/20"
                      : "text-white/80"
                  } ${isHovered ? "-translate-y-1" : ""}`}
                >
                  +{item.percentage}%
                </div>

                {/* Vertical Bar Column */}
                <div className="relative w-full max-w-[130px] flex items-end">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ease-out group-hover:brightness-125 ${
                      item.highlight ? "shadow-xl shadow-[#00dc82]/30" : "shadow-md shadow-black/40"
                    }`}
                    style={{
                      background: item.colorGradient,
                      height: `${item.heightPercent}%`,
                      minHeight: "36px",
                    }}
                  >
                    {/* Top specular glow line on bar */}
                    <div className="h-1 w-full bg-white/40" />
                  </div>
                </div>

                {/* Subtitle tag */}
                <div className="mt-2 text-center text-[10px] font-mono text-white/50 hidden sm:block">
                  {item.ticker}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Metric Footers Under Pillars ── */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {comparisonData.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-all ${
                item.highlight
                  ? "border-[#00dc82]/30 bg-[#00dc82]/10 text-white"
                  : "border-white/5 bg-white/[0.02] text-white/60"
              }`}
            >
              <div className="text-xs font-bold uppercase font-sans text-white/90">
                {item.name}
              </div>
              <div className="text-[11px] font-mono text-white/50 mt-1">
                {item.metricLabel}
              </div>
              <div className={`text-sm font-mono font-bold mt-2 ${item.highlight ? "text-[#00dc82]" : "text-white/80"}`}>
                +{item.percentage}% Cumulative
              </div>
            </div>
          ))}
        </div>

        {/* Historical Disclaimer */}
        <div className="mt-8 text-[11px] font-mono text-white/40 leading-relaxed border-t border-white/10 pt-4">
          * Systematic backtested & live model forward performance over 36-month rolling horizon. Past performance does not guarantee future results. CryptoVision risk models adjust exposure dynamically via automated stop-limits.
        </div>

      </div>
    </div>
  );
};
