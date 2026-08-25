import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  Brain,
  Database,
  Lock,
  Scale,
  FileCheck2,
  Info,
} from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: FileCheck2,
    title: "Deterministic Grounding",
    summary:
      "All Project Reality Scores, Red Flags, and Opportunity rankings are computed mathematically from raw telemetry data. The AI language layer only summarizes verified structured facts—it never hallucinates metrics.",
  },
  {
    icon: Database,
    title: "Multi-Source Provenance",
    summary:
      "Telemetry is sourced and cross-validated across independent institutional data providers (CoinGecko for spot markets, DeFiLlama for TVL, GitHub API for developer velocity, on-chain contracts for token unlocks).",
  },
  {
    icon: Scale,
    title: "Balanced Contrarian Thesis",
    summary:
      "CryptoVision deliberately searches for failure vectors and bearish contradictions rather than promoting speculative hype. Every research report enforces Bull Case, Bear Case, and Key Unknowns.",
  },
  {
    icon: Lock,
    title: "Zero-Hype & Non-Advisory",
    summary:
      "CryptoVision is strictly an investigative due-diligence workstation. It does not provide personalized financial, legal, or investment advice, nor does it generate speculative '100x' profit predictions.",
  },
];

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Telemetry Ingestion & Throttling",
    desc: "Public and on-chain telemetry is gathered with serialized queue schedulers and cached in resilient time-series stores.",
  },
  {
    step: "02",
    title: "Normalization & Anomaly Cleansing",
    desc: "Raw volumes, liquidity ratios, and commit counts are normalized against historical 90-day baselines to filter out wash-trading.",
  },
  {
    step: "03",
    title: "Claim vs. Evidence Matrix",
    desc: "Project claims are mapped against measurable thresholds to generate 🟢 Supported, 🟡 Mixed, or 🔴 Contradicted verdicts.",
  },
  {
    step: "04",
    title: "Failure Vector Risk Scan",
    desc: "Token unlocks, FDV/MCap dilution ratios, and whale centralization are checked to populate the Red Flag Radar.",
  },
];

export function TrustCenterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
            <ShieldCheck className="h-5 w-5 text-accent animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            CryptoVision Trust & Methodology Center
          </h1>
          <Badge variant="mint" className="text-[10px] uppercase font-bold">
            Audit Ready
          </Badge>
        </div>
        <p className="text-sm text-text-tertiary ml-11">
          Full transparency into our data sources, mathematical scoring formulas, AI grounding rules, and analytical limitations.
        </p>
      </div>

      {/* ── Core Trust Pillars ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRUST_PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <Card key={idx} className="card-highlight">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" />
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-text-secondary leading-relaxed">{p.summary}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── 4-Stage Verification Methodology ── */}
      <div className="p-6 rounded-2xl bg-surface-1 border border-border/80 card-highlight space-y-4">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Brain className="h-4 w-4 text-accent" /> The 4-Stage Research Verification Pipeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {METHODOLOGY_STEPS.map((m) => (
            <div key={m.step} className="p-4 rounded-xl bg-surface-0 border border-border/60 space-y-1.5">
              <div className="text-xs font-mono font-extrabold text-accent">{m.step}</div>
              <div className="text-xs font-bold text-text-primary">{m.title}</div>
              <p className="text-[11px] text-text-tertiary leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Verified Data Providers ── */}
      <div className="p-6 rounded-2xl bg-surface-1 border border-border/80 card-highlight space-y-4">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Database className="h-4 w-4 text-accent" /> Verified Telemetry Providers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-surface-0 border border-border/60 space-y-1">
            <div className="font-bold text-text-primary">CoinGecko v3 Pro</div>
            <div className="text-text-tertiary text-[11px]">
              Spot pricing, market cap, circulating/FDV supply, and 7-day sparkline curves.
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-0 border border-border/60 space-y-1">
            <div className="font-bold text-text-primary">DeFiLlama Telemetry</div>
            <div className="text-text-tertiary text-[11px]">
              Smart contract Total Value Locked (TVL), protocol fees, and cross-chain volume.
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-0 border border-border/60 space-y-1">
            <div className="font-bold text-text-primary">GitHub Open-Source Data</div>
            <div className="text-text-tertiary text-[11px]">
              Core repository commit frequency, merged pull requests, and contributor velocity.
            </div>
          </div>
        </div>
      </div>

      {/* ── Legal & Regulatory Notice ── */}
      <div className="p-5 rounded-2xl bg-surface-2/60 border border-border/80 text-xs text-text-secondary leading-relaxed space-y-2">
        <h3 className="font-bold text-text-primary flex items-center gap-2">
          <Info className="h-4 w-4 text-accent" /> Compliance & Non-Financial Advice Notice
        </h3>
        <p>
          CryptoVision AI is a research, educational, and due-diligence technology platform. All scores, metrics, and AI memos represent quantitative calculations based on publicly available data feeds. Nothing on this website constitutes personalized investment, financial, or legal advice. Digital asset markets are highly volatile; always conduct independent research before committing capital.
        </p>
      </div>
    </motion.div>
  );
}
