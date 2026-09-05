import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, FileText, Shield, Sparkles, ExternalLink, Compass } from "lucide-react";

export const EditorialResearchLibrary: React.FC = () => {
  const dossiers = [
    {
      title: "The Institutional Due Diligence Dossier",
      subtitle: "A Systematic Framework for 8-Figure Crypto Asset Allocations",
      readTime: "7 min read",
      category: "Executive Research",
      description:
        "Comprehensive methodology covering smart contract audit verification, token unlock cliff schedules, and on-chain liquidity depth requirements.",
      link: "/due-diligence",
      isInternal: true,
    },
    {
      title: "CryptoVision Platform Architecture & User Guide",
      subtitle: "Technical Dossier & Multi-Model Inference Specifications",
      readTime: "12 min read",
      category: "Platform Architecture",
      description:
        "Full technical breakdown of our distributed ingestion engine, mempool parser, neural ensemble voting, and dynamic VaR risk radar.",
      link: "/due-diligence",
      isInternal: true,
    },
    {
      title: "The Anatomy of Sovereign Liquidity Inflows",
      subtitle: "Analyzing Spot ETF Absorption vs. Miner Emission Ratios",
      readTime: "5 min read",
      category: "Macroeconomics",
      description:
        "Empirical study showing how structural daily custody inflows establish asymmetric market floors independent of retail leverage cycles.",
      link: "/market",
      isInternal: true,
    },
    {
      title: "Zero-Knowledge Cryptographic Settlement",
      subtitle: "Decoupling Verification from Execution in High-Throughput Chains",
      readTime: "6 min read",
      category: "Cryptography",
      description:
        "Technical analysis of STARKs, recursive SNARKs, and decentralized state rollups protecting institutional transaction privacy.",
      link: "/learn",
      isInternal: true,
    },
  ];

  return (
    <section id="library" className="relative py-20 lg:py-28 bg-[#080809] text-white border-t border-white/10 overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-18">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00dc82] block mb-3">
              Due Diligence & Knowledge Repository
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight">
              Rigorous research for patient minds.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/60 font-sans leading-relaxed">
              Explore long-form institutional research dossiers, platform methodology papers, and educational modules designed to cultivate genuine market edge.
            </p>
          </div>

          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-[#00dc82] transition-colors self-start md:self-auto"
          >
            <span>View Full Knowledge Academy</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4 Research Dossiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          {dossiers.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="serene-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-4 border-b border-white/10 pb-3">
                  <span className="text-[#00dc82] uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl text-white group-hover:text-white transition-colors mb-1.5 leading-snug">
                  {item.title}
                </h3>
                
                <div className="text-xs font-mono text-white/50 mb-4">
                  {item.subtitle}
                </div>

                <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-[#00dc82] transition-colors">
                <span>Read Institutional Dossier</span>
                <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-[#00dc82] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            GATEWAY TO PRO EXECUTION TERMINAL (CALM TRANSITION)
            ══════════════════════════════════════════════════════════════ */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 sm:p-12 lg:p-14 text-center relative overflow-hidden">
          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#00dc82]/[0.03] to-transparent" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00dc82] uppercase tracking-widest bg-[#00dc82]/10 border border-[#00dc82]/20 px-3.5 py-1 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Ready for Live Execution
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-normal mb-4">
              Enter the Institutional Pro Terminal.
            </h3>

            <p className="text-xs sm:text-sm text-white/65 font-sans leading-relaxed mb-8">
              Seamlessly step from calm, unhurried study into the live institutional cockpit. Access real-time 1.8ms telemetry, mempool whale flows, automated backtesting, and dynamic risk radar.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/overview"
                className="inline-flex items-center gap-3 bg-[#f5f5f3] hover:bg-white text-[#111111] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-white/20 active:scale-95"
              >
                <span>Launch Pro Terminal</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/[0.03] transition-all"
              >
                <span>Explore Whale Radar</span>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-white/40">
              <span>LATENCY: 1.8MS</span>
              <span>•</span>
              <span>18 GLOBAL RPC CO-LOCATIONS</span>
              <span>•</span>
              <span>SLA: 99.99%</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
