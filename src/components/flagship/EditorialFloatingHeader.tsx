import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ArrowUpRight, Shield, Activity, Sparkles, BookOpen, Compass, Cpu, Layers } from "lucide-react";
import { GlobalCurrencySelector } from "@/components/shared/GlobalCurrencySelector";

export const EditorialFloatingHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Escape closes overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchItems = [
    { title: "Neural Consensus Alpha Score", category: "Core Intelligence", path: "/overview" },
    { title: "Whale Wallet Flow Radar", category: "On-Chain Telemetry", path: "/discover" },
    { title: "Institutional Due Diligence Dossier", category: "Research", path: "/due-diligence" },
    { title: "Mempool De-Noising Architecture", category: "Methodology", path: "/#philosophy" },
    { title: "Sovereign ETF Net Inflows (BTC/ETH)", category: "Macro Liquidity", path: "/market" },
    { title: "Dynamic VaR Hedging & Drawdown Shield", category: "Risk Systems", path: "/risk-radar" },
    { title: "Zero-Knowledge Rollup Provenance", category: "Cryptography", path: "/learn" },
  ];

  const filteredSearch = searchQuery.trim() === ""
    ? searchItems
    : searchItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          1. FLOATING IVORY CAPSULE HEADER (MATCHES THE REFERENCE)
          ══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl shadow-2xl"
            : "top-0 left-0 right-0 w-full translate-x-0 max-w-full shadow-md"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled
              ? "pill-nav-ivory rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 border border-white/40 shadow-2xl gap-3 md:gap-6"
              : "bg-[#f5f5f3] text-[#121212] rounded-none border-b border-black/15 px-4 sm:px-10 lg:px-14 py-3 sm:py-3.5 gap-4 md:gap-8 w-full"
          }`}
        >
          
          {/* Brand Mark (Left) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="CryptoVision Home"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141414] text-white text-xs font-serif italic font-bold transition-transform group-hover:scale-110 shadow-sm">
              ✦
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-sm sm:text-base tracking-tight text-[#141414] leading-tight flex items-center gap-1">
                CryptoVision
              </span>
            </div>
          </Link>

          {/* Center Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold tracking-wide text-[#2d2d2d]">
            <a
              href="#intelligence"
              className="hover:text-black transition-colors hover:font-bold"
            >
              Intelligence
            </a>
            <a
              href="#philosophy"
              className="hover:text-black transition-colors hover:font-bold"
            >
              Philosophy
            </a>
            <a
              href="#calculator"
              className="hover:text-black transition-colors hover:font-bold"
            >
              Profit Engine
            </a>
            <a
              href="#composure"
              className="hover:text-black transition-colors hover:font-bold"
            >
              Asset Dossiers
            </a>
            <a
              href="#library"
              className="hover:text-black transition-colors hover:font-bold"
            >
              Library
            </a>
            <a
              href="#advisory"
              className="hover:text-black transition-colors hover:font-bold"
            >
              Advisory
            </a>
          </nav>

          {/* Right Action Island: Search + Global Currency Selector + Dark Menu Capsule */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Global Currency Selector (Requirement 3) */}
            <GlobalCurrencySelector />

            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#333333] hover:text-black hover:bg-black/5 transition-all cursor-pointer"
              aria-label="Search intelligence"
              title="Search intelligence"
            >
              <Search className="h-4 w-4 stroke-[2]" />
            </button>

            {/* Dark Pill Menu Capsule (Udun Reference Style) */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center gap-2 bg-[#121212] hover:bg-black text-white px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>menu</span>
              <span className="flex items-center justify-center text-[10px] opacity-80">
                {menuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. EXPANSIVE EDITORIAL OVERLAY MENU (TRIGGERED BY "menu ☰")
          ══════════════════════════════════════════════════════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#070709]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 lg:p-16 animate-in fade-in duration-200 text-white overflow-y-auto">
          
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full border-b border-white/10 pb-6 pt-16 sm:pt-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#00dc82] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                Editorial Navigation Index // Institutional Access
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-white/20 p-2 text-white/70 hover:text-white hover:border-white transition-all"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Grid inside Overlay */}
          <div className="max-w-6xl mx-auto w-full my-auto py-8 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Big Editorial Links */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#00dc82]">
                Platform Modules
              </span>
              
              <div className="space-y-2 font-editorial text-3xl sm:text-4xl lg:text-5xl">
                <div className="group flex items-center justify-between border-b border-white/5 pb-2">
                  <Link
                    to="/overview"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all inline-flex items-center gap-4"
                  >
                    <span>Market Overview & Terminal</span>
                  </Link>
                  <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-[#00dc82] transition-colors" />
                </div>

                <div className="group flex items-center justify-between border-b border-white/5 pb-2">
                  <Link
                    to="/discover"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all inline-flex items-center gap-4"
                  >
                    <span>Opportunity & Whale Radar</span>
                  </Link>
                  <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-[#00dc82] transition-colors" />
                </div>

                <div className="group flex items-center justify-between border-b border-white/5 pb-2">
                  <Link
                    to="/news"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all inline-flex items-center gap-4"
                  >
                    <span>Catalyst Intelligence & Newsreel</span>
                  </Link>
                  <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-[#00dc82] transition-colors" />
                </div>

                <div className="group flex items-center justify-between border-b border-white/5 pb-2">
                  <Link
                    to="/due-diligence"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all inline-flex items-center gap-4"
                  >
                    <span>Due Diligence Dossier</span>
                  </Link>
                  <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-[#00dc82] transition-colors" />
                </div>

                <div className="group flex items-center justify-between border-b border-white/5 pb-2">
                  <Link
                    to="/learn"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all inline-flex items-center gap-4"
                  >
                    <span>Institutional Academy</span>
                  </Link>
                  <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-[#00dc82] transition-colors" />
                </div>
              </div>
            </div>

            {/* Right: Quick Dossiers & Terminal Action */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-6">
              
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00dc82] mb-3">
                  <Sparkles className="h-4 w-4" />
                  <span>PRO WORKSPACE GATEWAY</span>
                </div>
                <h4 className="text-xl font-sans font-bold text-white mb-2">
                  Launch Institutional Console
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mb-5">
                  When you are ready to transition from tranquil study to multi-feed execution, the Pro Terminal provides 1.8ms telemetry, automated backtesting, and full portfolio VaR monitoring.
                </p>
                <Link
                  to="/overview"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2.5 w-full bg-[#f4f4f1] text-[#111111] hover:bg-white font-sans text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg hover:shadow-white/10"
                >
                  <span>Open Pro Terminal</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-white/50">
                <div className="p-3 border border-white/5 rounded-xl bg-black/40">
                  <div className="text-[10px] text-white/30">CONSENSUS STATE</div>
                  <div className="text-white font-bold mt-1">98.4% Aligned</div>
                </div>
                <div className="p-3 border border-white/5 rounded-xl bg-black/40">
                  <div className="text-[10px] text-white/30">FEED LATENCY</div>
                  <div className="text-[#00dc82] font-bold mt-1">1.8ms Global</div>
                </div>
              </div>

            </div>

          </div>

          {/* Overlay Footer */}
          <div className="max-w-6xl mx-auto w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40">
            <div>CRYPTOVISION // ARCHITECTURE FOR UNRUSHED CONVICTION</div>
            <div>VERIFIABLE ON-CHAIN REASONING — NO NOISE</div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          3. INSTANT KNOWLEDGE SEARCH MODAL (TRIGGERED BY 🔍)
          ══════════════════════════════════════════════════════════════ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#111318] border border-white/15 p-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <Search className="h-5 w-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search intelligence, models, or tokens..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none font-sans"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-white/40 hover:text-white text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredSearch.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchOpen(false);
                    if (item.path.startsWith("/#")) {
                      const id = item.path.substring(2);
                      const el = document.getElementById(id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.06] cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#00dc82] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono mt-0.5">
                      {item.category}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-[10px] font-mono text-white/40">
              <span>Press ESC or click outside to dismiss</span>
              <span>{filteredSearch.length} knowledge topics indexed</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
