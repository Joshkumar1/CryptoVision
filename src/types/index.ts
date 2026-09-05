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

// ── User Authentication & Profile ──
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  tier: "INSTITUTIONAL" | "PRO" | "STARTER";
  persona: ResearchPersona;
  walletAddress?: string;
}

// ── Visual Crypto Trend News Showcase ──
export interface CryptoTrendNews {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  badgeColor: string;
  image: string;
  impactScore: number;
  publishedAt: string;
  coins: Array<{ symbol: string; name: string; price: number; change24h: number }>;
  keyTakeaways: string[];
  institutionalSignal: string;
}

// ════════════════════════════════════════════════════════════════════════════
// ── PROFESSIONAL CRYPTO FINANCE INTELLIGENCE EXPANSION TYPES ──
// ════════════════════════════════════════════════════════════════════════════

export type ResearchPriorityState = "VERY_HIGH" | "HIGH" | "MODERATE" | "LOW" | "WATCH";

export interface ResearchPriority {
  priority: ResearchPriorityState;
  primaryReason: string;
  secondaryReason: string;
  mainRisk: string;
  biggestUnknown: string;
  nextResearchAction: string;
}

export interface WhyItMattersNow {
  primaryDriver: string;
  secondaryDriver: string;
  riskDriver: string;
  relationshipNarrative: string;
}

export interface MetricVelocity {
  label: string;
  current: string;
  previous: string;
  baseline90d: string;
  status: "ACCELERATING" | "STEADY" | "DECELERATING";
}

export interface InformationChange {
  velocity: "ACCELERATING" | "STEADY" | "DECELERATING" | "ANOMALOUS";
  metrics: MetricVelocity[];
  conclusion: string;
}

export type FundamentalDivergenceState =
  | "ALIGNED_GROWTH"
  | "DIVERGENCE_REQUIRES_INVESTIGATION"
  | "SPECULATIVE_DISLOCATION"
  | "FUNDAMENTAL_ACCUMULATION"
  | "CONTRARIAN_ASYMMETRY"
  | "STRUCTURAL_CONTRACTION";

export interface FundamentalMarketDivergence {
  priceTrend: "UP" | "FLAT" | "DOWN";
  fundamentalTrend: "UP" | "FLAT" | "DOWN";
  state: FundamentalDivergenceState;
  headline: string;
  interpretation: string;
}

export interface AdoptionQuality {
  status: "STRONG" | "MODERATE" | "WEAK" | "UNCLEAR" | "INSUFFICIENT_DATA";
  activeUsers: string;
  retentionRate: string;
  txFrequency: string;
  economicTxValue: string;
  feeGeneration: string;
  incentiveDependence: string;
  assessment: string;
}

export interface IncentiveDependency {
  classification: "ORGANIC_DOMINANT" | "INCENTIVE_SENSITIVE_GROWTH" | "HIGH_EMISSION_SUBSIDY" | "INSUFFICIENT_DATA";
  organicActivityPct: number;
  incentivizedActivityPct: number;
  rewardEmissionRate: string;
  detail: string;
}

export interface UnitEconomics {
  applicable: boolean;
  protocolCategory: string;
  revenueGrowth: string;
  feeGrowth: string;
  revenuePerActiveUser: string;
  feesPerActiveUser: string;
  revenueToTvlRatio: string;
  feesToTvlRatio: string;
  incentiveToRevenueRatio: string;
  sustainabilityAssessment: string;
}

export interface TokenValueCapture {
  status: "STRONG" | "MODERATE" | "WEAK" | "UNCLEAR" | "INSUFFICIENT_DATA";
  mechanisms: Array<{ type: string; description: string; active: boolean }>;
  structuralAnalysis: string;
}

export interface TokenNecessity {
  classification: "ESSENTIAL" | "IMPORTANT" | "SUPPLEMENTARY" | "WEAKLY_CONNECTED" | "UNCLEAR";
  demandDrivers: string[];
  supplyDrivers: string[];
  valueLeakage: string[];
  explanation: string;
}

