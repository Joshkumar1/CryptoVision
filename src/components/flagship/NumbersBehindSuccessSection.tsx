import React, { useState, useEffect, useRef } from "react";
import { Sparkles, TrendingUp, ShieldCheck, Activity, Cpu, ArrowUpRight, Zap, Database } from "lucide-react";
import { motion } from "framer-motion";

interface MetricItem {
  id: string;
  numberPrefix?: string;
  numberValue: number;
  numberSuffix: string;
  decimals?: number;
  label: string;
  sublabel: string;
  badge: string;
  trend: string;
  detail: string;
  accentGlow: string;
  accentText: string;
  accentBorder: string;
  icon: React.ReactNode;
}

const STAT_METRICS: MetricItem[] = [
  {
    id: "value_tracked",
    numberPrefix: "$",
    numberValue: 2.15,
    numberSuffix: "T+",
    decimals: 2,
    label: "Institutional Value Tracked",
    sublabel: "Synthesized multi-chain TVL & liquidity pools",
    badge: "99.99% Accuracy",
    trend: "+24.8% YoY",
    detail: "Ingesting 100,000+ mempool events per second across 18 RPC clusters.",
    accentGlow: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accentText: "text-[#00dc82]",
    accentBorder: "border-[#00dc82]/30",
    icon: <Database className="h-5 w-5 text-[#00dc82]" />,
  },
  {
    id: "telemetry_latency",
    numberValue: 1.8,
    numberSuffix: "ms",
    decimals: 1,
    label: "Telemetry Latency",
    sublabel: "Direct zero-hop RPC node propagation",
    badge: "Sub-Second Finality",
    trend: "-42ms vs Industry",
    detail: "Co-located infrastructure across Tokyo, Frankfurt, Singapore, and New York.",
    accentGlow: "from-cyan-500/20 via-blue-500/10 to-transparent",
    accentText: "text-cyan-400",
    accentBorder: "border-cyan-400/30",
    icon: <Zap className="h-5 w-5 text-cyan-400" />,
  },
  {
    id: "noise_filtered",
    numberValue: 99.8,
    numberSuffix: "%",
    decimals: 1,
    label: "Noise Filtered",
    sublabel: "Adversarial MEV & wash-trade elimination",
    badge: "Pure Conviction",
    trend: "Zero Hallucination",
    detail: "Triply-validated by independent neural model architectures before alert emission.",
    accentGlow: "from-amber-500/20 via-yellow-500/10 to-transparent",
    accentText: "text-amber-400",
    accentBorder: "border-amber-400/30",
    icon: <Cpu className="h-5 w-5 text-amber-400" />,
  },
  {
    id: "onchain_proofs",
    numberValue: 100,
    numberSuffix: "%",
    decimals: 0,
    label: "Cryptographic Proofs",
    sublabel: "Reproducible on-chain transaction hashes",
    badge: "Verifiable Alpha",
    trend: "100% Provenance",
    detail: "Every risk score, target, and signal links directly to immutable block proofs.",
    accentGlow: "from-purple-500/20 via-indigo-500/10 to-transparent",
    accentText: "text-purple-400",
    accentBorder: "border-purple-400/30",
    icon: <ShieldCheck className="h-5 w-5 text-purple-400" />,
  },
];

export const NumbersBehindSuccessSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    value_tracked: 0,
    telemetry_latency: 0,
    noise_filtered: 0,
    onchain_proofs: 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth Counter Animation Loop
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      // Ease-out cubic formula
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const nextCounts: { [key: string]: number } = {};
      STAT_METRICS.forEach((m) => {
        nextCounts[m.id] = parseFloat((m.numberValue * easeProgress).toFixed(m.decimals || 0));
      });

      setCounts(nextCounts);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#07080b] text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-12 overflow-hidden select-none"
    >
      
      {/* ══════════════════════════════════════════════════════════════
          1. EXACT ATMOSPHERIC AMBIENT CORNER LIGHTING (FROM REFERENCE SCREENSHOT)
          ══════════════════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 glass-grid-pattern opacity-20" />
        
        {/* Bottom-Left Corner: Glowing Emerald Light Pool */}
        <div className="absolute -bottom-24 -left-24 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#00dc82]/35 via-[#34d399]/20 to-transparent blur-[140px] animate-pulse-glow" />

        {/* Bottom-Right Corner: Glowing Silver/Cyan Beam Accent */}
        <div className="absolute -bottom-24 -right-24 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-cyan-400/30 via-blue-500/15 to-transparent blur-[140px] animate-pulse-glow" />
        
        {/* Top subtle vignette */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#07080b] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* ══════════════════════════════════════════════════════════════
            2. HIGH-IMPACT DISPLAY HEADLINE
            ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20"
        >
          <div className="max-w-2xl">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono tracking-widest text-[#00dc82] uppercase mb-5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#00dc82] animate-pulse" />
              <span>Institutional Provenance Metrics</span>
            </div>

            {/* Main Headline matching reference typography */}
            <h2 className="font-editorial text-[clamp(2.6rem,5.5vw,4.8rem)] font-normal text-white/95 leading-[1.05] tracking-tight">
              The Numbers Behind Success
            </h2>
          </div>

          <p className="max-w-md text-sm text-white/65 font-sans leading-relaxed text-balance">
            Unhurried institutional conviction quantified by real-time on-chain telemetry, multi-model consensus, and 1.8ms execution speed.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            3. ANIMATED 4-CARD METRIC GRID WITH SCROLL COUNTERS
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STAT_METRICS.map((metric, idx) => {
            const currentNum = counts[metric.id] ?? 0;
            const formattedNum = (metric.decimals && metric.decimals > 0)
              ? currentNum.toFixed(metric.decimals)
              : Math.round(currentNum).toLocaleString();

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-3xl p-6 sm:p-8 bg-[#0c0e14]/85 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col justify-between glass-shine-overlay cursor-pointer"
              >
                
                {/* Top Inner Ambient Card Glow */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${metric.accentGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {metric.icon}
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border bg-white/[0.04] ${metric.accentText} ${metric.accentBorder}`}>
                      {metric.badge}
                    </span>
                  </div>

                  {/* Animated Counter Display Number */}
                  <div className="flex items-baseline gap-1 font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white group-hover:text-[#00dc82] transition-colors duration-300">
                    {metric.numberPrefix && <span>{metric.numberPrefix}</span>}
                    <span>{formattedNum}</span>
                    <span className={metric.accentText}>{metric.numberSuffix}</span>
                  </div>

                  {/* Label & Sublabel */}
                  <h3 className="mt-3 text-lg font-bold font-sans text-white/95">
                    {metric.label}
                  </h3>
                  <p className="mt-1 text-xs text-white/55 font-sans leading-relaxed">
                    {metric.sublabel}
                  </p>
                </div>

                {/* Bottom Footer Detail */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span>{metric.trend}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Bottom Context Pill Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-center text-xs font-mono text-white/50"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00dc82] animate-pulse shadow-[0_0_8px_#00dc82]" />
            <span>REAL-TIME TELEMETRY ACTIVE</span>
          </span>
          <span className="text-white/20">•</span>
          <span>18 GLOBAL RPC NODES CO-LOCATED</span>
          <span className="text-white/20">•</span>
          <span>SLA: 99.99% VERIFIED UPTIME</span>
        </motion.div>

      </div>

    </section>
  );
};

