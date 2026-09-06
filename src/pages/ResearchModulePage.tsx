import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame, ShieldCheck, AlertTriangle, Sparkles, Building2, Code, Layers,
  Globe, FileText, CheckCircle2, ArrowRight, Activity, Users, Lock, ChevronRight, Zap
} from "lucide-react";
import { AssetIntelligenceService } from "@/lib/intelligence/AssetIntelligenceService";
import { AiIntelligenceLayer } from "@/components/shared/AiIntelligenceLayer";
import { ExpertiseSelector } from "@/components/shared/ExpertiseSelector";
import { useExpertiseStore } from "@/stores/expertiseStore";
import { cn } from "@/lib/utils";

export const ResearchModulePage: React.FC = () => {
  const { assetId = "bitcoin" } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { level } = useExpertiseStore();

  const asset = AssetIntelligenceService.getAssetIntelligence(assetId);
  const allAssets = AssetIntelligenceService.getAllAssets();

  const getRiskBadge = (lvl: "LOW" | "MODERATE" | "HIGH") => {
    switch (lvl) {
      case "LOW":
        return <span className="px-2.5 py-0.5 rounded-full bg-[#00dc82]/15 text-[#00dc82] border border-[#00dc82]/30 text-xs font-mono font-bold">LOW RISK</span>;
      case "MODERATE":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30 text-xs font-mono font-bold">MODERATE RISK</span>;
      case "HIGH":
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">HIGH RISK</span>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* ── MODULE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Flame className="h-5 w-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
              MODULE 2 — ASSET CREDIBILITY & UTILITY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            🔥 RESEARCH ASSET INTELLIGENCE
          </h1>
          <p className="text-xs font-sans text-white/60 mt-1 max-w-xl">
            Answers: <strong className="text-white">"What is this cryptocurrency and can I trust it?"</strong> Understand the asset beyond price—examining organization, purpose, trust signals, tokenomics, and risk factors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExpertiseSelector />
        </div>
      </div>

      {/* ── ASSET SELECTOR BAR ── */}
      <div className="p-4 rounded-2xl bg-[#0a0d16] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={asset.identity.logo} alt={asset.identity.name} className="h-8 w-8 rounded-full" />
          <span className="text-base font-bold font-mono text-white">{asset.identity.name} ({asset.identity.symbol})</span>
          <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            {asset.identity.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/40">Switch Asset:</span>
          <select
            value={asset.identity.id}
            onChange={(e) => navigate(`/research/${e.target.value}`)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-white focus:outline-none"
          >
            {allAssets.map((ast) => (
              <option key={ast.identity.id} value={ast.identity.id} className="bg-[#0a0d16]">
                {ast.identity.name} ({ast.identity.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Cross-Module Action Pills */}
        <div className="flex items-center gap-2">
          <Link
            to="/explore"
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-white/80 transition-colors"
          >
            ✦ Explore Market
          </Link>
          <Link
            to={`/analyze/${asset.identity.id}`}
            className="px-3 py-1.5 rounded-xl bg-cyan-400/15 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/25 text-xs font-mono font-bold transition-colors"
          >
            〽 Analyze Performance →
          </Link>
        </div>
      </div>

      {/* ── SECTION A — AI EXECUTIVE SUMMARY ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c101c] via-[#090d16] to-[#070910] border border-[#00dc82]/25 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00dc82]">
          <Sparkles className="h-4 w-4" />
          <span className="font-bold uppercase tracking-widest">SECTION A — AI EXECUTIVE SUMMARY</span>
        </div>

        <p className="text-sm font-sans text-white/90 leading-relaxed italic bg-white/[0.02] p-4 rounded-2xl border border-white/5">
          "{asset.intelligence.aiExecutiveSummary.fullSummary}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">What is it?</span>
            <p className="text-xs text-white/80">{asset.intelligence.aiExecutiveSummary.whatIsIt}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Why does it exist?</span>
            <p className="text-xs text-white/80">{asset.intelligence.aiExecutiveSummary.whyItExists}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-[#00dc82] uppercase block font-bold">Problem Solved</span>
            <p className="text-xs text-white/80">{asset.intelligence.aiExecutiveSummary.problemSolved}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-purple-400 uppercase block font-bold">Why Value Exists</span>
            <p className="text-xs text-white/80">{asset.intelligence.aiExecutiveSummary.whyItHasValue}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-rose-400 uppercase block font-bold">Biggest Risks</span>
            <p className="text-xs text-white/80">{asset.intelligence.aiExecutiveSummary.biggestRisks}</p>
          </div>
        </div>
      </div>

      {/* ── SECTION B — ASSET IDENTITY & LINKS ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <Globe className="h-4 w-4 text-cyan-400" /> SECTION B — ASSET IDENTITY & SPECIFICATIONS
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Full Name</span>
            <span className="text-white font-bold">{asset.identity.name}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Symbol</span>
            <span className="text-amber-400 font-bold">{asset.identity.symbol}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Launch Date</span>
            <span className="text-white font-bold">{asset.identity.launchDate}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Blockchain Architecture</span>
            <span className="text-[#00dc82] font-bold">{asset.identity.blockchain}</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {asset.identity.socialLinks.website && (
            <a href={asset.identity.socialLinks.website} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
              <Globe className="h-3.5 w-3.5 text-cyan-400" /> Website
            </a>
          )}
          {asset.identity.socialLinks.whitepaper && (
            <a href={asset.identity.socialLinks.whitepaper} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
              <FileText className="h-3.5 w-3.5 text-amber-400" /> Whitepaper
            </a>
          )}
          {asset.identity.socialLinks.github && (
            <a href={asset.identity.socialLinks.github} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
              <Code className="h-3.5 w-3.5 text-[#00dc82]" /> Source Repository
            </a>
          )}
        </div>
      </div>

      {/* ── SECTION C — PURPOSE & UTILITY ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" /> SECTION C — PURPOSE & UTILITY
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="text-xs font-bold font-mono text-amber-400 block uppercase">Primary Problem Being Solved</span>
            <p className="text-xs font-sans text-white/80">{asset.fundamentals.problemSolved}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <span className="text-xs font-bold font-mono text-cyan-400 block uppercase">Core Purpose</span>
            <p className="text-xs font-sans text-white/80">{asset.fundamentals.purpose}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] font-bold font-mono text-[#00dc82] block uppercase">Primary Use Cases</span>
            <ul className="space-y-1 text-xs text-white/70">
              {asset.fundamentals.useCases.map((uc, i) => (
                <li key={i} className="flex items-center gap-1.5">✦ {uc}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] font-bold font-mono text-purple-400 block uppercase">Competitive Advantages</span>
            <ul className="space-y-1 text-xs text-white/70">
              {asset.fundamentals.competitiveAdvantages.map((ca, i) => (
                <li key={i} className="flex items-start gap-1.5">✓ {ca}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[11px] font-bold font-mono text-rose-400 block uppercase">Limitations</span>
            <ul className="space-y-1 text-xs text-white/70">
              {asset.fundamentals.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-1.5">⚠ {lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── SECTION D — ORGANIZATION & DEVELOPMENT ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-400" /> SECTION D — ORGANIZATION & DEVELOPMENT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block mb-1">Founders</span>
            <span className="text-white font-bold">{asset.fundamentals.founders.join(", ")}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block mb-1">Core Organization</span>
            <span className="text-white font-bold">{asset.fundamentals.coreOrganization}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block mb-1">Major Investors</span>
            <span className="text-amber-400 font-bold">{asset.fundamentals.majorInvestors.join(", ")}</span>
          </div>
        </div>

        {/* Developer Activity Commentary */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <Code className="h-4 w-4 text-[#00dc82]" /> Developer Activity Insights
            </div>
            <div className="text-[10px] font-mono text-white/40">
              4w Commits: <strong className="text-[#00dc82]">{asset.fundamentals.developerActivity.commits4Weeks}</strong> • Stars: <strong className="text-white">{asset.fundamentals.developerActivity.githubStars}</strong>
            </div>
          </div>
          <p className="text-xs font-sans text-white/80 italic">
            "{asset.fundamentals.developerActivity.commentary}"
          </p>
        </div>
      </div>

      {/* ── SECTION E — TRANSPARENT TRUST SIGNALS ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#00dc82]" /> SECTION E — TRANSPARENT TRUST SIGNALS
          </h3>
          <span className="text-[10px] font-mono text-white/40">Includes Explicit "Why It Matters" Rationale</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {asset.trustSignals.map((ts) => {
            const isPos = ts.type === "POSITIVE";
            return (
              <div
                key={ts.id}
                className={cn(
                  "p-4 rounded-2xl border space-y-1.5",
                  isPos ? "bg-[#00dc82]/5 border-[#00dc82]/20" : "bg-rose-500/5 border-rose-500/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-mono font-bold flex items-center gap-1.5", isPos ? "text-[#00dc82]" : "text-rose-400")}>
                    {isPos ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    {ts.title}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                    {ts.type}
                  </span>
                </div>
                <p className="text-xs font-sans text-white/80 leading-relaxed">
                  <strong className="text-white/40">Why It Matters:</strong> {ts.whyItMatters}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION F — TOKENOMICS & INSIGHTS ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
          <Lock className="h-4 w-4 text-cyan-400" /> SECTION F — TOKENOMICS & SUPPLY MECHANICS
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Max Supply Cap</span>
            <span className="text-white font-bold">{asset.tokenomics.maxSupply ? asset.tokenomics.maxSupply.toLocaleString() : "∞ Uncapped"}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Circulating Supply</span>
            <span className="text-[#00dc82] font-bold">{asset.tokenomics.circulatingSupply.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Inflation Rate</span>
            <span className="text-amber-400 font-bold">{asset.tokenomics.inflationRatePercentage}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] text-white/40 block">Whale Concentration</span>
            <span className="text-rose-400 font-bold">{asset.tokenomics.whaleConcentrationPercentage}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          <span className="text-xs font-bold font-mono text-[#00dc82] block mb-1">Generated Tokenomics Insight</span>
          <p className="text-xs font-sans text-white/80 italic">"{asset.tokenomics.summaryInsight}"</p>
        </div>
      </div>

      {/* ── SECTION H — CATEGORIZED RISK INTELLIGENCE ── */}
      <div className="p-6 rounded-3xl bg-[#090c14] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" /> SECTION H — CATEGORIZED RISK INTELLIGENCE
          </h3>
          <span className="text-[10px] font-mono text-white/40">Data-Backed Risk Classification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            asset.risk.marketRisk,
            asset.risk.technologyRisk,
            asset.risk.liquidityRisk,
            asset.risk.regulatoryRisk,
            asset.risk.centralizationRisk,
            asset.risk.tokenomicsRisk,
          ].map((rk, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-white">{rk.category} Risk</span>
                {getRiskBadge(rk.level)}
              </div>
              <p className="text-xs font-sans text-white/70 leading-relaxed">{rk.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Observations Layer */}
      <AiIntelligenceLayer observations={asset.intelligence.observations} />
    </div>
  );
};
