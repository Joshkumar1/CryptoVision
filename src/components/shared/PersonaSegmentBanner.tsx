import { motion } from "framer-motion";
import { useAppStore } from "@/stores/appStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, Brain, FlaskConical, Scale, Info } from "lucide-react";

export function PersonaSegmentBanner() {
  const { persona, setPersona } = useAppStore();

  const SEGMENT_CONFIG = {
    EXPLORE: {
      label: "Explore Mode",
      badge: "Beginner & Visual",
      color: "border-[#00dc82]/35 bg-[#00dc82]/15 text-[#00dc82] backdrop-blur-md shadow-[0_0_15px_rgba(0,220,130,0.15)]",
      badgeClass: "bg-[#00dc82]/15 text-[#00dc82] border-[#00dc82]/30 backdrop-blur-md",
      activeBtnClass: "bg-[#00dc82]/20 text-[#00dc82] border border-[#00dc82]/40 font-bold shadow-sm backdrop-blur-md",
      icon: Sparkles,
      tagline: "Simplified plain-English analogies, beginner glossary, visual market digest, and guided safety checks.",
      tone: "EDUCATIONAL & INTUITIVE",
      features: ["Plain-English summaries", "Safety checklists", "Visual analogies"],
    },
    RESEARCH: {
      label: "Research Mode",
      badge: "Due Diligence & Audit",
      color: "border-[#2f80ed]/35 bg-[#2f80ed]/15 text-[#2f80ed] backdrop-blur-md shadow-[0_0_15px_rgba(47,128,237,0.15)]",
      badgeClass: "bg-[#2f80ed]/15 text-[#2f80ed] border-[#2f80ed]/30 backdrop-blur-md",
      activeBtnClass: "bg-[#2f80ed]/20 text-[#2f80ed] border border-[#2f80ed]/40 font-bold shadow-sm backdrop-blur-md",
      icon: Brain,
      tagline: "Structured Claim ➔ Evidence ➔ Verdict audit matrix, token unlock dilution alerts, and living thesis triggers.",
      tone: "EVIDENCE-BASED & VERIFIABLE",
      features: ["Claim vs. Reality audits", "Unlock schedules", "Living thesis triggers"],
    },
    ANALYST: {
      label: "Analyst Mode",
      badge: "Institutional Quant",
      color: "border-[#ff5b5b]/35 bg-[#ff5b5b]/15 text-[#ff5b5b] backdrop-blur-md shadow-[0_0_15px_rgba(255,91,91,0.15)]",
      badgeClass: "bg-[#ff5b5b]/15 text-[#ff5b5b] border-[#ff5b5b]/30 backdrop-blur-md",
      activeBtnClass: "bg-[#ff5b5b]/20 text-[#ff5b5b] border border-[#ff5b5b]/40 font-bold shadow-sm backdrop-blur-md",
      icon: FlaskConical,
      tagline: "Raw quantitative telemetry data, SHAP explainable ML feature attribution, and assumption sensitivity sliders.",
      tone: "QUANTITATIVE & STATISTICAL",
      features: ["SHAP ML decomposition", "Volatility σ indices", "Sensitivity sliders"],
    },
  };

  const current = SEGMENT_CONFIG[persona];
  const Icon = current.icon;

  return (
    <div className="p-4 sm:p-5 rounded-2xl serene-card border border-white/10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs transition-all">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className={cn("p-2.5 rounded-xl border flex-shrink-0 shadow-sm", current.color)}>
          <Icon className="h-4.5 w-4.5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm tracking-tight">{current.label}</span>
            <span className={cn("text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border", current.badgeClass)}>
              {current.badge}
            </span>
            <span className="text-[10px] font-mono text-white/40">
              • Posture: <strong className="text-white font-medium">{current.tone}</strong>
            </span>
          </div>
          <p className="text-white/60 text-xs mt-1 leading-relaxed max-w-2xl">{current.tagline}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {current.features.map((feat) => (
              <span
                key={feat}
                className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-white/60"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Switcher Buttons */}
      <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10 self-start lg:self-center shadow-sm">
        {(["EXPLORE", "RESEARCH", "ANALYST"] as const).map((p) => {
          const isSelected = persona === p;
          return (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={cn(
                "px-3.5 py-1 rounded-full text-xs font-mono transition-all capitalize flex items-center gap-1.5",
                isSelected
                  ? "bg-white text-black font-semibold shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04] font-medium"
              )}
            >
              {p === "EXPLORE" && <Sparkles className="h-3 w-3" />}
              {p === "RESEARCH" && <Brain className="h-3 w-3" />}
              {p === "ANALYST" && <FlaskConical className="h-3 w-3" />}
              <span>{p.toLowerCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
