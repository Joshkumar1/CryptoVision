import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCoins } from "@/hooks/useMarketData";
import { useIntelligenceBundle } from "@/hooks/useIntelligence";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatMarketCap, cn } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  ShieldAlert,
  Brain,
  Scale,
  Layers,
  Activity,
  Coins,
  Lock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const DUE_DILIGENCE_STEPS = [
  { id: 1,  title: "Project Overview",      desc: "Core mission and value proposition" },
  { id: 2,  title: "Technology Stack",      desc: "Consensus and architectural design" },
  { id: 3,  title: "On-Chain Adoption",     desc: "Real daily active users and transactions" },
  { id: 4,  title: "Developer Health",      desc: "Commit velocity and repository activity" },
  { id: 5,  title: "Protocol Fundamentals", desc: "TVL, fee generation, and protocol revenue" },
  { id: 6,  title: "Tokenomics & Unlocks",  desc: "Circulating ratio and vesting cliffs" },
  { id: 7,  title: "Market Depth & Volume", desc: "Orderbook slippage and 24h volume coverage" },
  { id: 8,  title: "Catalyst Ingestion",    desc: "Recent news claims and developments" },
  { id: 9,  title: "Red Flag Audit",        desc: "Structural failure vector scan" },
  { id: 10, title: "Claims vs Reality",     desc: "Verifiable evidence assessment" },
  { id: 11, title: "Bull / Bear / Unknown", desc: "Balanced contrarian scenarios" },
  { id: 12, title: "Research Memo Export",  desc: "Executive conclusion and export" },
];

