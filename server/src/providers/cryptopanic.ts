/**
 * CryptoPanic News Provider
 * Primary news source for crypto-specific news intelligence.
 * Implements NewsProvider interface.
 */

import { HttpClient } from "../infra/httpClient.js";
import { config } from "../config/env.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type { NewsProvider, NewsQueryOptions, ProviderNewsArticle } from "./interfaces.js";

export class CryptoPanicProvider implements NewsProvider {
  readonly name = "cryptopanic";
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      provider: "cryptopanic",
      baseUrl: config.cryptopanic.baseUrl,
      timeout: 10_000,
    });
  }

  async getLatestNews(options: NewsQueryOptions = {}): Promise<ProviderNewsArticle[]> {
    if (!config.cryptopanic.hasKey) return [];

    const start = Date.now();
    try {
      const params: Record<string, unknown> = {
        auth_token: config.cryptopanic.apiKey,
        public: true,
      };
      if (options.category) params.filter = options.category;

      const result = await this.client.get<any>("/posts/", params, "NEWS");
      if (!result?.data?.results) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.results
        .slice(0, options.limit || 20)
        .map((post: any): ProviderNewsArticle => ({
          id: `cp-${post.id}`,
          title: post.title,
          body: undefined,
          url: post.url || post.source?.url || "",
          source: post.source?.title || "CryptoPanic",
          sourceUrl: post.source?.url,
          publishedAt: post.published_at,
          categories: post.kind ? [post.kind] : [],
          coins: post.currencies?.map((c: any) => c.code) || [],
          sentiment: mapCryptoPanicSentiment(post.votes),
        }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getNewsForCoin(coinSymbol: string, options: NewsQueryOptions = {}): Promise<ProviderNewsArticle[]> {
    if (!config.cryptopanic.hasKey) return [];

    const start = Date.now();
    try {
      const params: Record<string, unknown> = {
        auth_token: config.cryptopanic.apiKey,
        currencies: coinSymbol.toUpperCase(),
        public: true,
      };

      const result = await this.client.get<any>("/posts/", params, "NEWS");
      if (!result?.data?.results) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.results
        .slice(0, options.limit || 10)
        .map((post: any): ProviderNewsArticle => ({
          id: `cp-${post.id}`,
          title: post.title,
          body: undefined,
          url: post.url || post.source?.url || "",
          source: post.source?.title || "CryptoPanic",
          sourceUrl: post.source?.url,
          publishedAt: post.published_at,
          categories: post.kind ? [post.kind] : [],
          coins: post.currencies?.map((c: any) => c.code) || [],
          sentiment: mapCryptoPanicSentiment(post.votes),
        }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }
}

function mapCryptoPanicSentiment(votes: any): ProviderNewsArticle["sentiment"] {
  if (!votes) return "neutral";
  const positive = (votes.positive || 0) + (votes.liked || 0);
  const negative = (votes.negative || 0) + (votes.disliked || 0);
  if (positive > negative * 2) return "positive";
  if (negative > positive * 2) return "negative";
  return "neutral";
}
