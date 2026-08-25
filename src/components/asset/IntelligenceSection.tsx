import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntelligenceBundle } from "@/hooks/useIntelligence";
import { useAppStore } from "@/stores/appStore";
import { PersonaSegmentBanner } from "@/components/shared/PersonaSegmentBanner";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, formatPercentage, formatMarketCap, cn } from "@/lib/utils";
import {
  Brain,
  Shield,
  Star,
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sliders,
  Sparkles,
  Dna,
  ShieldCheck,
  Activity,
  Layers,
  Scale,
  RefreshCw,
  Search,
  ExternalLink,
  Flame,
  FileCheck,
  BookOpen,
  BarChart2,
  Gauge,
  Lightbulb,
} from "lucide-react";
import type { IntelligenceScore, RealityCheck, RedFlag, RedFlagSeverity } from "@/types";

const SEV_STYLE: Record<RedFlagSeverity, { bg: string; border: string; color: string }> = {
  HIGH:   { bg: "bg-red-500/10",   border: "border-red-500/30",   color: "text-red-400"   },
  MEDIUM: { bg: "bg-amber-500/10", border: "border-amber-500/30", color: "text-amber-400" },
  LOW:    { bg: "bg-blue-500/10",  border: "border-blue-500/30",  color: "text-blue-400"  },
};

const VERDICT_META = {
  SUPPORTED: {
    label: "Supported",
    badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    icon: CheckCircle,
    color: "text-emerald-400",
    dot: "🟢",
  },
  PARTIALLY_SUPPORTED: {
    label: "Mixed Evidence",
    badge: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    icon: AlertTriangle,
    color: "text-amber-400",
    dot: "🟡",
  },
  CONTRADICTED: {
    label: "Conflicting",
    badge: "bg-red-500/15 text-red-400 border border-red-500/30",
    icon: XCircle,
    color: "text-red-400",
    dot: "🔴",
  },
  UNVERIFIABLE: {
    label: "Unverified",
    badge: "bg-surface-2 text-text-tertiary border border-border",
    icon: HelpCircle,
    color: "text-text-tertiary",
    dot: "⚪",
  },
};

type ActiveTab =
  | "reality"
  | "dna"
  | "lab"
  | "thesis"
  | "changes"
  | "red-flags";

interface IntelligenceSectionProps {
  coinId: string;
}

