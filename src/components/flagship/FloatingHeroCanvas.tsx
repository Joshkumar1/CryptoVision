import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, X, Eye, Download, Cookie, Check, ShieldCheck, Layers, Maximize2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CoinAsset {
  id: string;
  name: string;
  symbol: string;
  tag: string;
  badge: string;
  price: string;
  change24h: string;
  marketCap: string;
  volume24h: string;
  image: string;
  renderVariantImage: string;
  bgGlow: string;
  borderGlow: string;
  shadowGlow: string;
  accentText: string;
  thesis: string;
  whyItMatters: string;
  keyMetric: { label: string; value: string; detail: string };
  terminalRoute: string;
}

const KRYPTOS_4K_ASSET: CoinAsset = {
  id: "kryptos",
  name: "Kryptos Protocol",
  symbol: "KRYPTOS",
  tag: "Decentralized Digital Asset",
  badge: "4K Sovereign Reserve",
  price: "$104,250.00",
  change24h: "+8.92%",
  marketCap: "$2.15 Trillion",
  volume24h: "$42.6B",
  image: "/editorial/kryptos_protocol_4k_coin.png",
  renderVariantImage: "/editorial/kryptos_protocol_4k_coin_render.jpg",
  bgGlow: "from-cyan-500/30 via-blue-600/20 to-emerald-500/25",
  borderGlow: "from-cyan-400/60 via-blue-400/40 to-emerald-400/50",
  shadowGlow: "shadow-[0_0_100px_rgba(6,182,212,0.25)]",
  accentText: "text-cyan-400",
  thesis: "Kryptos Protocol functions as pristine, unencumbered 4K cryptographic monetary property. Fixed mathematical issuance and institutional custody absorption establish an asymmetric thermodynamic reserve asset for sovereign treasuries.",
  whyItMatters: "Acts as the ultimate counterparty-free reserve capital, neutralizing sovereign fiat dilution without reliance on central banking policy.",
  keyMetric: { label: "Liquid Free Float", value: "8.4%", detail: "All-time low circulating supply on centralized exchanges" },
  terminalRoute: "/market?asset=kryptos",
};

