/**
 * News Intelligence Pipeline
 * Replaces hardcoded LIVE_CATALYSTS with real provider data.
 * Pipeline: Sources → Dedup → Clustering → Verification → Impact → Evidence
 */

import { getNewsProviders } from "../providers/registry.js";
import type { ProviderNewsArticle } from "../providers/interfaces.js";
import type {
  NormalizedNewsEvent,
  NewsCategory,
  NewsVerificationStatus,
  SourceReliability,
  NewsSentiment,
} from "../models/normalized.js";
import { cacheGet, cacheSet } from "../infra/cache.js";

const CACHE_KEY = "news:pipeline:events";

// ── Tier 1 sources (generally reliable) ────────────────────────────────
const TIER_1_SOURCES = new Set([
  "coindesk", "cointelegraph", "theblock", "decrypt", "bloomberg",
  "reuters", "cnbc", "wsj", "nytimes", "techcrunch", "forbes",
]);

// ── Event Clustering ──────────────────────────────────────────────────

interface ArticleCluster {
  articles: ProviderNewsArticle[];
  primaryTitle: string;
  publishedAt: string;
  coins: string[];
  category: NewsCategory;
  sentiment: NewsSentiment;
}

/**
 * Cluster articles about the same event by title similarity.
 * Simple approach: normalized title overlap > 50% = same event.
 */
