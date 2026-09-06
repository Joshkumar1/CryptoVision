import React from "react";
import { useExpertiseStore } from "@/stores/expertiseStore";
import type { ExpertiseLevel } from "@/stores/expertiseStore";
import { Sparkles, Shield, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExpertiseSelector: React.FC<{ className?: string }> = ({ className }) => {
  const { level, setLevel } = useExpertiseStore();

  const options: Array<{ id: ExpertiseLevel; label: string; icon: typeof Sparkles; color: string }> = [
    { id: "BEGINNER", label: "Beginner", icon: Shield, color: "text-emerald-400" },
    { id: "INTERMEDIATE", label: "Intermediate", icon: Sparkles, color: "text-amber-400" },
    { id: "ADVANCED", label: "Advanced", icon: Cpu, color: "text-cyan-400" },
  ];

  return (
    <div className={cn("inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md select-none", className)}>
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-2 hidden sm:inline-block">
        Mode:
      </span>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = level === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLevel(opt.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer",
              active
                ? "bg-white text-black font-semibold shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/[0.06]"
            )}
          >
            <Icon className={cn("h-3 w-3", active ? "text-black" : opt.color)} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
