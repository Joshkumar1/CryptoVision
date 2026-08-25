/**
 * Reality Check Engine
 * Generates structured claim/evidence/assessment objects from coin data.
 * The AI/LLM is only used to interpret these structured objects — never to invent data.
 */

interface CoinData {
  id: string;
  name: string;
  description?: string;
  marketCap?: number;
  fdv?: number;
  volume24h?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  priceChange30d?: number;
  circulatingSupply?: number;
  totalSupply?: number | null;
  maxSupply?: number | null;
  commitCount4Weeks?: number;
  stars?: number;
  forks?: number;
  rsi?: number;
  tvl?: number | null;
}

export type EvidenceStatus =
  | "EVIDENCE_SUPPORTED"
  | "MIXED_EVIDENCE"
  | "SPECULATIVE"
  | "EVIDENCE_CONFLICT"
  | "INSUFFICIENT_DATA";

export interface Claim {
  id: string;
  text: string;
  category: string;
}

export interface EvidenceItem {
  metric: string;
  value: string;
  direction: "SUPPORTS" | "CONTRADICTS" | "NEUTRAL";
  source: string;
}

export interface ClaimAssessment {
  claim: Claim;
  evidence: EvidenceItem[];
  assessment: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE";
  explanation: string;
}

export interface RealityCheckResult {
  coinId: string;
  evidenceStatus: EvidenceStatus;
  overallAssessment: string;
  claims: ClaimAssessment[];
  contradictions: EvidenceItem[];
  bullCase: string[];
  bearCase: string[];
  unknowns: string[];
  whatWouldChangePositive: string[];
  whatWouldChangeNegative: string[];
  dataQuality: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
  computedAt: string;
}