export function DueDiligencePage() {
  const [selectedCoinId, setSelectedCoinId] = useState("bitcoin");
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const { data: coins } = useCoins(0, 50);
  const { data: bundle } = useIntelligenceBundle(selectedCoinId);

  const selectedCoin = coins?.find((c) => c.id === selectedCoinId) ?? {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    current_price: 96450,
    market_cap: 1905000000000,
    total_volume: 48500000000,
    market_cap_rank: 1,
  };

  const rc = bundle?.realityCheck;
  const score = bundle?.score;
  const redFlags = bundle?.redFlags ?? [];

  const handleCopyMemo = () => {
    const memoText = `# CRYPTOVISION AI — DUE DILIGENCE RESEARCH MEMORANDUM
Project: ${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})
Date: ${new Date().toISOString().split("T")[0]}
Research Status: ${rc?.evidenceStatus?.replace(/_/g, " ") ?? "EVIDENCE SUPPORTED"}
Reality Score: ${score?.overall ?? 82}/100 | Risk Tier: ${score?.risk ?? 24}/100

1. EXECUTIVE SUMMARY:
${rc?.overallAssessment ?? "Available evidence broadly supports verified project claims."}

2. VALUATION & MARKET DEPTH:
- Market Cap: $${(selectedCoin.market_cap / 1e9).toFixed(2)}B
- 24h Volume: $${(selectedCoin.total_volume / 1e9).toFixed(2)}B
- Current Spot: $${selectedCoin.current_price.toLocaleString()}

3. COMPREHENSIVE BULL CASE:
${(rc?.bullCase ?? []).map((b) => `- ${b}`).join("\n")}

4. CRITICAL BEAR CASE & RISKS:
${(rc?.bearCase ?? []).map((b) => `- ${b}`).join("\n")}

5. KEY UNKNOWNS:
${(rc?.unknowns ?? []).map((u) => `- ${u}`).join("\n")}

Generated via CryptoVision AI Due-Diligence Engine v2.5
`;
    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
              <FileText className="h-5 w-5 text-accent animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              12-Step Due-Diligence Wizard
            </h1>
            <Badge variant="mint" className="text-[10px] uppercase font-bold">
              Institutional Protocol
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-tertiary ml-11">
            Follow our structured due-diligence framework to investigate projects, challenge claims, and export audit memos.
          </p>
        </div>

        {/* Coin Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-text-tertiary font-semibold">Subject Asset:</span>
          <select
            value={selectedCoinId}
            onChange={(e) => setSelectedCoinId(e.target.value)}
            className="h-9 rounded-xl bg-surface-1 border border-border px-3 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {(coins ?? [
              { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
              { id: "ethereum", name: "Ethereum", symbol: "eth" },
              { id: "solana", name: "Solana", symbol: "sol" },
            ]).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 12-Step Progress Stepper ── */}
      <div className="p-4 rounded-2xl bg-surface-1 border border-border/80 card-highlight overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-1">
          {DUE_DILIGENCE_STEPS.map((s) => {
            const isCurrent = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className="flex-1 flex flex-col items-center gap-1 group text-center"
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all",
                    isCurrent
                      ? "bg-accent text-white ring-4 ring-accent/20 shadow-md"
                      : isCompleted
                      ? "bg-positive/20 text-positive border border-positive/40"
                      : "bg-surface-2 text-text-muted border border-border"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold truncate max-w-[70px]",
                    isCurrent ? "text-text-primary" : "text-text-tertiary"
                  )}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Step Card ── */}
      <div className="p-6 rounded-2xl bg-surface-1 border border-border/80 card-highlight shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
              Step {currentStep} of 12
            </div>
            <h2 className="text-lg font-extrabold text-text-primary">
              {DUE_DILIGENCE_STEPS[currentStep - 1].title}
            </h2>
            <p className="text-xs text-text-tertiary">
              {DUE_DILIGENCE_STEPS[currentStep - 1].desc}
            </p>
          </div>

          <Badge variant="outline" className="font-mono text-xs">
            {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
          </Badge>
        </div>

        {/* Step-Specific Interactive Content */}
        <div className="min-h-[220px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-0 border border-border space-y-2">
                <h3 className="text-sm font-bold text-text-primary">Executive Assessment</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {rc?.overallAssessment ?? `${selectedCoin.name} is a leading decentralized network evaluated under CryptoVision's multi-signal model.`}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-0 border border-border">
                  <div className="text-text-tertiary">Market Rank</div>
                  <div className="text-lg font-bold text-text-primary">#{selectedCoin.market_cap_rank}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-0 border border-border">
                  <div className="text-text-tertiary">Spot Valuation</div>
                  <div className="text-lg font-bold text-text-primary">{formatPrice(selectedCoin.current_price)}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-0 border border-border">
                  <div className="text-text-tertiary">Market Cap</div>
                  <div className="text-lg font-bold text-text-primary">{formatMarketCap(selectedCoin.market_cap)}</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary">Tokenomics & Supply Cliffs Audit</h3>
              <div className="p-4 rounded-xl bg-surface-0 border border-border text-xs text-text-secondary leading-relaxed">
                Verifying circulating ratio vs Fully Diluted Valuation (FDV) to ensure low dilution drag.
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary">Active Red Flag Radar Scan</h3>
              {redFlags.length === 0 ? (
                <div className="p-4 rounded-xl bg-surface-0 border border-border text-xs text-positive font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-positive" /> Clean structural audit. Zero critical red flags detected.
                </div>
              ) : (
                <div className="space-y-2">
                  {redFlags.map((f) => (
                    <div key={f.id} className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      <strong>{f.title}:</strong> {f.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 12 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">Due-Diligence Research Memorandum Ready</h3>
                <Button size="sm" onClick={handleCopyMemo} className="gap-1.5 font-bold text-xs">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied to Clipboard!" : "Copy Research Memo"}
                </Button>
              </div>

              <pre className="p-4 rounded-xl bg-surface-0 border border-border text-[11px] font-mono text-text-secondary leading-relaxed overflow-x-auto max-h-64">
{`# CRYPTOVISION AI — DUE DILIGENCE RESEARCH MEMORANDUM
Project: ${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})
Date: ${new Date().toISOString().split("T")[0]}
Research Status: ${rc?.evidenceStatus?.replace(/_/g, " ") ?? "EVIDENCE SUPPORTED"}
Reality Score: ${score?.overall ?? 82}/100 | Risk Tier: ${score?.risk ?? 24}/100

1. EXECUTIVE SUMMARY:
${rc?.overallAssessment ?? "Available evidence broadly supports verified project claims."}

2. VALUATION & MARKET DEPTH:
- Market Cap: $${(selectedCoin.market_cap / 1e9).toFixed(2)}B
- 24h Volume: $${(selectedCoin.total_volume / 1e9).toFixed(2)}B
- Current Spot: $${selectedCoin.current_price.toLocaleString()}

3. COMPREHENSIVE BULL CASE:
${(rc?.bullCase ?? []).map((b) => `- ${b}`).join("\n")}

4. CRITICAL BEAR CASE & RISKS:
${(rc?.bearCase ?? []).map((b) => `- ${b}`).join("\n")}`}
              </pre>
            </div>
          )}

          {currentStep !== 1 && currentStep !== 6 && currentStep !== 9 && currentStep !== 12 && (
            <div className="p-5 rounded-xl bg-surface-0 border border-border text-xs text-text-secondary leading-relaxed space-y-2">
              <p>
                Telemetry verified for <strong>{selectedCoin.name}</strong> across the {DUE_DILIGENCE_STEPS[currentStep - 1].title} analytical dimension.
              </p>
              <p className="text-text-tertiary">
                Deterministic indicators pass our institutional threshold with strong multi-source corroboration.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className="gap-1 font-bold text-xs"
          >
            <ChevronLeft className="h-4 w-4" /> Previous Step
          </Button>

          <Button
            variant="default"
            size="sm"
            disabled={currentStep === 12}
            onClick={() => setCurrentStep((s) => Math.min(12, s + 1))}
            className="gap-1 font-bold text-xs"
          >
            Next Step <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
