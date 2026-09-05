import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  BarChart3,
  Search,
  Network,
  Radar,
  Lock,
} from "lucide-react";

interface StrategyLayer {
  id: string;
  badge: string;
  tabTitle: string;
  headline: string;
  description: string;
  features: {
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[];
  telemetryType: "ingestion" | "synthesis" | "execution";
}

const strategyLayers: StrategyLayer[] = [
  {
    id: "layer-1",
    badge: "Layer 1: Ingestion",
    tabTitle: "Layer 1: Telemetry",
    headline: "Turnkey On-Chain Telemetry &\nWhale Flow Detection",
    description:
      "The foundation of our platform is a low-latency digital pipeline monitoring 100,000+ mempool events per second, tracking institutional wallet movements and aggregating cross-exchange orderbook depth.",
    features: [
      {
        title: "Millisecond Mempool Telemetry",
        desc: "Direct RPC nodes across 18 high-throughput networks provide sub-second transaction visibility before exchange confirmation.",
        icon: <Zap className="h-6 w-6 text-brand-red" />,
      },
      {
        title: "Whale Wallet Triangulation",
        desc: "Machine learning heuristics cluster institutional custody wallets, OTC desks, and ETF custodial flows in real time.",
        icon: <Database className="h-6 w-6 text-brand-blue" />,
      },
      {
        title: "Global Liquidity Aggregation",
        desc: "Unified order book depth modeling across Binance, Coinbase, OKX, and major on-chain automated market makers.",
        icon: <Layers className="h-6 w-6 text-brand-lime" />,
      },
    ],
    telemetryType: "ingestion",
  },
  {
    id: "layer-2",
    badge: "Layer 2: Synthesis",
    tabTitle: "Layer 2: AI Synthesis",
    headline: "Multi-Model AI Synthesis &\nAutomated Due Diligence",
    description:
      "Our cognitive layer feeds telemetry through a neural ensemble of specialized models—evaluating tokenomics, smart contract vulnerabilities, developer git velocity, and macroeconomic sentiment vectors.",
    features: [
      {
        title: "Reasoning Ensemble Voting",
        desc: "Cross-validation between predictive transformer architectures eliminates hallucination and guarantees signal confidence above 92%.",
        icon: <Cpu className="h-6 w-6 text-brand-blue" />,
      },
      {
        title: "Automated Smart Contract Audit",
        desc: "Static and symbolic bytecode analysis identifies reentrancy, honeypots, upgradeability risks, and hidden fee traps.",
        icon: <ShieldCheck className="h-6 w-6 text-brand-red" />,
      },
      {
        title: "Catalyst & Narrative Scoring",
        desc: "NLP pipelines extract market-moving announcements, ETF inflows, governance proposals, and developer momentum.",
        icon: <Activity className="h-6 w-6 text-brand-lime" />,
      },
    ],
    telemetryType: "synthesis",
  },
  {
    id: "layer-3",
    badge: "Layer 3: Execution",
    tabTitle: "Layer 3: Risk Radar",
    headline: "Autonomous Risk Radar &\nPredictive Alpha Execution",
    description:
      "Turning intelligence into actionable decisions. Our risk radar computes volatility regimes, simulates Monte Carlo portfolio drawdowns, and establishes systematic hedge parameters before market corrections.",
    features: [
      {
        title: "Dynamic Regime Detection",
        desc: "Hidden Markov models classify current conditions into Bullish Expansion, Distribution, or High Volatility Shakeout.",
        icon: <Radar className="h-6 w-6 text-brand-lime" />,
      },
      {
        title: "Institutional VaR & Tail-Risk Guard",
        desc: "Real-time Value-at-Risk modeling and automated exposure throttling protects capital during black-swan liquidations.",
        icon: <Lock className="h-6 w-6 text-brand-blue" />,
      },
      {
        title: "Algorithmic Backtesting Lab",
        desc: "Stress-test alpha hypotheses against 8 years of tick-level historical data across bull, bear, and chop environments.",
        icon: <BarChart3 className="h-6 w-6 text-brand-red" />,
      },
    ],
    telemetryType: "execution",
  },
];

export const StrategyLayerTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const current = strategyLayers[activeTab];