// Cookie helper utilities
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export const FloatingHeroCanvas: React.FC = () => {
  const [activeImageVariant, setActiveImageVariant] = useState<"master" | "render">("master");
  const [showModal, setShowModal] = useState(false);
  const [cookieToast, setCookieToast] = useState<string | null>(null);

  // Initialize cookie settings on mount
  useEffect(() => {
    setCookie("cv_selected_coin", "kryptos");
    setCookie("cv_asset_mode", "4K_ultra_hd");
  }, []);

  const currentAsset = KRYPTOS_4K_ASSET;
  const activeImageUrl = activeImageVariant === "master" ? currentAsset.image : currentAsset.renderVariantImage;

  // Handle switching 4K render views
  const handleToggleVariant = () => {
    const nextVariant = activeImageVariant === "master" ? "render" : "master";
    setActiveImageVariant(nextVariant);
    setCookie("cv_image_variant", nextVariant);
    setCookieToast(`Switched 4K perspective to ${nextVariant === "master" ? "Physical 4K Master" : "Raytraced Render"}`);
    setTimeout(() => setCookieToast(null), 3000);
  };

  // Handle downloading 4K coin image asset & update download cookies
  const handleDownloadCoinImage = () => {
    setCookie("cv_selected_coin", currentAsset.id);
    setCookie("cv_last_downloaded_coin", currentAsset.id);
    setCookie("cv_download_quality", "4K_ULTRA_HD");
    setCookie("cv_download_timestamp", new Date().toISOString());

    // Trigger image file download
    const link = document.createElement("a");
    link.href = activeImageUrl;
    link.download = `kryptos_protocol_4k_${activeImageVariant}_coin_asset.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCookieToast(`Downloaded 4K Kryptos Protocol coin image & saved preference to cookies!`);
    setTimeout(() => setCookieToast(null), 4000);
  };

  // Handle downloading cookie session data as JSON
  const handleDownloadCookieData = () => {
    const cookiePayload = {
      assetId: currentAsset.id,
      assetName: currentAsset.name,
      symbol: currentAsset.symbol,
      resolution: "3840x2160 (4K Ultra HD)",
      activeVariant: activeImageVariant,
      price: currentAsset.price,
      marketCap: currentAsset.marketCap,
      volume24h: currentAsset.volume24h,
      imageAssetPath: activeImageUrl,
      downloadTimestamp: new Date().toISOString(),
      domain: window.location.hostname || "localhost",
      path: "/",
      sameSite: "Lax",
      expires: "365 days",
      cookieHeader: `cv_selected_coin=${currentAsset.id}; cv_asset_mode=4K_ultra_hd; Path=/; Max-Age=31536000; SameSite=Lax`,
    };

    const blob = new Blob([JSON.stringify(cookiePayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kryptos_4k_asset_cookie_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCookieToast(`Exported 4K Kryptos coin cookie dataset file!`);
    setTimeout(() => setCookieToast(null), 4000);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-[#051118] via-[#070c14] to-[#040608] text-white pt-24 pb-24 px-4 sm:px-6 select-none">
      
      {/* ══════════════════════════════════════════════════════════════
          1. DYNAMIC ATMOSPHERIC 4K LIGHTING & GLOW BACKDROP
          ══════════════════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none transition-colors duration-1000">
        <div className="absolute inset-0 glass-grid-pattern opacity-25" />
        
        {/* Animated particle dots */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-cyan-400/40 animate-particle-1" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-emerald-400/30 animate-particle-2" />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-blue-400/30 animate-particle-3" />
        
        {/* Top flagship ambient glow */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[580px] rounded-full bg-gradient-to-b ${currentAsset.bgGlow} blur-[140px] transition-all duration-700 animate-pulse-glow`}
        />
        
        {/* Left side cyan accent pool */}
        <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#06b6d4]/20 via-[#3b82f6]/15 to-transparent blur-[150px]" />
        
        {/* Right side emerald atmospheric pulse */}
        <div className="absolute top-1/2 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-[#10b981]/20 via-[#6366f1]/15 to-transparent blur-[150px]" />
        
        {/* Bottom subtle grounding vignette */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[320px] bg-gradient-to-t from-[#040608] via-transparent to-transparent" />
      </div>

      {/* Floating Toast Notification for Cookie & Download Feedback */}
      <AnimatePresence>
        {cookieToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/90 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-white shadow-2xl"
          >
            <Cookie className="h-4 w-4 text-cyan-400" />
            <span>{cookieToast}</span>
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          2. CENTERPIECE: EDITORIAL DISPLAY TYPOGRAPHY & FLAGSHIP BADGE
          ══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center justify-center px-4 pt-2 pb-6"
      >
        
        {/* 4K Flagship Kryptos Protocol Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold">Kryptos Protocol</span>
          <span className="text-white/40">•</span>
          <span className="text-white/90">4K Ultra HD Reserve Asset</span>
        </motion.div>

        {/* High-Contrast Editorial Serif Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="font-editorial text-[clamp(2.5rem,5.8vw,5.2rem)] font-normal text-white leading-[1.06] tracking-tight max-w-4xl"
        >
          Clarity that gives ambitious allocators a sharper edge.
        </motion.h1>

        {/* Subtitle with High-Contrast Bold Highlights */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-5 max-w-2xl text-xs sm:text-sm md:text-base text-white/70 font-sans leading-relaxed text-balance"
        >
          From mempool anomalies to multi-model consensus, we synthesize{" "}
          <strong className="text-white font-medium">on-chain liquidity</strong>,{" "}
          <strong className="text-white font-medium">catalyst intelligence</strong>, and{" "}
          <strong className="text-white font-medium">verifiable risk</strong> that help capital move with poise and unhurried conviction.
        </motion.p>

        {/* Action Button Island */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to={currentAsset.terminalRoute}
              className="group inline-flex items-center gap-3 bg-[#f5f5f3] hover:bg-white text-[#111111] px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_35px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            >
              <span>Launch Kryptos Terminal</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-white text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleDownloadCoinImage}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium text-white hover:text-black hover:bg-white border border-cyan-400/30 hover:border-white bg-white/[0.06] backdrop-blur-md transition-all shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400 group-hover:text-black" />
            <span>Download 4K Coin Image</span>
          </motion.button>
        </motion.div>

      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          3. FEATURED PERFECT 4K KRYPTOS PROTOCOL COIN SHOWCASE
          ══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-20 w-full max-w-4xl mx-auto mt-2 px-2 sm:px-4"
      >

        
        {/* Glowing Colored Backdrop Frame */}
        <div className={`relative rounded-3xl p-[1.5px] bg-gradient-to-b ${currentAsset.borderGlow} ${currentAsset.shadowGlow} group transition-all duration-700`}>
          
          {/* Main Visual Container */}
          <div className="relative overflow-hidden rounded-3xl bg-[#090e15]/95 backdrop-blur-xl border border-white/10">
            
            {/* The Perfect 4K Kryptos Coin Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black/50 flex items-center justify-center">
              <img
                key={activeImageUrl}
                src={activeImageUrl}
                alt="Kryptos Protocol Decentralized Digital Asset 4K Coin"
                className="w-full h-full object-cover object-center filter contrast-[1.06] brightness-[1.03] transition-all duration-700 ease-out group-hover:scale-[1.025]"
                loading="eager"
              />

              {/* Gradient lighting & color integration overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a0f] via-black/15 to-transparent opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 pointer-events-none" />

              {/* TOP-LEFT: 4K Kryptos Protocol Live Feed Pill */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/40 shadow-xl text-[10px] sm:text-xs font-mono text-white/95">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#06b6d4]" />
                <span className="tracking-wide uppercase font-bold text-white">Kryptos Protocol</span>
                <span className="text-white/40">|</span>
                <span className="text-cyan-300 font-semibold">4K ULTRA HD DIGITAL ASSET</span>
              </div>

              {/* TOP-RIGHT: 4K Angle Switcher & Cookie Pill */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleVariant}
                  title="Toggle between 4K Physical Master & 4K Raytraced Render"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 hover:bg-black backdrop-blur-md border border-white/25 hover:border-cyan-400 text-[10px] sm:text-xs font-mono text-white transition-all shadow-lg cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 text-cyan-400" />
                  <span>{activeImageVariant === "master" ? "4K Physical Coin" : "4K Raytraced Render"}</span>
                </button>
              </div>

              {/* BOTTOM FLOATING TELEMETRY & DOWNLOAD ACTIONS BAR */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-black/85 backdrop-blur-lg border border-white/20 shadow-2xl">
                
                {/* Left Coin Details & Real-Time Price */}
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-bold text-cyan-400">
                      KRYPTOS Sovereign Liquidity
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-medium">
                      {currentAsset.change24h} (24h)
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white tracking-tight">
                    {currentAsset.price}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-white/75 font-sans">
                    <span>Market Cap: <strong className="text-white font-mono">{currentAsset.marketCap}</strong></span>
                    <span className="text-white/30">•</span>
                    <span>24h Vol: <strong className="text-white font-mono">{currentAsset.volume24h}</strong></span>
                  </div>
                </div>

                {/* Right Action Island: Download 4K Image & Download Cookie */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  
                  {/* Download 4K Image Button */}
                  <button
                    type="button"
                    onClick={handleDownloadCoinImage}
                    title="Download this 4K Kryptos coin image asset and save to cookies"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f0f0f0] text-black text-xs font-mono font-semibold transition-all shadow-lg hover:shadow-cyan-400/20 active:scale-95 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download 4K Image</span>
                  </button>

                  {/* Download Cookie / Session Data */}
                  <button
                    type="button"
                    onClick={handleDownloadCookieData}
                    title="Download active coin cookie session configuration"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all border border-white/15 cursor-pointer"
                  >
                    <Cookie className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="hidden md:inline">Download Cookie</span>
                  </button>

                  {/* Inspect 4K Dossier */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    title="Inspect 4K resolution coin dossier"
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 cursor-pointer"
                  >
                    <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Cookie Persistence & Asset Download Info */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center text-[11px] font-mono text-white/50">
          <span className="flex items-center gap-1.5">
            <Cookie className="h-3 w-3 text-cyan-400" />
            <span>Active Cookie: cv_selected_coin="kryptos"</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>4K Ultra-HD Master Asset Verified</span>
          </span>
        </div>

      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          4. INTERACTIVE 4K KRYPTOS COIN DOSSIER & FULLSCREEN MODAL
          ══════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0a1017] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-white overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-cyan-400/40 flex-shrink-0 shadow-xl bg-black">
                  <img
                    src={activeImageUrl}
                    alt={currentAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1 border text-cyan-300 bg-cyan-500/10 border-cyan-400/30">
                    {currentAsset.name} ({currentAsset.symbol}) // 4K SOVEREIGN ASSET
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-white leading-tight">
                    Kryptos Protocol 4K Dossier
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-white/15 p-2 text-white/60 hover:text-white hover:border-white transition-all flex-shrink-0 cursor-pointer"
                aria-label="Close dossier"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* High Resolution Image View in Modal */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 mb-6 bg-black">
              <img
                src={activeImageUrl}
                alt="4K Kryptos Protocol Image Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-black/80 text-[10px] font-mono text-cyan-400 border border-cyan-400/30">
                RESOLUTION: 3840 x 2160 (4K MASTER)
              </div>
            </div>

            {/* Structured Content */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Core Allocation Thesis
                </h4>
                <p className="text-sm font-sans text-white/85 leading-relaxed">
                  {currentAsset.thesis}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Institutional Significance
                </h4>
                <p className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed">
                  {currentAsset.whyItMatters}
                </p>
              </div>

              {/* Key Metric Card */}
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    {currentAsset.keyMetric.label}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold mt-0.5 text-cyan-400">
                    {currentAsset.keyMetric.value}
                  </div>
                  <div className="text-[11px] text-white/50 mt-1 font-sans">
                    {currentAsset.keyMetric.detail}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCoinImage}
                    className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download 4K Asset</span>
                  </button>

                  <Link
                    to={currentAsset.terminalRoute}
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center justify-center gap-1 text-cyan-300 hover:text-white text-xs font-mono"
                  >
                    <span>Terminal View</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer with Cookie Persistence Confirmation */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/40">
              <span className="flex items-center gap-1.5">
                <Cookie className="h-3.5 w-3.5 text-cyan-400" />
                <span>COOKIE STORED: cv_selected_coin="kryptos"</span>
              </span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Close & Return
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