export function generateRealityCheck(coin: CoinData): RealityCheckResult {
  const claims: ClaimAssessment[] = [];
  const contradictions: EvidenceItem[] = [];
  const bullCase: string[] = [];
  const bearCase: string[] = [];
  const unknowns: string[] = [];
  const whatWouldChangePositive: string[] = [];
  const whatWouldChangeNegative: string[] = [];

  let supportedCount = 0;
  let contradictedCount = 0;
  let unverifiableCount = 0;
  let dataPointCount = 0;

  // ── CLAIM 1: Developer Activity ──
  {
    const evidence: EvidenceItem[] = [];
    let assessment: ClaimAssessment["assessment"] = "UNVERIFIABLE";
    let explanation = "";

    if (coin.commitCount4Weeks !== undefined) {
      dataPointCount++;
      const isActive = coin.commitCount4Weeks > 20;
      evidence.push({
        metric: "Commits (4 weeks)",
        value: coin.commitCount4Weeks.toString(),
        direction: isActive ? "SUPPORTS" : coin.commitCount4Weeks > 5 ? "NEUTRAL" : "CONTRADICTS",
        source: "CoinGecko Developer Data",
      });

      if (coin.stars !== undefined) {
        dataPointCount++;
        evidence.push({
          metric: "GitHub Stars",
          value: coin.stars.toLocaleString(),
          direction: coin.stars > 500 ? "SUPPORTS" : "NEUTRAL",
          source: "CoinGecko Developer Data",
        });
      }

      if (coin.commitCount4Weeks === 0) {
        assessment = "CONTRADICTED";
        explanation = `No commits detected in the past 4 weeks suggests development may be stagnant.`;
        contradictedCount++;
        contradictions.push(evidence[0]);
        bearCase.push("Zero developer commits in the past 4 weeks");
        whatWouldChangeNegative.push("Developer activity remains at zero for multiple consecutive periods");
      } else if (coin.commitCount4Weeks > 50) {
        assessment = "SUPPORTED";
        explanation = `Active development with ${coin.commitCount4Weeks} commits in 4 weeks indicates ongoing engineering work.`;
        supportedCount++;
        bullCase.push(`Active development: ${coin.commitCount4Weeks} commits in the past 4 weeks`);
        whatWouldChangePositive.push("Developer commit frequency continues to increase");
      } else {
        assessment = "PARTIALLY_SUPPORTED";
        explanation = `Moderate developer activity with ${coin.commitCount4Weeks} commits over 4 weeks.`;
        supportedCount++;
      }
    } else {
      assessment = "UNVERIFIABLE";
      explanation = "Developer activity data is not available for this asset.";
      unverifiableCount++;
      unknowns.push("Developer activity cannot be independently verified");
    }

    claims.push({
      claim: { id: "dev-activity", text: "The project has active developer activity", category: "TECHNOLOGY" },
      evidence,
      assessment,
      explanation,
    });
  }

  // ── CLAIM 2: Token Supply & Dilution Risk ──
  {
    const evidence: EvidenceItem[] = [];
    let assessment: ClaimAssessment["assessment"] = "UNVERIFIABLE";
    let explanation = "";

    if (coin.marketCap !== undefined && coin.fdv !== undefined && coin.fdv > 0) {
      dataPointCount++;
      const fdvRatio = coin.marketCap / coin.fdv;
      const pct = (fdvRatio * 100).toFixed(0);

      evidence.push({
        metric: "Circulating / FDV",
        value: `${pct}%`,
        direction: fdvRatio > 0.7 ? "SUPPORTS" : fdvRatio < 0.3 ? "CONTRADICTS" : "NEUTRAL",
        source: "CoinGecko Market Data",
      });

      if (fdvRatio < 0.2) {
        assessment = "CONTRADICTED";
        explanation = `Only ${pct}% of fully diluted supply is circulating. Significant future token inflation is expected.`;
        contradictedCount++;
        contradictions.push(evidence[0]);
        bearCase.push(`Only ${pct}% of total supply is currently circulating — high dilution risk`);
        whatWouldChangeNegative.push("Token unlock schedule releases large supply batches");
      } else if (fdvRatio > 0.8) {
        assessment = "SUPPORTED";
        explanation = `${pct}% of supply is already circulating, indicating low future dilution risk.`;
        supportedCount++;
        bullCase.push(`${pct}% of supply circulating — low dilution risk`);
      } else {
        assessment = "PARTIALLY_SUPPORTED";
        explanation = `${pct}% of supply is circulating. Moderate future inflation expected.`;
        supportedCount++;
      }

      whatWouldChangePositive.push("Circulating supply approaches maximum supply (reduced dilution pressure)");
    } else {
      assessment = "UNVERIFIABLE";
      explanation = "Fully diluted valuation data is not available.";
      unverifiableCount++;
      unknowns.push("Full tokenomics including vesting schedules cannot be verified");
    }

    claims.push({
      claim: { id: "tokenomics", text: "Token supply is reasonable and does not pose significant dilution risk", category: "TOKENOMICS" },
      evidence,
      assessment,
      explanation,
    });
  }

  // ── CLAIM 3: Market Momentum ──
  {
    const evidence: EvidenceItem[] = [];
    let assessment: ClaimAssessment["assessment"] = "UNVERIFIABLE";
    let explanation = "";

    if (coin.priceChange30d !== undefined) {
      dataPointCount++;
      evidence.push({
        metric: "30-day price change",
        value: `${coin.priceChange30d >= 0 ? "+" : ""}${coin.priceChange30d.toFixed(1)}%`,
        direction: coin.priceChange30d > 10 ? "SUPPORTS" : coin.priceChange30d < -20 ? "CONTRADICTS" : "NEUTRAL",
        source: "CoinGecko Market Data",
      });
    }

    if (coin.priceChange7d !== undefined) {
      dataPointCount++;
      evidence.push({
        metric: "7-day price change",
        value: `${coin.priceChange7d >= 0 ? "+" : ""}${coin.priceChange7d.toFixed(1)}%`,
        direction: coin.priceChange7d > 5 ? "SUPPORTS" : coin.priceChange7d < -10 ? "CONTRADICTS" : "NEUTRAL",
        source: "CoinGecko Market Data",
      });
    }

    if (coin.rsi !== undefined) {
      dataPointCount++;
      evidence.push({
        metric: "RSI (14)",
        value: coin.rsi.toFixed(1),
        direction: coin.rsi > 70 ? "CONTRADICTS" : coin.rsi < 30 ? "SUPPORTS" : "NEUTRAL",
        source: "Technical Analysis (90d price data)",
      });
    }

    if (evidence.length > 0) {
      const supporting = evidence.filter((e) => e.direction === "SUPPORTS").length;
      const contradicting = evidence.filter((e) => e.direction === "CONTRADICTS").length;

      if (contradicting > supporting) {
        assessment = "CONTRADICTED";
        explanation = "Current market indicators suggest weakening momentum.";
        contradictedCount++;
        bearCase.push("Market momentum signals are predominantly negative");
        whatWouldChangeNegative.push("RSI falls below 30 and remains there for extended period");
      } else if (supporting >= contradicting && supporting > 0) {
        assessment = "SUPPORTED";
        explanation = "Multiple market indicators show positive momentum.";
        supportedCount++;
        bullCase.push("Market momentum indicators are predominantly positive");
        whatWouldChangePositive.push("RSI recovers above 50 with increasing volume");
      } else {
        assessment = "PARTIALLY_SUPPORTED";
        explanation = "Mixed market signals — no clear directional bias.";
        supportedCount++;
      }
    } else {
      assessment = "UNVERIFIABLE";
      explanation = "Insufficient price history for momentum analysis.";
      unverifiableCount++;
    }

    claims.push({
      claim: { id: "momentum", text: "The project shows positive market momentum", category: "GROWTH" },
      evidence,
      assessment,
      explanation,
    });
  }

  // ── CLAIM 4: Liquidity ──
  if (coin.volume24h !== undefined && coin.marketCap !== undefined && coin.marketCap > 0) {
    dataPointCount++;
    const volRatio = coin.volume24h / coin.marketCap;
    const evidence: EvidenceItem[] = [{
      metric: "24h Volume / Market Cap",
      value: `${(volRatio * 100).toFixed(1)}%`,
      direction: volRatio > 0.05 ? "SUPPORTS" : volRatio < 0.005 ? "CONTRADICTS" : "NEUTRAL",
      source: "CoinGecko Market Data",
    }];

    const isLiquid = volRatio > 0.05;
    const isIlliquid = volRatio < 0.005;

    let assessment: ClaimAssessment["assessment"];
    let explanation: string;

    if (isLiquid) {
      assessment = "SUPPORTED";
      explanation = `Volume/Market Cap ratio of ${(volRatio * 100).toFixed(1)}% indicates healthy liquidity.`;
      supportedCount++;
      bullCase.push("Liquidity is healthy relative to market cap");
    } else if (isIlliquid) {
      assessment = "CONTRADICTED";
      explanation = `Very low volume relative to market cap (${(volRatio * 100).toFixed(2)}%) indicates liquidity risk.`;
      contradictedCount++;
      contradictions.push(evidence[0]);
      bearCase.push("Low liquidity relative to market cap poses risk for larger positions");
      whatWouldChangeNegative.push("Volume continues to decline relative to market cap");
    } else {
      assessment = "PARTIALLY_SUPPORTED";
      explanation = `Moderate liquidity at ${(volRatio * 100).toFixed(1)}% volume/market cap ratio.`;
      supportedCount++;
    }

    claims.push({
      claim: { id: "liquidity", text: "The project has sufficient market liquidity", category: "FINANCIAL" },
      evidence,
      assessment,
      explanation,
    });
  }

  // ── TVL Claims (if available) ──
  if (coin.tvl !== null && coin.tvl !== undefined && coin.tvl > 0 && coin.marketCap) {
    dataPointCount++;
    const tvlRatio = coin.tvl / coin.marketCap;
    const evidence: EvidenceItem[] = [
      {
        metric: "Total Value Locked (TVL)",
        value: `$${(coin.tvl / 1e6).toFixed(1)}M`,
        direction: tvlRatio > 0.3 ? "SUPPORTS" : "NEUTRAL",
        source: "DeFiLlama",
      },
      {
        metric: "TVL / Market Cap",
        value: tvlRatio.toFixed(2),
        direction: tvlRatio > 0.5 ? "SUPPORTS" : tvlRatio < 0.05 ? "CONTRADICTS" : "NEUTRAL",
        source: "Calculated",
      },
    ];

    let assessment: ClaimAssessment["assessment"];
    let explanation: string;

    if (tvlRatio > 0.5) {
      assessment = "SUPPORTED";
      explanation = `Strong TVL-to-market cap ratio of ${tvlRatio.toFixed(2)} indicates genuine protocol usage.`;
      supportedCount++;
      bullCase.push(`TVL of $${(coin.tvl / 1e6).toFixed(0)}M indicates real protocol usage`);
      whatWouldChangePositive.push("TVL continues to grow and approaches or exceeds market cap");
    } else if (tvlRatio < 0.05) {
      assessment = "CONTRADICTED";
      explanation = `Low TVL relative to market cap suggests speculative premium over actual protocol usage.`;
      contradictedCount++;
      bearCase.push("TVL is low relative to market cap — significant speculative premium");
      whatWouldChangeNegative.push("TVL declines while market cap remains inflated");
    } else {
      assessment = "PARTIALLY_SUPPORTED";
      explanation = `TVL of $${(coin.tvl / 1e6).toFixed(0)}M with ratio of ${tvlRatio.toFixed(2)} — moderate protocol backing.`;
      supportedCount++;
    }

    claims.push({
      claim: { id: "tvl", text: "The protocol has meaningful total value locked relative to its valuation", category: "ECOSYSTEM" },
      evidence,
      assessment,
      explanation,
    });
  } else if (coin.tvl === undefined) {
    unknowns.push("TVL (Total Value Locked) data is not available from DeFiLlama");
  }

  // ── What Would Change Assessment ──
  whatWouldChangePositive.push(
    "Developer commit frequency increases significantly over multiple periods",
    "Volume relative to market cap improves meaningfully",
    "Circulating supply approaches total supply (reduced dilution)"
  );
  whatWouldChangeNegative.push(
    "Developer activity drops to zero for consecutive periods",
    "Liquidity deteriorates materially",
    "Large token unlocks depress price action"
  );

  // ── Overall Evidence Status ──
  const totalClaims = supportedCount + contradictedCount + unverifiableCount;
  let evidenceStatus: EvidenceStatus;
  let overallAssessment: string;

  if (totalClaims === 0 || unverifiableCount === totalClaims) {
    evidenceStatus = "INSUFFICIENT_DATA";
    overallAssessment = "Insufficient data is available to form a meaningful assessment of this project.";
  } else if (contradictedCount > supportedCount) {
    evidenceStatus = "EVIDENCE_CONFLICT";
    overallAssessment = `Evidence materially conflicts with ${contradictedCount} of ${totalClaims} assessed claims. Significant caution is warranted.`;
  } else if (contradictedCount > 0 && supportedCount > 0) {
    evidenceStatus = "MIXED_EVIDENCE";
    overallAssessment = `Mixed evidence: ${supportedCount} claims supported, ${contradictedCount} contradicted. A nuanced picture emerges.`;
  } else if (unverifiableCount > supportedCount) {
    evidenceStatus = "SPECULATIVE";
    overallAssessment = `Most claims cannot be independently verified. Available evidence is limited.`;
  } else {
    evidenceStatus = "EVIDENCE_SUPPORTED";
    overallAssessment = `Available evidence broadly supports ${supportedCount} of ${totalClaims} assessed claims.`;
  }

  // Data quality
  const dataQuality: RealityCheckResult["dataQuality"] =
    dataPointCount >= 10 ? "STRONG" :
    dataPointCount >= 5 ? "MODERATE" :
    dataPointCount >= 2 ? "WEAK" : "INSUFFICIENT";

  return {
    coinId: coin.id,
    evidenceStatus,
    overallAssessment,
    claims,
    contradictions,
    bullCase,
    bearCase,
    unknowns,
    whatWouldChangePositive: [...new Set(whatWouldChangePositive)],
    whatWouldChangeNegative: [...new Set(whatWouldChangeNegative)],
    dataQuality,
    computedAt: new Date().toISOString(),
  };
}
