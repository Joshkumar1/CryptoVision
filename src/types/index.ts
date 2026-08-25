// ── Coin from CoinGecko /coins/markets ──
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  sparkline_in_7d?: { price: number[] };
}

// ── Market overview from /global ──
export interface MarketOverview {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  marketCapChangePercentage24h: number;
}

// ── Market regime ──
export interface MarketRegime {
  state: "BULLISH" | "NEUTRAL" | "BEARISH" | "HIGH_VOLATILITY";
  description: string;
  confidence: number;
}

// ── Chart data ──
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

// ── Coin detail (full /coins/{id}) ──
export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string; small: string; large: string };
  market_cap_rank: number;
  description: { en: string };
  links: { homepage: string[]; blockchain_site: string[] };
  categories?: string[];
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    fully_diluted_valuation: Record<string, number>;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    atl: Record<string, number>;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  developer_data?: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    commit_count_4_weeks: number;
  };
}

// ── Trending coin from /search/trending ──
export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data?: {
      price: number;
      price_change_percentage_24h: Record<string, number>;
      market_cap: string;
      sparkline: string;
    };
  };
}

// ── API response wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// ── Navigation ──
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

// ════════════════════════════════════════════════════════
// ── NEW: Evidence Status System ──
// ════════════════════════════════════════════════════════

export type EvidenceStatus =
  | "EVIDENCE_SUPPORTED"
  | "MIXED_EVIDENCE"
  | "SPECULATIVE"
  | "EVIDENCE_CONFLICT"
  | "INSUFFICIENT_DATA";

export const EVIDENCE_STATUS_META: Record<
  EvidenceStatus,
  { label: string; color: string; description: string; emoji: string }
> = {
  EVIDENCE_SUPPORTED: {
    label: "Evidence Supported",
    color: "#34d399",
    description: "Available evidence generally supports important claims.",
    emoji: "🟢",
  },
  MIXED_EVIDENCE: {
    label: "Mixed Evidence",
    color: "#f59e0b",
    description: "Some claims are supported while others show weakness.",
    emoji: "🟡",
  },
  SPECULATIVE: {
    label: "Speculative",
    color: "#fb923c",
    description: "Claims are significant but evidence is limited.",
    emoji: "🟠",
  },
  EVIDENCE_CONFLICT: {
    label: "Evidence Conflict",
    color: "#ef4444",
    description: "Available data materially contradicts one or more important claims.",
    emoji: "🔴",
  },
  INSUFFICIENT_DATA: {
    label: "Insufficient Data",
    color: "#506090",
    description: "Not enough reliable information to form a meaningful assessment.",
    emoji: "⚪",
  },
};

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
export type EvidenceQuality = "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";

// ── Project Claim ──
export interface ProjectClaim {
  id: string;
  text: string;
  category: "GROWTH" | "TECHNOLOGY" | "ADOPTION" | "TOKENOMICS" | "ECOSYSTEM" | "TEAM" | "FINANCIAL";
  source: "PROJECT_DESCRIPTION" | "WHITEPAPER" | "SOCIAL" | "INFERRED";
  confidence: number;
}

// ── Evidence item ──
export interface Evidence {
  id: string;
  claimId?: string;
  metric: string;
  value: string | number;
  period?: string;
  source: string;
  timestamp: string;
  direction: "SUPPORTS" | "CONTRADICTS" | "NEUTRAL";
  quality: EvidenceQuality;
  explanation: string;
}

// ── Intelligence Score ──
export interface IntelligenceScoreDimension {
  label: string;
  score: number;
  trend: "UP" | "DOWN" | "STABLE" | "UNKNOWN";
  description: string;
  evidenceQuality: EvidenceQuality;
}

export interface IntelligenceScore {
  coinId: string;
  overall: number;
  opportunity: number;
  risk: number;
  modelConfidence: number;
  evidenceQuality: EvidenceQuality;
  dimensions: {
    technology: IntelligenceScoreDimension;
    adoption: IntelligenceScoreDimension;
    developerActivity: IntelligenceScoreDimension;
    ecosystem: IntelligenceScoreDimension;
    tokenomics: IntelligenceScoreDimension;
    liquidity: IntelligenceScoreDimension;
    transparency: IntelligenceScoreDimension;
  };
  computedAt: string;
}

// ── Red Flag ──
export type RedFlagSeverity = "HIGH" | "MEDIUM" | "LOW";
export type RedFlagType =
  | "SUPPLY_CONCENTRATION"
  | "HIGH_FDV_RATIO"
  | "DEVELOPER_INACTIVITY"
  | "EXTREME_VOLATILITY"
  | "LOW_LIQUIDITY"
  | "ATH_DISTANCE"
  | "EXTREME_RSI"
  | "HIGH_INFLATION"
  | "TOKEN_UNLOCK_PRESSURE"
  | "CENTRALIZATION"
  | "DECLINING_METRICS";

export interface RedFlag {
  id: string;
  type: RedFlagType;
  severity: RedFlagSeverity;
  title: string;
  description: string;
  evidence: string;
  metric?: string;
  value?: string | number;
  recommendation?: string;
}

// ── Reality Check ──
export interface RealityCheckClaim {
  claim: ProjectClaim;
  evidence: Evidence[];
  assessment: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE";
  explanation: string;
}

