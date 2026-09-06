/**
 * GoPlus Security Provider
 * Token security analysis — contract permissions, ownership,
 * honeypot detection, transfer restrictions.
 * Implements SecurityDataProvider interface.
 */

import { HttpClient } from "../infra/httpClient.js";
import { config } from "../config/env.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type { SecurityDataProvider, TokenSecurityResult, SecurityRiskItem } from "./interfaces.js";

// GoPlus chain ID mapping
const CHAIN_IDS: Record<string, string> = {
  ethereum: "1",
  bsc: "56",
  polygon: "137",
  avalanche: "43114",
  arbitrum: "42161",
  optimism: "10",
  fantom: "250",
  base: "8453",
};

export class GoPlusProvider implements SecurityDataProvider {
  readonly name = "goplus";
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      provider: "goplus",
      baseUrl: config.goplus.baseUrl,
      timeout: 10_000,
    });
  }

  async getTokenSecurity(contractAddress: string, chain = "ethereum"): Promise<TokenSecurityResult | null> {
    const chainId = CHAIN_IDS[chain.toLowerCase()] || "1";
    const start = Date.now();

    try {
      const result = await this.client.get<any>(
        `/token_security/${chainId}`,
        { contract_addresses: contractAddress.toLowerCase() },
        "SECURITY"
      );

      if (!result?.data?.result) return null;

      const tokenData = result.data.result[contractAddress.toLowerCase()];
      if (!tokenData) return null;

      recordProviderSuccess(this.name, Date.now() - start);

      const riskItems: SecurityRiskItem[] = [];

      // Analyze security signals
      if (toBool(tokenData.is_honeypot)) {
        riskItems.push({
          id: "honeypot",
          severity: "CRITICAL",
          title: "Honeypot Detected",
          description: "This token appears to be a honeypot — users may not be able to sell.",
        });
      }

      if (toBool(tokenData.is_mintable)) {
        riskItems.push({
          id: "mintable",
          severity: "HIGH",
          title: "Mintable Token",
          description: "Token owner can mint additional tokens, creating inflation risk.",
        });
      }

      if (toBool(tokenData.can_take_back_ownership)) {
        riskItems.push({
          id: "ownership-reclaim",
          severity: "HIGH",
          title: "Ownership Reclaimable",
          description: "Previous owner can reclaim ownership of the contract.",
        });
      }

      if (toBool(tokenData.owner_change_balance)) {
        riskItems.push({
          id: "balance-manipulation",
          severity: "CRITICAL",
          title: "Owner Can Change Balances",
          description: "Contract owner can modify token balances of any holder.",
        });
      }

      if (toBool(tokenData.is_blacklisted)) {
        riskItems.push({
          id: "blacklist",
          severity: "MEDIUM",
          title: "Blacklist Function",
          description: "Contract has a blacklist function that can block addresses from trading.",
        });
      }

      if (toBool(tokenData.transfer_pausable)) {
        riskItems.push({
          id: "pausable",
          severity: "MEDIUM",
          title: "Transfer Pausable",
          description: "Token transfers can be paused by the contract owner.",
        });
      }

      if (toBool(tokenData.cannot_sell_all)) {
        riskItems.push({
          id: "sell-restriction",
          severity: "HIGH",
          title: "Sell Restriction",
          description: "Holders may not be able to sell all their tokens.",
        });
      }

      const buyTax = parseFloat(tokenData.buy_tax || "0");
      const sellTax = parseFloat(tokenData.sell_tax || "0");

      if (sellTax > 10) {
        riskItems.push({
          id: "high-sell-tax",
          severity: "HIGH",
          title: `High Sell Tax: ${(sellTax * 100).toFixed(1)}%`,
          description: `Selling this token incurs a ${(sellTax * 100).toFixed(1)}% tax.`,
        });
      } else if (sellTax > 5) {
        riskItems.push({
          id: "moderate-sell-tax",
          severity: "MEDIUM",
          title: `Sell Tax: ${(sellTax * 100).toFixed(1)}%`,
          description: `Selling incurs a ${(sellTax * 100).toFixed(1)}% tax.`,
        });
      }

      if (!toBool(tokenData.is_open_source)) {
        riskItems.push({
          id: "closed-source",
          severity: "HIGH",
          title: "Not Open Source",
          description: "Contract source code is not verified/published.",
        });
      }

      if (toBool(tokenData.is_proxy)) {
        riskItems.push({
          id: "proxy",
          severity: "MEDIUM",
          title: "Proxy Contract",
          description: "This is a proxy contract — implementation can be changed by owner.",
        });
      }

      return {
        contractAddress,
        chain,
        isOpenSource: toBoolOrNull(tokenData.is_open_source),
        isProxy: toBoolOrNull(tokenData.is_proxy),
        ownerAddress: tokenData.owner_address || null,
        canTakeBackOwnership: toBoolOrNull(tokenData.can_take_back_ownership),
        ownerCanChangeBalance: toBoolOrNull(tokenData.owner_change_balance),
        isMintable: toBoolOrNull(tokenData.is_mintable),
        hasHoneypotRisk: toBoolOrNull(tokenData.is_honeypot),
        cannotBuy: toBoolOrNull(tokenData.cannot_buy),
        cannotSellAll: toBoolOrNull(tokenData.cannot_sell_all),
        hasTransferPausable: toBoolOrNull(tokenData.transfer_pausable),
        hasBlacklist: toBoolOrNull(tokenData.is_blacklisted),
        hasWhitelist: toBoolOrNull(tokenData.is_whitelisted),
        hasTradingCooldown: toBoolOrNull(tokenData.trading_cooldown),
        hasAntiWhale: toBoolOrNull(tokenData.is_anti_whale),
        buyTax: buyTax || null,
        sellTax: sellTax || null,
        holderCount: parseInt(tokenData.holder_count || "0", 10) || null,
        lpHolderCount: parseInt(tokenData.lp_holder_count || "0", 10) || null,
        riskItems,
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }
}

function toBool(val: unknown): boolean {
  return val === "1" || val === 1 || val === true;
}

function toBoolOrNull(val: unknown): boolean | null {
  if (val === undefined || val === null || val === "") return null;
  return toBool(val);
}
