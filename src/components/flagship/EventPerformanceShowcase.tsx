import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Maximize2,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { EventPerformanceDashboard } from "@/components/dashboard/EventPerformanceDashboard";

interface EventPerformanceShowcaseProps {
  isHero?: boolean;
  onSwitchHeroMode?: () => void;
  hasCoinOption?: boolean;
}

export const EventPerformanceShowcase: React.FC<EventPerformanceShowcaseProps> = ({
  isHero = false,
  onSwitchHeroMode,
  hasCoinOption = false,
}) => {
  const [viewMode, setViewMode] = useState<"isometric" | "flat">("isometric");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle smooth gyroscopic perspective tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== "isometric") return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const rotX = viewMode === "isometric" ? 11 - mousePos.y * 9 : 0;
  const rotY = viewMode === "isometric" ? -7 + mousePos.x * 11 : 0;
  const rotZ = viewMode === "isometric" ? 1.8 - mousePos.x * 2 : 0;

  return (
    <section
      id="operations"
      className={`relative w-full overflow-hidden bg-[#080809] select-none transition-all duration-500 ${
        isHero ? "pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 min-h-[92vh] flex flex-col justify-center" : "py-20 md:py-28"
      }`}
    >
      {/* ══════════════════════════════════════════════════════════════
          1. CINEMATIC MISTY FOREST MOUNTAIN & NEBULA BACKDROP (IMAGE 1)
          ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/editorial/misty_forest_backdrop.jpg"
          alt="Atmospheric misty mountain pine forest backdrop"
          className="w-full h-full object-cover object-center opacity-35 filter contrast-125 brightness-75 scale-105 transition-transform duration-1000"
        />
        {/* Soft Vignette and Blending Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-[#080809] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-transparent to-[#080809] opacity-85" />
        {/* Deep Purple & Indigo Nebula Ambient Glow (as shown in Image 1) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-fuchsia-600/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-[#080809]/30 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        
        {/* ══════════════════════════════════════════════════════════════
            2. TOP CONTROLS & STATUS DOCK
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 sm:pb-8">
          
          {/* Status Badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-white/80 font-medium tracking-wide uppercase">
              Live Operations Telemetry v2.4
            </span>
          </div>

          {/* Interactive Perspective & View Controls */}
          <div className="flex items-center gap-2 bg-[#121217]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={() => setViewMode("isometric")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                viewMode === "isometric"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Boxes className="h-3.5 w-3.5" />
              <span>3D Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("flat")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                viewMode === "flat"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Flat Interactive</span>
            </button>
            
            {hasCoinOption && onSwitchHeroMode && (
              <button
                type="button"
                onClick={onSwitchHeroMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/20 transition-all cursor-pointer"
                title="Switch to 4K Sovereign Reserve Coin"
              >
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">4K Sovereign Coin</span>
              </button>
            )}

            <Link
              to="/events"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
              title="Open dedicated operational terminal"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Link>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. 3D ISOMETRIC FLOATING DASHBOARD CANVAS (MATCHING IMAGE 1)
            ══════════════════════════════════════════════════════════════ */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full flex items-center justify-center transition-all duration-300"
          style={{
            perspective: viewMode === "isometric" ? "2200px" : "none",
          }}
        >
          {/* Ambient Glow Aura behind Dashboard */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent blur-3xl pointer-events-none -z-10"
            style={{
              transform: `translate(${mousePos.x * 35}px, ${mousePos.y * 35}px)`,
            }}
          />

          {/* 3D Angled Shell */}
          <div
            className="w-full transition-transform ease-out duration-200 will-change-transform"
            style={{
              transform:
                viewMode === "isometric"
                  ? `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0.97)`
                  : "none",
              transformStyle: "preserve-3d",
            }}
          >
            {/* The Live Interactive Dashboard */}
            <EventPerformanceDashboard className="w-full" />
          </div>

        </div>

        {/* Bottom Interactive Hint */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40 font-mono pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>INTERACTIVE TELEMETRY &bull; HOVER TO TILT &bull; CLICK ANY METRIC OR CHART TO EXPLORE</span>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
          >
            <span>Launch Dedicated Operational Terminal</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </section>
  );
};
