import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { EventPerformanceDashboard } from "@/components/dashboard/EventPerformanceDashboard";

export const EventDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080809] text-white antialiased flex flex-col selection:bg-white selection:text-black">
      {/* Top Breadcrumb & Quick Controls */}
      <header className="w-full bg-[#0d0d11] border-b border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white/70 hover:text-white transition-all border border-white/[0.06]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Flagship</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/50 font-mono">
            <span>Terminal</span>
            <span>/</span>
            <span className="text-white font-medium">Event Operations</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cluster 01 Online</span>
          </div>

          <Link
            to="/market"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all border border-white/[0.06]"
          >
            <span>Market Terminal</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Autonomous Operations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans mt-0.5">
              Protocol Event Performance &amp; Settlement Suite
            </h2>
          </div>
          <div className="text-xs text-white/40 font-mono">
            Synced with Ethereum Mainnet &bull; Block #21,489,102
          </div>
        </div>

        {/* The Core Dashboard Component */}
        <EventPerformanceDashboard className="w-full flex-1 shadow-2xl" />
      </main>

      {/* Clean Minimalist Footnote */}
      <footer className="w-full py-4 border-t border-white/[0.06] text-center text-[11px] text-white/35 font-mono">
        CryptoVision Institutional Operations &bull; NexEvent Performance Suite &bull; All Telemetry Verified
      </footer>
    </div>
  );
};
