/**
 * Alternative.me Fear & Greed Index
 * Free public API — no key required.
 * Contextual market sentiment — NOT used for scoring.
 * Attribution: Data from alternative.me Crypto Fear & Greed Index.
 */

import { HttpClient } from "../infra/httpClient.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type { SentimentProvider, FearGreedData, FearGreedHistoryPoint } from "./interfaces.js";

export class AlternativeMeProvider implements SentimentProvider {
  readonly name = "alternativeme";
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      provider: "alternativeme",
      baseUrl: "https://api.alternative.me",
      timeout: 5_000,
    });
  }

  async getFearAndGreed(): Promise<FearGreedData | null> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>("/fng/", { limit: 1 }, "MARKET");
      if (!result?.data?.data?.[0]) return null;

      recordProviderSuccess(this.name, Date.now() - start);
      const d = result.data.data[0];

      return {
        value: parseInt(d.value, 10),
        classification: d.value_classification,
        timestamp: new Date(parseInt(d.timestamp, 10) * 1000).toISOString(),
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  async getFearAndGreedHistory(days = 30): Promise<FearGreedHistoryPoint[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>("/fng/", { limit: days }, "FUNDAMENTAL");
      if (!result?.data?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.data.map((d: any): FearGreedHistoryPoint => ({
        value: parseInt(d.value, 10),
        classification: d.value_classification,
        timestamp: new Date(parseInt(d.timestamp, 10) * 1000).toISOString(),
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }
}