export interface RealityCheck {
  coinId: string;
  evidenceStatus: EvidenceStatus;
  overallAssessment: string;
  claims: RealityCheckClaim[];
  contradictions: Evidence[];
  bullCase: string[];
  bearCase: string[];
  unknowns: string[];
  whatWouldChangePositive: string[];
  whatWouldChangeNegative: string[];
  dataQuality: EvidenceQuality;
  computedAt: string;
}

// ── Emerging Project ──
export type EmergingSignalType =
  | "DEVELOPER_ACTIVITY_INCREASING"
  | "VOLUME_UPTICK"
  | "PRICE_MOMENTUM"
  | "MARKET_CAP_OPPORTUNITY"
  | "LIQUIDITY_IMPROVING"
  | "NARRATIVE_STRENGTH"
  | "FUNDAMENTAL_STRENGTH"
  | "RELATIVE_STRENGTH";

export interface EmergingProject {
  coinId: string;
  coin?: Coin;
  score: number;
  opportunityScore: number;
  riskLevel: RiskLevel;
  evidenceQuality: EvidenceQuality;
  signals: Array<{
    type: EmergingSignalType;
    label: string;
    detail: string;
    strength: number;
  }>;
  whyOnRadar: string;
  isBeforeTheHype: boolean;
  computedAt: string;
}

// ── Narrative ──
export interface NarrativeData {
  id: string;
  name: string;
  description: string;
  momentum: number;
  strength: number;
  volume: number;
  assetCount: number;
  topAssets: string[];
  topCoins?: Coin[];
  weekChange: number;
  monthChange: number;
}

// ── Watchlist ──
export interface WatchlistItem {
  coinId: string;
  addedAt: string;
  lastScore?: number;
  lastEvidenceStatus?: EvidenceStatus;
  lastRisk?: RiskLevel;
}

// ── Currency & Language ──
export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  name: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "usd", symbol: "$",   locale: "en-US", name: "US Dollar" },
  { code: "inr", symbol: "₹",   locale: "en-IN", name: "Indian Rupee" },
  { code: "eur", symbol: "€",   locale: "de-DE", name: "Euro" },
  { code: "gbp", symbol: "£",   locale: "en-GB", name: "British Pound" },
  { code: "aed", symbol: "د.إ", locale: "ar-AE", name: "UAE Dirham" },
  { code: "jpy", symbol: "¥",   locale: "ja-JP", name: "Japanese Yen" },
  { code: "sgd", symbol: "S$",  locale: "en-SG", name: "Singapore Dollar" },
];

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English",   nativeName: "English" },
  { code: "hi", name: "Hindi",     nativeName: "हिन्दी" },
  { code: "te", name: "Telugu",    nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada",   nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "bn", name: "Bengali",   nativeName: "বাংলা" },
  { code: "mr", name: "Marathi",   nativeName: "मराठी" },
];

// ── Legacy types (kept for compatibility) ──
export interface OpportunityScore {
  coinId: string;
  coin?: Coin;
  score: number;
  breakdown: {
    momentum: number;
    fundamentals: number;
    liquidity: number;
    sentiment: number;
    tokenomics: number;
    riskAdjustment: number;
  };
  risk: { level: string; score: number };
  confidence: number;
  evidenceQuality: "Weak" | "Moderate" | "Strong";
}

export interface Narrative {
  id: string;
  name: string;
  momentum: number;
  volume: number;
  assets: string[];
  strength: number;
}

// ── Portfolio Holdings ──
export interface PortfolioHolding {
  id: string;
  coinId: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
  notes?: string;
}

// ── Custom Price & Risk Alerts ──
export type AlertTriggerType =
  | "PRICE_ABOVE"
  | "PRICE_BELOW"
  | "RSI_OVERSOLD"
  | "RSI_OVERBOUGHT"
  | "RED_FLAG_DETECTED";

export interface CustomAlert {
  id: string;
  coinId: string;
  coinName: string;
  type: AlertTriggerType;
  targetValue?: number;
  createdAt: string;
  triggered: boolean;
  message: string;
}

// ── Research Experience Personas ──
export type ResearchPersona = "EXPLORE" | "RESEARCH" | "ANALYST";

export interface PersonaConfig {
  id: ResearchPersona;
  label: string;
  description: string;
  targetAudience: string;
}

export const RESEARCH_PERSONAS: PersonaConfig[] = [
  {
    id: "EXPLORE",
    label: "Explore",
    description: "Plain-English summaries, visual analogies, and guided due diligence.",
    targetAudience: "Beginners & Casual Investors",
  },
  {
    id: "RESEARCH",
    label: "Research",
    description: "Structured evidence, audited claims, tokenomics, and risk factors.",
    targetAudience: "Serious Researchers & Allocators",
  },
  {
    id: "ANALYST",
    label: "Analyst",
    description: "Raw telemetry, feature importance, provenance, and sensitivity models.",
    targetAudience: "Institutional Analysts & Quants",
  },
];

// ── Universal Evidence Audit Trail ──
export interface EvidenceAuditTrail {
  title: string;
  claim: string;
  verdict: "SUPPORTED" | "CONTRADICTED" | "MIXED" | "UNVERIFIED";
  telemetryPoints: Array<{ label: string; value: string | number; trend?: "UP" | "DOWN" | "STABLE" }>;
  sourceProvider: string;
  sourceUrl?: string;
  timestamp: string;
  methodology: string;
  confidenceScore: number;
  evidenceQuality: EvidenceQuality;
}