function clusterArticles(articles: ProviderNewsArticle[]): ArticleCluster[] {
  const clusters: ArticleCluster[] = [];

  for (const article of articles) {
    const normalized = normalizeTitle(article.title);
    let matched = false;

    for (const cluster of clusters) {
      if (titleSimilarity(normalized, normalizeTitle(cluster.primaryTitle)) > 0.45) {
        cluster.articles.push(article);
        // Merge coins
        for (const coin of article.coins || []) {
          if (!cluster.coins.includes(coin)) cluster.coins.push(coin);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      clusters.push({
        articles: [article],
        primaryTitle: article.title,
        publishedAt: article.publishedAt,
        coins: [...(article.coins || [])],
        category: categorizeArticle(article),
        sentiment: mapSentiment(article.sentiment),
      });
    }
  }

  return clusters;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.split(" ").filter((w) => w.length > 3));
  const wordsB = new Set(b.split(" ").filter((w) => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  const intersection = new Set([...wordsA].filter((w) => wordsB.has(w)));
  return intersection.size / Math.min(wordsA.size, wordsB.size);
}

// ── Categorization ────────────────────────────────────────────────────

function categorizeArticle(article: ProviderNewsArticle): NewsCategory {
  const text = `${article.title} ${article.body || ""}`.toLowerCase();

  if (/regulat|sec |cftc|ban|law|legal|complian/.test(text)) return "REGULATORY";
  if (/hack|exploit|vulnerab|breach|rug\s?pull|scam|drain/.test(text)) return "EXPLOIT_SECURITY";
  if (/partnership|integrat|collaborat|launch/.test(text)) return "PARTNERSHIP";
  if (/upgrade|update|mainnet|testnet|release|fork|deploy/.test(text)) return "DEVELOPMENT";
  if (/token|supply|burn|mint|airdrop|unlock|vest/.test(text)) return "TOKENOMICS";
  if (/blackrock|institutional|etf|fund|invest|acquisition/.test(text)) return "INSTITUTIONAL";
  if (/governance|vote|proposal|dao/.test(text)) return "GOVERNANCE";
  if (/ecosystem|chain|network|defi|nft/.test(text)) return "ECOSYSTEM";
  if (/price|market|rally|crash|surge|dump|liquidat/.test(text)) return "MARKET_EVENT";
  return "OTHER";
}

// ── Verification Status ───────────────────────────────────────────────

function determineVerificationStatus(cluster: ArticleCluster): NewsVerificationStatus {
  const sourceNames = cluster.articles.map((a) => a.source.toLowerCase());
  const hasTier1 = sourceNames.some((s) => TIER_1_SOURCES.has(s));
  const multiSource = new Set(sourceNames).size >= 2;

  if (hasTier1 && multiSource) return "CONFIRMED";
  if (hasTier1 || multiSource) return "REPORTED";
  if (cluster.articles.length === 1) return "DEVELOPING";
  return "REPORTED";
}

function determineSourceReliability(cluster: ArticleCluster): SourceReliability {
  const sources = cluster.articles.map((a) => a.source.toLowerCase());
  if (sources.some((s) => s.includes("official") || s.includes("blog"))) return "OFFICIAL";
  if (sources.some((s) => TIER_1_SOURCES.has(s))) return "TIER_1";
  if (sources.length >= 2) return "TIER_2";
  return "UNVERIFIED";
}

// ── Impact Assessment ─────────────────────────────────────────────────

function assessImpact(cluster: ArticleCluster): NormalizedNewsEvent["impactLevel"] {
  const category = cluster.category;
  const sentiment = cluster.sentiment;

  // Exploit/Security events are always high impact
  if (category === "EXPLOIT_SECURITY") return "CRITICAL";

  // Regulatory actions are typically high impact
  if (category === "REGULATORY") return "HIGH";

  // Institutional moves (ETF approvals, etc) are high impact
  if (category === "INSTITUTIONAL" && cluster.articles.length >= 3) return "HIGH";

  // Multi-source coverage implies significance
  if (cluster.articles.length >= 5) return "HIGH";
  if (cluster.articles.length >= 3) return "MODERATE";

  if (category === "DEVELOPMENT" || category === "PARTNERSHIP") return "MODERATE";
  if (category === "TOKENOMICS") return "MODERATE";

  return "LOW";
}

function mapSentiment(sentiment?: string): NewsSentiment {
  if (sentiment === "positive") return "BULLISH";
  if (sentiment === "negative") return "BEARISH";
  return "NEUTRAL";
}

// ── Main Pipeline ─────────────────────────────────────────────────────

/**
 * Run the full news intelligence pipeline.
 * 1. Fetch from all news providers
 * 2. Deduplicate
 * 3. Cluster into events
 * 4. Verify and categorize
 * 5. Assess impact
 * 6. Return normalized events
 */
export async function runNewsPipeline(): Promise<NormalizedNewsEvent[]> {
  // Check cache first
  const cached = cacheGet<NormalizedNewsEvent[]>(CACHE_KEY);
  if (cached) return cached;

  const providers = getNewsProviders();
  if (providers.length === 0) return [];

  // 1. Fetch from all providers in parallel
  const allArticles: ProviderNewsArticle[] = [];
  const results = await Promise.allSettled(
    providers.map((p) => p.getLatestNews({ limit: 25 }))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  }

  if (allArticles.length === 0) return [];

  // 2. Deduplicate by ID
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  // 3. Sort by publish date
  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // 4. Cluster into events
  const clusters = clusterArticles(unique);

  // 5. Convert to normalized events
  const events: NormalizedNewsEvent[] = clusters.map((cluster, idx): NormalizedNewsEvent => ({
    eventId: `evt-${Date.now()}-${idx}`,
    title: cluster.primaryTitle,
    summary: cluster.articles[0].body || cluster.primaryTitle,
    primarySource: {
      name: cluster.articles[0].source,
      url: cluster.articles[0].url,
      publishedAt: cluster.articles[0].publishedAt,
    },
    secondarySources: cluster.articles.slice(1).map((a) => ({
      name: a.source,
      url: a.url,
      publishedAt: a.publishedAt,
    })),
    affectedAssets: cluster.coins,
    category: cluster.category,
    verificationStatus: determineVerificationStatus(cluster),
    sourceReliability: determineSourceReliability(cluster),
    publishedAt: cluster.publishedAt,
    updatedAt: new Date().toISOString(),
    sentiment: cluster.sentiment,
    impactLevel: assessImpact(cluster),
    clusteredArticleCount: cluster.articles.length,
  }));

  // Cache for 3 minutes
  cacheSet(CACHE_KEY, events, "NEWS");

  return events;
}

/**
 * Get news events for a specific coin.
 */
export async function getNewsForAsset(assetId: string, symbol: string): Promise<NormalizedNewsEvent[]> {
  const providers = getNewsProviders();
  if (providers.length === 0) return [];

  // Fetch coin-specific news
  const allArticles: ProviderNewsArticle[] = [];
  const results = await Promise.allSettled(
    providers.map((p) => p.getNewsForCoin(symbol, { limit: 15 }))
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  }

  if (allArticles.length === 0) return [];

  // Deduplicate and cluster
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const clusters = clusterArticles(unique);

  return clusters.map((cluster, idx): NormalizedNewsEvent => ({
    eventId: `evt-${assetId}-${Date.now()}-${idx}`,
    title: cluster.primaryTitle,
    summary: cluster.articles[0].body || cluster.primaryTitle,
    primarySource: {
      name: cluster.articles[0].source,
      url: cluster.articles[0].url,
      publishedAt: cluster.articles[0].publishedAt,
    },
    secondarySources: cluster.articles.slice(1).map((a) => ({
      name: a.source,
      url: a.url,
      publishedAt: a.publishedAt,
    })),
    affectedAssets: [assetId, ...cluster.coins.filter((c) => c !== assetId)],
    category: cluster.category,
    verificationStatus: determineVerificationStatus(cluster),
    sourceReliability: determineSourceReliability(cluster),
    publishedAt: cluster.publishedAt,
    updatedAt: new Date().toISOString(),
    sentiment: cluster.sentiment,
    impactLevel: assessImpact(cluster),
    clusteredArticleCount: cluster.articles.length,
  }));
}
