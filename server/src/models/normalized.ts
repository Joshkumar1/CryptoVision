/**
 * CryptoVision Normalized Data Models
 * All providers convert into these common schemas.
 * Analytical engines consume ONLY these models.
 */

// ── Normalized Asset ──────────────────────────────────────────────────────

export interface NormalizedAsset {
  /** CryptoVision canonical ID */
  id: string;
  symbol: string;
  name: string;
  chain: string | null;
  price: number;
  marketCap: number;
  fdv: number | null;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  marketCapRank: number | null;
  priceChange1h: number | null;
  priceChange24h: number;
  priceChange7d: number | null;
  priceChange30d: number | null;
  ath: number | null;
  athChangePercent: number | null;
  atl: number | null;
  image: string | null;
  categories: string[];
  /** Which providers contributed to this record */
  sources: DataSource[];
  /** When this record was last updated */
  updatedAt: string;
}

// ── Normalized Metric ─────────────────────────────────────────────────────

export interface NormalizedMetric {
  assetId: string;
  metric: string;
  value: number;
  unit: string;
  timestamp: string;
  source: string;
  quality: MetricQuality;
  coverage: MetricCoverage;
}

export type MetricQuality = "HIGH" | "MODERATE" | "LOW" | "UNVERIFIED";
export type MetricCoverage = "FULL" | "PARTIAL" | "ESTIMATED" | "UNAVAILABLE";

// ── Normalized Evidence ───────────────────────────────────────────────────

export interface NormalizedEvidence {
  claimId: string;
  source: string;
  sourceType: EvidenceSourceType;
  value: string;
  timestamp: string;
  reliability: EvidenceReliability;
  quality: EvidenceQualityLevel;
  status: EvidenceStatus;
}

export type EvidenceSourceType =
  | "MARKET_DATA"
  | "ON_CHAIN"
  | "DEFI_PROTOCOL"
  | "DEVELOPER"
  | "NEWS"
  | "SECURITY_AUDIT"
  | "OFFICIAL_ANNOUNCEMENT"
  | "SOCIAL"
  | "CALCULATED";

export type EvidenceReliability = "HIGH" | "MODERATE" | "LOW" | "UNKNOWN";
export type EvidenceQualityLevel = "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
export type EvidenceStatus = "CONFIRMED" | "REPORTED" | "DEVELOPING" | "RUMOR" | "STALE";

// ── Normalized News Event ─────────────────────────────────────────────────

export interface NormalizedNewsEvent {
  eventId: string;
  title: string;
  summary: string;
  primarySource: NewsSourceRef;
  secondarySources: NewsSourceRef[];
  affectedAssets: string[];         // CryptoVision asset IDs
  category: NewsCategory;
  verificationStatus: NewsVerificationStatus;
  sourceReliability: SourceReliability;
  publishedAt: string;
  updatedAt: string;
  sentiment: NewsSentiment;
  impactLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "INFORMATIONAL";
  clusteredArticleCount: number;
}

export interface NewsSourceRef {
  name: string;
  url: string;
  publishedAt: string;
}

export type NewsCategory =
  | "REGULATORY"
  | "DEVELOPMENT"
  | "TOKENOMICS"
  | "EXPLOIT_SECURITY"
  | "INSTITUTIONAL"
  | "ECOSYSTEM"
  | "PARTNERSHIP"
  | "GOVERNANCE"
  | "MARKET_EVENT"
  | "OTHER";

export type NewsVerificationStatus = "CONFIRMED" | "REPORTED" | "DEVELOPING" | "RUMOR";
export type SourceReliability = "OFFICIAL" | "TIER_1" | "TIER_2" | "UNVERIFIED" | "UNKNOWN";
export type NewsSentiment = "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED";

// ── Normalized Security Report ────────────────────────────────────────────

export interface NormalizedSecurityReport {
  assetId: string;
  contractAddress: string;
  chain: string;
  overallRisk: SecurityRiskLevel;
  signals: SecuritySignal[];
  knownRisks: string[];
  unknowns: string[];
  source: string;
  analyzedAt: string;
}

export type SecurityRiskLevel = "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "UNKNOWN";

export interface SecuritySignal {
  category: string;
  indicator: string;
  value: boolean | number | string | null;
  severity: SecurityRiskLevel;
  description: string;
}

// ── Data Source ────────────────────────────────────────────────────────────

export interface DataSource {
  provider: string;
  fetchedAt: string;
  quality: MetricQuality;
  fallbackUsed: boolean;
}

// ── Data Freshness ────────────────────────────────────────────────────────

export interface DataFreshnessInfo {
  metric: string;
  updatedAt: string;
  source: string;
  status: "LIVE" | "RECENT" | "DELAYED" | "STALE" | "HISTORICAL" | "UNAVAILABLE" | "DEMO";
  ageMs: number;
  displayText: string; // "Updated 2 minutes ago", "Historical data", etc.
}

/**
 * Compute freshness status from age
 */
export function computeFreshnessStatus(ageMs: number, category: FreshnessCategory): DataFreshnessInfo["status"] {
  const thresholds = FRESHNESS_THRESHOLDS[category];
  if (ageMs <= thresholds.live) return "LIVE";
  if (ageMs <= thresholds.recent) return "RECENT";
  if (ageMs <= thresholds.delayed) return "DELAYED";
  return "STALE";
}

export type FreshnessCategory =
  | "REALTIME"       // prices, order book
  | "MARKET"         // market cap, volume
  | "FUNDAMENTAL"    // TVL, fees, revenue
  | "DEVELOPER"      // commits, contributors
  | "TOKENOMICS"     // supply, unlocks
  | "NEWS"           // articles, events
  | "HISTORICAL";    // historical data

const FRESHNESS_THRESHOLDS: Record<FreshnessCategory, { live: number; recent: number; delayed: number }> = {
  REALTIME:     { live: 60_000,       recent: 300_000,      delayed: 600_000 },
  MARKET:       { live: 300_000,      recent: 600_000,      delayed: 1_800_000 },
  FUNDAMENTAL:  { live: 900_000,      recent: 3_600_000,    delayed: 7_200_000 },
  DEVELOPER:    { live: 21_600_000,   recent: 43_200_000,   delayed: 86_400_000 },
  TOKENOMICS:   { live: 21_600_000,   recent: 43_200_000,   delayed: 86_400_000 },
  NEWS:         { live: 300_000,      recent: 900_000,      delayed: 3_600_000 },
  HISTORICAL:   { live: 86_400_000,   recent: 604_800_000,  delayed: 2_592_000_000 },
};

export function formatFreshnessDisplay(ageMs: number): string {
  const seconds = Math.floor(ageMs / 1000);
  if (seconds < 60) return "Updated just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
}
