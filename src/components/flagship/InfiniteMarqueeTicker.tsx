import React from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowUpRight, Cpu, ShieldCheck, Zap, Sparkles, Database, Lock, Layers, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  isPositive: boolean;
  metric: string;
  tag: string;
  route: string;
}

const LIVE_TICKER_ITEMS: TickerItem[] = [
  { id: "kryptos", symbol: "KRYPTOS", name: "Kryptos Protocol", price: "$104,250.00", change24h: "+8.92%", isPositive: true, metric: "4K Reserve Asset", tag: "Sovereign TVL", route: "/market?asset=kryptos" },
  { id: "btc", symbol: "BTC", name: "Bitcoin", price: "$96,480.00", change24h: "+4.15%", isPositive: true, metric: "2.18M Exchange Float", tag: "Store of Value", route: "/market?asset=btc" },
  { id: "eth", symbol: "ETH", name: "Ethereum", price: "$3,420.50", change24h: "+5.68%", isPositive: true, metric: "28.6% Staked Ratio", tag: "Settlement Layer", route: "/market?asset=eth" },
  { id: "sol", symbol: "SOL", name: "Solana", price: "$218.40", change24h: "+12.40%", isPositive: true, metric: "2,840 Economic TPS", tag: "High-Throughput", route: "/market?asset=sol" },
  { id: "avax", symbol: "AVAX", name: "Avalanche", price: "$42.15", change24h: "+6.30%", isPositive: true, metric: "142 Active Subnets", tag: "Subnet Mesh", route: "/market?asset=avax" },
  { id: "near", symbol: "NEAR", name: "Near Protocol", price: "$7.85", change24h: "+9.10%", isPositive: true, metric: "Stateless Sharding", tag: "AI Compute", route: "/market?asset=near" },
  { id: "sui", symbol: "SUI", name: "Sui Network", price: "$3.45", change24h: "+14.20%", isPositive: true, metric: "Object-Centric Execution", tag: "Move Engine", route: "/market?asset=sui" },
  { id: "link", symbol: "LINK", name: "Chainlink", price: "$22.80", change24h: "+3.75%", isPositive: true, metric: "CCIP Cross-Chain", tag: "Oracle Mesh", route: "/market?asset=link" },
];

const TELEMETRY_FEED = [
  { text: "MEMPOOL INGESTION: 100,000 EV/SEC", icon: Activity, accent: "text-[#00dc82]" },
  { text: "NEURAL CONSENSUS: 98.4% CONFIRMATION", icon: Cpu, accent: "text-cyan-400" },
  { text: "DIRECT NODE LATENCY: 1.8MS SUB-SECOND", icon: Zap, accent: "text-amber-400" },
  { text: "ON-CHAIN PROOFS: 100% IMMUTABLE HASHES", icon: ShieldCheck, accent: "text-purple-400" },
  { text: "MEV DE-NOISING: 99.8% WASH TRADES FILTERED", icon: Lock, accent: "text-emerald-400" },
  { text: "SOVEREIGN RESERVE: 4K ULTRA-HD MASTER VERIFIED", icon: Sparkles, accent: "text-gold" },
];

export const InfiniteMarqueeTicker: React.FC = () => {
  return (
    <section className="relative w-full bg-[#050608] border-y border-white/10 py-6 overflow-hidden select-none">
      
      {/* Side Fade Gradient Masks for Smooth Vignette Edge */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#050608] via-[#050608]/80 to-transparent z-20" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#050608] via-[#050608]/80 to-transparent z-20" />

      {/* ══════════════════════════════════════════════════════════════
          ROW 1: SCROLLING FROM RIGHT TO LEFT (LIVE ASSET PRICES & METRICS)
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex overflow-hidden mb-4">
        <div className="animate-marquee-left flex items-center gap-4 sm:gap-6">
          
          {/* Double array to ensure seamless infinite looping */}
          {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              to={item.route}
              className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-md flex-shrink-0 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.symbol}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60">
                  {item.tag}
                </span>
              </div>

              <span className="font-mono text-xs font-semibold text-white">
                {item.price}
              </span>

              <span className="font-mono text-[11px] font-bold text-[#00dc82]">
                {item.change24h}
              </span>

              <span className="text-[10px] font-mono text-white/40 border-l border-white/10 pl-2 hidden sm:inline">
                {item.metric}
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          ))}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ROW 2: SCROLLING FROM LEFT TO RIGHT (TELEMETRY & PROVENANCE FEEDS)
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee-right flex items-center gap-6 sm:gap-8">
          
          {/* Double array to ensure seamless infinite looping */}
          {[...TELEMETRY_FEED, ...TELEMETRY_FEED, ...TELEMETRY_FEED].map((feed, idx) => {
            const Icon = feed.icon;
            return (
              <div
                key={`telemetry-${idx}`}
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-[11px] font-mono tracking-wider uppercase text-white/70 flex-shrink-0 hover:border-white/20 transition-all"
              >
                <Icon className={`h-3.5 w-3.5 ${feed.accent} animate-pulse`} />
                <span>{feed.text}</span>
                <span className="text-white/20 ml-2">•</span>
              </div>
            );
          })}

        </div>
      </div>

    </section>
  );
};
