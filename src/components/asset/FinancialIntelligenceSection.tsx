import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  FinancialIntelligence,
  UserThesis,
  ResearchPriorityState,
} from "@/types";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Coins,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Brain,
  Scale,
  Sparkles,
  PieChart,
  BarChart3,
  Flame,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  Database,
  Lock,
  Compass,
  FileText,
  Save,
  Check,
  Plus,
  Trash2,
  Sliders,
  ExternalLink,
  Target,
  Zap,
  FlaskConical,
} from "lucide-react";

interface FinancialIntelligenceSectionProps {
  financial: FinancialIntelligence;
}

type FinancialTab =
  | "overview"
  | "economics"
  | "supply"
  | "valuation"
  | "scenarios"
  | "governance"
  | "thesis";

export function FinancialIntelligenceSection({ financial }: FinancialIntelligenceSectionProps) {
  const [activeTab, setActiveTab] = useState<FinancialTab>("overview");
  const { theses, saveThesis } = useAppStore();

  const coinId = financial.coinId;
  const existingThesis = theses[coinId];

  // User Scenario Assumptions State (Section 54)
  const [userUserGrowth, setUserUserGrowth] = useState(15);
  const [userRevGrowth, setUserRevGrowth] = useState(25);
  const [userDilution, setUserDilution] = useState(8);
  const [userMultiple, setUserMultiple] = useState(1.2);
  const [thesisReviewed, setThesisReviewed] = useState(false);

  // User Thesis Form State

  const [hypothesis, setHypothesis] = useState(
    existingThesis?.coreHypothesis || "Investigate fundamental adoption velocity and fee capture sustainability."
  );
  const [assumptions, setAssumptions] = useState<string[]>(
    existingThesis?.keyAssumptions || [
      "Active address growth sustains post-catalyst",
      "No sudden unannounced cliff supply unlock",
    ]
  );
  const [catalysts, setCatalysts] = useState<string[]>(
    existingThesis?.expectedCatalysts || ["Upcoming protocol milestone upgrade"]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveThesis = () => {
    const newThesis: UserThesis = {
      coinId,
      title: `${coinId.toUpperCase()} Investment Thesis`,
      coreHypothesis: hypothesis,
      keyAssumptions: assumptions,
      expectedCatalysts: catalysts,
      majorRisks: [financial.snapshot.primaryRisk],
      openQuestions: financial.researchGaps,
      lastUpdated: new Date().toISOString(),
    };
    saveThesis(newThesis);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="glass-panel border border-white/12 rounded-3xl overflow-hidden card-highlight shadow-2xl space-y-0 border-t-white/20">
      {/* ── Section Header ── */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-0/50 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-accent/15 border border-accent/30 text-accent backdrop-blur-md">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-text-primary tracking-tight">
                Corporate Finance &amp; Valuation Suite
              </h2>
              <Badge variant="mint" className="text-[10px] font-mono uppercase font-bold">
                Fundamental Grounding
              </Badge>
            </div>
            <p className="text-xs text-text-tertiary mt-0.5">
              Deterministic protocol accounting, token value capture, float dilution dynamics, and competitive moats.
            </p>
          </div>
        </div>

        <div className="text-xs text-text-muted font-mono flex items-center gap-2">
          <span>Engine Calibration:</span>
          <strong className="text-emerald-400 font-bold">DETERMINISTIC V2.5</strong>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex border-b border-white/10 bg-surface-0/60 backdrop-blur-md overflow-x-auto">

        {[
          { id: "overview",   label: "🧭 Overview & Signals", icon: Compass },
          { id: "economics",  label: "💵 Economics & Value Capture", icon: Coins },
          { id: "supply",     label: "📦 Supply & Ownership", icon: PieChart },
          { id: "valuation",  label: "⚖️ Valuation & Moat", icon: Scale },
          { id: "scenarios",  label: "🧪 Scenario Lab", icon: FlaskConical },
          { id: "governance", label: "🛡️ Governance & Security", icon: ShieldCheck },
          { id: "thesis",     label: "🧠 Living Thesis Memory", icon: Brain },
        ].map((tab) => {

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FinancialTab)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap",
                isActive
                  ? "border-gold text-gold bg-gold/15 shadow-inner"
                  : "border-transparent text-text-tertiary hover:text-text-primary hover:bg-white/[0.06]"
              )}
            >

              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active Tab Content Area ── */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 1: OVERVIEW & SIGNAL DRIVERS                           */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Why It Matters Now Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-accent/10 via-surface-2/60 to-surface-1 border border-accent/30">
                <div className="flex items-center gap-2 mb-2 text-accent font-bold text-xs uppercase tracking-wider font-mono">
                  <Flame className="h-4 w-4" />
                  Why This Project Matters Now
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-surface-0/70 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Primary Driver</span>
                    <span className="text-xs font-bold text-text-primary">{financial.whyItMattersNow.primaryDriver}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-0/70 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Secondary Driver</span>
                    <span className="text-xs font-bold text-text-primary">{financial.whyItMattersNow.secondaryDriver}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-0/70 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">Risk Driver</span>
                    <span className="text-xs font-bold text-rose-400">{financial.whyItMattersNow.riskDriver}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed bg-surface-0/40 p-3 rounded-xl border border-border/40">
                  {financial.whyItMattersNow.relationshipNarrative}
                </p>
              </div>

              {/* Information Change & Divergence Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Information Change Engine */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-accent" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                        Information Change Engine
                      </h3>
                    </div>
                    <Badge
                      variant={financial.informationChange.velocity === "ACCELERATING" ? "positive" : "secondary"}
                      className="text-[10px] font-mono uppercase"
                    >
                      {financial.informationChange.velocity}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Compares current momentum against historical 30-day and 90-day baseline levels to filter out short-term noise.
                  </p>
                  <div className="divide-y divide-border/60 text-xs">
                    {financial.informationChange.metrics.map((m, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between">
                        <span className="text-text-secondary font-medium">{m.label}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="font-bold text-text-primary">{m.current}</span>
                          <span className="text-text-muted text-[10px]">(prev: {m.previous})</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0 uppercase",
                              m.status === "ACCELERATING" ? "text-emerald-400 border-emerald-500/30" : "text-text-muted"
                            )}
                          >
                            {m.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-1 border border-border text-[11px] text-text-secondary">
                    {financial.informationChange.conclusion}
                  </div>
                </div>

                {/* Fundamental vs Market Divergence */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                          Fundamental vs. Market Divergence
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono uppercase text-accent border-accent/40">
                        {financial.fundamentalDivergence.state.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-1 border border-border/80 my-3">
                      <div className="text-xs font-bold text-text-primary mb-1">
                        {financial.fundamentalDivergence.headline}
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {financial.fundamentalDivergence.interpretation}
                      </p>
                    </div>
                  </div>

                  {/* Signal Anomalies */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                      Observed Signal Divergences
                    </span>
                    {financial.signalAnomalies.map((anom) => (
                      <div key={anom.id} className="p-2.5 rounded-xl bg-surface-1 border border-border text-xs flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-text-primary">{anom.pair}: </span>
                          <span className="text-text-secondary">{anom.divergence} </span>
                          <span className="text-[10px] text-text-muted block mt-0.5">{anom.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Completeness Breakdown */}
              <div className="p-4 rounded-2xl bg-surface-0/40 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-accent" />
                  <div>
                    <span className="font-bold text-text-primary block">Data Coverage &amp; Confidence Calibration</span>
                    <span className="text-text-tertiary text-[11px]">{financial.dataCoverage.confidenceDefinition}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span>Market: <strong>{financial.dataCoverage.market}%</strong></span>
                  <span>Tokenomics: <strong>{financial.dataCoverage.tokenomics}%</strong></span>
                  <span>Developer: <strong>{financial.dataCoverage.developer}%</strong></span>
                  <span>On-Chain: <strong>{financial.dataCoverage.onChain}%</strong></span>
                  <Badge variant="mint" className="text-[10px]">
                    {financial.dataCoverage.overall}% Overall
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 2: ECONOMICS & VALUE CAPTURE                           */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "economics" && (
            <motion.div
              key="economics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Adoption Quality vs Incentive Dependency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Adoption Quality */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      Adoption Quality Engine
                    </h3>
                    <Badge variant={financial.adoptionQuality.status === "STRONG" ? "positive" : "secondary"}>
                      {financial.adoptionQuality.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Evaluates whether observed transactions reflect economically meaningful retention or temporary sybil farming.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Estimated Users</span>
                      <span className="font-bold text-text-primary">{financial.adoptionQuality.activeUsers}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">30d Retention</span>
                      <span className="font-bold text-emerald-400">{financial.adoptionQuality.retentionRate}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Tx Frequency</span>
                      <span className="font-bold text-text-primary">{financial.adoptionQuality.txFrequency}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Fee Generation</span>
                      <span className="font-bold text-text-primary">{financial.adoptionQuality.feeGeneration}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border text-[11px] text-text-secondary">
                    {financial.adoptionQuality.assessment}
                  </div>
                </div>

                {/* Incentive Dependency */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Incentive Dependency Engine
                    </h3>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {financial.incentiveDependency.classification.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Separates organic protocol usage from activity purchased via token reward subsidies.
                  </p>

                  {/* Organic vs Incentivized Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-emerald-400">Organic: {financial.incentiveDependency.organicActivityPct}%</span>
                      <span className="text-amber-400">Incentivized: {financial.incentiveDependency.incentivizedActivityPct}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-surface-2 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: `${financial.incentiveDependency.organicActivityPct}%` }}
                      />
                      <div
                        className="bg-amber-500 transition-all"
                        style={{ width: `${financial.incentiveDependency.incentivizedActivityPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-1 border border-border space-y-1.5 text-xs">
                    <div className="text-[10px] font-mono text-text-muted">
                      Reward Emissions: <strong>{financial.incentiveDependency.rewardEmissionRate}</strong>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {financial.incentiveDependency.detail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unit Economics Table */}
              <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    Protocol Unit Economics
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {financial.unitEconomics.protocolCategory}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-[10px] text-text-muted block font-sans">Rev / Active User</span>
                    <span className="text-sm font-bold text-text-primary">{financial.unitEconomics.revenuePerActiveUser}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-[10px] text-text-muted block font-sans">Fees / Active User</span>
                    <span className="text-sm font-bold text-text-primary">{financial.unitEconomics.feesPerActiveUser}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-[10px] text-text-muted block font-sans">Revenue / TVL Ratio</span>
                    <span className="text-sm font-bold text-text-primary">{financial.unitEconomics.revenueToTvlRatio}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border">
                    <span className="text-[10px] text-text-muted block font-sans">Incentive / Revenue</span>
                    <span className="text-sm font-bold text-amber-400">{financial.unitEconomics.incentiveToRevenueRatio}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                  <strong>Sustainability Verdict:</strong> {financial.unitEconomics.sustainabilityAssessment}
                </p>
              </div>

              {/* Token Value Capture & Token Necessity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Token Value Capture */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Lock className="h-4 w-4 text-accent" />
                      Token Value Capture Mechanism
                    </h3>
                    <Badge variant={financial.tokenValueCapture.status === "STRONG" ? "positive" : "secondary"}>
                      {financial.tokenValueCapture.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Analyzes whether protocol commercial success programmatically accrues value to the native token.
                  </p>
                  <div className="space-y-2 text-xs">
                    {financial.tokenValueCapture.mechanisms.map((mech, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                        <div>
                          <span className="font-bold text-text-primary block">{mech.type}</span>
                          <span className="text-[10px] text-text-muted">{mech.description}</span>
                        </div>
                        <Badge
                          variant={mech.active ? "positive" : "outline"}
                          className="text-[9px] font-mono uppercase"
                        >
                          {mech.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                    {financial.tokenValueCapture.structuralAnalysis}
                  </p>
                </div>

                {/* Token Necessity Test */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-accent" />
                        Token Necessity Test
                      </h3>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono text-accent border-accent/40">
                        {financial.tokenNecessity.classification}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-tertiary leading-relaxed mb-3">
                      "Would the product still function materially the same without the native token?"
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Demand Drivers</span>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-text-secondary text-[11px]">
                          {financial.tokenNecessity.demandDrivers.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Supply Inflation Sinks</span>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-text-secondary text-[11px]">
                          {financial.tokenNecessity.supplyDrivers.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border mt-3">
                    {financial.tokenNecessity.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 3: SUPPLY, OWNERSHIP & TREASURY                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "supply" && (
            <motion.div
              key="supply"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Supply Dynamics & Unlock Absorption */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Supply Dynamics */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-accent" />
                      Supply Dynamics &amp; Float Analysis
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Float: {financial.supplyDynamics.currentFloatPct}%
                    </Badge>
                  </div>

                  {/* Float bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-emerald-400">Circulating Float: {financial.supplyDynamics.currentFloatPct}%</span>
                      <span className="text-rose-400">Locked / Future: {financial.supplyDynamics.futureFloatPct}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-surface-2 overflow-hidden flex">
                      <div className="bg-emerald-500" style={{ width: `${financial.supplyDynamics.currentFloatPct}%` }} />
                      <div className="bg-rose-500" style={{ width: `${financial.supplyDynamics.futureFloatPct}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-sans">Annualized Dilution</span>
                      <span className="font-bold text-amber-400">+{financial.supplyDynamics.annualizedDilutionPct}% / yr</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-sans">Upcoming Unlock</span>
                      <span className="font-bold text-text-primary">{financial.supplyDynamics.upcomingUnlockAmount}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                    {financial.supplyDynamics.potentialSupplyPressure}
                  </p>
                </div>

                {/* Unlock Absorption Risk */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Scale className="h-4 w-4 text-accent" />
                      Unlock Absorption Risk
                    </h3>
                    <Badge
                      variant={
                        financial.unlockAbsorption.riskTier === "LOW"
                          ? "positive"
                          : financial.unlockAbsorption.riskTier === "MODERATE"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {financial.unlockAbsorption.riskTier} RISK
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Compares upcoming cliff unlock volume against 30-day average daily liquidity depth.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-sans">Unlock vs. 24h Vol</span>
                      <span className="font-bold text-text-primary">{financial.unlockAbsorption.unlockVsDailyVolume}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-sans">Unlock vs. Float</span>
                      <span className="font-bold text-text-primary">{financial.unlockAbsorption.unlockVsLiquidFloat}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                    {financial.unlockAbsorption.depthAssessment}
                  </p>
                </div>
              </div>

              {/* Ownership Structure & Treasury Resilience */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Who Owns This Token */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-accent" />
                      Who Owns This Token?
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Concentration: {financial.ownershipStructure.concentrationRisk}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    {financial.ownershipStructure.breakdown.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                        <div>
                          <span className="font-bold text-text-primary">{item.category}</span>
                          <span className="text-[10px] text-text-muted block font-mono">Attribution: {item.attribution}</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-text-primary">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                    {financial.ownershipStructure.details}
                  </p>
                </div>

                {/* Treasury Resilience & Whale Activity */}
                <div className="space-y-5">
                  {/* Treasury */}
                  <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" />
                        Treasury Resilience
                      </h3>
                      <Badge variant={financial.treasuryResilience.status === "STRONG" ? "positive" : "secondary"}>
                        {financial.treasuryResilience.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] text-text-muted block font-sans">Treasury Assets</span>
                        <span className="font-bold text-text-primary">{financial.treasuryResilience.treasuryValueUsd}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] text-text-muted block font-sans">Estimated Runway</span>
                        <span className="font-bold text-emerald-400">{financial.treasuryResilience.estimatedRunway}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                      {financial.treasuryResilience.survivalAssessment}
                    </p>
                  </div>

                  {/* Large Holder Activity */}
                  <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                        <Activity className="h-4 w-4 text-accent" />
                        Large Holder Activity (7-Day)
                      </h3>
                      <Badge variant="outline" className="text-[10px] font-mono uppercase">
                        {financial.largeHolderActivity.trend}
                      </Badge>
                    </div>
                    <div className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border space-y-1">
                      <div>Net Flow: <strong>{financial.largeHolderActivity.exchangeTransfers7d}</strong></div>
                      <div>{financial.largeHolderActivity.narrative}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 4: VALUATION & COMPETITIVE MOAT                       */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "valuation" && (
            <motion.div
              key="valuation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Relative Valuation Multiples Table */}
              <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Scale className="h-4 w-4 text-accent" />
                      Relative Valuation Multiples
                    </h3>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      Benchmarked against: <strong>{financial.valuationContext.peerGroup}</strong>
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Sector Quartiles
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {financial.valuationContext.multiples.map((mult, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-1 border border-border space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-text-primary">{mult.metric}</span>
                        <Badge
                          variant={mult.quartile === "TOP_QUARTILE" ? "outline" : "secondary"}
                          className="text-[9px] font-mono uppercase"
                        >
                          {mult.quartile.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-2 font-mono">
                        <span className="text-xl font-extrabold text-text-primary">{mult.projectValue}</span>
                        <span className="text-xs text-text-muted">vs peer {mult.peerMedian}</span>
                      </div>
                      <p className="text-[10px] text-text-tertiary leading-relaxed pt-1 border-t border-border/40">
                        {mult.relevance}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                  <strong>Growth vs. Valuation Verdict:</strong> {financial.valuationContext.growthVsValuationCheck}
                </p>
              </div>

              {/* Competitive Moat & Dependency Risk */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Competitive Moat */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      Competitive Moat Engine
                    </h3>
                    <Badge variant={financial.competitiveMoat.moatStrength === "STRONG" ? "positive" : "secondary"}>
                      {financial.competitiveMoat.moatStrength} MOAT
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    "What prevents another well-capitalized team from reproducing this protocol?"
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Network Effects</span>
                      <span className="font-bold text-text-primary">{financial.competitiveMoat.networkEffects}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Switching Costs</span>
                      <span className="font-bold text-text-primary">{financial.competitiveMoat.switchingCosts}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Reproducibility Defense</span>
                      <span className="text-text-secondary text-[11px]">{financial.competitiveMoat.reproducibilityDefense}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-1 border border-border text-[11px] text-emerald-400 font-mono">
                    {financial.competitiveMoat.marketShareTrend}
                  </div>
                </div>

                {/* Dependency Risk Map */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Layers className="h-4 w-4 text-accent" />
                      Dependency Risk Map
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {financial.dependencyAnalysis.overallRisk} RISK
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Identifies single points of failure across underlying Layer 1s, oracles, bridges, and custodians.
                  </p>
                  <div className="space-y-2 text-xs">
                    {financial.dependencyAnalysis.dependencies.map((dep, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-surface-1 border border-border flex items-center justify-between">
                        <div>
                          <span className="font-bold text-text-primary">{dep.component}</span>
                          <span className="text-[10px] text-text-muted block">{dep.entity}</span>
                        </div>
                        <Badge
                          variant={dep.risk === "LOW" ? "positive" : "secondary"}
                          className="text-[9px] font-mono uppercase"
                        >
                          {dep.risk}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border text-[11px] text-rose-400 space-y-1">
                    <span className="font-bold block uppercase text-[10px]">Critical Failure Vectors:</span>
                    {financial.dependencyAnalysis.criticalFailureVectors.map((v, i) => (
                      <div key={i}>• {v}</div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB: SCENARIO LAB (Sections 53 & 54)                       */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "scenarios" && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Section Header */}
              <div className="p-4 rounded-2xl glass-panel border border-white/12 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent/15 text-accent border border-accent/30">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-text-primary">
                        Scenario Lab: Multi-Regime Stress Modeling
                      </h3>
                      <Badge variant="mint" className="text-[10px] uppercase font-mono font-bold">
                        Probabilistic Boundary Tests
                      </Badge>
                    </div>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      Deterministic stress cases modeling network throughput, fee capture sustainability, float dilution, and multiple re-rating.
                    </p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-text-muted">
                  Protocol Calibration: <strong className="text-emerald-400">Deterministic V2.5</strong>
                </div>
              </div>

              {/* 4 Probabilistic Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  financial.scenarioLab?.baseCase ?? {
                    name: "Base Case",
                    probability: "55%",
                    assumptions: ["Network activity compounds +15% pace", "Current emission schedule proceeds without cliff shocks"],
                    networkActivity: "Steady +15% active address retention",
                    economicActivity: "Fee capture maintains margin baseline",
                    tokenomicsImpact: "Gradual float expansion absorbed by normal daily volume",
                    liquidityOutlook: "Orderbook depth resilient within 1.5% slippage",
                    valuationMultiple: "Multiples aligned near peer median (1.0x)",
                    primaryRiskVector: "Gradual competitor fee compression",
                  },
                  financial.scenarioLab?.bullCase ?? {
                    name: "Bull Case",
                    probability: "25%",
                    assumptions: ["Upcoming protocol upgrade triggers 2.5x throughput", "Major institutional liquidity integrations accelerate"],
                    networkActivity: "Accelerating +45% YoY daily active address growth",
                    economicActivity: "Protocol fee generation expands 80% above baseline",
                    tokenomicsImpact: "Token burn / fee-share achieves net-deflationary pressure",
                    liquidityOutlook: "Exchange depth doubles; bid-ask spreads compress",
                    valuationMultiple: "Valuation re-rates to upper quartile (>1.6x peer median)",
                    primaryRiskVector: "Validator congestion under extreme burst load",
                  },
                  financial.scenarioLab?.bearCase ?? {
                    name: "Bear Case",
                    probability: "15%",
                    assumptions: ["User retention softens post-incentive campaign", "Vesting cliff unlocks create persistent supply overhang"],
                    networkActivity: "-15% contraction in active transaction throughput",
                    economicActivity: "Protocol revenue drops 30% as incentives taper",
                    tokenomicsImpact: "Unlock volume exceeds 40% of 30-day average volume",
                    liquidityOutlook: "Market maker depth widens by 35%, increasing slippage",
                    valuationMultiple: "Multiple compresses toward lower quartile (0.6x peer median)",
                    primaryRiskVector: "Cascading unlock absorption fatigue",
                  },
                  financial.scenarioLab?.stressCase ?? {
                    name: "Stress Case",
                    probability: "5%",
                    assumptions: ["Systemic smart-contract exploit or regulatory shock", "Liquidity pools suffer severe withdrawal shock (>50% outflow)"],
                    networkActivity: "Drastic contraction in daily transactions; bridge flows halt",
                    economicActivity: "Fee generation collapses below baseline operational breakeven",
                    tokenomicsImpact: "Panic unstaking and accelerated float liquidity extraction",
                    liquidityOutlook: "Severe orderbook illiquidity; slippage spikes over 6.5%",
                    valuationMultiple: "Extreme multiple compression below 0.35x peer median",
                    primaryRiskVector: "Treasury runway depletion under prolonged stress regime",
                  },
                ].map((sc, i) => {
                  const isBull = sc.name === "Bull Case";
                  const isBear = sc.name === "Bear Case";
                  const isStress = sc.name === "Stress Case";

                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-4 rounded-2xl border space-y-3 glass-card flex flex-col justify-between",
                        isBull
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : isBear
                          ? "border-amber-500/30 bg-amber-500/5"
                          : isStress
                          ? "border-rose-500/30 bg-rose-500/5"
                          : "border-accent/30 bg-accent/5"
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={cn(
                              "text-xs font-black uppercase font-mono tracking-wider",
                              isBull ? "text-emerald-400" : isBear ? "text-amber-400" : isStress ? "text-rose-400" : "text-accent"
                            )}
                          >
                            {sc.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            Prob: {sc.probability}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Assumptions</span>
                            <ul className="text-[11px] text-text-secondary space-y-0.5 mt-0.5">
                              {sc.assumptions.map((asm, j) => (
                                <li key={j} className="line-clamp-2">• {asm}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-2 rounded-xl bg-surface-0/60 border border-white/10 space-y-1">
                            <div className="text-[10px] text-text-tertiary font-bold uppercase">Expected Throughput</div>
                            <div className="text-xs font-bold text-text-primary">{sc.networkActivity}</div>
                          </div>

                          <div className="p-2 rounded-xl bg-surface-0/60 border border-white/10 space-y-1">
                            <div className="text-[10px] text-text-tertiary font-bold uppercase">Tokenomics &amp; Dilution</div>
                            <div className="text-[11px] text-text-secondary">{sc.tokenomicsImpact}</div>
                          </div>

                          <div className="p-2 rounded-xl bg-surface-0/60 border border-white/10 space-y-1">
                            <div className="text-[10px] text-text-tertiary font-bold uppercase">Valuation Multiple</div>
                            <div className="text-xs font-bold text-gold font-mono">{sc.valuationMultiple}</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] uppercase font-bold text-rose-400 block">Primary Risk Vector:</span>
                        <span className="text-[11px] text-text-muted mt-0.5 block">{sc.primaryRiskVector}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive User Assumption Sandbox (Section 54) */}
              <div className="p-5 rounded-2xl glass-panel border border-gold/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <Sliders className="h-5 w-5 text-gold" />
                    <div>
                      <h4 className="text-sm font-black text-text-primary flex items-center gap-2">
                        Interactive User Assumption Sandbox (Section 54)
                      </h4>
                      <p className="text-xs text-text-tertiary">
                        Modify key fundamental parameters to model custom research outcomes. Labeled explicitly as user assumptions.
                      </p>
                    </div>
                  </div>
                  <Badge variant="gold" className="text-[10px] uppercase font-mono font-bold">
                    [USER ASSUMPTION]
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Slider 1: User Growth */}
                  <div className="p-3.5 rounded-xl bg-surface-0/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-secondary text-[11px]">User Growth YoY</span>
                      <span className="font-mono font-black text-accent">{userUserGrowth > 0 ? `+${userUserGrowth}%` : `${userUserGrowth}%`}</span>
                    </div>
                    <input
                      type="range"
                      min={-20}
                      max={100}
                      step={5}
                      value={userUserGrowth}
                      onChange={(e) => setUserUserGrowth(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <div className="text-[10px] text-text-muted flex justify-between font-mono">
                      <span>-20%</span>
                      <span>Baseline (+15%)</span>
                      <span>+100%</span>
                    </div>
                  </div>

                  {/* Slider 2: Revenue Acceleration */}
                  <div className="p-3.5 rounded-xl bg-surface-0/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-secondary text-[11px]">Protocol Revenue Δ</span>
                      <span className="font-mono font-black text-emerald-400">{userRevGrowth > 0 ? `+${userRevGrowth}%` : `${userRevGrowth}%`}</span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={150}
                      step={5}
                      value={userRevGrowth}
                      onChange={(e) => setUserRevGrowth(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                    <div className="text-[10px] text-text-muted flex justify-between font-mono">
                      <span>-50%</span>
                      <span>Baseline (+25%)</span>
                      <span>+150%</span>
                    </div>
                  </div>

                  {/* Slider 3: Annual Float Dilution */}
                  <div className="p-3.5 rounded-xl bg-surface-0/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-secondary text-[11px]">Annual Float Dilution</span>
                      <span className="font-mono font-black text-rose-400">+{userDilution}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={2}
                      value={userDilution}
                      onChange={(e) => setUserDilution(Number(e.target.value))}
                      className="w-full accent-rose-400"
                    />
                    <div className="text-[10px] text-text-muted flex justify-between font-mono">
                      <span>0% (Fixed)</span>
                      <span>Controlled</span>
                      <span>50% Cliff</span>
                    </div>
                  </div>

                  {/* Slider 4: Valuation Multiple Multiplier */}
                  <div className="p-3.5 rounded-xl bg-surface-0/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-secondary text-[11px]">Multiple Multiplier</span>
                      <span className="font-mono font-black text-gold">{userMultiple.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={3.0}
                      step={0.1}
                      value={userMultiple}
                      onChange={(e) => setUserMultiple(Number(e.target.value))}
                      className="w-full accent-gold"
                    />
                    <div className="text-[10px] text-text-muted flex justify-between font-mono">
                      <span>0.5x (Bear)</span>
                      <span>1.0x (Median)</span>
                      <span>3.0x (Euphoria)</span>
                    </div>
                  </div>
                </div>

                {/* Recalculated Output Box */}
                <div className="p-3.5 rounded-xl bg-surface-1/80 border border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="gold" className="text-[10px] font-mono">
                      USER SCENARIO OUTCOME
                    </Badge>
                    <span className="text-text-secondary">
                      Net Implied Multiple: <strong className="text-gold font-mono text-sm">{(userMultiple * (1 + userRevGrowth / 100) / (1 + userDilution / 100)).toFixed(2)}x</strong>
                    </span>
                    <span className="text-border">|</span>
                    <span className="text-text-secondary">
                      Dilution Drag: <strong className="text-rose-400 font-mono">-{userDilution}%</strong>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUserUserGrowth(15);
                      setUserRevGrowth(25);
                      setUserDilution(8);
                      setUserMultiple(1.2);
                    }}
                    className="text-[10px] h-7 font-bold"
                  >
                    Reset Baseline
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 6: GOVERNANCE & SECURITY                               */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "governance" && (

            <motion.div
              key="governance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Decentralization Reality Check */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Lock className="h-4 w-4 text-accent" />
                      Decentralization Reality Check
                    </h3>
                    <Badge variant={financial.decentralizationReality.status === "SUPPORTED" ? "positive" : "secondary"}>
                      {financial.decentralizationReality.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Compares public marketing claims of decentralization against observable validator and admin key architecture.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Validator Concentration</span>
                      <span className="font-bold text-text-primary">{financial.decentralizationReality.validatorConcentration}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Multisig Control</span>
                      <span className="font-bold text-text-primary">{financial.decentralizationReality.multisigControl}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Emergency Pause Controls</span>
                      <span className="text-text-secondary text-[11px]">{financial.decentralizationReality.emergencyPowers}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                    {financial.decentralizationReality.observedVsClaim}
                  </p>
                </div>

                {/* Security Profile (Audited != Safe) */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Security Profile &amp; Audit Audit
                    </h3>
                    <Badge variant="mint" className="text-[10px]">
                      Audited Architecture
                    </Badge>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span><strong>Fundamental Rule:</strong> Audited does NOT equal Safe. Audits evaluate code bugs, not economic exploit vectors.</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Independent Auditors</span>
                      <div className="flex gap-2 mt-1">
                        {financial.securityProfile.auditors.map((aud, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] font-mono">{aud}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Bug Bounty Program</span>
                      <span className="font-bold text-emerald-400">{financial.securityProfile.bugBounty}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                      <span className="text-[10px] text-text-muted block font-medium">Exploit History</span>
                      <span className="font-bold text-text-primary">{financial.securityProfile.exploitHistory}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary bg-surface-1 p-3 rounded-xl border border-border">
                    {financial.securityProfile.summary}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TAB 6: LIVING THESIS MEMORY & RESEARCH GAPS                */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeTab === "thesis" && (
            <motion.div
              key="thesis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* ── Does Your Thesis Still Hold? (Section 58) ── */}
              <div className="p-4 rounded-2xl glass-panel border border-gold/40 shadow-lg space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-gold animate-pulse" />
                    <div>
                      <h4 className="text-xs font-black uppercase text-text-primary tracking-wide flex items-center gap-2">
                        Does Your Thesis Still Hold? (Section 58 Evidence Cross-Check)
                      </h4>
                      <p className="text-[11px] text-text-tertiary">
                        Comparing your testable assumptions against the latest deterministic on-chain and market data.
                      </p>
                    </div>
                  </div>
                  <Badge variant={thesisReviewed ? "positive" : "warning"} className="text-[10px] font-mono uppercase">
                    {thesisReviewed ? "Thesis Verified" : "Review Recommended"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-0/60 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-secondary text-[11px]">Assumption 1: User Growth Sustains</span>
                      <span className="text-emerald-400 font-bold font-mono">🟢 SUPPORTED</span>
                    </div>
                    <p className="text-[11px] text-text-tertiary">
                      On-chain active address velocity is {financial.informationChange.velocity} with {financial.adoptionQuality.activeUsers} active accounts.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-0/60 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-secondary text-[11px]">Assumption 2: Supply Overhang Absorbed</span>
                      <span className="text-amber-400 font-bold font-mono">🟡 MODERATE OVERHANG</span>
                    </div>
                    <p className="text-[11px] text-text-tertiary">
                      Upcoming unlock: {financial.supplyDynamics.upcomingUnlockAmount} scheduled for {financial.supplyDynamics.upcomingUnlockDate}. Absorption tier: {financial.unlockAbsorption.riskTier}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setThesisReviewed(true)}
                    className="text-xs font-bold h-7"
                  >
                    Confirm Thesis Holds
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setHypothesis((prev) => prev + " [Updated: Factoring recent unlock absorption metrics]");
                      setThesisReviewed(true);
                    }}
                    className="text-xs font-bold h-7 bg-gold text-slate-950 hover:bg-gold-hover"
                  >
                    Update Thesis Assumptions
                  </Button>
                </div>
              </div>

              {/* My Thesis vs CryptoVision Assessment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* My Thesis (Editable Form) */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                        <Brain className="h-4 w-4 text-accent" />
                        My Living Thesis (Analyst Workspace)
                      </h3>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Persistent Memory
                      </Badge>
                    </div>
                    <p className="text-xs text-text-tertiary leading-relaxed mb-3">
                      Record your personal thesis, test assumptions against empirical data, and retain research memory over time.
                    </p>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                          Core Investment Hypothesis
                        </label>
                        <textarea
                          value={hypothesis}
                          onChange={(e) => setHypothesis(e.target.value)}
                          rows={3}
                          className="w-full rounded-xl bg-surface-1 border border-border p-3 text-xs text-text-primary focus:border-accent focus:outline-none"
                          placeholder="Write why you think this asset is interesting..."
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">
                          Key Testable Assumptions
                        </label>
                        <div className="space-y-1.5">
                          {assumptions.map((assump, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Input
                                value={assump}
                                onChange={(e) => {
                                  const updated = [...assumptions];
                                  updated[i] = e.target.value;
                                  setAssumptions(updated);
                                }}
                                className="text-xs h-8 bg-surface-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveThesis}
                    className="w-full mt-4 gap-2 font-bold text-xs"
                    variant={savedSuccess ? "mint" : "default"}
                  >
                    {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {savedSuccess ? "Thesis Saved to Research Workspace!" : "Save Thesis to Workspace"}
                  </Button>

                </div>

                {/* CryptoVision Empirical Assessment */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                        <Compass className="h-4 w-4 text-accent" />
                        CryptoVision Empirical Assessment
                      </h3>
                      <Badge variant="mint" className="text-[10px] font-mono">
                        Objective Telemetry
                      </Badge>
                    </div>
                    <p className="text-xs text-text-tertiary leading-relaxed mb-3">
                      Independent algorithmic synthesis derived from on-chain telemetry, free from confirmation bias.
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] text-text-muted block font-medium">Priority Rating</span>
                        <span className="font-bold text-accent">{financial.researchPriority.priority} PRIORITY</span>
                        <p className="text-[11px] text-text-secondary mt-0.5">{financial.researchPriority.primaryReason}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] text-text-muted block font-medium">Largest Structural Risk</span>
                        <span className="font-bold text-rose-400">{financial.researchPriority.mainRisk}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] text-text-muted block font-medium">Core Contradiction</span>
                        <span className="font-bold text-text-primary">{financial.fundamentalDivergence.headline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-1 border border-border text-[11px] text-text-secondary mt-3">
                    <strong>Next Verification Action:</strong> {financial.researchPriority.nextResearchAction}
                  </div>
                </div>
              </div>

              {/* Research Gaps & What Should I Verify Next */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Research Gaps */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-accent" />
                    What We Don't Know (Research Gaps)
                  </h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Transparent disclosure of missing parameters where current public data is incomplete.
                  </p>
                  <div className="space-y-2 text-xs">
                    {financial.researchGaps.map((gap, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-surface-1 border border-border flex items-start gap-2">
                        <span className="text-accent font-bold font-mono">•</span>
                        <span className="text-text-secondary">{gap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prioritized Checklist */}
                <div className="p-5 rounded-2xl bg-surface-0/50 border border-border/80 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    What Should I Verify Next?
                  </h3>
                  <div className="space-y-2 text-xs">
                    {financial.researchChecklist.map((chk) => (
                      <div key={chk.priority} className="p-2.5 rounded-xl bg-surface-1 border border-border space-y-1">
                        <div className="flex items-center gap-2 font-bold text-text-primary">
                          <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono text-[10px]">
                            #{chk.priority}
                          </span>
                          <span>{chk.question}</span>
                        </div>
                        <p className="text-[10px] text-text-muted pl-6">
                          <strong>Method:</strong> {chk.verificationMethod}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analyst Bias Warnings */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Cognitive &amp; Analytical Bias Warnings</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {financial.biasWarnings.map((bias, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-surface-1 border border-border text-[11px]">
                      <span className="font-bold text-text-primary block">{bias.bias}</span>
                      <span className="text-text-secondary">{bias.warning}</span>
                      <span className="text-[10px] text-text-muted block mt-1 font-mono">Trigger: {bias.trigger}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
