/**
 * Emerging Projects Detection Engine
 * Identifies projects with positive signals before mainstream attention.
 * All signals are derived from measurable metrics.
 */

import { clamp } from "./utils.js";

export type EmergingSignalType =
  | "DEVELOPER_ACTIVITY_INCREASING"
  | "VOLUME_UPTICK"
  | "PRICE_MOMENTUM"
  | "MARKET_CAP_OPPORTUNITY"
  | "LIQUIDITY_IMPROVING"
  | "FUNDAMENTAL_STRENGTH"
  | "RELATIVE_STRENGTH";

export interface EmergingSignal {
  type: EmergingSignalType;
  label: string;
  detail: string;
  strength: number;  // 0–1
}

export interface EmergingProjectResult {
  coinId: string;
  score: number;
  signals: EmergingSignal[];
  whyOnRadar: string;
  isBeforeTheHype: boolean;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
}

interface CoinForScanning {
  id: string;
  symbol: string;
  name: string;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  fully_diluted_valuation?: number | null;
  total_supply?: number | null;
  ath_change_percentage: number;
  commitCount4Weeks?: number;
}

// Coins that are already well-known and should not appear in "emerging"
const EXCLUDED_FROM_EMERGING = new Set([
  "bitcoin", "ethereum", "tether", "usd-coin", "bnb", "ripple",
  "solana", "cardano", "dogecoin", "tron", "shiba-inu", "avalanche-2",
  "polkadot", "chainlink", "dai",
]);