export interface SupplyDynamics {
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  currentFloatPct: number;
  futureFloatPct: number;
  annualizedDilutionPct: number;
  unlockScheduleSummary: string;
  upcomingUnlockAmount: string;
  upcomingUnlockDate: string;
  potentialSupplyPressure: string;
}

export interface UnlockAbsorptionRisk {
  riskTier: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
  unlockVsDailyVolume: string;
  unlockVsLiquidFloat: string;
  depthAssessment: string;
}

export interface OwnershipStructure {
  breakdown: Array<{
    category: string;
    percentage: number;
    attribution: "VERIFIED" | "PROBABLE" | "UNATTRIBUTED" | "UNKNOWN";
  }>;
  concentrationRisk: "LOW" | "MODERATE" | "HIGH";
  details: string;
}

export interface LargeHolderActivity {
  trend: "ACCUMULATION" | "NEUTRAL" | "DISTRIBUTION";
  dormantWalletActivation: boolean;
  exchangeTransfers7d: string;
  treasuryTransfers7d: string;
  narrative: string;
}

export interface TreasuryResilience {
  status: "STRONG" | "MODERATE" | "WEAK" | "UNKNOWN";
  treasuryValueUsd: string;
  liquidStablecoinPct: string;
  nativeTokenExposurePct: string;
  estimatedRunway: string;
  tokenPriceDependence: string;
  survivalAssessment: string;
}

export interface ValuationMetricComparison {
  metric: string;
  projectValue: string;
  peerMedian: string;
  quartile: "TOP_QUARTILE" | "ABOVE_MEDIAN" | "MEDIAN" | "BELOW_MEDIAN" | "BOTTOM_QUARTILE";
  relevance: string;
  limitations: string;
}

export interface ValuationContext {
  peerGroup: string;
  multiples: ValuationMetricComparison[];
  growthVsValuationCheck: string;
}

export interface CompetitiveMoat {
  moatStrength: "STRONG" | "MODERATE" | "WEAK" | "UNCLEAR";
  networkEffects: string;
  liquidityDepth: string;
  developerEcosystem: string;
  switchingCosts: string;
  composability: string;
  reproducibilityDefense: string;
  marketShareTrend: string;
}

export interface DependencyItem {
  component: string;
  entity: string;
  risk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  impact: string;
}

export interface DependencyAnalysis {
  overallRisk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  dependencies: DependencyItem[];
  criticalFailureVectors: string[];
}

export interface DecentralizationReality {
  status: "SUPPORTED" | "MIXED" | "CONTRADICTED" | "UNKNOWN";
  validatorConcentration: string;
  multisigControl: string;
  adminKeyPrivileges: string;
  emergencyPowers: string;
  observedVsClaim: string;
}

export interface SecurityProfile {
  audited: boolean;
  auditors: string[];
  findingsResolved: string;
  exploitHistory: string;
  bugBounty: string;
  summary: string;
}

export interface CatalystConfirmationItem {
  event: string;
  date: string;
  expectedImpact: string;
  observedData: string;
  confirmation: "CONFIRMED" | "PARTIALLY_CONFIRMED" | "NOT_YET_CONFIRMED" | "CONTRADICTED";
}

