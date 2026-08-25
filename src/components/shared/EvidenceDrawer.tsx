import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Clock,
  Database,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  FileCheck,
  Scale,
} from "lucide-react";

const VERDICT_META = {
  SUPPORTED: {
    label: "On-Chain Supported",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
    dot: "🟢",
  },
  CONTRADICTED: {
    label: "Contradicted / Conflict",
    color: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: XCircle,
    dot: "🔴",
  },
  MIXED: {
    label: "Mixed Evidence",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
    dot: "🟡",
  },
  UNVERIFIED: {
    label: "Unverified Claim",
    color: "bg-surface-2 text-text-tertiary border-border",
    icon: HelpCircle,
    dot: "⚪",
  },
};

export function EvidenceDrawer() {
  const { evidenceModalData, closeEvidenceModal } = useAppStore();

  if (!evidenceModalData) return null;

  const verdict = VERDICT_META[evidenceModalData.verdict] ?? VERDICT_META.UNVERIFIED;
  const VerdictIcon = verdict.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEvidenceModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Slide-out Drawer */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className="relative z-10 w-full max-w-xl bg-surface-1 border-l border-border/80 shadow-2xl h-full flex flex-col justify-between overflow-hidden card-highlight"
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between gap-3 bg-surface-2/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent/20 text-accent">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                  Evidence Audit Trail & Provenance
                  <Badge variant="mint" className="text-[9px] uppercase font-bold">
                    Zero-Hallucination
                  </Badge>
                </h3>
                <p className="text-[11px] text-text-tertiary">
                  Verifiable data lineage and mathematical scoring breakdown.
                </p>
              </div>
            </div>

            <button
              onClick={closeEvidenceModal}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-3 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Claim & Verdict Card */}
            <div className="p-5 rounded-2xl bg-surface-0 border border-border/80 space-y-3 card-highlight">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  Audited Hypothesis / Claim
                </span>
                <span
                  className={cn(
                    "text-xs font-extrabold px-2.5 py-1 rounded-xl border flex items-center gap-1.5",
                    verdict.color
                  )}
                >
                  <VerdictIcon className="h-3.5 w-3.5" />
                  {verdict.label}
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary leading-snug">
                "{evidenceModalData.claim}"
              </h4>
            </div>

            {/* Verifiable Telemetry Points */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-accent" /> Measured Telemetry Points
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evidenceModalData.telemetryPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface-0 border border-border/80 space-y-1"
                  >
                    <span className="text-[10px] font-bold uppercase text-text-tertiary block">
                      {pt.label}
                    </span>
                    <div className="text-lg font-extrabold text-text-primary tabular font-mono">
                      {pt.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology & Calculation Explanation */}
            <div className="p-4 rounded-2xl bg-surface-0 border border-border/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-accent" /> Verification Methodology
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                {evidenceModalData.methodology}
              </p>
            </div>

            {/* Data Provenance & Lineage */}
            <div className="p-4 rounded-2xl bg-surface-2/60 border border-border space-y-2.5 text-xs">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                Data Provenance & Verification
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-text-tertiary block">Provider:</span>
                  <strong className="text-text-primary">{evidenceModalData.sourceProvider}</strong>
                </div>
                <div>
                  <span className="text-text-tertiary block">Quality Tier:</span>
                  <strong className="text-positive font-semibold">
                    {evidenceModalData.evidenceQuality} EVIDENCE
                  </strong>
                </div>
                <div>
                  <span className="text-text-tertiary block">Timestamp:</span>
                  <span className="text-text-secondary font-mono">
                    {new Date(evidenceModalData.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary block">Confidence Index:</span>
                  <strong className="text-accent font-mono">
                    {evidenceModalData.confidenceScore}% Model Confidence
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface-2/80 flex items-center justify-between gap-3">
            <span className="text-[11px] text-text-tertiary">
              CryptoVision Deterministic Evidence Model v2.5
            </span>
            <Button size="sm" onClick={closeEvidenceModal} className="font-bold text-xs">
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
