/**
 * NewsData.io Fallback News Provider
 * Secondary news source when CryptoPanic is unavailable or rate-limited.
 */

import { HttpClient } from "../infra/httpClient.js";
import { config } from "../config/env.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type { NewsProvider, NewsQueryOptions, ProviderNewsArticle } from "./interfaces.js";

export class NewsDataProvider implements NewsProvider {
  readonly name = "newsdata";
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      provider: "newsdata",
      baseUrl: config.newsdata.baseUrl,
      timeout: 10_000,
    });
  }

  async getLatestNews(options: NewsQueryOptions = {}): Promise<ProviderNewsArticle[]> {
    if (!config.newsdata.hasKey) return [];

    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/news",
        {
          apikey: config.newsdata.apiKey,
          q: "cryptocurrency OR bitcoin OR ethereum OR blockchain",
          language: "en",
          category: "business,technology",
          size: options.limit || 10,
        },
        "NEWS"
      );

      if (!result?.data?.results) return [];
      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.results.map((article: any): ProviderNewsArticle => ({
        id: `nd-${article.article_id || article.link}`,
        title: article.title || "",
        body: article.description || article.content || undefined,
        url: article.link || "",
        source: article.source_name || article.source_id || "NewsData",
        sourceUrl: article.source_url,
        publishedAt: article.pubDate || new Date().toISOString(),
        categories: article.category || [],
        coins: extractCoinMentions(article.title, article.description),
        sentiment: article.sentiment || "neutral",
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getNewsForCoin(coinSymbol: string, options: NewsQueryOptions = {}): Promise<ProviderNewsArticle[]> {
    if (!config.newsdata.hasKey) return [];

    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/news",
        {
          apikey: config.newsdata.apiKey,
          q: coinSymbol,
          language: "en",
          size: options.limit || 10,
        },
        "NEWS"
      );

      if (!result?.data?.results) return [];
      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.results.map((article: any): ProviderNewsArticle => ({
        id: `nd-${article.article_id || article.link}`,
        title: article.title || "",
        body: article.description || article.content || undefined,
        url: article.link || "",
        source: article.source_name || article.source_id || "NewsData",
        sourceUrl: article.source_url,
        publishedAt: article.pubDate || new Date().toISOString(),
        categories: article.category || [],
        coins: [coinSymbol, ...extractCoinMentions(article.title, article.description)],
        sentiment: article.sentiment || "neutral",
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }
}

/** Simple keyword extraction for coin mentions */
function extractCoinMentions(title?: string, body?: string): string[] {
  const text = `${title || ""} ${body || ""}`.toUpperCase();
  const coins: string[] = [];
  const KNOWN = [
    "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOT", "LINK",
    "MATIC", "UNI", "AAVE", "NEAR", "FET", "TAO", "RENDER", "ARB",
    "OP", "SUI", "APT", "FIL", "ATOM",
  ];
  for (const sym of KNOWN) {
    // Match word boundaries to avoid false positives
    if (new RegExp(`\\b${sym}\\b`).test(text)) {
      coins.push(sym);
    }
  }
  return [...new Set(coins)];
}
