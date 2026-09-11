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

export const EventPerformanceShowcase: React.FC = () => {
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

  const rotX = viewMode === "isometric" ? 12 - mousePos.y * 8 : 0;
  const rotY = viewMode === "isometric" ? -8 + mousePos.x * 12 : 0;
  const rotZ = viewMode === "isometric" ? 2 - mousePos.x * 2 : 0;

  return (
    <section
      id="operations-showcase"
      className="relative w-full py-24 md:py-32 overflow-hidden bg-[#080809]"
    >
      {/* ══════════════════════════════════════════════════════════════
          1. CINEMATIC MISTY FOREST MOUNTAIN BACKDROP (FROM REFERENCE)
          ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/editorial/misty_forest_backdrop.jpg"
          alt="Atmospheric misty mountain pine forest backdrop"
          className="w-full h-full object-cover object-center opacity-40 filter contrast-125 brightness-75 scale-105 transition-transform duration-1000"
        />
        {/* Soft Vignette and Blending Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-[#080809] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080809] via-transparent to-[#080809] opacity-80" />
        <div className="absolute inset-0 bg-[#080809]/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ══════════════════════════════════════════════════════════════
            2. TOP BANNER HEADLINES (EXACT TEXT FROM REFERENCE IMAGE)
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 sm:pb-16 border-b border-white/[0.08]">
          
          {/* Left Headline */}
          <div className="flex items-start gap-3.5 max-w-md">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-1 shadow-inner">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                Automate 80% of Key Event Tasks Efficiently
              </h3>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Autonomous workflow distribution, cross-venue settlements, and real-time scheduling automation.
              </p>
            </div>
          </div>

          {/* Center Showcase Controls */}
          <div className="flex items-center gap-2 bg-[#121217]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl self-center">
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
            <Link
              to="/events"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
              title="Open full page dashboard"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Link>
          </div>

          {/* Right Headline */}
          <div className="flex items-start gap-3.5 max-w-md">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-purple-400 flex-shrink-0 mt-1 shadow-inner">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                Real-Time Intelligence for Flawless Execution
              </h3>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Live turnover tracking, granular margin analytics, and predictive attendee behavior telemetry.
              </p>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. 3D ISOMETRIC FLOATING DASHBOARD CANVAS
            ══════════════════════════════════════════════════════════════ */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mt-8 sm:mt-12 w-full flex items-center justify-center"
          style={{
            perspective: viewMode === "isometric" ? "2000px" : "none",
          }}
        >
          {/* Ambient Glow Aura behind Dashboard */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10"
            style={{
              transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
            }}
          />

          {/* 3D Angled Shell */}
          <div
            className="w-full transition-transform ease-out duration-200 will-change-transform"
            style={{
              transform:
                viewMode === "isometric"
                  ? `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0.96)`
                  : "none",
              transformStyle: "preserve-3d",
            }}
          >
            {/* The Live Interactive Dashboard */}
            <EventPerformanceDashboard className="w-full" />
          </div>

        </div>

        {/* Bottom Interactive Hint */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40 font-mono pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE INTERACTIVE PREVIEW &bull; CLICK ANY METRIC OR CHART TO EXPLORE</span>
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
