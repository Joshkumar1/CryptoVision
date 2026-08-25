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
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      icon: Sparkles,
      tagline: "Simplified plain-English analogies, glossary tooltips, and guided safety checks.",
      tone: "NEUTRAL & EDUCATIONAL",
    },
    RESEARCH: {
      label: "Research Mode",
      badge: "Due Diligence",
      color: "border-accent/30 bg-accent/10 text-accent",
      icon: Brain,
      tagline: "Structured Claim ➔ Evidence ➔ Verdict audit matrix and living thesis triggers.",
      tone: "NEUTRAL & EVIDENCE-BASED",
    },
    ANALYST: {
      label: "Analyst Mode",
      badge: "Institutional Quant",
      color: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      icon: FlaskConical,
      tagline: "Raw telemetry data, feature importance breakdown, and assumption sensitivity sliders.",
      tone: "NEUTRAL & QUANTITATIVE",
    },
  };

  const current = SEGMENT_CONFIG[persona];
  const Icon = current.icon;

  return (
    <div className="p-3.5 rounded-2xl bg-surface-1 border border-border/80 card-highlight flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-xl border flex-shrink-0", current.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-text-primary text-xs">{current.label}</span>
            <Badge variant="outline" className="text-[9px] font-bold uppercase">
              {current.badge}
            </Badge>
            <span className="text-[10px] font-mono text-text-tertiary">
              • Posture: <strong className="text-text-secondary">{current.tone}</strong>
            </span>
          </div>
          <p className="text-text-tertiary text-[11px] mt-0.5">{current.tagline}</p>
        </div>
      </div>

      {/* Segment Switcher Buttons */}
      <div className="flex items-center gap-1 bg-surface-0 p-1 rounded-xl border border-border self-start md:self-auto">
        {(["EXPLORE", "RESEARCH", "ANALYST"] as const).map((p) => {
          const isSelected = persona === p;
          return (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all capitalize",
                isSelected
                  ? p === "EXPLORE"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs"
                    : p === "RESEARCH"
                    ? "bg-accent/20 text-accent border border-accent/30 shadow-xs"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-xs"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
              )}
            >
              {p.toLowerCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