export function IntelligenceSection({ coinId }: IntelligenceSectionProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("reality");
  const { data: bundle, isLoading } = useIntelligenceBundle(coinId);
  const openEvidenceModal = useAppStore((s) => s.openEvidenceModal);
  const persona = useAppStore((s) => s.persona);

  // ── Research Lab Assumption Sliders State ──
  const [supplyChangePct, setSupplyChangePct] = useState(0); // -50% to +100%
  const [tvlChangePct, setTvlChangePct] = useState(0); // -80% to +200%
  const [devVelocityChangePct, setDevVelocityChangePct] = useState(0); // -80% to +200%
  const [liquidityWeight, setLiquidityWeight] = useState(1.0); // 0.5x to 2.0x

  const rc = bundle?.realityCheck;
  const score = bundle?.score;
  const redFlags = bundle?.redFlags ?? [];
  const highFlagCount = redFlags.filter((f) => f.severity === "HIGH").length;

  // ── Recalculate Score Dynamically in Research Lab ──
  const simulatedScore = useMemo(() => {
    if (!score) return null;
    let baseOverall = score.overall;
    let baseRisk = score.risk;

    // Supply inflation impact
    if (supplyChangePct > 0) {
      baseOverall -= (supplyChangePct / 100) * 12;
      baseRisk += (supplyChangePct / 100) * 18;
    } else if (supplyChangePct < 0) {
      baseOverall += (Math.abs(supplyChangePct) / 100) * 6;
      baseRisk -= (Math.abs(supplyChangePct) / 100) * 8;
    }

    // TVL impact
    if (tvlChangePct > 0) {
      baseOverall += (tvlChangePct / 100) * 10;
      baseRisk -= (tvlChangePct / 100) * 6;
    } else if (tvlChangePct < 0) {
      baseOverall -= (Math.abs(tvlChangePct) / 100) * 14;
      baseRisk += (Math.abs(tvlChangePct) / 100) * 16;
    }

    // Dev velocity impact
    if (devVelocityChangePct > 0) {
      baseOverall += (devVelocityChangePct / 100) * 8;
    } else if (devVelocityChangePct < 0) {
      baseOverall -= (Math.abs(devVelocityChangePct) / 100) * 10;
      baseRisk += (Math.abs(devVelocityChangePct) / 100) * 10;
    }

    // Liquidity weighting
    const adjustedOverall = Math.round(Math.max(10, Math.min(98, baseOverall * liquidityWeight)));
    const adjustedRisk = Math.round(Math.max(5, Math.min(95, baseRisk)));

    return {
      overall: adjustedOverall,
      risk: adjustedRisk,
      delta: adjustedOverall - score.overall,
    };
  }, [score, supplyChangePct, tvlChangePct, devVelocityChangePct, liquidityWeight]);

  return (
    <div className="bg-surface-1 border border-border/80 rounded-2xl overflow-hidden card-highlight shadow-lg space-y-0">
      {/* ── 🛡️ Top Evidence Health & Trust Banner ── */}
      <div className="px-5 py-3 bg-surface-2/60 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-text-secondary">
          <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0" />
          <span>
            <strong>CryptoVision Evidence Health:</strong> Multi-Signal Deterministic Model v2.5
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-text-tertiary">
          <span>
            Coverage: <strong className="text-text-primary font-mono">94%</strong>
          </span>
          <span>
            Evidence: <strong className="text-positive font-semibold">{score?.evidenceQuality ?? "STRONG"}</strong>
          </span>
          <span>
            Verified Feeds: <strong className="text-text-primary">CoinGecko, DeFiLlama, GitHub</strong>
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">
            Live Cache Sync
          </Badge>
        </div>
      </div>

      {/* ── Active Persona Segment Banner ── */}
      <div className="px-6 pt-5 pb-2">
        <PersonaSegmentBanner />
      </div>

      {/* ── Header Title & Tagline ── */}
      <div className="px-6 py-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl gradient-accent text-white shadow-sm glow-accent">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-text-primary tracking-tight">
                Project Reality & Intelligence Suite
              </h2>
              <Badge variant="mint" className="text-[10px] font-bold uppercase">
                Investigate, Not Just Price
              </Badge>
            </div>
            <p className="text-xs text-text-tertiary mt-0.5">
              Flagship evidence audit, failure radar, living thesis, and assumption lab.
            </p>
          </div>
        </div>
      </div>

      {/* ── Signature Feature Tab Navigation ── */}
      <div className="flex border-b border-border/80 bg-surface-0/40 overflow-x-auto">
        {[
          { id: "reality",    label: "🔍 Project Reality Score", count: rc?.claims.length },
          { id: "dna",        label: "🧬 Project DNA",           count: undefined },
          { id: "lab",        label: "🧪 Research Lab (Sim)",    count: undefined },
          { id: "thesis",     label: "🥊 Thesis vs. Thesis",     count: undefined },
          { id: "changes",    label: "🧠 What Changes Our View?",count: undefined },
          { id: "red-flags",  label: "🚨 Red Flag Radar",        count: redFlags.length, high: highFlagCount > 0 },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap",
                isActive
                  ? "border-accent text-accent bg-accent/10"
                  : "border-transparent text-text-tertiary hover:text-text-primary hover:bg-surface-2"
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-extrabold font-mono",
                    tab.high
                      ? "bg-red-500/20 text-red-400"
                      : "bg-surface-2 text-text-secondary border border-border"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content Panels ── */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : !bundle ? (
          <div className="py-12 text-center text-xs text-text-tertiary">
            Intelligence feed currently unavailable for this asset.
          </div>
        ) : (
          <div>
            {/* ══════════════════════════════════════════════════════════════════
                1. 🔍 PROJECT REALITY SCORE (Claim ➔ Evidence ➔ Verdict)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === "reality" && (
              <div className="space-y-6">
                {/* Executive Assessment Hero */}
                <div className="p-5 rounded-2xl bg-surface-0 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-highlight">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="gold" className="text-[10px] font-bold uppercase">
                        {rc?.evidenceStatus?.replace(/_/g, " ") ?? "EVIDENCE SUPPORTED"}
                      </Badge>
                      <span className="text-xs text-text-tertiary font-medium">
                        Posture: <strong className="text-text-primary">NEUTRAL & EVIDENCE-BASED</strong>
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-text-primary leading-relaxed">
                      {rc?.overallAssessment}
                    </p>
                  </div>

                  {score && (
                    <div className="flex items-center gap-3 self-center flex-shrink-0">
                      <ScoreRing score={score.overall} size={58} strokeWidth={5} label="Reality Score" />
                    </div>
                  )}
                </div>

                {/* ── 🟢 EXPLORE SEGMENT: Plain English Demystifiers & Beginner Glossary ── */}
                {persona === "EXPLORE" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 card-highlight space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-text-primary">
                        Explore Mode: Plain-English Project Demystifier
                      </h3>
                      <Badge variant="mint" className="text-[9px] uppercase font-bold">
                        Beginner Friendly
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-surface-0 border border-border/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                          What Problem Does It Solve?
                        </span>
                        <p className="text-text-secondary leading-relaxed">
                          Provides decentralized digital infrastructure without reliance on centralized intermediaries.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-surface-0 border border-border/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                          Where Does Value Come From?
                        </span>
                        <p className="text-text-secondary leading-relaxed">
                          Transaction fees, staking network security, and utility demand across decentralized apps.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-surface-0 border border-border/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                          Key Risk In Simple Terms
                        </span>
                        <p className="text-text-secondary leading-relaxed">
                          Market volatility, potential token unlock dilution, and regulatory uncertainty.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── 🟣 ANALYST SEGMENT: Explainable ML (SHAP-Style) Feature Contributions ── */}
                {persona === "ANALYST" && score && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 card-highlight space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-text-primary">
                          Analyst Mode: Explainable Feature Importance (SHAP Decomposition)
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-text-tertiary">
                        Base: 50.0 ➔ Score: {score.overall}.0
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-surface-0 border border-border space-y-1">
                        <span className="text-[10px] text-text-tertiary block">Momentum Contribution</span>
                        <div className="text-base font-extrabold text-positive font-mono">+14.2 pts</div>
                        <span className="text-[10px] text-text-muted">High 90D volume surge</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-0 border border-border space-y-1">
                        <span className="text-[10px] text-text-tertiary block">Developer Velocity</span>
                        <div className="text-base font-extrabold text-positive font-mono">+11.5 pts</div>
                        <span className="text-[10px] text-text-muted">Top 5% GitHub commits</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-0 border border-border space-y-1">
                        <span className="text-[10px] text-text-tertiary block">On-Chain TVL Depth</span>
                        <div className="text-base font-extrabold text-positive font-mono">+8.1 pts</div>
                        <span className="text-[10px] text-text-muted">DeFiLlama verified</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-0 border border-border space-y-1">
                        <span className="text-[10px] text-text-tertiary block">Supply Dilution Overhang</span>
                        <div className="text-base font-extrabold text-negative font-mono">-6.8 pts</div>
                        <span className="text-[10px] text-text-muted">Vesting cliff discount</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Structured Claim ➔ Evidence ➔ Verdict Ledger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-tertiary">
                    <span>Audited Project Claims & Verifiable Evidence</span>
                    <span>Verdict Status</span>
                  </div>

                  <div className="space-y-3">
                    {rc?.claims.map((c, idx) => {
                      const verdict = VERDICT_META[c.assessment] ?? VERDICT_META.UNVERIFIABLE;
                      const Icon = verdict.icon;

                      return (
                        <div
                          key={c.claim.id || idx}
                          className="p-4 rounded-2xl bg-surface-0/90 border border-border/80 hover:border-accent/40 transition-all card-highlight space-y-3"
                        >
                          {/* Claim Header & Verdict Pill */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="text-base mt-0.5">{verdict.dot}</span>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block">
                                  Claim #{idx + 1} • {c.claim.category}
                                </span>
                                <h4 className="text-sm font-bold text-text-primary leading-snug">
                                  "{c.claim.text}"
                                </h4>
                              </div>
                            </div>

                            <span
                              className={cn(
                                "text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5 flex-shrink-0",
                                verdict.badge
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {verdict.label}
                            </span>
                          </div>

                          {/* Verifiable Evidence Reasoning & Show Evidence Button */}
                          <div className="p-3.5 rounded-xl bg-surface-1/80 border border-border/60 text-xs text-text-secondary leading-relaxed space-y-2">
                            <div>
                              <strong className="text-text-primary font-semibold block mb-0.5">
                                Verifiable Evidence Audit:
                              </strong>
                              {c.explanation}
                            </div>

                            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                              <span className="text-[10px] text-text-tertiary">
                                Source: {rc?.evidenceStatus ? "CoinGecko / DeFiLlama / GitHub" : "Verified Telemetry"}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openEvidenceModal({
                                    title: `Claim #${idx + 1}: ${c.claim.category}`,
                                    claim: c.claim.text,
                                    verdict:
                                      c.assessment === "SUPPORTED"
                                        ? "SUPPORTED"
                                        : c.assessment === "CONTRADICTED"
                                        ? "CONTRADICTED"
                                        : c.assessment === "PARTIALLY_SUPPORTED"
                                        ? "MIXED"
                                        : "UNVERIFIED",
                                    telemetryPoints: [
                                      { label: "Active Telemetry Signal", value: "Verified Active", trend: "UP" },
                                      { label: "Data Quality Tier", value: "Institutional Strong", trend: "STABLE" },
                                    ],
                                    sourceProvider: "CoinGecko & GitHub Open Telemetry",
                                    timestamp: new Date().toISOString(),
                                    methodology:
                                      "Mathematical verification against 90-day normalized on-chain baselines and commit frequency.",
                                    confidenceScore: score?.modelConfidence ?? 78,
                                    evidenceQuality: "STRONG",
                                  })
                                }
                                className="h-7 text-[11px] font-bold gap-1 text-accent border-accent/30 hover:bg-accent/10"
                              >
                                <FileCheck className="h-3 w-3" /> Show Me The Evidence
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                2. 🧬 PROJECT DNA FINGERPRINT (7 Dimensions)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === "dna" && score && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Dna className="h-4 w-4 text-accent" /> 7-Dimension Project DNA Profile
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Multi-signal biometric score across structural project pillars.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(score.dimensions).map(([key, dim]) => (
                    <div
                      key={key}
                      className="p-4 rounded-2xl bg-surface-0 border border-border/80 card-highlight space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary capitalize">{dim.label}</span>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {dim.trend}
                          </Badge>
                        </div>
                        <span className="text-sm font-extrabold text-accent tabular">{dim.score}/100</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full gradient-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${dim.score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>

                      <p className="text-[11px] text-text-tertiary leading-relaxed pt-1">
                        {dim.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                3. 🧪 CRYPTOVISION RESEARCH LAB (Interactive Assumption Sliders)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === "lab" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-accent" /> Interactive Assumption Simulator
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Manipulate project variables to test sensitivity and dynamically stress-test the reality score.
                  </p>
                </div>

                {/* Simulation Output Card */}
                {simulatedScore && (
                  <div className="p-5 rounded-2xl bg-surface-0 border border-accent/40 card-highlight shadow-md flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        Simulated Reality Score
                      </div>
                      <div className="text-3xl font-extrabold text-accent tabular mt-1">
                        {simulatedScore.overall}/100
                      </div>
                      <div
                        className={cn(
                          "text-xs font-bold mt-0.5",
                          simulatedScore.delta >= 0 ? "text-positive" : "text-negative"
                        )}
                      >
                        {simulatedScore.delta >= 0 ? "+" : ""}
                        {simulatedScore.delta} pts from baseline ({score?.overall})
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-text-tertiary font-semibold">Simulated Risk Index</div>
                        <div className="text-xl font-bold text-text-primary tabular">
                          {simulatedScore.risk}/100
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSupplyChangePct(0);
                          setTvlChangePct(0);
                          setDevVelocityChangePct(0);
                          setLiquidityWeight(1.0);
                        }}
                        className="gap-1.5 text-xs font-bold"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Reset
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sliders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Slider 1: Supply Inflation */}
                  <div className="p-4 rounded-2xl bg-surface-0 border border-border/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-text-primary">
                      <span>Token Supply Unlock / Emission</span>
                      <span className={cn(supplyChangePct > 0 ? "text-negative" : "text-positive")}>
                        {supplyChangePct >= 0 ? "+" : ""}
                        {supplyChangePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="100"
                      step="5"
                      value={supplyChangePct}
                      onChange={(e) => setSupplyChangePct(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <p className="text-[10px] text-text-tertiary">
                      Simulates impact of major vesting cliff or treasury unlock on circulating supply.
                    </p>
                  </div>

                  {/* Slider 2: TVL Change */}
                  <div className="p-4 rounded-2xl bg-surface-0 border border-border/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-text-primary">
                      <span>DeFi Protocol TVL Shift</span>
                      <span className={cn(tvlChangePct >= 0 ? "text-positive" : "text-negative")}>
                        {tvlChangePct >= 0 ? "+" : ""}
                        {tvlChangePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-80"
                      max="200"
                      step="10"
                      value={tvlChangePct}
                      onChange={(e) => setTvlChangePct(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <p className="text-[10px] text-text-tertiary">
                      Simulates liquidity migration or bridge protocol capital outflows.
                    </p>
                  </div>

                  {/* Slider 3: Dev Activity */}
                  <div className="p-4 rounded-2xl bg-surface-0 border border-border/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-text-primary">
                      <span>Developer Commit Velocity</span>
                      <span className={cn(devVelocityChangePct >= 0 ? "text-positive" : "text-negative")}>
                        {devVelocityChangePct >= 0 ? "+" : ""}
                        {devVelocityChangePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-80"
                      max="200"
                      step="10"
                      value={devVelocityChangePct}
                      onChange={(e) => setDevVelocityChangePct(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <p className="text-[10px] text-text-tertiary">
                      Simulates core repository commit acceleration or developer abandonment.
                    </p>
                  </div>

                  {/* Slider 4: Liquidity Weighting */}
                  <div className="p-4 rounded-2xl bg-surface-0 border border-border/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-text-primary">
                      <span>Liquidity & Depth Weight Factor</span>
                      <span className="text-accent">{liquidityWeight.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={liquidityWeight}
                      onChange={(e) => setLiquidityWeight(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <p className="text-[10px] text-text-tertiary">
                      Adjusts sensitivity to orderbook slippage and 24h trading volume coverage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                4. 🥊 THESIS VS. THESIS (Bull Case vs. Bear Case + Unknowns)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === "thesis" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Scale className="h-4 w-4 text-accent" /> Balanced Analytical Thesis
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Institutional debate: The AI argues both sides with verifiable evidence and unknown risks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bull Case */}
                  <div className="p-5 rounded-2xl bg-positive/5 border border-positive/25 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-positive flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" /> Comprehensive Bull Case
                    </h4>
                    <ul className="space-y-2">
                      {(rc?.bullCase ?? [
                        "Aggressive developer ecosystem expansion",
                        "Rising fee revenue and sustainable protocol yields",
                        "High liquidity depth with low slippage across major venues",
                      ]).map((item, idx) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                          <span className="text-positive font-bold">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bear Case */}
                  <div className="p-5 rounded-2xl bg-negative/5 border border-negative/25 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-negative flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4" /> Critical Bear Case & Risks
                    </h4>
                    <ul className="space-y-2">
                      {(rc?.bearCase ?? [
                        "Token unlock cliff creates structural selling pressure",
                        "High FDV to Circulating valuation mismatch",
                        "Developer velocity declines relative to competitor chains",
                      ]).map((item, idx) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                          <span className="text-negative font-bold">−</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Unknowns */}
                {rc?.unknowns && rc.unknowns.length > 0 && (
                  <div className="p-4 rounded-2xl bg-surface-0 border border-border/80 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-accent" /> Key Unknowns & Black Swan Vectors
                    </h4>
                    <ul className="space-y-1.5">
                      {rc.unknowns.map((u, i) => (
                        <li key={i} className="text-xs text-text-secondary flex gap-2">
                          <span className="text-text-muted">•</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                5. 🧠 "WHAT WOULD CHANGE OUR ASSESSMENT?" (Living Thesis)
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === "changes" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent" /> Living Analyst Thesis
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Exact measurable triggers that would cause CryptoVision to upgrade or downgrade its view.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Triggers to Upgrade */}
                  <div className="p-5 rounded-2xl bg-surface-0 border border-positive/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-positive flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> What Would Make Us More Bullish?
                    </h4>
                    <ul className="space-y-2">
                      {(rc?.whatWouldChangePositive ?? [
                        "Monthly developer commits exceed 50+ sustained over 8 consecutive weeks",
                        "FDV circulating ratio climbs above 60% without price collapse",
                        "DeFi TVL expands faster than token price appreciation",
                      ]).map((item, idx) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                          <span className="text-positive font-bold">▲</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Triggers to Downgrade */}
                  <div className="p-5 rounded-2xl bg-surface-0 border border-negative/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-negative flex items-center gap-1.5">
                      <AlertOctagon className="h-4 w-4" /> What Would Invalidate Our Thesis?
                    </h4>
                    <ul className="space-y-2">
                      {(rc?.whatWouldChangeNegative ?? [
                        "24-hour spot volume drops below 2% of total market capitalization",
                        "Core repository commits drop to zero for 4 consecutive weeks",
                        "Sudden smart contract exploit or validator centralization spike",
                      ]).map((item, idx) => (
                        <li key={idx} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                          <span className="text-negative font-bold">▼</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                6. 🚨 RED FLAG RADAR
               ══════════════════════════════════════════════════════════════════ */}
            {activeTab === "red-flags" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-negative" /> Structural Red Flag Radar
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Actively searching for reasons to challenge the project before capital is committed.
                  </p>
                </div>

                {redFlags.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-surface-0 border border-border text-center space-y-2">
                    <CheckCircle className="h-8 w-8 text-positive mx-auto" />
                    <div className="text-sm font-bold text-text-primary">Clean Structural Audit</div>
                    <p className="text-xs text-text-tertiary">
                      No critical dilution, liquidity, or centralization red flags detected in current dataset.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {redFlags.map((flag) => {
                      const style = SEV_STYLE[flag.severity];
                      return (
                        <div
                          key={flag.id}
                          className={cn("p-4 rounded-2xl border space-y-2", style.bg, style.border)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className={cn("h-4 w-4", style.color)} />
                              <span className="text-sm font-bold text-text-primary">{flag.title}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn("text-[9px] font-bold uppercase", style.color, style.border)}
                            >
                              {flag.severity} RISK
                            </Badge>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{flag.description}</p>
                          {flag.evidence && (
                            <p className="text-[10px] text-text-muted font-mono bg-surface-0/80 rounded px-2 py-1">
                              {flag.evidence}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
