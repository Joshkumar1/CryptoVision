import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const FlagshipHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-3 z-50 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-3rem)] max-w-7xl glass-card-premium shadow-2xl rounded-2xl transition-all">
      <div className="flex h-16 md:h-18 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        
        {/* ── Brand & Optional Ticker ── */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            {/* Geometric Polygonal Brand Symbol (Jade Glow) */}
            <div className="relative flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center bg-[#050807] border border-[#00dc82]/30 text-[#00dc82] transition-transform group-hover:scale-105 flex-shrink-0 shadow-sm shadow-[#00dc82]/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00dc82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Corner accent block */}
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#00dc82]" />
            </div>

            <div className="flex flex-col">
              <span className="font-display text-base sm:text-xl font-black tracking-tight text-white uppercase leading-none whitespace-nowrap">
                Crypto<span className="text-[#00dc82]">Vision</span>
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.22em] text-[#34d399]/70 whitespace-nowrap">
                Institutional AI
              </span>
            </div>
          </Link>

          {/* Institutional Ticker Ribbon (Only on ultra-wide screens to prevent cramming) */}
          <div className="hidden 2xl:flex items-center gap-2 text-xs font-semibold tracking-wide text-white/80 border-l border-[#00dc82]/20 pl-4 flex-shrink-0 whitespace-nowrap">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00dc82] animate-pulse flex-shrink-0 shadow-sm shadow-[#00dc82]"></span>
            <span className="font-mono uppercase font-bold text-white/90">NASDAQ: $CV-AI —</span>
            <span className="font-mono text-[#00dc82] font-bold">ALPHA: +142.8%</span>
          </div>
        </div>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 flex-shrink-0">
          <a
            href="#strategy"
            className="text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-[#00dc82] whitespace-nowrap"
          >
            Strategy
          </a>
          <a
            href="#advantage"
            className="text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-[#00dc82] whitespace-nowrap"
          >
            Advantage
          </a>
          <a
            href="#performance"
            className="text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-[#00dc82] whitespace-nowrap"
          >
            Performance
          </a>
          <a
            href="#pillars"
            className="text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-[#00dc82] whitespace-nowrap"
          >
            Trust Pillars
          </a>
          <a
            href="#research"
            className="text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-[#00dc82] whitespace-nowrap"
          >
            Research
          </a>
        </nav>

        {/* ── Header Actions (Jade Cobra Solid CTA) ── */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <Link
            to="/overview"
            className="group relative inline-flex items-center gap-2 sm:gap-2.5 btn-jade-primary px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-all flex-shrink-0 whitespace-nowrap"
          >
            <span>Launch Terminal</span>
            <span className="flex h-5 w-5 items-center justify-center bg-[#050807] text-[#00dc82] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#00dc82]/20 text-white hover:bg-[#00dc82]/10 lg:hidden flex-shrink-0 rounded-lg"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer (Obsidian Jade) ── */}
      {mobileMenuOpen && (
        <div className="border-t border-[#00dc82]/15 bg-[#070c09]/95 backdrop-blur-xl px-6 py-6 lg:hidden animate-in slide-in-from-top-2 duration-200 text-white rounded-b-2xl">
          <nav className="flex flex-col gap-4">
            <a
              href="#strategy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-[#00dc82] py-1.5 border-b border-white/5"
            >
              Our Strategy
            </a>
            <a
              href="#advantage"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-[#00dc82] py-1.5 border-b border-white/5"
            >
              Our Advantage
            </a>
            <a
              href="#performance"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-[#00dc82] py-1.5 border-b border-white/5"
            >
              Systematic Performance
            </a>
            <a
              href="#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-[#00dc82] py-1.5 border-b border-white/5"
            >
              The 6 Pillars
            </a>
            <a
              href="#research"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-[#00dc82] py-1.5 border-b border-white/5"
            >
              Research &amp; Intelligence
            </a>
            <Link
              to="/overview"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 inline-flex items-center justify-between btn-jade-primary px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-lg"
            >
              <span>Open Trading Terminal</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