export function scoreEmergingProject(coin: CoinForScanning): EmergingProjectResult | null {
  // Skip top 20 by rank — already discovered
  if (coin.market_cap_rank && coin.market_cap_rank <= 20) return null;
  if (EXCLUDED_FROM_EMERGING.has(coin.id)) return null;
  // Skip micro-cap trash (under $5M market cap)
  if (coin.market_cap < 5_000_000) return null;
  // Skip over-inflated FDV ratio (high risk)
  if (coin.fully_diluted_valuation && coin.market_cap > 0) {
    const fdvRatio = coin.market_cap / coin.fully_diluted_valuation;
    if (fdvRatio < 0.05) return null;  // Extreme inflation risk
  }

  const signals: EmergingSignal[] = [];
  let score = 0;

  // ── SIGNAL 1: Developer Activity ──
  if (coin.commitCount4Weeks !== undefined) {
    if (coin.commitCount4Weeks > 100) {
      score += 30;
      signals.push({
        type: "DEVELOPER_ACTIVITY_INCREASING",
        label: "High Developer Activity",
        detail: `${coin.commitCount4Weeks} commits in 4 weeks — very active development`,
        strength: 1.0,
      });
    } else if (coin.commitCount4Weeks > 30) {
      score += 20;
      signals.push({
        type: "DEVELOPER_ACTIVITY_INCREASING",
        label: "Active Development",
        detail: `${coin.commitCount4Weeks} commits in 4 weeks`,
        strength: 0.7,
      });
    } else if (coin.commitCount4Weeks > 10) {
      score += 8;
      signals.push({
        type: "DEVELOPER_ACTIVITY_INCREASING",
        label: "Moderate Dev Activity",
        detail: `${coin.commitCount4Weeks} commits in 4 weeks`,
        strength: 0.4,
      });
    }
  }

  // ── SIGNAL 2: Volume Uptick ──
  if (coin.total_volume > 0 && coin.market_cap > 0) {
    const volRatio = coin.total_volume / coin.market_cap;
    if (volRatio > 0.5) {
      score += 25;
      signals.push({
        type: "VOLUME_UPTICK",
        label: "High Volume Surge",
        detail: `Volume is ${(volRatio * 100).toFixed(0)}% of market cap`,
        strength: 1.0,
      });
    } else if (volRatio > 0.2) {
      score += 15;
      signals.push({
        type: "VOLUME_UPTICK",
        label: "Elevated Volume",
        detail: `Volume/MC ratio: ${(volRatio * 100).toFixed(0)}%`,
        strength: 0.6,
      });
    } else if (volRatio > 0.05) {
      score += 5;
      signals.push({
        type: "VOLUME_UPTICK",
        label: "Moderate Volume",
        detail: `Volume/MC ratio: ${(volRatio * 100).toFixed(0)}%`,
        strength: 0.3,
      });
    }
  }

  // ── SIGNAL 3: Price Momentum ──
  if (coin.price_change_percentage_7d_in_currency !== undefined) {
    const change7d = coin.price_change_percentage_7d_in_currency;
    if (change7d > 30) {
      score += 20;
      signals.push({
        type: "PRICE_MOMENTUM",
        label: "Strong 7d Momentum",
        detail: `+${change7d.toFixed(1)}% in 7 days`,
        strength: 1.0,
      });
    } else if (change7d > 10) {
      score += 12;
      signals.push({
        type: "PRICE_MOMENTUM",
        label: "Positive Momentum",
        detail: `+${change7d.toFixed(1)}% in 7 days`,
        strength: 0.6,
      });
    } else if (change7d > 3) {
      score += 5;
      signals.push({
        type: "PRICE_MOMENTUM",
        label: "Mild Uptrend",
        detail: `+${change7d.toFixed(1)}% in 7 days`,
        strength: 0.3,
      });
    }
  }

  // ── SIGNAL 4: Market Cap Opportunity (sweet spot: $10M–$2B) ──
  if (coin.market_cap >= 10_000_000 && coin.market_cap <= 2_000_000_000) {
    const sizeFactor =
      coin.market_cap < 100_000_000 ? 1.0 :  // small cap
      coin.market_cap < 500_000_000 ? 0.7 :  // mid cap
      0.4;                                     // large-ish
    score += Math.round(15 * sizeFactor);
    signals.push({
      type: "MARKET_CAP_OPPORTUNITY",
      label: coin.market_cap < 100_000_000 ? "Small Cap Opportunity" :
             coin.market_cap < 500_000_000 ? "Mid Cap Range" : "Large-ish Opportunity",
      detail: `Market cap: $${(coin.market_cap / 1e6).toFixed(0)}M — outside top 20`,
      strength: sizeFactor,
    });
  }

  // ── SIGNAL 5: Tokenomics Health ──
  if (coin.fully_diluted_valuation && coin.market_cap > 0 && coin.fully_diluted_valuation > 0) {
    const fdvRatio = coin.market_cap / coin.fully_diluted_valuation;
    if (fdvRatio > 0.7) {
      score += 10;
      signals.push({
        type: "FUNDAMENTAL_STRENGTH",
        label: "Low Dilution Risk",
        detail: `${(fdvRatio * 100).toFixed(0)}% of max supply circulating`,
        strength: 0.8,
      });
    }
  }

  // Minimum score threshold to appear on radar
  if (score < 25) return null;

  const finalScore = clamp(score, 25, 100);
  const signalCount = signals.length;

  // Before the Hype: rank 50-300 or small/mid cap, with high volume surge and positive momentum
  const isBeforeTheHype =
    ((coin.market_cap_rank && coin.market_cap_rank > 40) || coin.market_cap < 300_000_000) &&
    signals.some((s) => s.type === "VOLUME_UPTICK") &&
    signals.some((s) => s.type === "PRICE_MOMENTUM" || s.type === "MARKET_CAP_OPPORTUNITY" || s.type === "DEVELOPER_ACTIVITY_INCREASING");

  // Risk level
  let riskLevel: EmergingProjectResult["riskLevel"] = "HIGH";
  if (coin.market_cap > 500_000_000) riskLevel = "MODERATE";
  if (coin.market_cap > 1_000_000_000) riskLevel = "MODERATE";
  if (coin.market_cap < 50_000_000) riskLevel = "VERY_HIGH";
  if (signalCount >= 4 && coin.market_cap > 100_000_000) riskLevel = "MODERATE";

  // Generate radar summary
  const topSignal = signals.sort((a, b) => b.strength - a.strength)[0];
  const whyOnRadar = topSignal
    ? `${topSignal.label}: ${topSignal.detail}`
    : `${signalCount} positive signals detected`;

  return {
    coinId: coin.id,
    score: finalScore,
    signals: signals.slice(0, 5),  // max 5 signals
    whyOnRadar,
    isBeforeTheHype,
    riskLevel,
  };
}

export function detectEmergingProjects(
  coins: CoinForScanning[]
): EmergingProjectResult[] {
  const results: EmergingProjectResult[] = [];

  for (const coin of coins) {
    const result = scoreEmergingProject(coin);
    if (result) results.push(result);
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
