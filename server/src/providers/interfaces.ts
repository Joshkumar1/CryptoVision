/**
 * CryptoVision Provider Interfaces
 * Provider-agnostic contracts. Analytical engines must NEVER depend on
 * provider-specific response formats — only these normalized interfaces.
 */

// ── Data Source Metadata ──────────────────────────────────────────────────

export interface DataSourceMeta {
  provider: string;
  fetchedAt: string;          // ISO timestamp
  cachedUntil?: string;       // ISO timestamp
  fallbackUsed: boolean;
  quality: DataQualityStatus;
  latencyMs?: number;
}

export type DataQualityStatus = "VALID" | "STALE" | "MISSING" | "CONFLICT" | "INVALID" | "DEMO";

// ── Market Data Provider ──────────────────────────────────────────────────

export interface MarketDataProvider {
  readonly name: string;

  /** Global market metrics */
  getGlobalMarketData(): Promise<GlobalMarketData | null>;

  /** Paginated ranked coin listings */
  getCoinsMarket(options: CoinsMarketOptions): Promise<ProviderCoinMarket[]>;

  /** Detailed coin data */
  getCoinDetail(coinId: string): Promise<ProviderCoinDetail | null>;

  /** Historical price chart */
  getCoinChart(coinId: string, days: number, currency?: string): Promise<ProviderChartPoint[]>;

  /** Trending coins */
  getTrending(): Promise<ProviderTrendingCoin[]>;

  /** Search coins */
  search(query: string): Promise<ProviderSearchResult>;

  /** Simple price lookup for one or more coins */
  getSimplePrices(coinIds: string[], currency?: string): Promise<Record<string, number>>;
}

export interface GlobalMarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  marketCapChangePercentage24h: number;
}

export interface CoinsMarketOptions {
  page?: number;
  perPage?: number;
  currency?: string;
  sparkline?: boolean;
  category?: string;
}

export interface ProviderCoinMarket {
  id: string;               // provider-specific ID
  symbol: string;
  name: string;
  image?: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  fdv: number | null;
  volume24h: number;
  high24h: number | null;
  low24h: number | null;
  priceChange24h: number;
  priceChangePercent24h: number;
  priceChangePercent1h: number | null;
  priceChangePercent7d: number | null;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number | null;
  athChangePercent: number | null;
  sparkline7d: number[] | null;
}

export interface ProviderCoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: string;
  image: string;
  marketCapRank: number | null;
  links: {
    homepage: string[];
    blockchain: string[];
    repos: string[];
  };
  marketData: {
    currentPrice: number;
    marketCap: number;
    fdv: number | null;
    volume24h: number;
    high24h: number | null;
    low24h: number | null;
    priceChangePercent24h: number;
    priceChangePercent7d: number | null;
    priceChangePercent30d: number | null;
    priceChangePercent1y: number | null;
    ath: number | null;
    athChangePercent: number | null;
    atl: number | null;
    circulatingSupply: number;
    totalSupply: number | null;
    maxSupply: number | null;
  };
  developerData?: {
    forks: number;
    stars: number;
    subscribers: number;
    totalIssues: number;
    closedIssues: number;
    prsMerged: number;
    commitCount4Weeks: number;
  };
  categories?: string[];
}

export interface ProviderChartPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface ProviderTrendingCoin {
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number | null;
  thumb: string;
}

export interface ProviderSearchResult {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    marketCapRank: number | null;
    thumb: string;
  }>;
}

// ── On-Chain Data Provider ────────────────────────────────────────────────

export interface OnChainDataProvider {
  readonly name: string;

  /** Get native token balance */
  getBalance(address: string, chain?: string): Promise<string | null>;

  /** Get ERC20 token balances for a wallet */
  getTokenBalances(address: string, chain?: string): Promise<TokenBalance[]>;

  /** Get recent transactions */
  getTransactions(address: string, chain?: string, limit?: number): Promise<OnChainTransaction[]>;

  /** Get token holder count */
  getTokenHolderCount(contractAddress: string, chain?: string): Promise<number | null>;

  /** Get contract metadata */
  getContractMetadata(contractAddress: string, chain?: string): Promise<ContractMetadata | null>;
}

export interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}

export interface OnChainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

// ── News Provider ─────────────────────────────────────────────────────────

export interface NewsProvider {
  readonly name: string;

  /** Fetch latest news articles */
  getLatestNews(options?: NewsQueryOptions): Promise<ProviderNewsArticle[]>;

  /** Fetch news for a specific coin/project */
  getNewsForCoin(coinSymbol: string, options?: NewsQueryOptions): Promise<ProviderNewsArticle[]>;
}

export interface NewsQueryOptions {
  limit?: number;
  page?: number;
  category?: string;
  regions?: string[];
}

export interface ProviderNewsArticle {
  id: string;
  title: string;
  body?: string;
  url: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  categories?: string[];
  coins?: string[];          // symbols or slugs mentioned
  sentiment?: "positive" | "negative" | "neutral";
}

// ── Developer Data Provider ───────────────────────────────────────────────

export interface DeveloperDataProvider {
  readonly name: string;

  /** Get repository overview */
  getRepoInfo(owner: string, repo: string): Promise<RepoInfo | null>;

