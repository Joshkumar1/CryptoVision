import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AssetDossier {
  symbol: string;
  name: string;
  category: string;
  thesisTitle: string;
  image: string;
  macroThesis: string;
  catalysts: { title: string; date: string; impact: string }[];
  metrics: { label: string; value: string; context: string }[];
  riskProfile: { var: string; maxDrawdown: string; whaleConcentration: string };
  terminalSymbol: string;
}

const ASSET_DOSSIERS: AssetDossier[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    category: "Sovereign Store of Value",
    thesisTitle: "The Thermodynamic Anchor of Digital Scarcity",
    image: "/editorial/crypto_bitcoin_macro.jpg",
    macroThesis:
      "Bitcoin functions as an immutable, non-sovereign monetary asset governed solely by mathematical consensus. As global central banks navigate sovereign debt refinancing cycles, institutional allocators increasingly treat BTC as pristine, counterparty-free reserve capital with zero default risk.",
    catalysts: [
      { title: "Institutional ETF Inflow Ingestion", date: "Ongoing Q3-Q4", impact: "Structural supply absorption exceeding daily mined issuance by 3.8x" },
      { title: "Strategic Sovereign Reserve Legislation", date: "Upcoming H1", impact: "First nation-state reserve diversification frameworks outside El Salvador" },
      { title: "Lightning & ZK Layer 2 Settlement Growth", date: "Active rollout", impact: "Zero-fee institutional settlement layers built natively on Bitcoin script" },
    ],
    metrics: [
      { label: "Exchange Free Float", value: "2.18M BTC", context: "Lowest supply on exchanges since 2017" },
      { label: "Network Hashrate", value: "680 EH/s", context: "All-time computational security high" },
      { label: "Long-Term Holder Supply", value: "72.4%", context: "Coins dormant >155 days (institutional hands)" },
    ],
    riskProfile: { var: "1.42%", maxDrawdown: "18.2% (90d)", whaleConcentration: "Low (Decentralized)" },
    terminalSymbol: "BTC",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    category: "Decentralized Settlement Layer",
    thesisTitle: "The Base Money of the Programmable Economy",
    image: "/editorial/crypto_ethereum_crystal.jpg",
    macroThesis:
      "Ethereum represents the world's primary sovereign smart-contract settlement network, securing over $60B in decentralized finance collateral and tokenized real-world assets. With staking yield acting as the native risk-free rate of web3, ETH combines yield-bearing capital properties with deflationary fee burns during periods of network demand.",
    catalysts: [
      { title: "Pectra Protocol Upgrade", date: "Scheduled Q4", impact: "Account abstraction (EIP-7702) and 2,048 ETH maximum effective balance for validators" },
      { title: "Institutional Staking ETF Filings", date: "Under Review", impact: "Unlocks sovereign yield generation inside regulated brokerage accounts" },
      { title: "Layer 2 Blob Space Expansion", date: "Continuous", impact: "Rollup settlement costs reduced by 99% via dynamic blob fee markets" },
    ],
    metrics: [
      { label: "Staked Supply Ratio", value: "28.6%", context: "34.5M ETH locked securing the consensus engine" },
      { label: "Annualized Network Fees", value: "$2.84B", context: "100% of base fees burned from circulating supply" },
      { label: "DeFi Collateral TVL", value: "$62.1B", context: "58% market dominance across all blockchain ecosystems" },
    ],
    riskProfile: { var: "1.85%", maxDrawdown: "22.4% (90d)", whaleConcentration: "Moderate" },
    terminalSymbol: "ETH",
  },
  {
    symbol: "SOL",
    name: "Solana",
    category: "High-Throughput Global Execution",
    thesisTitle: "Single-State Synchronization at the Speed of Light",
    image: "/editorial/crypto_solana_titanium.jpg",
    macroThesis:
      "Solana is architected for continuous high-frequency execution without the composability fragmentation of multi-layer rollups. By parallelizing transactions across GPU hardware and optimizing pipeline propagation (Turbine), Solana acts as the financial operating system for consumer micropayments and on-chain central limit order books.",
    catalysts: [
      { title: "Firedancer Independent Validator Client", date: "Mainnet Phase 2", impact: "Rewrites consensus in C++ targeting 1,000,000 TPS hardware saturation" },
      { title: "Token Extensions Adoption", date: "Enterprise Live", impact: "Confidential transfers, interest-bearing tokens, and compliance rulehooks" },
      { title: "Global Visa & Stripe Merchant Settlement", date: "Expanding", impact: "USDC settlement on Solana replacing legacy ACH rail latency" },
    ],
    metrics: [
      { label: "True Non-Vote TPS", value: "2,840 TPS", context: "Sustained real economic transactions per second" },
      { label: "Daily Active Wallets", value: "4.8M", context: "Highest user engagement density in digital assets" },
      { label: "DEX Volume Dominance", value: "26.4%", context: "Surpassed Ethereum L1 in 24h decentralized trade volume" },
    ],
    riskProfile: { var: "2.40%", maxDrawdown: "28.1% (90d)", whaleConcentration: "Moderate" },
    terminalSymbol: "SOL",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    category: "Sovereign Subnet Architecture",
    thesisTitle: "Customizable Sovereign Consensuses for Institutional Finance",
    image: "/editorial/stone_sanctuary.jpg",
    macroThesis:
      "Avalanche's Multi-Subnet architecture allows enterprises and financial institutions to deploy sovereign, KYC-compliant execution environments that interoperate with sub-second finality. Its Snowman consensus protocol scales without sacrificing decentralization or throughput.",
    catalysts: [
      { title: "Avalanche9000 Architecture Upgrade", date: "Active Rollout", impact: "Drops Subnet launch costs by 99.9% and standardizes cross-subnet messaging (Teleporter)" },
      { title: "Institutional RWA Subnets (Citi/JPMorgan)", date: "Live Pilots", impact: "Compliant fund tokenization and repurchase agreement settlement" },
      { title: "Primary Network Fee Burn", date: "Deflationary", impact: "All Teleporter cross-chain fees permanently burned" },
    ],
    metrics: [
      { label: "Time to Finality", value: "<0.75s", context: "Deterministic sub-second transaction irreversibility" },
      { label: "Active Enterprise Subnets", value: "142 Active", context: "Institutional private-permissioned chains connected to mainnet" },
      { label: "Validator Node Count", value: "1,680 Nodes", context: "High decentralized validation resilience" },
    ],
    riskProfile: { var: "2.65%", maxDrawdown: "31.4% (90d)", whaleConcentration: "Moderate" },
    terminalSymbol: "AVAX",
  },
];

