import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, Globe } from "lucide-react";

export const InstitutionalAdvisorySection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("cv_advisory_email", email);
        document.cookie = `cv_advisory_requested=true; path=/; max-age=31536000`;
      }
    }, 600);
  };

  return (
    <section className="w-full bg-[#f6f1ea] pt-12 pb-8 sm:pt-16 sm:pb-12 text-[#1c272c] font-sans overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ══════════════════════════════════════════════════════════════
            1. TOP TEAL GRADIENT BANNER CARD (ANIMATED FLOATING ELEMENTS)
            ══════════════════════════════════════════════════════════════ */}
        <div className="relative rounded-[2.5rem] sm:rounded-[3.2rem] bg-gradient-to-r from-[#175263] via-[#144757] to-[#1b5d6f] p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-white/10 text-white">
          
          {/* Animated Soft Organic Warm Peach Background Shape (Right Side) */}
          <div className="pointer-events-none absolute top-0 right-0 w-full md:w-3/5 h-full overflow-hidden select-none">
            <svg
              className="absolute -right-10 -bottom-10 w-[620px] h-[620px] text-[#f4d2c1] opacity-90 transition-all duration-700 animate-morph-shape"
              viewBox="0 0 500 500"
              fill="currentColor"
            >
              <path d="M420,320Q360,440,240,440Q120,440,70,320Q20,200,100,100Q180,0,300,40Q420,80,450,200Q480,320,420,320Z" />
            </svg>
            
            {/* Animated Floating Paper Airplane (Line-Art SVG matching reference video) */}
            <div className="absolute top-12 right-24 sm:right-36 z-20 animate-paper-plane">
              <svg
                className="w-14 h-14 text-[#f4d2c1] stroke-current drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                viewBox="0 0 64 64"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M58 6L6 28L26 38L36 58L58 6Z" />
                <path d="M26 38L58 6" />
              </svg>
            </div>

            {/* Animated Floating Ambient Orbs & Pulsing Dots */}
            <div className="absolute top-10 right-1/2 w-4 h-4 rounded-full bg-[#f4d2c1]/60 animate-pulse-dot" />
            <div className="absolute bottom-20 right-1/4 w-3 h-3 rounded-full bg-[#175263] border border-[#f4d2c1]/40 animate-pulse-dot" />
            <div className="absolute top-1/3 right-12 w-6 h-6 rounded-full border-2 border-[#175263]/30 animate-float-slow" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Form & Headline */}
            <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                Still have questions?
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-lg">
                Leave a request and our research desk will contact you to help you choose the ideal intelligence format.
              </p>

              {/* Form Input Container */}
              <div className="mt-8 w-full max-w-md">
                {submitted ? (
                  <div className="flex items-center gap-3 p-4 rounded-full bg-[#0d3642]/90 border border-emerald-400/40 text-emerald-300 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xl">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span>Request received! Our advisory desk will reach out shortly.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="w-full bg-[#0e3b47]/80 hover:bg-[#0e3b47] focus:bg-[#0e3b47] border border-white/25 focus:border-white text-white placeholder:text-white/60 text-sm rounded-full px-6 py-3.5 transition-all outline-none shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#f4d2c1] hover:bg-[#fae1d4] active:scale-95 text-[#173e4a] font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 group"
                    >
                      {loading ? (
                        <span className="animate-pulse">Sending...</span>
                      ) : (
                        <>
                          <span>Submit</span>
                          <Send className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* Right Column: Sleek Animated Levitating 4K Device Card Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative max-w-sm sm:max-w-md w-full animate-float-slow">
                
                {/* Visual Glass Frame for Smartphone Card */}
                <div className="relative rounded-3xl overflow-hidden border border-white/25 bg-[#0a1820]/90 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <img
                    src="/editorial/cryptovision_advisory_illustration.png"
                    alt="CryptoVision AI Platform & Mobile Terminal Interface"
                    className="w-full h-auto object-cover filter brightness-[1.02] contrast-[1.04]"
                  />
                  
                  {/* Floating speech bubble banner overlay matching reference video */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#124958]/95 backdrop-blur-md border border-white/20 text-white shadow-2xl animate-float-delayed">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f4d2c1] text-[#173e4a] text-[10px] font-bold">
                        ★
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#f4d2c1] font-bold">
                        Institutional AI Format
                      </span>
                    </div>
                    <p className="text-xs font-sans text-white/90 font-medium leading-snug">
                      The ideal platform to learn how to <strong className="text-white font-bold underline decoration-[#f4d2c1]">manage all aspects</strong> of crypto market intelligence.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. MODERN MINIMALIST FOOTER (MATCHING USER'S VISUAL SPEC)
            ══════════════════════════════════════════════════════════════ */}
        <div className="mt-14 pt-6 border-t border-[#1c272c]/15 text-[#1c272c]">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10">
            
            {/* Logo Group */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="grid grid-cols-3 gap-0.5 w-8 h-8 items-center justify-center p-1 rounded-full bg-[#1c272c] text-white shadow-md group-hover:rotate-12 transition-transform">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4d2c1]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <span className="text-2xl font-bold font-sans tracking-tight text-[#1c272c]">
                CryptoVision
              </span>
            </div>

            {/* Vertical Dashed Divider */}
            <div className="hidden lg:block h-12 w-px border-r border-dashed border-[#1c272c]/30" />

            {/* Nav Column 1 */}
            <div className="flex items-center gap-8 text-xs font-bold tracking-wider text-[#1c272c]/80 uppercase">
              <Link to="/overview" className="hover:text-black hover:underline underline-offset-4 transition-all">
                About
              </Link>
              <Link to="/learn" className="hover:text-black hover:underline underline-offset-4 transition-all">
                Program
              </Link>
            </div>

            {/* Nav Column 2 */}
            <div className="flex items-center gap-8 text-xs font-bold tracking-wider text-[#1c272c]/80 uppercase">
              <Link to="/due-diligence" className="hover:text-black hover:underline underline-offset-4 transition-all">
                Courses
              </Link>
              <Link to="/news" className="hover:text-black hover:underline underline-offset-4 transition-all">
                Reviews
              </Link>
            </div>

            {/* Vertical Dashed Divider */}
            <div className="hidden lg:block h-12 w-px border-r border-dashed border-[#1c272c]/30" />

            {/* Contact Details */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-6 lg:gap-1 text-xs font-mono text-[#1c272c]/75">
              <div className="flex items-center gap-2">
                <span>WWW.CRYPTOVISION-AI.COM</span>
              </div>
              <div className="flex items-center gap-2">
                <span>RESEARCH@CRYPTOVISION-AI.COM</span>
              </div>
            </div>

            {/* Phone & Location */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-6 lg:gap-1 text-xs font-mono text-[#1c272c]/75">
              <div>+1 (800) 555-0199</div>
              <div>ODESSA / GLOBAL DESK</div>
            </div>

          </div>

          {/* Bottom Copyright & Social Icons Row */}
          <div className="pt-6 border-t border-[#1c272c]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#1c272c]/60">
            
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1c272c] text-white text-[10px] font-bold">
                C
              </span>
              <span>2026 CRYPTOVISION AI. ALL RIGHTS RESERVED</span>
            </div>

            {/* Social Icons Pill Buttons matching reference */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1c272c]/20 hover:border-[#1c272c] hover:bg-[#1c272c] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[#1c272c]"
                title="Twitter / X"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1c272c]/20 hover:border-[#1c272c] hover:bg-[#1c272c] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[#1c272c]"
                title="Behance / GitHub"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1c272c]/20 hover:border-[#1c272c] hover:bg-[#1c272c] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[#1c272c]"
                title="LinkedIn"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1c272c]/20 hover:border-[#1c272c] hover:bg-[#1c272c] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[#1c272c]"
                title="Instagram"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://cryptovision-ai.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-[#1c272c]/20 hover:border-[#1c272c] hover:bg-[#1c272c] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[#1c272c]"
                title="Website"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