export interface SignalAnomaly {
  id: string;
  pair: string;
  divergence: string;
  explanation: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export interface DataConflictItem {
  metric: string;
  sourceA: { name: string; value: string };
  sourceB: { name: string; value: string };
  difference: string;
  recommendedVerification: string;
}

export interface DataCoverageBreakdown {
  market: number;
  tokenomics: number;
  developer: number;
  onChain: number;
  fundamentals: number;
  overall: number;
  confidenceLabel: "HIGH CONFIDENCE" | "MODERATE CONFIDENCE" | "PRELIMINARY ASSESSMENT";
  confidenceDefinition: string;
}

export interface ResearchChecklistItem {
  priority: number;
  question: string;
  decisionImpact: string;
  verificationMethod: string;
}

export interface AnalystBiasWarning {
  bias: string;
  warning: string;
  trigger: string;
}

export type ProjectMaturity = "EMERGING" | "EARLY" | "GROWTH" | "ESTABLISHED" | "MATURE";

export interface MaturityProfile {
  stage: ProjectMaturity;
  description: string;
  weightingFocus: string;
  ageYears: number;
}

export interface ScenarioCase {
  name: "Base Case" | "Bull Case" | "Bear Case" | "Stress Case";
  probability: string;
  assumptions: string[];
  networkActivity: string;
  economicActivity: string;
  tokenomicsImpact: string;
  liquidityOutlook: string;
  valuationMultiple: string;
  primaryRiskVector: string;
}

export interface ScenarioLab {
  baseCase: ScenarioCase;
  bullCase: ScenarioCase;
  bearCase: ScenarioCase;
  stressCase: ScenarioCase;
  methodologyNote: string;
}

export interface ScoreWeightComponent {
  dimension: string;
  weightPct: number;
  score: number;
  contribution: number;
  dataQuality: "STRONG" | "MODERATE" | "PRELIMINARY";
  justification: string;
}

export interface ScoreTransparency {
  overallIntelligence: number;
  components: ScoreWeightComponent[];
  methodology: string;
}

export interface ResearchSnapshot {
  coinId: string;
  researchPriority: ResearchPriorityState;
  projectIntelligence: number;
  opportunity: number;
  risk: RiskLevel;
  evidenceQuality: EvidenceQuality;
  dataCoverage: number;
  maturity: ProjectMaturity;
  primaryDriver: string;
  primaryRisk: string;
  biggestContradiction: string;
  biggestUnknown: string;
  mostImportantCatalyst: string;
  nextVerificationStep: string;
}

export interface UserThesis {
  coinId: string;
  title: string;
  coreHypothesis: string;
  keyAssumptions: string[];
  expectedCatalysts: string[];
  majorRisks: string[];
  openQuestions: string[];
  lastUpdated: string;
}

export interface ThesisHistoryEntry {
  date: string;
  assessment: string;
  changeReason: string;
  riskChange?: string;
}

export interface FinancialIntelligence {
  coinId: string;
  researchPriority: ResearchPriority;
  snapshot: ResearchSnapshot;
  maturityProfile: MaturityProfile;
  scenarioLab: ScenarioLab;
  scoreTransparency: ScoreTransparency;
  whyItMattersNow: WhyItMattersNow;
  informationChange: InformationChange;
  fundamentalDivergence: FundamentalMarketDivergence;
  adoptionQuality: AdoptionQuality;
  incentiveDependency: IncentiveDependency;
  unitEconomics: UnitEconomics;
  tokenValueCapture: TokenValueCapture;
  tokenNecessity: TokenNecessity;
  supplyDynamics: SupplyDynamics;
  unlockAbsorption: UnlockAbsorptionRisk;
  ownershipStructure: OwnershipStructure;
  largeHolderActivity: LargeHolderActivity;
  treasuryResilience: TreasuryResilience;
  valuationContext: ValuationContext;
  competitiveMoat: CompetitiveMoat;
  dependencyAnalysis: DependencyAnalysis;
  decentralizationReality: DecentralizationReality;
  securityProfile: SecurityProfile;
  catalystConfirmations: CatalystConfirmationItem[];
  signalAnomalies: SignalAnomaly[];
  dataConflicts: DataConflictItem[];
  dataCoverage: DataCoverageBreakdown;
  researchGaps: string[];
  researchChecklist: ResearchChecklistItem[];
  biasWarnings: AnalystBiasWarning[];
  thesisHistory: ThesisHistoryEntry[];
  computedAt: string;
}



