/**
 * CryptoVision Intelligence Engine
 * Computes multi-dimensional intelligence scores from available data.
 * All scores are derived from measurable metrics — not AI-generated.
 */

import { clamp } from "./utils.js";

export interface ScoringInput {
  // Market data
  marketCap?: number;
  fdv?: number;
  volume24h?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  priceChange30d?: number;
  athChangePercent?: number;
  circulatingSupply?: number;
  totalSupply?: number | null;
  maxSupply?: number | null;

  // Technical indicators
  rsi?: number;
  macdHistogram?: number;
  aboveSma20?: boolean;
  aboveSma50?: boolean;
  bollingerWidth?: number;

  // Developer data
  commitCount4Weeks?: number;
  stars?: number;
  forks?: number;
  prsMerged?: number;
  closedIssues?: number;
  totalIssues?: number;

  // External data
  tvl?: number | null;          // from DeFiLlama
  developerScore?: number;      // CoinGecko developer score
}

export interface DimensionScore {
  label: string;
  score: number;    // 0–100
  trend: "UP" | "DOWN" | "STABLE" | "UNKNOWN";
  description: string;
  evidenceQuality: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
  dataPoints: string[];
}

export interface IntelligenceScoreResult {
  overall: number;
  opportunity: number;
  risk: number;
  modelConfidence: number;
  evidenceQuality: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
  dimensions: {
    technology: DimensionScore;
    adoption: DimensionScore;
    developerActivity: DimensionScore;
    ecosystem: DimensionScore;
    tokenomics: DimensionScore;
    liquidity: DimensionScore;
    transparency: DimensionScore;
  };
}

// ── Individual Dimension Scorers ──────────────────────────────────────────

function scoreTechnology(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 50; // baseline
  let quality: DimensionScore["evidenceQuality"] = "INSUFFICIENT";

  if (input.commitCount4Weeks !== undefined) {
    quality = "MODERATE";
    dataPoints.push(`${input.commitCount4Weeks} commits (4 weeks)`);
    if (input.commitCount4Weeks > 100) score += 25;
    else if (input.commitCount4Weeks > 50) score += 15;
    else if (input.commitCount4Weeks > 10) score += 5;
    else score -= 10;
  }

  if (input.stars !== undefined) {
    dataPoints.push(`${input.stars.toLocaleString()} GitHub stars`);
    if (input.stars > 5000) score += 20;
    else if (input.stars > 1000) score += 10;
    else if (input.stars > 100) score += 5;
    if (quality === "MODERATE") quality = "STRONG";
  }

  if (input.prsMerged !== undefined && input.totalIssues !== undefined) {
    const closeRate = input.totalIssues > 0
      ? (input.closedIssues ?? 0) / input.totalIssues
      : 0;
    dataPoints.push(`${Math.round(closeRate * 100)}% issue close rate`);
    if (closeRate > 0.8) score += 10;
    else if (closeRate < 0.3) score -= 10;
  }

  const finalScore = clamp(score, 10, 95);
  const trend =
    input.commitCount4Weeks !== undefined
      ? input.commitCount4Weeks > 20 ? "UP" : input.commitCount4Weeks < 5 ? "DOWN" : "STABLE"
      : "UNKNOWN";

  return {
    label: "Technology",
    score: finalScore,
    trend,
    description: dataPoints.length
      ? `Developer signals: ${dataPoints.join(", ")}.`
      : "Insufficient developer data available.",
    evidenceQuality: quality,
    dataPoints,
  };
}

