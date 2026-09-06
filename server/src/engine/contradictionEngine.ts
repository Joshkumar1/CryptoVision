/**
 * Contradiction Engine
 * Cross-references all provider data to detect conflicts.
 * Outputs: where do sources disagree?
 */

import { crossValidate } from "./dataQuality.js";
import type { DataConflictItem } from "../types.js";

export interface ContradictionReport {
  assetId: string;
  conflicts: DataConflictItem[];
  agreements: string[];
  overallConsistency: "CONSISTENT" | "MINOR_DISCREPANCIES" | "SIGNIFICANT_CONFLICTS";
  analyzedAt: string;
}

/**
 * Detect contradictions between multiple data sources for a single asset.
 */
export function detectContradictions(
  assetId: string,
  sources: Array<{
    provider: string;
    data: Record<string, number | null>;
  }>
): ContradictionReport {
  const conflicts: DataConflictItem[] = [];
  const agreements: string[] = [];

  if (sources.length < 2) {
    return {
      assetId,
      conflicts: [],
      agreements: ["Single source — no cross-validation possible."],
      overallConsistency: "CONSISTENT",
      analyzedAt: new Date().toISOString(),
    };
  }

  // Compare all pairs for common metrics
  const metricsToCompare = [
    { key: "price", label: "Price", tolerance: 2 },
    { key: "marketCap", label: "Market Cap", tolerance: 5 },
    { key: "volume24h", label: "24h Volume", tolerance: 15 },
    { key: "circulatingSupply", label: "Circulating Supply", tolerance: 3 },
    { key: "totalSupply", label: "Total Supply", tolerance: 3 },
    { key: "fdv", label: "Fully Diluted Valuation", tolerance: 5 },
  ];

  for (const metric of metricsToCompare) {
    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const valA = sources[i].data[metric.key];
        const valB = sources[j].data[metric.key];

        if (valA === null || valA === undefined || valB === null || valB === undefined) continue;

        const result = crossValidate(
          metric.label,
          { provider: sources[i].provider, value: valA },
          { provider: sources[j].provider, value: valB },
          metric.tolerance
        );

        if (result.status === "CONFLICT") {
          conflicts.push({
            metric: metric.label,
            sourceA: { name: sources[i].provider, value: String(valA) },
            sourceB: { name: sources[j].provider, value: String(valB) },
            difference: `${result.differencePct.toFixed(1)}%`,
            recommendedVerification: `Verify ${metric.label} from the project's official sources or block explorer.`,
          });
        } else if (result.status === "AGREEMENT") {
          agreements.push(result.detail);
        } else {
          // MINOR_DIFFERENCE — note but don't flag as conflict
          agreements.push(`${metric.label}: minor difference (${result.differencePct.toFixed(1)}%) between ${sources[i].provider} and ${sources[j].provider}`);
        }
      }
    }
  }

  const consistency: ContradictionReport["overallConsistency"] =
    conflicts.length === 0 ? "CONSISTENT" :
    conflicts.length <= 2 ? "MINOR_DISCREPANCIES" :
    "SIGNIFICANT_CONFLICTS";

  return {
    assetId,
    conflicts,
    agreements,
    overallConsistency: consistency,
    analyzedAt: new Date().toISOString(),
  };
}
