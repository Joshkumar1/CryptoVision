import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, X, Eye, Download, Cookie, Check, Coins, TrendingUp } from "lucide-react";

interface CoinData {
  id: "btc" | "eth" | "sol";
  name: string;
  symbol: string;
  tag: string;
  badge: string;
  price: string;
  change24h: string;
  marketCap: string;
  volume24h: string;
  image: string;
  bgGlow: string;
  borderGlow: string;
  shadowGlow: string;
  accentText: string;
  thesis: string;
  whyItMatters: string;
  keyMetric: { label: string; value: string; detail: string };
  terminalRoute: string;
}

const COINS: Record<string, CoinData> = {
  btc: {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    tag: "Monetary Property",
    badge: "Sovereign Scarcity",
    price: "$91,450.20",
    change24h: "+3.84%",
    marketCap: "$1.81 Trillion",
    volume24h: "$34.8B",
    image: "/editorial/crypto_bitcoin_macro.jpg",
    bgGlow: "from-amber-500/25 via-yellow-500/15 to-orange-600/20",
    borderGlow: "from-amber-400/50 via-yellow-400/30 to-orange-500/40",
    shadowGlow: "shadow-[0_0_80px_rgba(245,158,11,0.2)]",
    accentText: "text-amber-400",
    thesis: "Bitcoin functions as pristine, unencumbered monetary property. Fixed mathematical issuance and global custody absorption establish an asymmetric thermodynamic reserve asset for institutional treasuries.",
    whyItMatters: "Acts as the ultimate counterparty-free reserve capital, neutralizing sovereign fiat dilution without reliance on central banking policy.",
    keyMetric: { label: "Liquid Free Float", value: "11.2%", detail: "All-time low circulating supply on centralized exchanges" },
    terminalRoute: "/market?asset=bitcoin",
  },
  eth: {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    tag: "Smart Contract L1",
    badge: "Settlement Layer",
    price: "$2,740.85",
    change24h: "+4.12%",
    marketCap: "$330.5 Billion",
    volume24h: "$18.6B",
    image: "/editorial/crypto_ethereum_coin.jpg",
    bgGlow: "from-cyan-500/25 via-blue-500/15 to-indigo-600/20",
    borderGlow: "from-cyan-400/50 via-blue-400/30 to-indigo-500/40",
    shadowGlow: "shadow-[0_0_80px_rgba(6,182,212,0.2)]",
    accentText: "text-cyan-400",
    thesis: "Ethereum provides the sovereign smart contract foundation for global decentralized finance, securing billions in collateral with deflationary fee burns and native staking yield.",
    whyItMatters: "The native risk-free yield rate of Web3, powering institutional tokenized real-world assets (RWAs) and layer-2 state rollups.",
    keyMetric: { label: "Staked Supply Ratio", value: "28.6%", detail: "34.5M ETH locked securing the consensus engine" },
    terminalRoute: "/market?asset=ethereum",
  },
  sol: {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    tag: "High-Speed Monolith",
    badge: "Parallel Engine",
    price: "$188.60",
    change24h: "+6.45%",
    marketCap: "$88.9 Billion",
    volume24h: "$7.2B",
    image: "/editorial/crypto_solana_titanium.jpg",
    bgGlow: "from-emerald-500/25 via-teal-500/15 to-purple-600/20",
    borderGlow: "from-emerald-400/50 via-teal-400/30 to-purple-500/40",
    shadowGlow: "shadow-[0_0_80px_rgba(16,185,129,0.2)]",
    accentText: "text-emerald-400",
    thesis: "Single-state synchronization at the speed of light. Hardware-parallelized validation allows real-time consumer payments and decentralized central limit order books without rollup fragmentation.",
    whyItMatters: "Delivers sub-second finality and sustained 2,800+ real economic TPS, enabling institutional-grade high-frequency decentralized trading.",
    keyMetric: { label: "True Non-Vote TPS", value: "2,840 TPS", detail: "Sustained real economic transactions per second" },
    terminalRoute: "/discover",
  },
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
  const [selectedCoinId, setSelectedCoinId] = useState<"btc" | "eth" | "sol">("btc");
  const [showModal, setShowModal] = useState(false);
  const [cookieToast, setCookieToast] = useState<string | null>(null);

  // Initialize selected coin from browser cookie on mount
  useEffect(() => {
    const savedCoin = getCookie("cv_selected_coin");
    if (savedCoin && (savedCoin === "btc" || savedCoin === "eth" || savedCoin === "sol")) {
      setSelectedCoinId(savedCoin);
    } else {
      // Default to Bitcoin and save initial cookie
      setCookie("cv_selected_coin", "btc");
    }
  }, []);

  const currentCoin = COINS[selectedCoinId] || COINS.btc;

  // Handle switching coin & update cookie
  const handleSelectCoin = (id: "btc" | "eth" | "sol") => {
    setSelectedCoinId(id);
    setCookie("cv_selected_coin", id);
    setCookieToast(`Cookie updated: cv_selected_coin="${id}"`);
    setTimeout(() => setCookieToast(null), 3000);
  };

  // Handle downloading coin image & update download cookie
  const handleDownloadCoinImage = () => {
    setCookie("cv_selected_coin", currentCoin.id);
    setCookie("cv_last_downloaded_coin", currentCoin.id);
    setCookie("cv_download_timestamp", new Date().toISOString());

    // Trigger image file download
    const link = document.createElement("a");
    link.href = currentCoin.image;
    link.download = `${currentCoin.id}_${currentCoin.name.toLowerCase()}_coin_asset.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCookieToast(`Downloaded ${currentCoin.name} coin image & saved to cookies!`);
    setTimeout(() => setCookieToast(null), 4000);
  };

  // Handle downloading cookie session data as JSON
  const handleDownloadCookieData = () => {
    const cookiePayload = {
      cookieKey: "cv_selected_coin",
      activeCoin: currentCoin.id,
      coinName: currentCoin.name,
      symbol: currentCoin.symbol,
      price: currentCoin.price,
      marketCap: currentCoin.marketCap,
      volume24h: currentCoin.volume24h,
      imageAsset: currentCoin.image,
      downloadTimestamp: new Date().toISOString(),
      domain: window.location.hostname || "localhost",
      path: "/",
      sameSite: "Lax",
      expires: "365 days",
      cookieHeader: `cv_selected_coin=${currentCoin.id}; Path=/; Max-Age=31536000; SameSite=Lax`,
    };

    const blob = new Blob([JSON.stringify(cookiePayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentCoin.id}_coin_cookie_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCookieToast(`Exported ${currentCoin.name} cookie dataset file!`);
    setTimeout(() => setCookieToast(null), 4000);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-[#061412] via-[#070c14] to-[#040608] text-white pt-28 pb-24 px-4 sm:px-6 select-none">
      
      {/* ══════════════════════════════════════════════════════════════
          1. DYNAMIC COLORED BACKGROUND (RESPONDS TO ACTIVE COIN)
          ══════════════════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none transition-colors duration-1000">
        <div className="absolute inset-0 glass-grid-pattern opacity-20" />
        
        {/* Dynamic ambient color glow matching active coin */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full bg-gradient-to-b ${currentCoin.bgGlow} blur-[130px] transition-all duration-700`}
        />
        
        {/* Left side ambient color pool */}
        <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#059669]/15 via-[#0284c7]/10 to-transparent blur-[140px]" />
        
        {/* Right side atmospheric accent */}
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#6366f1]/15 via-[#8b5cf6]/10 to-transparent blur-[140px]" />
        
        {/* Bottom subtle grounding glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-[#040608] via-transparent to-transparent" />
      </div>

      {/* Floating Toast Notification for Cookie & Download Feedback */}
      {cookieToast && (
        <div className="fixed top-24 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono text-white shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300">
          <Cookie className="h-4 w-4 text-[#00dc82]" />
          <span>{cookieToast}</span>
          <Check className="h-3.5 w-3.5 text-[#00dc82]" />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          2. CENTERPIECE: EDITORIAL DISPLAY TYPOGRAPHY
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center justify-center px-4 pt-4 pb-8">
        
        {/* Coin Selection Tabs (According to Selected Coin) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {(["btc", "eth", "sol"] as const).map((coinId) => {
            const coin = COINS[coinId];
            const isSelected = selectedCoinId === coinId;
            return (
              <button
                key={coin.id}
                type="button"
                onClick={() => handleSelectCoin(coin.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black font-bold shadow-[0_0_25px_rgba(255,255,255,0.35)] scale-105"
                    : "bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12] border border-white/15"
                }`}
              >
                <span className="font-bold">{coin.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? "bg-black/10 text-black font-semibold" : "bg-white/10 text-white/60"}`}>
                  {coin.symbol}
                </span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82]" />}
              </button>
            );
          })}
        </div>

        {/* High-Contrast Editorial Serif Headline */}
        <h1 className="font-editorial text-[clamp(2.4rem,5.6vw,4.8rem)] font-normal text-white leading-[1.08] tracking-tight max-w-3xl">
          Clarity that gives ambitious allocators a sharper edge.
        </h1>

        {/* Subtitle with High-Contrast Bold Highlights */}
        <p className="mt-5 max-w-2xl text-xs sm:text-sm md:text-base text-white/65 font-sans leading-relaxed text-balance">
          From mempool anomalies to multi-model consensus, we synthesize{" "}
          <strong className="text-white font-medium">on-chain liquidity</strong>,{" "}
          <strong className="text-white font-medium">catalyst intelligence</strong>, and{" "}
          <strong className="text-white font-medium">verifiable risk</strong> that help capital move with poise and unhurried conviction.
        </p>

        {/* Action Button Island */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to={currentCoin.terminalRoute}
            className="group inline-flex items-center gap-3 bg-[#f5f5f3] hover:bg-white text-[#111111] px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] active:scale-95"
          >
            <span>Launch {currentCoin.name} Terminal</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-white text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </Link>

          <button
            type="button"
            onClick={handleDownloadCoinImage}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium text-white hover:text-black hover:bg-white border border-white/20 hover:border-white bg-white/[0.05] backdrop-blur-md transition-all shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download {currentCoin.name} Coin</span>
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. SINGLE STANDOUT IMAGE OF THE COIN ON COLORED BACKDROP
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-2 px-2 sm:px-4">
        
        {/* Glowing Colored Backdrop Frame */}
        <div className={`relative rounded-3xl p-[1px] bg-gradient-to-b ${currentCoin.borderGlow} ${currentCoin.shadowGlow} group transition-all duration-700`}>
          
          {/* Main Visual Container */}
          <div className="relative overflow-hidden rounded-3xl bg-[#0b1016]/95 backdrop-blur-xl border border-white/10">
            
            {/* The One Real Image of the Coin */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black/40 flex items-center justify-center">
              <img
                key={currentCoin.id}
                src={currentCoin.image}
                alt={`${currentCoin.name} (${currentCoin.symbol}) Official Coin Asset`}
                className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[1.02] transition-all duration-700 ease-out group-hover:scale-[1.03]"
                loading="eager"
              />

              {/* Gradient lighting & color integration overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d14] via-black/20 to-transparent opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

              {/* TOP-LEFT: Active Coin & Live Feed Pill */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-lg text-[10px] sm:text-xs font-mono text-white/95">
                <span className="h-2 w-2 rounded-full bg-[#00dc82] animate-pulse shadow-[0_0_8px_#00dc82]" />
                <span className="tracking-wide uppercase font-bold">{currentCoin.name}</span>
                <span className="text-white/40">|</span>
                <span className={currentCoin.accentText}>{currentCoin.badge}</span>
              </div>

              {/* TOP-RIGHT: Active Browser Cookie Status Indicator */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-lg text-[10px] sm:text-xs font-mono text-white/80">
                <Cookie className="h-3.5 w-3.5 text-[#00dc82]" />
                <span className="text-white/50 hidden sm:inline">Cookie:</span>
                <span className="font-semibold text-[#00dc82]">cv_coin="{currentCoin.id}"</span>
              </div>

              {/* BOTTOM FLOATING TELEMETRY & DOWNLOAD ACTIONS BAR */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-lg border border-white/20 shadow-2xl">
                
                {/* Left Coin Details & Real-Time Price */}
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-bold ${currentCoin.accentText}`}>
                      {currentCoin.symbol} Spot Liquidity
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-medium">
                      {currentCoin.change24h} (24h)
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white tracking-tight">
                    {currentCoin.price}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-white/70 font-sans">
                    <span>Market Cap: <strong className="text-white font-mono">{currentCoin.marketCap}</strong></span>
                    <span className="text-white/30">•</span>
                    <span>24h Vol: <strong className="text-white font-mono">{currentCoin.volume24h}</strong></span>
                  </div>
                </div>

                {/* Right Action Island: Download Coin Image & Download Cookie */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  
                  {/* Download Image Button */}
                  <button
                    type="button"
                    onClick={handleDownloadCoinImage}
                    title="Download this coin image asset and save to cookies"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f0f0f0] text-black text-xs font-mono font-semibold transition-all shadow-lg hover:shadow-white/20 active:scale-95 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Image</span>
                  </button>

                  {/* Download Cookie / Session Data */}
                  <button
                    type="button"
                    onClick={handleDownloadCookieData}
                    title="Download active coin cookie session configuration"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all border border-white/15 cursor-pointer"
                  >
                    <Cookie className="h-3.5 w-3.5 text-[#00dc82]" />
                    <span className="hidden md:inline">Download Cookie</span>
                  </button>

                  {/* Inspect Dossier */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    title="Inspect deep on-chain dossier"
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Cookie Persistence & Asset Download Info */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center text-[11px] font-mono text-white/50">
          <span className="flex items-center gap-1.5">
            <Cookie className="h-3 w-3 text-[#00dc82]" />
            <span>Preference persistently stored in browser cookies</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <Download className="h-3 w-3 text-emerald-400" />
            <span>High-res coin asset download ready</span>
          </span>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. INTERACTIVE KNOWLEDGE DOSSIER MODAL
          ══════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c1219] border border-white/20 p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 flex-shrink-0 shadow-lg bg-black">
                  <img
                    src={currentCoin.image}
                    alt={currentCoin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className={`inline-block text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1 border ${currentCoin.accentText} bg-white/5 border-white/20`}>
                    {currentCoin.name} ({currentCoin.symbol}) // {currentCoin.badge}
                  </span>
                  <h3 className="font-editorial text-2xl text-white leading-tight">
                    {currentCoin.name} Sovereign Dossier
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

            {/* Structured Content */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Core Allocation Thesis
                </h4>
                <p className="text-sm font-sans text-white/85 leading-relaxed">
                  {currentCoin.thesis}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Institutional Significance
                </h4>
                <p className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed">
                  {currentCoin.whyItMatters}
                </p>
              </div>

              {/* Key Metric Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    {currentCoin.keyMetric.label}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-mono font-bold mt-0.5 ${currentCoin.accentText}`}>
                    {currentCoin.keyMetric.value}
                  </div>
                  <div className="text-[11px] text-white/50 mt-1 font-sans">
                    {currentCoin.keyMetric.detail}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCoinImage}
                    className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-semibold hover:bg-white/90 transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Asset</span>
                  </button>

                  <Link
                    to={currentCoin.terminalRoute}
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center justify-center gap-1 text-white/70 hover:text-white text-xs font-mono"
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
                <Cookie className="h-3.5 w-3.5 text-[#00dc82]" />
                <span>COOKIE ACTIVE: cv_selected_coin="{currentCoin.id}"</span>
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


