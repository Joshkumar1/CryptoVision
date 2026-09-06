/**
 * CryptoVision Data Quality Engine
 * Validates data before analytical use.
 * Never silently repairs suspicious financial data.
 */

import type { NormalizedAsset, NormalizedMetric, DataSource } from "../models/normalized.js";

export type DataQualityVerdict = "VALID" | "STALE" | "MISSING" | "CONFLICT" | "INVALID";

export interface DataQualityResult {
  verdict: DataQualityVerdict;
  issues: DataQualityIssue[];
  score: number;          // 0-100
  passedChecks: number;
  failedChecks: number;
}

export interface DataQualityIssue {
  field: string;
  check: string;
  severity: "ERROR" | "WARNING" | "INFO";
  message: string;
}

/**
 * Validate a NormalizedAsset before analytical use.
 */
export function validateAsset(asset: NormalizedAsset): DataQualityResult {
  const issues: DataQualityIssue[] = [];
  let passedChecks = 0;
  let failedChecks = 0;

  // ── Type Checks ──
  if (typeof asset.price !== "number" || isNaN(asset.price)) {
    issues.push({ field: "price", check: "type", severity: "ERROR", message: "Price is not a valid number" });
    failedChecks++;
  } else { passedChecks++; }

  if (typeof asset.marketCap !== "number" || isNaN(asset.marketCap)) {
    issues.push({ field: "marketCap", check: "type", severity: "ERROR", message: "Market cap is not a valid number" });
    failedChecks++;
  } else { passedChecks++; }

  // ── Freshness Checks ──
  if (asset.updatedAt) {
    const ageMs = Date.now() - new Date(asset.updatedAt).getTime();
    if (ageMs > 24 * 60 * 60 * 1000) {
      issues.push({ field: "updatedAt", check: "freshness", severity: "WARNING", message: "Data is more than 24 hours old" });
      failedChecks++;
    } else if (ageMs > 60 * 60 * 1000) {
      issues.push({ field: "updatedAt", check: "freshness", severity: "INFO", message: "Data is more than 1 hour old" });
      passedChecks++;
    } else { passedChecks++; }
  } else {
    issues.push({ field: "updatedAt", check: "freshness", severity: "WARNING", message: "No timestamp available" });
    failedChecks++;
  }

  // ── Outlier Checks ──
  if (asset.price <= 0) {
    issues.push({ field: "price", check: "outlier", severity: "ERROR", message: "Price is zero or negative" });
    failedChecks++;
  } else { passedChecks++; }

  if (asset.marketCap < 0) {
    issues.push({ field: "marketCap", check: "outlier", severity: "ERROR", message: "Market cap is negative" });
    failedChecks++;
  } else { passedChecks++; }

  if (asset.volume24h < 0) {
    issues.push({ field: "volume24h", check: "outlier", severity: "ERROR", message: "Volume is negative" });
    failedChecks++;
  } else { passedChecks++; }

  // ── Consistency Checks ──
  if (asset.marketCap > 0 && asset.price > 0 && asset.circulatingSupply > 0) {
    const impliedMCap = asset.price * asset.circulatingSupply;
    const deviation = Math.abs(impliedMCap - asset.marketCap) / asset.marketCap;
    if (deviation > 0.1) {
      issues.push({
        field: "marketCap",
        check: "consistency",
        severity: "WARNING",
        message: `Market cap deviation: price × supply differs by ${(deviation * 100).toFixed(1)}%`,
      });
      failedChecks++;
    } else { passedChecks++; }
  }

  // ── Supply Checks ──
  if (asset.circulatingSupply <= 0) {
    issues.push({ field: "circulatingSupply", check: "missing", severity: "WARNING", message: "Circulating supply is zero or missing" });
    failedChecks++;
  } else { passedChecks++; }

  if (asset.totalSupply !== null && asset.circulatingSupply > 0) {
    if (asset.circulatingSupply > asset.totalSupply) {
      issues.push({
        field: "circulatingSupply",
        check: "consistency",
        severity: "WARNING",
        message: "Circulating supply exceeds total supply",
      });
      failedChecks++;
    } else { passedChecks++; }
  }

  if (asset.maxSupply !== null && asset.totalSupply !== null) {
    if (asset.totalSupply > asset.maxSupply) {
      issues.push({
        field: "totalSupply",
        check: "consistency",
        severity: "WARNING",
        message: "Total supply exceeds max supply",
      });
      failedChecks++;
    } else { passedChecks++; }
  }

  // ── Source Checks ──
  if (!asset.sources || asset.sources.length === 0) {
    issues.push({ field: "sources", check: "provenance", severity: "WARNING", message: "No data source recorded" });
    failedChecks++;
  } else { passedChecks++; }

  // ── Compute Verdict ──
  const total = passedChecks + failedChecks;
  const score = total > 0 ? Math.round((passedChecks / total) * 100) : 0;

  const errors = issues.filter((i) => i.severity === "ERROR").length;
  let verdict: DataQualityVerdict = "VALID";
  if (errors > 0) verdict = "INVALID";
  else if (issues.some((i) => i.check === "freshness" && i.severity === "WARNING")) verdict = "STALE";
  else if (issues.some((i) => i.severity === "WARNING")) verdict = "CONFLICT";

  return { verdict, issues, score, passedChecks, failedChecks };
}

/**
 * Compare values from two providers for cross-source validation.
 */
export function crossValidate(
  metric: string,
  sourceA: { provider: string; value: number },
  sourceB: { provider: string; value: number },
  tolerancePct = 5
): {
  status: "AGREEMENT" | "MINOR_DIFFERENCE" | "CONFLICT";
  differencePct: number;
  detail: string;
} {
  if (sourceA.value === 0 && sourceB.value === 0) {
    return { status: "AGREEMENT", differencePct: 0, detail: "Both sources report zero" };
  }

  const avg = (sourceA.value + sourceB.value) / 2;
  const diff = Math.abs(sourceA.value - sourceB.value);
  const pct = avg > 0 ? (diff / avg) * 100 : 0;

  if (pct <= tolerancePct) {
    return {
      status: "AGREEMENT",
      differencePct: pct,
      detail: `${metric}: ${sourceA.provider} ($${sourceA.value.toLocaleString()}) ≈ ${sourceB.provider} ($${sourceB.value.toLocaleString()}) — ${pct.toFixed(1)}% difference`,
    };
  }

  if (pct <= tolerancePct * 3) {
    return {
      status: "MINOR_DIFFERENCE",
      differencePct: pct,
      detail: `${metric}: ${pct.toFixed(1)}% difference between ${sourceA.provider} and ${sourceB.provider}`,
    };
  }

  return {
    status: "CONFLICT",
    differencePct: pct,
    detail: `${metric}: ${pct.toFixed(1)}% CONFLICT — ${sourceA.provider} ($${sourceA.value.toLocaleString()}) vs ${sourceB.provider} ($${sourceB.value.toLocaleString()})`,
  };
}