export const ComposureAssetExplorer: React.FC = () => {
  const [activeAsset, setActiveAsset] = useState<AssetDossier>(ASSET_DOSSIERS[0]);

  return (
    <section id="composure" className="relative py-20 lg:py-28 bg-[#080809] text-white border-t border-white/10 overflow-hidden select-none">
      
      {/* Soft Background Radial */}
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-[#00dc82]/[0.02] blur-[160px] animate-pulse-glow" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00dc82] block mb-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#00dc82] animate-pulse" />
            <span>Interactive Composure Dossiers</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight mb-4">
            Unrushed intelligence for core sovereign assets.
          </h2>
          <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed text-balance">
            Rather than chasing volatile micro-cap speculation, institutional compounding requires deep, methodical understanding of fundamental protocol moats and confirmed structural catalysts.
          </p>
        </motion.div>

        {/* Asset Switcher Pill Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
          {ASSET_DOSSIERS.map((asset) => {
            const isSelected = activeAsset.symbol === asset.symbol;
            return (
              <button
                key={asset.symbol}
                type="button"
                onClick={() => setActiveAsset(asset)}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "text-black font-semibold shadow-lg"
                    : "bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.07] border border-white/10"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeAssetPill"
                    className="absolute inset-0 bg-white rounded-full shadow-md z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 font-bold">{asset.symbol}</span>
                <span className="relative z-10 opacity-70">// {asset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Dossier Presentation Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAsset.symbol}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
            className="serene-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/15 shadow-2xl overflow-hidden glass-shine-overlay"
          >
            
            {/* Cinematic Atmospheric Banner */}
            <div className="relative h-44 sm:h-56 -mx-6 sm:-mx-10 lg:-mx-12 -mt-6 sm:-mt-10 lg:-mt-12 mb-8 overflow-hidden">
              <motion.img
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={activeAsset.image}
                alt={activeAsset.name}
                className="w-full h-full object-cover filter contrast-[1.03] brightness-[0.88]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-[#090a0d]/50 to-transparent" />
              <div className="absolute bottom-5 left-6 sm:left-10 lg:left-12 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#00dc82] animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#00dc82]">
                      {activeAsset.category}
                    </span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-md">
                    {activeAsset.thesisTitle}
                  </h3>
                </div>
                <Link
                  to={`/overview`}
                  className="hidden sm:inline-flex items-center gap-2 bg-white/15 hover:bg-white text-white hover:text-black px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all flex-shrink-0"
                >
                  <span>Inspect in Terminal</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Core Macro Thesis */}
            <div className="mb-10">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-3">
                Fundamental Macro Thesis
              </h4>
              <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed max-w-4xl text-balance">
                {activeAsset.macroThesis}
              </p>
            </div>

            {/* 3 Columns: Metrics + Catalysts + Risk Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-white/10">
              
              {/* Column 1: Network Health Metrics (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-2">
                  Institutional Health Metrics
                </h4>
                
                {activeAsset.metrics.map((m, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all cursor-default"
                  >
                    <div className="text-[11px] font-mono text-white/50">{m.label}</div>
                    <div className="text-xl font-mono font-bold text-white mt-0.5">{m.value}</div>
                    <div className="text-[11px] text-white/60 mt-1 font-sans">{m.context}</div>
                  </motion.div>
                ))}
              </div>

              {/* Column 2: Confirmed Catalysts (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-2">
                  Confirmed Structural Catalysts
                </h4>

                {activeAsset.catalysts.map((c, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00dc82]/30 transition-all cursor-default"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-semibold text-[#00dc82]">{c.title}</span>
                      <span className="text-white/40">{c.date}</span>
                    </div>
                    <p className="text-xs text-white/65 font-sans leading-relaxed">
                      {c.impact}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Column 3: Stress-Tested Risk Gauges (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-2">
                  Risk Profile
                </h4>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Daily VaR (99% Conf.)</div>
                    <div className="text-lg font-mono font-bold text-[#00dc82] mt-0.5">{activeAsset.riskProfile.var}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Max 90D Drawdown</div>
                    <div className="text-lg font-mono font-bold text-white mt-0.5">{activeAsset.riskProfile.maxDrawdown}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase">Whale Concentration</div>
                    <div className="text-xs font-mono font-semibold text-white/80 mt-0.5">{activeAsset.riskProfile.whaleConcentration}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-white/40 text-center">
                  DATA PROVENANCE: 100% REPRODUCIBLE
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

