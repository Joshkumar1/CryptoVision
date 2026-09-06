// ── Asset Intelligence Unified Schema ──
// Strictly follows single source of truth data architecture

export type AssetClass = "CRYPTOCURRENCY" | "EQUITY" | "ETF" | "COMMODITY" | "FOREX";

export interface AssetSocialLinks {
  website: string;
  whitepaper: string;
  twitter?: string;
  github?: string;
  telegram?: string;
  discord?: string;
  reddit?: string;
}

export interface AssetIdentity {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  category: string;
  assetClass: AssetClass;
  launchDate: string;
  blockchain: string;
  socialLinks: AssetSocialLinks;
}

export interface AssetMarketData {
  priceUsd: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  priceChange90d: number;
  priceChange1y: number;
  priceChangeAllTime: number;
  marketCapUsd: number;
  volume24hUsd: number;
  btcDominance: number;
  ethDominance: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  athUsd: number;
  athDate: string;
  atlUsd: number;
  atlDate: string;
  sparkline7d: number[];
}

export interface ChartPoint {
  timestamp: number;
  price: number;
  marketCap?: number;
  volume?: number;
}

export interface DrawdownPeriod {
  period: string;
  peakPrice: number;
  troughPrice: number;
  dropPercentage: number;
  durationDays: number;
  recoveryDays: number | null;
}

export interface AssetHistoricalData {
  priceHistory: ChartPoint[];
  marketCapHistory: ChartPoint[];
  volumeHistory: ChartPoint[];
  drawdownPeriods: DrawdownPeriod[];
  milestones: Array<{ date: string; title: string; description: string }>;
}

export interface AssetFundamentals {
  purpose: string;
  problemSolved: string;
  useCases: string[];
  realWorldApps: string[];
  targetUsers: string[];
  competitiveAdvantages: string[];
  limitations: string[];
  founders: string[];
  coreOrganization: string;
  developmentTeam: string;
  majorInvestors: string[];
  strategicPartnerships: string[];
  developerActivity: {
    commits4Weeks: number;
    githubStars: number;
    forks: number;
    mergedPRs: number;
    activeContributors: number;
    commentary: string; // Contextual explanation (e.g., "Development activity remains consistent...")
  };
}

export interface TrustSignal {
  id: string;
  title: string;
  type: "POSITIVE" | "RISK";
  whyItMatters: string;
}

export interface TokenDistributionItem {
  label: string;
  percentage: number;
}

export interface TokenUnlockItem {
  date: string;
  event: string;
  percentOfSupply: number;
}

export interface AssetTokenomics {
  maxSupply: number | null;
  circulatingSupply: number;
  totalSupply: number | null;
  inflationRatePercentage: number;
  distribution: TokenDistributionItem[];
  unlockSchedule: TokenUnlockItem[];
  stakingMechanism: string;
  burningMechanism: string;
  whaleConcentrationPercentage: number;
  summaryInsight: string;
}

export interface AssetAdoptionMetrics {
  activeDailyUsers: number;
  dailyTransactions: number;
  dappCount: number;
  institutionalHolders: string[];
  networkGrowthRate: number;
}

export type RiskLevel = "LOW" | "MODERATE" | "HIGH";

export interface RiskCategoryDetail {
  category: "Market" | "Technology" | "Liquidity" | "Regulatory" | "Centralization" | "Tokenomics";
  level: RiskLevel;
  explanation: string;
}

export interface AssetCategorizedRisk {
  marketRisk: RiskCategoryDetail;
  technologyRisk: RiskCategoryDetail;
  liquidityRisk: RiskCategoryDetail;
  regulatoryRisk: RiskCategoryDetail;
  centralizationRisk: RiskCategoryDetail;
  tokenomicsRisk: RiskCategoryDetail;
}

export interface AiObservation {
  id: string;
  timestamp: string;
  topic: string;
  observation: string;
  confidenceScore: number; // 0 to 1
  impact: "BULLISH" | "BEARISH" | "NEUTRAL";
}

export interface AssetIntelligenceLayer {
  aiExecutiveSummary: {
    whatIsIt: string;
    whyItExists: string;
    problemSolved: string;
    whyItHasValue: string;
    biggestRisks: string;
    fullSummary: string;
  };
  observations: AiObservation[];
}

export interface AssetIntelligence {
  identity: AssetIdentity;
  market: AssetMarketData;
  historical: AssetHistoricalData;
  fundamentals: AssetFundamentals;
  trustSignals: TrustSignal[];
  tokenomics: AssetTokenomics;
  adoption: AssetAdoptionMetrics;
  risk: AssetCategorizedRisk;
  intelligence: AssetIntelligenceLayer;
}
