/**
 * Security Reality Engine
 * Produces: Security Signals, Known Risks, Unknowns.
 * NEVER displays "Safe" just because no warning was returned.
 */

import { getSecurityProvider } from "../providers/registry.js";
import type { NormalizedSecurityReport, SecuritySignal, SecurityRiskLevel } from "../models/normalized.js";

export async function analyzeSecurityReality(
  assetId: string,
  contractAddress: string | null,
  chain = "ethereum"
): Promise<NormalizedSecurityReport> {
  const base: NormalizedSecurityReport = {
    assetId,
    contractAddress: contractAddress || "",
    chain,
    overallRisk: "UNKNOWN",
    signals: [],
    knownRisks: [],
    unknowns: [
      "Smart contract behavior may change if the contract is upgradeable.",
      "Security analysis covers known patterns only — novel attack vectors may exist.",
      "Absence of warnings does NOT equal safety.",
    ],
    source: "goplus",
    analyzedAt: new Date().toISOString(),
  };

  if (!contractAddress) {
    base.unknowns.push("No contract address available for security analysis.");
    return base;
  }

  const securityProvider = getSecurityProvider();
  if (!securityProvider) {
    base.unknowns.push("Security provider not configured. Cannot perform contract analysis.");
    return base;
  }

  try {
    const result = await securityProvider.getTokenSecurity(contractAddress, chain);
    if (!result) {
      base.unknowns.push("Security scan returned no data. Token may not be indexed.");
      return base;
    }

    // Convert risk items to signals
    for (const risk of result.riskItems) {
      base.signals.push({
        category: risk.id,
        indicator: risk.title,
        value: true,
        severity: risk.severity as SecurityRiskLevel,
        description: risk.description,
      });

      if (risk.severity === "CRITICAL" || risk.severity === "HIGH") {
        base.knownRisks.push(risk.description);
      }
    }

    // Add positive signals too
    if (result.isOpenSource === true) {
      base.signals.push({
        category: "open-source",
        indicator: "Verified Source Code",
        value: true,
        severity: "LOW",
        description: "Contract source code is verified and publicly available.",
      });
    }

    if (result.buyTax !== null && result.sellTax !== null) {
      if (result.buyTax === 0 && result.sellTax === 0) {
        base.signals.push({
          category: "no-tax",
          indicator: "No Buy/Sell Tax",
          value: true,
          severity: "LOW",
          description: "No transaction tax detected on buy or sell.",
        });
      }
    }

    if (result.holderCount !== null && result.holderCount > 0) {
      base.signals.push({
        category: "holder-count",
        indicator: `${result.holderCount.toLocaleString()} Holders`,
        value: result.holderCount,
        severity: "LOW",
        description: `Token has ${result.holderCount.toLocaleString()} unique holders.`,
      });
    }

    // Determine overall risk
    const criticals = base.signals.filter((s) => s.severity === "CRITICAL").length;
    const highs = base.signals.filter((s) => s.severity === "HIGH").length;
    const mediums = base.signals.filter((s) => s.severity === "MODERATE").length;

    if (criticals > 0) base.overallRisk = "CRITICAL";
    else if (highs >= 2) base.overallRisk = "HIGH";
    else if (highs === 1 || mediums >= 2) base.overallRisk = "MODERATE";
    else if (base.signals.length > 0) base.overallRisk = "LOW";
    // Else stays "UNKNOWN" — never "SAFE"

    // Standard unknowns
    if (result.isProxy) {
      base.unknowns.push("Proxy contract: implementation logic can change without notice.");
    }
    if (result.isMintable === null) {
      base.unknowns.push("Could not determine if token supply can be increased.");
    }

    base.source = securityProvider.name;

  } catch (err: any) {
    base.unknowns.push(`Security scan error: ${err.message}`);
  }

  return base;
}
