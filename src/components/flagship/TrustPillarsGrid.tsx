import React from "react";
import { ArrowUpRight, Zap, ShieldCheck, Lock, Activity, Layers, FileCheck2, Cpu, CheckCircle2 } from "lucide-react";

export const TrustPillarsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* ── BENTO TILE 1: PREDICTIVE ALPHA (Col-span 2 on LG) ── */}
      <div className="lg:col-span-2 glass-bento-card p-7 md:p-9 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-[#00dc82] shadow-sm shadow-[#00dc82]/20">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00dc82]">
                BENTO // CORE MODULE 01
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-white">
                Predictive Alpha Engine
              </h3>
            </div>
          </div>
          <span className="self-start sm:self-auto font-mono text-xs font-bold text-[#00dc82] bg-[#00dc82]/15 border border-[#00dc82]/30 px-3 py-1 rounded-full shadow-sm shadow-[#00dc82]/10">
            94.6% VERIFIED CONFIDENCE
          </span>
        </div>

        <p className="mt-4 text-sm md:text-base leading-relaxed text-white/75 max-w-2xl">
          Multi-head reasoning transformers continuously synthesize 1,400+ on-chain data points—tracking exchange net flows, whale accumulation clusters, and macro liquidity vectors before retail momentum builds.
        </p>

        {/* Interactive Telemetry Sub-grid inside the Bento Tile */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#050807]/70 backdrop-blur-sm p-3 rounded-lg border border-[#00dc82]/15">
            <div className="text-[10px] text-white/45 uppercase">DAILY RUNS</div>
            <div className="text-base font-bold text-white mt-0.5">86,400</div>
          </div>
          <div className="bg-[#050807]/70 backdrop-blur-sm p-3 rounded-lg border border-[#00dc82]/15">
            <div className="text-[10px] text-white/45 uppercase">PREDICTIVE SHARPE</div>
            <div className="text-base font-bold text-[#00dc82] mt-0.5">3.42</div>
          </div>
          <div className="bg-[#050807]/70 backdrop-blur-sm p-3 rounded-lg border border-[#00dc82]/15">
            <div className="text-[10px] text-white/45 uppercase">DATA VECTORS</div>
            <div className="text-base font-bold text-white mt-0.5">1,400+</div>
          </div>
          <div className="bg-[#050807]/70 backdrop-blur-sm p-3 rounded-lg border border-[#00dc82]/15">
            <div className="text-[10px] text-white/45 uppercase">FALSE POSITIVES</div>
            <div className="text-base font-bold text-[#34d399] mt-0.5">&lt; 1.8%</div>
          </div>
        </div>

        {/* Ambient Corner Flare */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#00dc82]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00dc82]/20 transition-all" />
      </div>

      {/* ── BENTO TILE 2: DETERMINISTIC RISK SHIELD (Span 1 on LG) ── */}
      <div className="glass-bento-card p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-[#00dc82] shadow-sm shadow-[#00dc82]/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="font-mono text-[10px] uppercase text-white/40 font-bold">
              BENTO // 02
            </span>
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            Deterministic Risk Shield
          </h3>
          <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/70">
            Real-time Value-at-Risk (VaR) modeling and automated tail-risk hedging parameters eliminate cascading liquidation drawdowns during black-swan events.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-white/60">PORTFOLIO VaR (99%):</span>
          <span className="font-bold text-[#00dc82] text-sm">1.28% MAX</span>
        </div>
      </div>

      {/* ── BENTO TILE 3: SUB-SECOND INGESTION (Span 1 on LG) ── */}
      <div className="glass-bento-card p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-[#00dc82] shadow-sm shadow-[#00dc82]/20">
              <Zap className="h-6 w-6" />
            </div>
            <span className="font-mono text-[10px] uppercase text-white/40 font-bold">
              BENTO // 03
            </span>
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            Sub-Second Ingestion
          </h3>
          <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/70">
            Co-located low-latency RPC nodes stream pending mempool bundles, DEX arbitrage routes, and institutional OTC transactions directly to memory.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-white/60">NODE LATENCY:</span>
          <span className="font-bold text-[#00dc82] text-sm">1.8 MS (RPC)</span>
        </div>
      </div>

      {/* ── BENTO TILE 4: CRYPTOGRAPHIC TRANSPARENCY (Span 1 on LG) ── */}
      <div className="glass-bento-card p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-[#00dc82] shadow-sm shadow-[#00dc82]/20">
              <Lock className="h-6 w-6" />
            </div>
            <span className="font-mono text-[10px] uppercase text-white/40 font-bold">
              BENTO // 04
            </span>
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            Cryptographic Transparency
          </h3>
          <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/70">
            Immutable hash trees record model execution timestamps and verified due diligence claims, ensuring each signal provenance is unforgeable.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-white/60">PROOF OF SIGNAL:</span>
          <span className="font-bold text-[#00dc82] text-sm">ZK-VERIFIED</span>
        </div>
      </div>

      {/* ── BENTO TILE 5: MULTI-CHAIN DEPTH (Span 1 on LG) ── */}
      <div className="glass-bento-card p-7 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00dc82]/10 border border-[#00dc82]/30 text-[#00dc82] shadow-sm shadow-[#00dc82]/20">
              <Layers className="h-6 w-6" />
            </div>
            <span className="font-mono text-[10px] uppercase text-white/40 font-bold">
              BENTO // 05
            </span>
          </div>
          <h3 className="font-display text-xl font-bold uppercase text-white">
            Multi-Chain Depth
          </h3>
          <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/70">
            Unified analytical coverage spanning EVM networks, Solana, Bitcoin Layer-2s, and high-velocity decentralized order books.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-white/60">ACTIVE NETWORKS:</span>
          <span className="font-bold text-white text-sm">18 INTEGRATED</span>
        </div>
      </div>

      {/* ── BENTO TILE 6: INSTITUTIONAL DUE DILIGENCE (Col-span 3 on LG) ── */}
      <div className="lg:col-span-3 glass-bento-card p-7 md:p-9 rounded-2xl relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00dc82]/10 border border-[#00dc82]/30 text-[#00dc82]">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00dc82]">
                BENTO // AUDIT ENGINE 06
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold uppercase text-white">
              Autonomous Smart Contract &amp; Tokenomics Due Diligence
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Comprehensive bytecode decompilation scans for reentrancy, hidden mint functions, and liquidation slippage traps, combined with tokenomics unlock schedule analysis.
            </p>
          </div>

          {/* Audit Verification Checklist Chips */}
          <div className="flex flex-wrap gap-2.5 font-mono text-xs">
            <div className="flex items-center gap-2 bg-[#050807]/80 backdrop-blur-sm border border-[#00dc82]/25 px-3.5 py-2 rounded-lg text-white">
              <CheckCircle2 className="h-4 w-4 text-[#00dc82]" />
              <span>Bytecode Audit: PASS</span>
            </div>
            <div className="flex items-center gap-2 bg-[#050807]/80 backdrop-blur-sm border border-[#00dc82]/25 px-3.5 py-2 rounded-lg text-white">
              <CheckCircle2 className="h-4 w-4 text-[#00dc82]" />
              <span>Timelock Multi-Sig: 720D</span>
            </div>
            <div className="flex items-center gap-2 bg-[#050807]/80 backdrop-blur-sm border border-[#00dc82]/25 px-3.5 py-2 rounded-lg text-white">
              <CheckCircle2 className="h-4 w-4 text-[#00dc82]" />
              <span>Honeypot Heuristic: ZERO</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
