import React from "react";
import type { AiObservation } from "@/types/intelligence";
import { Sparkles, Activity, ShieldCheck, Clock, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiIntelligenceLayerProps {
  observations: AiObservation[];
  title?: string;
  className?: string;
}

export const AiIntelligenceLayer: React.FC<AiIntelligenceLayerProps> = ({
  observations,
  title = "AI Intelligence Layer — Empirical Observations",
  className,
}) => {
  if (!observations || observations.length === 0) return null;

  return (
    <div className={cn("p-5 rounded-3xl bg-[#090d16] border border-[#00dc82]/20 shadow-xl relative overflow-hidden", className)}>
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#00dc82]/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00dc82]/15 text-[#00dc82] border border-[#00dc82]/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-mono text-white tracking-wide">{title}</h4>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Data-Supported • Non-Sensational • Real-Time Synthetic Commentary
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono text-white/60">
          <ShieldCheck className="h-3 w-3 text-[#00dc82]" />
          <span>Verified Data Provenance</span>
        </div>
      </div>

      <div className="space-y-3">
        {observations.map((obs) => {
          const confidencePercent = Math.round(obs.confidenceScore * 100);
          return (
            <div
              key={obs.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-mono font-semibold text-[10px] text-white">
                    {obs.topic}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-white/40">
                    <Clock className="h-3 w-3" />
                    {obs.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-white/50">Confidence:</span>
                  <span className="font-bold text-[#00dc82]">{confidencePercent}%</span>
                </div>
              </div>

              <p className="text-xs font-sans text-white/90 leading-relaxed pl-1">
                "{obs.observation}"
              </p>

              <div className="flex items-center justify-between text-[9px] font-mono text-white/40 pt-1">
                <span>Data Source: Cryptographic On-Chain Telemetry & Order Book Feeds</span>
                <span className="text-amber-400/80 italic">Not future return financial advice</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