  return (
    <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl glass-card-premium p-6 shadow-xl md:p-8 lg:p-10">
      
      {/* ── 3 Tab Switchers (Jade Cobra Frosted Glass Style) ── */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
        {strategyLayers.map((layer, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveTab(idx)}
              className={`group relative isolate flex w-full min-w-0 items-center justify-between overflow-hidden px-5 py-4 text-left rounded-lg transition-all ${
                isActive
                  ? "bg-[#00dc82]/15 border border-[#00dc82]/40 text-[#00dc82] shadow-md shadow-[#00dc82]/10"
                  : "bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {/* Active Jade Accent Stripe */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1.5 bg-[#00dc82] shadow-sm shadow-[#00dc82]"
                />
              )}

              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.14em]">
                {layer.tabTitle}
              </span>

              <span
                className={`flex h-7 w-7 items-center justify-center border transition-colors ${
                  isActive
                    ? "border-[#00dc82]/50 bg-[#00dc82]/20 text-[#00dc82]"
                    : "border-white/20 text-white/60 group-hover:border-white/50 group-hover:text-white"
                }`}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Grid ── */}
      <div className="mt-8 grid min-h-0 w-full min-w-0 flex-1 gap-8 md:mt-10 md:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:gap-12 items-center">
        
        {/* Left: Text & Features */}
        <div className="flex flex-col">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#00dc82] mb-2">
            {current.badge}
          </div>
          <h3 className="font-display text-2xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-4xl whitespace-pre-line">
            {current.headline}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
            {current.description}
          </p>

          {/* 3 Technical Feature Blocks with Jade Glass Accents */}
          <div className="mt-8 space-y-4 md:mt-10">
            {current.features.map((f, i) => (
              <div key={i} className="grid grid-cols-[48px_1fr] gap-4 items-start p-3.5 rounded-xl border border-[#00dc82]/15 bg-[#050807]/60 backdrop-blur-sm hover:border-[#00dc82]/35 transition-all">
                <div className="flex h-12 w-12 items-center justify-center border border-[#00dc82]/30 bg-[#00dc82]/10 text-[#00dc82] rounded-lg shadow-sm flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-sans text-sm md:text-base font-bold uppercase tracking-wide text-white">
                    {f.title}
                  </h4>
                  <p className="mt-1 text-xs md:text-sm leading-relaxed text-white/60">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: High-End Live Simulated Institutional Terminal Viewport */}
        <div className="relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-xl glass-dark-card text-white shadow-2xl">
          
          {/* Terminal Window Chrome */}
          <div className="flex h-10 items-center justify-between border-b border-white/10 bg-navy/60 backdrop-blur-md px-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-red"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-brand-lime"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 ml-2">
                CV-TELEMETRY // {current.id.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-brand-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-ping" />
              LIVE 2.4 MS
            </div>
          </div>

          {/* Dynamic Content Based on Active Tab */}
          <div className="flex-1 p-5 font-mono text-xs space-y-4">
            {activeTab === 0 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">GLOBAL INGESTION RATE</span>
                  <span className="font-bold text-brand-lime">118,490 TPS</span>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">
                    RECENT WHALE DETECTIONS
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between text-white/90">
                      <span className="text-brand-blue">TX #8491A</span>
                      <span>3,400 BTC ($326.4M)</span>
                      <span className="text-brand-red font-bold">OTC ACCUM</span>
                    </div>
                    <div className="flex justify-between text-white/90">
                      <span className="text-brand-blue">TX #8492C</span>
                      <span>42,500 ETH ($148.7M)</span>
                      <span className="text-brand-lime font-bold">STAKED LIDO</span>
                    </div>
                    <div className="flex justify-between text-white/90">
                      <span className="text-brand-blue">TX #8493F</span>
                      <span>850,000 SOL ($187.0M)</span>
                      <span className="text-brand-blue font-bold">CUSTODY INFLOW</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-white/10 p-3 bg-white/5">
                    <div className="text-[10px] text-white/50">ORDERBOOK DEPTH (+2%)</div>
                    <div className="text-lg font-bold text-white mt-1">$482.5M</div>
                  </div>
                  <div className="border border-white/10 p-3 bg-white/5">
                    <div className="text-[10px] text-white/50">NET OTC DELTA (24H)</div>
                    <div className="text-lg font-bold text-brand-lime mt-1">+$842.1M</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">NEURAL REASONING ENSEMBLE</span>
                  <span className="font-bold text-brand-blue">98.4% CONSENSUS</span>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">
                    SMART CONTRACT RISK AUDIT #CV-SEC-09
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-white/80">Reentrancy Guard:</span>
                      <span className="text-brand-lime font-bold">VERIFIED SAFE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Mint/Freeze Privileges:</span>
                      <span className="text-brand-lime font-bold">REVOKED (IMMUTABLE)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Liquidity Timelock:</span>
                      <span className="text-brand-blue font-bold">720 DAYS (MULTI-SIG)</span>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 p-3 bg-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-white/50">NARRATIVE MOMENTUM VECTOR</span>
                    <span className="text-xs font-bold text-brand-red">ACCELERATING</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-blue to-brand-red w-[88%]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/60">CURRENT MARKET REGIME</span>
                  <span className="font-bold text-brand-lime">BULLISH EXPANSION</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-white/10 p-2.5 bg-white/5">
                    <div className="text-[9px] text-white/50">ALPHA CONFIDENCE</div>
                    <div className="text-base font-bold text-brand-lime mt-1">94.6%</div>
                  </div>
                  <div className="border border-white/10 p-2.5 bg-white/5">
                    <div className="text-[9px] text-white/50">PORTFOLIO VaR (99%)</div>
                    <div className="text-base font-bold text-brand-blue mt-1">1.28%</div>
                  </div>
                  <div className="border border-white/10 p-2.5 bg-white/5">
                    <div className="text-[9px] text-white/50">SHARPE RATIO</div>
                    <div className="text-base font-bold text-white mt-1">3.42</div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded border border-white/10">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">
                    SYSTEMATIC ALPHA SIGNALS (LIVE)
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">SOL/USD:</span>
                      <span className="text-brand-lime font-bold">TARGET $245 (+18.4%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white font-bold">BTC/USD:</span>
                      <span className="text-brand-blue font-bold">TARGET $112,000 (+14.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white font-bold">HEDGE PARAMETER:</span>
                      <span className="text-brand-red font-bold">STOP TRAILING 3.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Terminal Action Bar */}
          <div className="border-t border-white/10 bg-navy/90 p-3 flex justify-between items-center">
            <span className="text-[11px] font-mono text-white/60">
              AUDITED BY SYSTEM KERNEL v2.5.8
            </span>
            <Link
              to="/overview"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-lime hover:underline"
            >
              <span>Inspect Live</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* ── Bottom Section Button ── */}
      <div className="mt-8 flex justify-end md:mt-10">
        <Link
          to="/research-lab"
          className="group inline-flex items-center gap-3 bg-navy px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-navy/90"
        >
          <span>Research Lab & Models</span>
          <span className="flex h-6 w-6 items-center justify-center bg-cloud text-navy transition-colors group-hover:bg-cloud/80">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

    </div>
  );
};
