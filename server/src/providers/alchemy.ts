/**
 * Alchemy On-Chain Data Provider
 * Implements OnChainDataProvider interface.
 * Ethereum-focused with multi-chain support.
 */

import { HttpClient } from "../infra/httpClient.js";
import { config } from "../config/env.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type {
  OnChainDataProvider,
  TokenBalance,
  OnChainTransaction,
  ContractMetadata,
} from "./interfaces.js";

const NETWORK_MAP: Record<string, string> = {
  ethereum: "eth-mainnet",
  polygon: "polygon-mainnet",
  arbitrum: "arb-mainnet",
  optimism: "opt-mainnet",
  base: "base-mainnet",
};

export class AlchemyProvider implements OnChainDataProvider {
  readonly name = "alchemy";

  private getClient(chain = "ethereum"): HttpClient | null {
    if (!config.alchemy.hasKey) return null;
    const network = NETWORK_MAP[chain.toLowerCase()] || "eth-mainnet";
    return new HttpClient({
      provider: "alchemy",
      baseUrl: `https://${network}.g.alchemy.com/v2/${config.alchemy.apiKey}`,
      timeout: 15_000,
    });
  }

  async getBalance(address: string, chain = "ethereum"): Promise<string | null> {
    const client = this.getClient(chain);
    if (!client) return null;

    const start = Date.now();
    try {
      const result = await client.post<any>("", {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      if (!result?.result) return null;
      recordProviderSuccess(this.name, Date.now() - start);

      // Convert hex wei to ETH string
      const wei = BigInt(result.result);
      return (Number(wei) / 1e18).toFixed(6);
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  async getTokenBalances(address: string, chain = "ethereum"): Promise<TokenBalance[]> {
    const client = this.getClient(chain);
    if (!client) return [];

    const start = Date.now();
    try {
      const result = await client.post<any>("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenBalances",
        params: [address],
      });

      if (!result?.result?.tokenBalances) return [];
      recordProviderSuccess(this.name, Date.now() - start);

      return result.result.tokenBalances
        .filter((t: any) => t.tokenBalance !== "0x0" && t.tokenBalance !== "0x")
        .slice(0, 50) // Limit to prevent over-fetching
        .map((t: any): TokenBalance => ({
          contractAddress: t.contractAddress,
          symbol: "",
          name: "",
          balance: t.tokenBalance,
          decimals: 18, // Default; would need metadata call for accurate value
        }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getTransactions(address: string, chain = "ethereum", limit = 20): Promise<OnChainTransaction[]> {
    const client = this.getClient(chain);
    if (!client) return [];

    const start = Date.now();
    try {
      const result = await client.post<any>("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [{
          fromAddress: address,
          category: ["external", "erc20"],
          maxCount: `0x${limit.toString(16)}`,
          order: "desc",
        }],
      });

      if (!result?.result?.transfers) return [];
      recordProviderSuccess(this.name, Date.now() - start);

      return result.result.transfers.map((tx: any): OnChainTransaction => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "",
        value: String(tx.value || 0),
        timestamp: 0, // Would need block timestamp lookup
        blockNumber: parseInt(tx.blockNum, 16) || 0,
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getTokenHolderCount(contractAddress: string, chain = "ethereum"): Promise<number | null> {
    // Alchemy doesn't have a direct holder count endpoint on basic plans
    // Use token metadata or getNFTOwners for NFTs
    return null;
  }

  async getContractMetadata(contractAddress: string, chain = "ethereum"): Promise<ContractMetadata | null> {
    const client = this.getClient(chain);
    if (!client) return null;

    const start = Date.now();
    try {
      const result = await client.post<any>("", {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getTokenMetadata",
        params: [contractAddress],
      });

      if (!result?.result) return null;
      recordProviderSuccess(this.name, Date.now() - start);

      return {
        name: result.result.name || "",
        symbol: result.result.symbol || "",
        decimals: result.result.decimals || 18,
        totalSupply: result.result.totalSupply || "0",
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }
}