function scoreAdoption(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 40;
  let quality: DimensionScore["evidenceQuality"] = "INSUFFICIENT";

  if (input.volume24h !== undefined && input.marketCap !== undefined && input.marketCap > 0) {
    quality = "MODERATE";
    const volRatio = input.volume24h / input.marketCap;
    dataPoints.push(`V/MC ratio: ${(volRatio * 100).toFixed(1)}%`);
    if (volRatio > 0.3) score += 20;        // high turnover = activity
    else if (volRatio > 0.1) score += 10;
    else if (volRatio < 0.01) score -= 15;  // very low activity
  }

  if (input.priceChange30d !== undefined) {
    quality = quality === "INSUFFICIENT" ? "WEAK" : quality;
    dataPoints.push(`30d change: ${input.priceChange30d >= 0 ? "+" : ""}${input.priceChange30d.toFixed(1)}%`);
    if (input.priceChange30d > 50) score += 15;
    else if (input.priceChange30d > 10) score += 8;
    else if (input.priceChange30d < -30) score -= 15;
  }

  if (input.marketCap !== undefined) {
    quality = quality === "INSUFFICIENT" ? "WEAK" : quality;
    // Higher rank = more adoption evidence (proxy)
    if (input.marketCap > 10e9) score += 15;   // top-tier
    else if (input.marketCap > 1e9) score += 10;
    else if (input.marketCap > 100e6) score += 5;
  }

  const trend = input.priceChange30d !== undefined
    ? input.priceChange30d > 5 ? "UP" : input.priceChange30d < -5 ? "DOWN" : "STABLE"
    : "UNKNOWN";

  return {
    label: "Adoption",
    score: clamp(score, 5, 95),
    trend,
    description: dataPoints.length
      ? `Adoption signals: ${dataPoints.join(", ")}.`
      : "Insufficient adoption data available.",
    evidenceQuality: quality,
    dataPoints,
  };
}

function scoreDeveloperActivity(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 30;
  let quality: DimensionScore["evidenceQuality"] = "INSUFFICIENT";

  if (input.commitCount4Weeks !== undefined) {
    quality = "MODERATE";
    dataPoints.push(`${input.commitCount4Weeks} commits in 4 weeks`);
    if (input.commitCount4Weeks > 200) { score = 90; }
    else if (input.commitCount4Weeks > 100) { score = 80; }
    else if (input.commitCount4Weeks > 50) { score = 65; }
    else if (input.commitCount4Weeks > 20) { score = 55; }
    else if (input.commitCount4Weeks > 0) { score = 40; }
    else { score = 20; }
  }

  if (input.forks !== undefined) {
    dataPoints.push(`${input.forks} forks`);
    if (input.forks > 1000) score = Math.min(score + 10, 95);
    if (quality === "MODERATE") quality = "STRONG";
  }

  if (input.prsMerged !== undefined) {
    dataPoints.push(`${input.prsMerged} PRs merged`);
    if (input.prsMerged > 50) score = Math.min(score + 5, 95);
  }

  const trend = input.commitCount4Weeks !== undefined
    ? input.commitCount4Weeks > 30 ? "UP" : input.commitCount4Weeks < 5 ? "DOWN" : "STABLE"
    : "UNKNOWN";

  return {
    label: "Developer Activity",
    score: clamp(score, 5, 95),
    trend,
    description: dataPoints.length
      ? `Development signals: ${dataPoints.join(", ")}.`
      : "No developer activity data available.",
    evidenceQuality: quality,
    dataPoints,
  };
}

function scoreEcosystem(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 40;
  let quality: DimensionScore["evidenceQuality"] = "INSUFFICIENT";

  if (input.tvl !== null && input.tvl !== undefined && input.tvl > 0) {
    quality = "MODERATE";
    dataPoints.push(`TVL: $${(input.tvl / 1e6).toFixed(1)}M`);
    if (input.tvl > 1e9) score += 30;
    else if (input.tvl > 100e6) score += 20;
    else if (input.tvl > 10e6) score += 10;
    else score += 3;

    if (input.marketCap && input.marketCap > 0) {
      const tvlRatio = input.tvl / input.marketCap;
      dataPoints.push(`TVL/MC: ${tvlRatio.toFixed(2)}`);
      if (tvlRatio > 0.5) score += 15;   // strong fundamental backing
      else if (tvlRatio < 0.05) score -= 10;
    }
  } else if (input.tvl === null) {
    // No DeFi protocol data — might be L1 or non-DeFi
    quality = "WEAK";
    score = 50;
    dataPoints.push("TVL data not available (may not be DeFi protocol)");
  }

  if (input.volume24h && input.volume24h > 1e6) {
    quality = quality === "INSUFFICIENT" ? "WEAK" : quality;
    score += 5;
  }

  return {
    label: "Ecosystem",
    score: clamp(score, 10, 95),
    trend: "UNKNOWN",
    description: dataPoints.length
      ? `Ecosystem signals: ${dataPoints.join(", ")}.`
      : "Insufficient ecosystem data.",
    evidenceQuality: quality,
    dataPoints,
  };
}

