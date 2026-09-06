/**
 * Evidence Engine
 * Every analytical result must be traceable to: source, timestamp,
 * metric, calculation, provider, quality, confidence.
 * The AI must never promote rumor into fact.
 */

import type { NormalizedEvidence, EvidenceSourceType, EvidenceReliability, EvidenceQualityLevel, EvidenceStatus } from "../models/normalized.js";

/** In-memory evidence store keyed by claim ID */
const evidenceStore: Map<string, NormalizedEvidence[]> = new Map();

/**
 * Record a piece of evidence for a claim.
 */
export function recordEvidence(evidence: NormalizedEvidence): void {
  const existing = evidenceStore.get(evidence.claimId) || [];
  existing.push(evidence);
  evidenceStore.set(evidence.claimId, existing);
}

/**
 * Get all evidence for a claim.
 */
export function getEvidence(claimId: string): NormalizedEvidence[] {
  return evidenceStore.get(claimId) || [];
}

/**
 * Create evidence from a market data point.
 */
export function createMarketEvidence(
  claimId: string,
  metric: string,
  value: string,
  source: string,
  reliability: EvidenceReliability = "HIGH"
): NormalizedEvidence {
  const evidence: NormalizedEvidence = {
    claimId,
    source,
    sourceType: "MARKET_DATA",
    value: `${metric}: ${value}`,
    timestamp: new Date().toISOString(),
    reliability,
    quality: reliability === "HIGH" ? "STRONG" : reliability === "MODERATE" ? "MODERATE" : "WEAK",
    status: "CONFIRMED",
  };
  recordEvidence(evidence);
  return evidence;
}

/**
 * Create evidence from on-chain data.
 */
export function createOnChainEvidence(
  claimId: string,
  metric: string,
  value: string,
  source: string
): NormalizedEvidence {
  const evidence: NormalizedEvidence = {
    claimId,
    source,
    sourceType: "ON_CHAIN",
    value: `${metric}: ${value}`,
    timestamp: new Date().toISOString(),
    reliability: "HIGH",
    quality: "STRONG",
    status: "CONFIRMED",
  };
  recordEvidence(evidence);
  return evidence;
}

/**
 * Create evidence from a news report.
 */
export function createNewsEvidence(
  claimId: string,
  headline: string,
  source: string,
  verificationStatus: EvidenceStatus
): NormalizedEvidence {
  const reliability: EvidenceReliability =
    verificationStatus === "CONFIRMED" ? "HIGH" :
    verificationStatus === "REPORTED" ? "MODERATE" : "LOW";

  const evidence: NormalizedEvidence = {
    claimId,
    source,
    sourceType: "NEWS",
    value: headline,
    timestamp: new Date().toISOString(),
    reliability,
    quality: reliability === "HIGH" ? "MODERATE" : "WEAK",
    status: verificationStatus,
  };
  recordEvidence(evidence);
  return evidence;
}

/**
 * Create evidence from a calculated/derived metric.
 */
export function createCalculatedEvidence(
  claimId: string,
  calculation: string,
  result: string,
  inputs: string[]
): NormalizedEvidence {
  const evidence: NormalizedEvidence = {
    claimId,
    source: "cryptovision:engine",
    sourceType: "CALCULATED",
    value: `${calculation} = ${result} (from: ${inputs.join(", ")})`,
    timestamp: new Date().toISOString(),
    reliability: "MODERATE",
    quality: "MODERATE",
    status: "CONFIRMED",
  };
  recordEvidence(evidence);
  return evidence;
}

/**
 * Aggregate evidence quality for a claim.
 */
export function aggregateEvidenceQuality(claimId: string): {
  quality: EvidenceQualityLevel;
  totalPieces: number;
  strongPieces: number;
  sources: string[];
  summary: string;
} {
  const pieces = getEvidence(claimId);
  if (pieces.length === 0) {
    return {
      quality: "INSUFFICIENT",
      totalPieces: 0,
      strongPieces: 0,
      sources: [],
      summary: "CryptoVision cannot establish this claim from currently available reliable data.",
    };
  }

  const strongPieces = pieces.filter((e) => e.quality === "STRONG").length;
  const moderatePieces = pieces.filter((e) => e.quality === "MODERATE").length;
  const sources = [...new Set(pieces.map((e) => e.source))];

  let quality: EvidenceQualityLevel;
  if (strongPieces >= 2 && sources.length >= 2) quality = "STRONG";
  else if (strongPieces >= 1 || moderatePieces >= 2) quality = "MODERATE";
  else if (pieces.length >= 1) quality = "WEAK";
  else quality = "INSUFFICIENT";

  return {
    quality,
    totalPieces: pieces.length,
    strongPieces,
    sources,
    summary: `${pieces.length} evidence item(s) from ${sources.length} source(s). Quality: ${quality}.`,
  };
}

/**
 * Clear evidence for a claim (for refresh).
 */
export function clearEvidence(claimId: string): void {
  evidenceStore.delete(claimId);
}