  /** Get commit activity (last N weeks) */
  getCommitActivity(owner: string, repo: string): Promise<WeeklyCommitActivity[]>;

  /** Get contributors */
  getContributors(owner: string, repo: string): Promise<ContributorInfo[]>;

  /** Get releases */
  getReleases(owner: string, repo: string, limit?: number): Promise<ReleaseInfo[]>;
}

export interface RepoInfo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  license: string | null;
  archived: boolean;
}

export interface WeeklyCommitActivity {
  weekStart: number;      // unix timestamp
  totalCommits: number;
  additions: number;
  deletions: number;
}

export interface ContributorInfo {
  login: string;
  contributions: number;
  avatarUrl: string;
}

export interface ReleaseInfo {
  name: string;
  tagName: string;
  publishedAt: string;
  body: string;
  prerelease: boolean;
}

// ── Security Data Provider ────────────────────────────────────────────────

export interface SecurityDataProvider {
  readonly name: string;

  /** Get token security analysis */
  getTokenSecurity(contractAddress: string, chainId?: string): Promise<TokenSecurityResult | null>;
}

export interface TokenSecurityResult {
  contractAddress: string;
  chain: string;

  // Ownership & Control
  isOpenSource: boolean | null;
  isProxy: boolean | null;
  ownerAddress: string | null;
  canTakeBackOwnership: boolean | null;
  ownerCanChangeBalance: boolean | null;

  // Minting & Supply
  isMintable: boolean | null;
  hasHoneypotRisk: boolean | null;

  // Transfer Restrictions
  cannotBuy: boolean | null;
  cannotSellAll: boolean | null;
  hasTransferPausable: boolean | null;
  hasBlacklist: boolean | null;
  hasWhitelist: boolean | null;
  hasTradingCooldown: boolean | null;
  hasAntiWhale: boolean | null;

  // Tax
  buyTax: number | null;
  sellTax: number | null;

  // Holder info
  holderCount: number | null;
  lpHolderCount: number | null;

  // Risk summary
  riskItems: SecurityRiskItem[];
}

export interface SecurityRiskItem {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  description: string;
}

// ── DeFi Fundamentals Provider ────────────────────────────────────────────

export interface DeFiFundamentalsProvider {
  readonly name: string;

  /** Get protocol TVL */
  getProtocolTVL(slug: string): Promise<ProtocolTVLData | null>;

  /** Get protocol fees & revenue */
  getProtocolFees(slug: string): Promise<ProtocolFeesData | null>;

  /** Get token unlock schedule */
  getTokenUnlocks(slug: string): Promise<TokenUnlockData | null>;

  /** Get protocol treasury */
  getProtocolTreasury(slug: string): Promise<ProtocolTreasuryData | null>;

  /** Get top protocols by TVL */
  getTopProtocols(limit?: number): Promise<ProtocolSummary[]>;

  /** Get protocol yields */
  getProtocolYields(slug: string): Promise<ProtocolYieldData[]>;

  /** Get known hacks */
  getHacks(): Promise<HackEvent[]>;

  /** Get fundraising rounds */
  getFundraises(slug?: string): Promise<FundraiseEvent[]>;
}

export interface ProtocolTVLData {
  slug: string;
  name: string;
  currentTvl: number;
  change1d: number | null;
  change7d: number | null;
  change30d: number | null;
  tvlHistory: Array<{ date: number; tvl: number }>;
  chains: string[];
}

export interface ProtocolFeesData {
  slug: string;
  dailyFees: number | null;
  dailyRevenue: number | null;
  totalFees24h: number | null;
  totalRevenue24h: number | null;
  fees30d: number | null;
  revenue30d: number | null;
}

export interface TokenUnlockData {
  slug: string;
  upcomingUnlocks: Array<{
    date: string;
    amount: number;
    amountUsd: number | null;
    category: string;        // "team", "investor", "ecosystem" etc
    percentOfSupply: number;
  }>;
}

export interface ProtocolTreasuryData {
  slug: string;
  totalUsd: number;
  ownTokenPct: number;
  stablecoinPct: number;
  otherPct: number;
  breakdown: Array<{
    token: string;
    amount: number;
    valueUsd: number;
  }>;
}

export interface ProtocolSummary {
  slug: string;
  name: string;
  tvl: number;
  change1d: number | null;
  change7d: number | null;
  category: string | null;
  chains: string[];
}

export interface ProtocolYieldData {
  pool: string;
  chain: string;
  apy: number;
  tvl: number;
  project: string;
}

export interface HackEvent {
  name: string;
  date: string;
  amount: number;
  chain: string;
  technique: string;
  link: string;
}

export interface FundraiseEvent {
  name: string;
  date: string;
  amount: number;
  round: string;
  leadInvestors: string[];
  category: string;
}

// ── Sentiment Provider ────────────────────────────────────────────────────

export interface SentimentProvider {
  readonly name: string;

  /** Get current Fear & Greed index */
  getFearAndGreed(): Promise<FearGreedData | null>;

  /** Get historical Fear & Greed */
  getFearAndGreedHistory(days?: number): Promise<FearGreedHistoryPoint[]>;
}

export interface FearGreedData {
  value: number;         // 0-100
  classification: string; // "Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"
  timestamp: string;
}

export interface FearGreedHistoryPoint {
  value: number;
  classification: string;
  timestamp: string;
}