function scoreTokenomics(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 60;
  let quality: DimensionScore["evidenceQuality"] = "INSUFFICIENT";
  let trend: DimensionScore["trend"] = "UNKNOWN";

  if (input.marketCap !== undefined && input.fdv !== undefined && input.fdv > 0) {
    quality = "STRONG";
    const fdvRatio = input.marketCap / input.fdv;
    dataPoints.push(`Circulating/FDV ratio: ${(fdvRatio * 100).toFixed(0)}%`);
    if (fdvRatio > 0.8) {
      score += 20;  // most tokens already circulating = low dilution risk
      trend = "STABLE";
    } else if (fdvRatio > 0.5) {
      score += 5;
    } else if (fdvRatio < 0.2) {
      score -= 25;  // significant future inflation risk
      trend = "DOWN";
      dataPoints.push("⚠ High future inflation risk");
    } else {
      score -= 10;
    }
  }

  if (input.maxSupply === null && input.totalSupply === null) {
    quality = quality === "INSUFFICIENT" ? "WEAK" : quality;
    score -= 5;
    dataPoints.push("Unlimited supply (inflationary)");
    trend = "DOWN";
  }

  if (input.circulatingSupply !== undefined && input.totalSupply != null && input.totalSupply > 0) {
    quality = quality === "INSUFFICIENT" ? "MODERATE" : quality;
    const supplyRatio = input.circulatingSupply / (input.totalSupply as number);
    dataPoints.push(`${(supplyRatio * 100).toFixed(0)}% of total supply in circulation`);
    if (supplyRatio < 0.3) {
      score -= 10;
      dataPoints.push("⚠ Large percentage of supply not yet circulating");
    }
  }

  return {
    label: "Tokenomics",
    score: clamp(score, 5, 95),
    trend,
    description: dataPoints.length
      ? `Tokenomics signals: ${dataPoints.join(", ")}.`
      : "Supply data unavailable.",
    evidenceQuality: quality,
    dataPoints,
  };
}

function scoreLiquidity(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 40;
  let quality: DimensionScore["evidenceQuality"] = "INSUFFICIENT";

  if (input.volume24h !== undefined) {
    quality = "MODERATE";
    dataPoints.push(`24h volume: $${(input.volume24h / 1e6).toFixed(1)}M`);
    if (input.volume24h > 1e9) score += 40;
    else if (input.volume24h > 100e6) score += 25;
    else if (input.volume24h > 10e6) score += 10;
    else if (input.volume24h > 1e6) score += 0;
    else score -= 20;
  }

  if (input.marketCap !== undefined && input.volume24h !== undefined && input.marketCap > 0) {
    const ratio = input.volume24h / input.marketCap;
    dataPoints.push(`V/MC: ${(ratio * 100).toFixed(1)}%`);
    if (ratio < 0.005) {
      score -= 15;
      dataPoints.push("⚠ Very low liquidity relative to market cap");
    }
  }

  const trend = input.volume24h !== undefined
    ? input.volume24h > 50e6 ? "STABLE" : "UNKNOWN"
    : "UNKNOWN";

  return {
    label: "Liquidity",
    score: clamp(score, 5, 95),
    trend,
    description: dataPoints.length
      ? `Liquidity signals: ${dataPoints.join(", ")}.`
      : "Volume data unavailable.",
    evidenceQuality: quality,
    dataPoints,
  };
}

