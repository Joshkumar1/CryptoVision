import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { cn } from "@/lib/utils";

import type { FinancialIntelligence, ResearchPriorityState } from "@/types";
import {
  Zap,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Scale,
} from "lucide-react";

interface ResearchSnapshotCardProps {
  financial: FinancialIntelligence;
}

const PRIORITY_META: Record<
  ResearchPriorityState,
  { label: string; bg: string; text: string; border: string; glow: string; icon: React.ElementType }
> = {
  VERY_HIGH: {
    label: "VERY HIGH RESEARCH PRIORITY",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    icon: Zap,
  },
  HIGH: {
    label: "HIGH RESEARCH PRIORITY",
    bg: "bg-accent/15",
    text: "text-accent",
    border: "border-accent/40",
    glow: "shadow-[0_0_20px_rgba(245,197,66,0.2)]",
    icon: Sparkles,
  },
  MODERATE: {
    label: "MODERATE RESEARCH PRIORITY",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
    glow: "shadow-none",
    icon: Clock,
  },
  LOW: {
    label: "LOW RESEARCH PRIORITY",
    bg: "bg-surface-2",
    text: "text-text-tertiary",
    border: "border-border",
    glow: "shadow-none",
    icon: Scale,
  },
  WATCH: {
    label: "DEFENSIVE WATCH / CAUTION",
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/40",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
    icon: AlertOctagon,
  },
};

export function ResearchSnapshotCard({ financial }: ResearchSnapshotCardProps) {
  const [showTransparency, setShowTransparency] = useState(false);
  const snap = financial.snapshot;
  const maturity = snap.maturity || financial.maturityProfile?.stage || "ESTABLISHED";
  const pMeta = PRIORITY_META[snap.researchPriority] || PRIORITY_META.MODERATE;
  const PriorityIcon = pMeta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-3xl border glass-panel p-6 shadow-2xl card-highlight transition-all overflow-hidden relative border-t-white/20",
        pMeta.border,
        pMeta.glow
      )}
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* ── Top Bar: Priority Badge & Coverage ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-1.5 rounded-xl border backdrop-blur-md", pMeta.bg, pMeta.border, pMeta.text)}>
            <PriorityIcon className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-xs font-black tracking-wider uppercase font-mono", pMeta.text)}>
                {pMeta.label}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono text-text-tertiary">
                60-Second Snapshot
              </Badge>
              <Badge
                variant="secondary"
                className="text-[10px] font-mono font-bold uppercase text-purple-300 border border-purple-400/30"
              >
                Maturity: {maturity}
              </Badge>
            </div>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Deterministic synthesis of current momentum, information velocity, valuation, and thesis risks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs self-start sm:self-auto font-mono flex-wrap">
          <span className="text-text-muted">
            Coverage: <strong className="text-text-primary">{snap.dataCoverage}%</strong>
          </span>
          <span className="text-border">|</span>
          <span className="text-text-muted">
            Evidence: <strong className="text-emerald-400">{snap.evidenceQuality}</strong>
          </span>
          <span className="text-border">|</span>
          <span className="text-text-muted">
            Risk: <strong className={cn(snap.risk === "LOW" ? "text-emerald-400" : snap.risk === "VERY_HIGH" ? "text-rose-400" : "text-amber-400")}>{snap.risk}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTransparency(!showTransparency)}
            className="text-[10px] h-6 px-2 text-accent hover:text-accent-hover font-bold border border-accent/30 rounded-lg"
          >
            {showTransparency ? "Hide Weights" : "Score Weights"}
          </Button>
        </div>
      </div>

      {/* ── Score Transparency Multi-Factor Decomposition (Section 51) ── */}
      {showTransparency && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-5 p-4 rounded-2xl bg-surface-0/80 border border-accent/40 backdrop-blur-xl shadow-inner space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-text-primary">
                Multi-Signal Quantitative Score Transparency
              </span>
            </div>
            <span className="text-[10px] font-mono text-text-tertiary">
              Deterministic Attribution V2.5
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {(financial.scoreTransparency?.components ?? [
              { dimension: "Adoption", weightPct: 20, score: 84 },
              { dimension: "Developer", weightPct: 15, score: 78 },
              { dimension: "Technology", weightPct: 15, score: 82 },
              { dimension: "Tokenomics", weightPct: 15, score: 72 },
              { dimension: "Market Depth", weightPct: 10, score: 90 },
              { dimension: "Value Capture", weightPct: 10, score: 85 },
              { dimension: "Risk Inversion", weightPct: 15, score: 88 },
            ]).map((comp, i) => (
              <div key={i} className="p-2 rounded-xl bg-surface-1/80 border border-white/10">
                <span className="text-[10px] text-text-tertiary font-medium block truncate">
                  {comp.dimension} ({comp.weightPct}%)
                </span>
                <span className="text-sm font-extrabold text-text-primary font-mono block mt-0.5">
                  {comp.score}/100
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-muted leading-relaxed">
            * Scores reflect empirical multi-signal confirmation. No single metric dictates quality or opportunity.
          </p>
        </motion.div>
      )}


      {/* ── Primary Quantitative Snapshot Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-0/50 backdrop-blur-md border border-white/10">
          <ScoreRing score={snap.projectIntelligence} size={48} strokeWidth={4} />
          <div>
            <span className="text-lg font-black text-text-primary block leading-none font-mono">
              {snap.projectIntelligence}/100
            </span>
            <span className="text-[10px] text-text-tertiary block font-medium">Intelligence Score</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-0/50 backdrop-blur-md border border-white/10">
          <ScoreRing score={snap.opportunity} size={48} strokeWidth={4} />
          <div>
            <span className="text-lg font-black text-text-primary block leading-none font-mono">
              {snap.opportunity}/100
            </span>
            <span className="text-[10px] text-text-tertiary block font-medium">Asymmetric Score</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-surface-0/50 backdrop-blur-md border border-white/10 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
            Primary Driver
          </span>
          <span className="text-xs font-bold text-text-primary line-clamp-1">
            {snap.primaryDriver}
          </span>
          <span className="text-[10px] text-accent mt-0.5 block line-clamp-1">
            Accelerating 30d Baseline
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-surface-0/50 backdrop-blur-md border border-white/10 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
            Primary Risk Vector
          </span>
          <span className="text-xs font-bold text-rose-400 line-clamp-1">
            {snap.primaryRisk}
          </span>
          <span className="text-[10px] text-text-tertiary mt-0.5 block line-clamp-1">
            Structural Supply Pressure
          </span>
        </div>
      </div>

      {/* ── Granular 4-Quadrant Analyst Matrix ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Biggest Contradiction */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-500/30 glass-card-hover">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-[11px] uppercase tracking-wide">Biggest Contradiction</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {snap.biggestContradiction}
          </p>
        </div>

        {/* Biggest Unknown */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-500/30 glass-card-hover">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
            <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-[11px] uppercase tracking-wide">Biggest Unknown</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {snap.biggestUnknown}
          </p>
        </div>

        {/* Most Important Catalyst */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 backdrop-blur-md border border-purple-500/30 glass-card-hover">
          <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
            <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-[11px] uppercase tracking-wide">Key Near-Term Catalyst</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {snap.mostImportantCatalyst}
          </p>
        </div>

        {/* Next Verification Step */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 glass-card-hover">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-[11px] uppercase tracking-wide">Next Verification Action</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
            {snap.nextVerificationStep}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
