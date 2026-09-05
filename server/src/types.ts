export type ResearchPriorityState = "VERY_HIGH" | "HIGH" | "MODERATE" | "LOW" | "WATCH";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
export type EvidenceQuality = "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";

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