function scoreTransparency(input: ScoringInput): DimensionScore {
  const dataPoints: string[] = [];
  let score = 50;
  let quality: DimensionScore["evidenceQuality"] = "WEAK";

  // Open source proxy: GitHub data available
  if (input.stars !== undefined || input.forks !== undefined) {
    quality = "MODERATE";
    score += 15;
    dataPoints.push("GitHub repository public");
  }

  if (input.commitCount4Weeks !== undefined && input.commitCount4Weeks > 0) {
    score += 10;
    dataPoints.push("Active development visible");
    quality = "MODERATE";
  }

  if (input.totalIssues !== undefined && input.closedIssues !== undefined) {
    score += 10;
    dataPoints.push("Issue tracker publicly visible");
  }

  // High FDV ratio = transparency concern
  if (input.marketCap !== undefined && input.fdv !== undefined && input.fdv > 0) {
    const ratio = input.marketCap / input.fdv;
    if (ratio < 0.2) {
      score -= 15;
      dataPoints.push("⚠ Low FDV/MC ratio raises transparency questions");
    }
  }

  return {
    label: "Transparency",
    score: clamp(score, 15, 90),
    trend: "STABLE",
    description: dataPoints.length
      ? `Transparency signals: ${dataPoints.join(", ")}.`
      : "Limited transparency data available.",
    evidenceQuality: quality,
    dataPoints,
  };
}

// ── Overall Score Computation ──────────────────────────────────────────────

export function computeIntelligenceScore(input: ScoringInput): IntelligenceScoreResult {
  const tech   = scoreTechnology(input);
  const adopt  = scoreAdoption(input);
  const dev    = scoreDeveloperActivity(input);
  const eco    = scoreEcosystem(input);
  const token  = scoreTokenomics(input);
  const liq    = scoreLiquidity(input);
  const trans  = scoreTransparency(input);

  // Weighted overall intelligence score
  const overall = Math.round(
    tech.score   * 0.18 +
    adopt.score  * 0.18 +
    dev.score    * 0.20 +
    eco.score    * 0.12 +
    token.score  * 0.14 +
    liq.score    * 0.10 +
    trans.score  * 0.08
  );

  // Opportunity score — momentum-forward weighting
  const opportunity = Math.round(
    adopt.score  * 0.30 +
    liq.score    * 0.25 +
    dev.score    * 0.20 +
    eco.score    * 0.15 +
    tech.score   * 0.10
  );

  // Risk score — higher means riskier
  let riskScore = 50;
  if (input.rsi !== undefined) {
    if (input.rsi > 80) riskScore += 20;
    else if (input.rsi < 20) riskScore += 10;
  }
  if (token.score < 40) riskScore += 20;
  if (liq.score < 30) riskScore += 15;
  if (dev.score < 20) riskScore += 10;
  if (adopt.score < 30) riskScore += 10;
  riskScore = clamp(riskScore, 10, 95);

  // Evidence quality: based on how many dimensions have strong data
  const qualityScores = [tech, adopt, dev, eco, token, liq, trans].map(
    (d) => ({ STRONG: 3, MODERATE: 2, WEAK: 1, INSUFFICIENT: 0 }[d.evidenceQuality] ?? 0)
  );
  const avgQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
  const evidenceQuality: IntelligenceScoreResult["evidenceQuality"] =
    avgQuality >= 2.5 ? "STRONG" :
    avgQuality >= 1.5 ? "MODERATE" :
    avgQuality >= 0.8 ? "WEAK" : "INSUFFICIENT";

  // Model confidence based on data coverage
  const dataPoints = [tech, adopt, dev, eco, token, liq, trans].reduce(
    (total, d) => total + d.dataPoints.length, 0
  );
  const modelConfidence = clamp(30 + dataPoints * 4, 30, 90);

  return {
    overall,
    opportunity,
    risk: riskScore,
    modelConfidence,
    evidenceQuality,
    dimensions: {
      technology: tech,
      adoption: adopt,
      developerActivity: dev,
      ecosystem: eco,
      tokenomics: token,
      liquidity: liq,
      transparency: trans,
    },
  };
}
