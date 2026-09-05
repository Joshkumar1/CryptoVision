import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Shield, Lock, Terminal } from "lucide-react";

export const FlagshipFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#050807] text-white border-t border-[#00dc82]/20">
      {/* ── Top Ambient Edge Line (Jade Emerald Gradient) ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#00dc82] via-[#34d399] to-[#047857]" />

      <div className="container-abtc relative z-10 pt-20 pb-12 md:pt-24 md:pb-16">
        
        {/* ── Subscription & Links Grid ── */}
        <div className="grid gap-16 md:grid-cols-[minmax(0,1.2fr)_auto] md:items-start">
          
          {/* Left: Newsletter Subscription */}
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#00dc82] mb-3">
              INSTITUTIONAL DISPATCH
            </div>
            <h2 className="font-sans text-2xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-3xl md:text-4xl">
              Sign up for real-time <br />
              <span className="text-[#00dc82]">alpha &amp; due diligence reports</span>
            </h2>

            {subscribed ? (
              <div className="mt-8 flex items-center gap-3 bg-[#00dc82]/10 border border-[#00dc82]/40 p-4 max-w-lg">
                <CheckCircle2 className="h-5 w-5 text-[#00dc82] flex-shrink-0" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#00dc82]">
                  Confirmed: Institutional alerts active for {email}
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-8 flex w-full max-w-xl items-center gap-4 border-b border-white/25 pb-3"
              >
                <input
                  type="email"
                  required
                  placeholder="ENTER INSTITUTIONAL EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-xs sm:text-sm uppercase tracking-[0.2em] text-white placeholder:text-white/40 focus:outline-none"
                  aria-label="Email"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center btn-jade-primary flex-shrink-0"
                >
                  <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </form>
            )}

            <p className="mt-4 font-mono text-[11px] text-white/50 uppercase tracking-widest">
              Distributed daily at 07:00 UTC // Algorithmic, uncurated market intelligence
            </p>
          </div>

          {/* Right: Quick Links & Social */}
          <div className="flex flex-col gap-8 md:items-end">
            
            {/* Social Squares (Exact ABTC Style) */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border border-white/20 text-white transition-colors hover:border-brand-red hover:text-brand-red hover:bg-white/5"
                aria-label="X Twitter"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2H21l-6.52 7.45L22 22h-6.708l-5.25-6.866L3.96 22H1.2l6.97-7.967L1 2h6.882l4.748 6.276L18.244 2Zm-1.176 18h1.86L7.05 4h-2L17.068 20Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border border-white/20 text-white transition-colors hover:border-brand-red hover:text-brand-red hover:bg-white/5"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.18c0-1.47-.03-3.37-2.05-3.37-2.06 0-2.37 1.6-2.37 3.26V22H7.72V8z" />
                </svg>
              </a>
              <Link
                to="/overview"
                className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center border border-white/20 text-brand-lime transition-colors hover:border-brand-lime hover:bg-brand-lime/10"
                title="Launch Pro Terminal"
              >
                <Terminal className="h-5 w-5" />
              </Link>
            </div>

            {/* Legal & Route Links */}
            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-[0.18em] text-white/70">
                <Link to="/overview" className="hover:text-[#00dc82]">Terminal</Link>
                <Link to="/discover" className="hover:text-[#00dc82]">Opportunities</Link>
                <Link to="/research-lab" className="hover:text-[#00dc82]">Research Lab</Link>
                <Link to="/trust" className="hover:text-[#00dc82]">Trust Center</Link>
                <Link to="/due-diligence" className="hover:text-[#00dc82]">Due Diligence</Link>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">
                © 2026 CryptoVision Institutional AI Corp. All Rights Reserved.
              </p>
            </div>

          </div>

        </div>

        {/* ── Massive Full-Width Architectural Stroke Typography Watermark (Jade Cobra Neon Stroke) ── */}
        <div aria-hidden="true" className="pointer-events-none mt-16 md:mt-24 w-full select-none opacity-25 hover:opacity-40 transition-opacity">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1200 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="105"
              textAnchor="middle"
              stroke="rgba(0, 220, 130, 0.35)"
              strokeWidth="1.8"
              fill="transparent"
              fontSize="120"
              fontWeight="900"
              fontFamily="Outfit, Inter, sans-serif"
              letterSpacing="12"
            >
              CRYPTOVISION
            </text>
          </svg>
        </div>

      </div>
    </footer>
  );
};
