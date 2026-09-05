import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNewsCatalysts, type NewsCatalyst } from "@/hooks/useNews";
import { useAppStore } from "@/stores/appStore";
import {
  CryptoTrendsNewsreel,
  CRYPTO_TREND_STORIES,
} from "@/components/auth/CryptoTrendsNewsreel";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";
import {
  Newspaper,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Brain,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  Radio,
  Share2,
  Copy,
  Check,
  Rss,
  Globe,
  MessageSquare,
  Zap,
  Sliders,
  Bell,
  Eye,
} from "lucide-react";

// ── Catalyst Categories for Tab 3 ──
const CATALYST_CATEGORIES = [
  { id: "ALL", label: "All Catalysts" },
  { id: "REGULATORY", label: "Regulatory" },
  { id: "DEVELOPMENT", label: "Dev Releases" },
  { id: "TOKENOMICS", label: "Token Unlocks" },
  { id: "EXPLOIT_SECURITY", label: "Security & Exploits" },
  { id: "INSTITUTIONAL", label: "Institutional Flows" },
];

const VERDICT_BADGES = {
  SUPPORTED: {
    label: "On-Chain Supported",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
    dot: "🟢",
  },
  CONTRADICTED: {
    label: "Contradicted / False",
    color: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: XCircle,
    dot: "🔴",
  },
  MIXED: {
    label: "Mixed Evidence",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
    dot: "🟡",
  },
  UNVERIFIED: {
    label: "Unverified Claim",
    color: "bg-surface-2 text-text-tertiary border-border",
    icon: HelpCircle,
    dot: "⚪",
  },
};

// ── Multi-Source Breaking Wire Feeds ──
interface WireItem {
  id: string;
  title: string;
  source: string;
  sourceType: "MEDIA" | "REGULATORY" | "ON_CHAIN" | "DEFI";
  summary: string;
  publishedAt: string;
  timeAgo: string;
  sentiment: "BULLISH" | "NEUTRAL" | "BEARISH";
  impactScore: number;
  tokens: string[];
  url: string;
  badge?: string;
}

const BREAKING_WIRE_FEEDS: WireItem[] = [
  {
    id: "wire-1",
    title: "BlackRock Expands BUIDL Tokenized Treasury Fund Across Multi-Chain Deployments",
    source: "Bloomberg Crypto",
    sourceType: "MEDIA",
    summary:
      "BlackRock's tokenized liquidity fund launches on Aptos, Arbitrum, Avalanche, Optimism, and Polygon to expand on-chain institutional settlement rails.",
    publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeAgo: "15m ago",
    sentiment: "BULLISH",
    impactScore: 94,
    tokens: ["ETH", "ARB", "OP", "AVAX"],
    url: "https://bloomberg.com/crypto",
    badge: "Tier-1 Institutional",
  },
  {
    id: "wire-2",
    title: "US CFTC Affirms Ethereum and Solana Spot Commodity Classification in Updated Guidance",
    source: "CFTC Public Registry",
    sourceType: "REGULATORY",
    summary:
      "Regulators clarify decentralized proof-of-stake tokens without custodial centralization will continue classification under commodity derivatives supervision.",
    publishedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    timeAgo: "42m ago",
    sentiment: "BULLISH",
    impactScore: 97,
    tokens: ["ETH", "SOL"],
    url: "https://cftc.gov",
    badge: "Policy Milestone",
  },
  {
    id: "wire-3",
    title: "Whale Wallet Inflow: 18,500 BTC Transferred from Coinbase Prime to Custody Cold Vaults",
    source: "On-Chain Sentinel Mesh",
    sourceType: "ON_CHAIN",
    summary:
      "Large-scale net exchange outflow detected across 4 tranches, signaling prolonged institutional hold duration rather than spot selling pressure.",
    publishedAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    timeAgo: "1h ago",
    sentiment: "BULLISH",
    impactScore: 89,
    tokens: ["BTC"],
    url: "https://etherscan.io",
    badge: "On-Chain Whale Flow",
  },
  {
    id: "wire-4",
    title: "Uniswap Foundation Activates v4 Hook Deployment & Cross-Chain Fee Telemetry",
    source: "The Block",
    sourceType: "DEFI",
    summary:
      "Automated liquidity rebalancing hooks go live on testnet, reducing transaction slippage and introducing customizable dynamic fee tiers.",
    publishedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    timeAgo: "1.8h ago",
    sentiment: "BULLISH",
    impactScore: 88,
    tokens: ["UNI", "ETH"],
    url: "https://theblock.co",
    badge: "DeFi Infrastructure",
  },
  {
    id: "wire-5",
    title: "Federal Reserve Holds Benchmark Rates Steady; Signals Data-Dependent Liquidity Stance",
    source: "CoinDesk",
    sourceType: "MEDIA",
    summary:
      "Macro interest rates maintained at neutral band. Risk assets absorb statement with minimal volatility as balance sheet runoff approaches scheduled tapering.",
    publishedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    timeAgo: "3h ago",
    sentiment: "NEUTRAL",
    impactScore: 82,
    tokens: ["BTC", "ETH"],
    url: "https://coindesk.com",
    badge: "Macroeconomic",
  },
  {
    id: "wire-6",
    title: "Cross-Chain Lending Protocol Audits Unvested Vesting Cliff Allocations",
    source: "Decrypt",
    sourceType: "DEFI",
    summary:
      "Security researchers highlight $74M scheduled insider unlock across next 30 days, advising liquidity providers to verify pool collateral caps.",
    publishedAt: new Date(Date.now() - 250 * 60 * 1000).toISOString(),
    timeAgo: "4h ago",
    sentiment: "BEARISH",
    impactScore: 78,
    tokens: ["SUI", "APT"],
    url: "https://decrypt.co",
    badge: "Vesting Alert",
  },
];

// ── Social Sentiment & Buzz Radar Data ──
const SOCIAL_BUZZ_TOPICS = [
  {
    topic: "#BitcoinETF",
    velocity: "+380%",
    mentions24h: "142,500 mentions",
    sentimentScore: 88,
    sentimentLabel: "Overwhelmingly Bullish",
    primaryVenue: "Twitter (X)",
    status: "ACCELERATING",
  },
  {
    topic: "#SolanaDeFi",
    velocity: "+210%",
    mentions24h: "89,200 mentions",
    sentimentScore: 82,
    sentimentLabel: "Strongly Bullish",
    primaryVenue: "Telegram & X",
    status: "ACCELERATING",
  },
  {
    topic: "#BlobSpace",
    velocity: "+145%",
    mentions24h: "34,100 mentions",
    sentimentScore: 76,
    sentimentLabel: "Constructive Technical",
    primaryVenue: "Farcaster & GitHub",
    status: "STEADY",
  },
  {
    topic: "#RestakingRisks",
    velocity: "+95%",
    mentions24h: "18,400 mentions",
    sentimentScore: 54,
    sentimentLabel: "Mixed / Defensive",
    primaryVenue: "Governance Forums",
    status: "STEADY",
  },
];

type NewsTab = "newsreel" | "wire" | "catalysts" | "social" | "gatherer";

export function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: NewsTab =
    rawTab === "newsreel" ||
    rawTab === "wire" ||
    rawTab === "catalysts" ||
    rawTab === "social" ||
    rawTab === "gatherer"
      ? (rawTab as NewsTab)
      : "newsreel";

  const handleTabChange = (tab: NewsTab) => {
    setSearchParams({ tab });
  };

  // State for Wire & Catalysts
  const [wireSourceFilter, setWireSourceFilter] = useState<string>("ALL");
  const [wireSentimentFilter, setWireSentimentFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [catalystCategory, setCatalystCategory] = useState("ALL");
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Watchlist from global store
  const { watchlist } = useAppStore();

  // Data
  const { data: catalysts, isLoading, error, refetch } = useNewsCatalysts(catalystCategory);

  // Wire filtering
  const filteredWire = useMemo(() => {
    return BREAKING_WIRE_FEEDS.filter((item) => {
      const matchSource =
        wireSourceFilter === "ALL" ||
        (wireSourceFilter === "MEDIA" && item.sourceType === "MEDIA") ||
        (wireSourceFilter === "REGULATORY" && item.sourceType === "REGULATORY") ||
        (wireSourceFilter === "ON_CHAIN" && item.sourceType === "ON_CHAIN") ||
        (wireSourceFilter === "DEFI" && item.sourceType === "DEFI");

      const matchSentiment =
        wireSentimentFilter === "ALL" || item.sentiment === wireSentimentFilter;

      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.tokens.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      return matchSource && matchSentiment && matchSearch;
    });
  }, [wireSourceFilter, wireSentimentFilter, search]);

  // Catalyst filtering
  const filteredCatalysts = useMemo(() => {
    return (catalysts ?? []).filter(
      (c) =>
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.summary.toLowerCase().includes(search.toLowerCase()) ||
        c.impactedCoins.some((coin) => coin.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [catalysts, search]);

  // Watchlist Gathered News
  const gatheredWatchlistNews = useMemo(() => {
    return BREAKING_WIRE_FEEDS.filter((w) =>
      w.tokens.some((tok) =>
        watchlist.some((watchedId) => watchedId.toLowerCase().includes(tok.toLowerCase()))
      )
    );
  }, [watchlist]);

  const handleCopyGatheredBriefing = () => {
    const text = `# CRYPTOVISION AI — GATHERED NEWS BRIEFING
Generated: ${new Date().toLocaleString()}
Active Wire Stories: ${filteredWire.length}

${filteredWire
  .slice(0, 5)
  .map(
    (w, i) =>
      `${i + 1}. [${w.source}] ${w.title} (${w.tokens.join(", ")})
   - Impact Score: ${w.impactScore}/100 | Sentiment: ${w.sentiment}
   - Summary: ${w.summary}`
  )
  .join("\n\n")}

Verified via CryptoVision Multi-Signal Terminal`;
    navigator.clipboard.writeText(text);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7 max-w-7xl mx-auto"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
              <Newspaper className="h-5 w-5 text-accent animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              News &amp; Catalyst Intelligence Terminal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-tertiary ml-11">
            Multi-option intelligence gathering: Visual Trend Newsreels, Live Breaking Wires, On-Chain Claim Verifications, and Social Sentiment Radar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyGatheredBriefing}
            className="gap-1.5 font-bold text-xs"
          >
            {copiedMemo ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copiedMemo ? "Briefing Copied!" : "Export Briefing"}
          </Button>
        </div>
      </div>

      {/* ── News Gathering Options Navigation Tabs ── */}
      <div className="flex border-b border-border/80 bg-surface-0/60 p-1 rounded-2xl overflow-x-auto gap-1">
        {[
          { id: "newsreel",  label: "🔥 Trends Newsreel", count: "4 Live", icon: Flame },
          { id: "wire",      label: "⚡ Live Breaking Wire", count: `${filteredWire.length} Stories`, icon: Radio },
          { id: "catalysts", label: "🔍 On-Chain Catalyst Verifier", count: "Verified", icon: ShieldCheck },
          { id: "social",    label: "📡 Social Buzz & Radar", count: "Trending", icon: MessageSquare },
          { id: "gatherer",  label: "🎯 Custom News Watcher", count: `${watchlist.length} Watched`, icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as NewsTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                isActive
                  ? "bg-accent text-white shadow-md"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-surface-2 text-text-muted"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB 1: TRENDS NEWSREEL (VISUAL STORIES SHOWCASE)            */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "newsreel" && (
        <motion.div
          key="tab-newsreel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Executive Sub-Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/15 via-surface-1 to-surface-0 border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold/20 text-gold">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  Crypto Trends Newsreel
                  <Badge variant="gold" className="text-[9px] uppercase font-mono font-bold">
                    Executive Mode
                  </Badge>
                </h3>
                <p className="text-xs text-text-tertiary">
                  High-impact visual market intelligence slides. Automatically cycles every 6 seconds with interactive pause, coin price tracking, and institutional signals.
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-text-muted self-start sm:self-auto">
              Auto-Pilot: <strong className="text-gold">Active (6s interval)</strong>
            </div>
          </div>

          {/* Interactive Stories Player Component */}
          <div className="rounded-3xl border border-border shadow-2xl overflow-hidden">
            <CryptoTrendsNewsreel autoPlayInterval={6000} />
          </div>

          {/* Stories Catalog Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              Featured Trend Briefings In This Reel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {CRYPTO_TREND_STORIES.map((story) => (
                <div
                  key={story.id}
                  className="p-4 rounded-2xl bg-surface-1 border border-border/80 card-highlight flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        {story.category}
                      </span>
                      <span className="text-[10px] font-mono text-gold font-bold">
                        Impact: {story.impactScore}/100
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-text-primary line-clamp-2 leading-snug">
                      {story.title}
                    </h4>
                    <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                      {story.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {story.coins.map((c) => (
                        <span key={c.symbol} className="px-1.5 py-0.5 rounded bg-surface-0 border border-border font-mono text-[10px] font-bold">
                          {c.symbol}
                        </span>
                      ))}
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {story.institutionalSignal}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB 2: LIVE BREAKING WIRE (MULTI-SOURCE AGGREGATOR)          */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "wire" && (
        <motion.div
          key="tab-wire"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Wire Filter Bar */}
          <div className="p-4 rounded-2xl bg-surface-1 border border-border/80 space-y-3 card-highlight">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <Input
                  placeholder="Filter wire by token or event (e.g. BTC, BlackRock, ETF)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-surface-0 border-border text-xs"
                />
              </div>

              {/* Source Filters */}
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-text-muted mr-1">Source:</span>
                {[
                  { id: "ALL", label: "All Sources" },
                  { id: "MEDIA", label: "Bloomberg & Coindesk" },
                  { id: "REGULATORY", label: "SEC & Policy" },
                  { id: "ON_CHAIN", label: "On-Chain Mesh" },
                  { id: "DEFI", label: "DeFi Protocols" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setWireSourceFilter(f.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-semibold transition-all text-xs",
                      wireSourceFilter === f.id
                        ? "bg-accent text-white shadow-sm"
                        : "bg-surface-0 text-text-tertiary hover:text-text-primary border border-border"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentiment Filters */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs">
              <span className="text-[10px] uppercase font-bold text-text-muted">Sentiment Bias:</span>
              {(["ALL", "BULLISH", "NEUTRAL", "BEARISH"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setWireSentimentFilter(s)}
                  className={cn(
                    "px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-all",
                    wireSentimentFilter === s
                      ? s === "BULLISH"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : s === "BEARISH"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        : "bg-accent text-white border-accent"
                      : "bg-surface-0 text-text-muted border-border"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Wire Feed Stream List */}
          <div className="space-y-3">
            {filteredWire.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-surface-1 border border-border/80 hover:border-accent/40 transition-all card-highlight space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-surface-0 border border-border text-[10px] font-bold text-text-primary">
                      {item.source}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{item.timeAgo}</span>
                    {item.badge && (
                      <Badge variant="outline" className="text-[9px] font-mono">
                        {item.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold",
                        item.sentiment === "BULLISH"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : item.sentiment === "BEARISH"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-surface-2 text-text-muted"
                      )}
                    >
                      {item.sentiment}
                    </span>
                    <span className="text-accent font-bold text-[10px]">
                      Impact: {item.impactScore}/100
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-text-primary tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-tertiary uppercase font-bold">Related:</span>
                    {item.tokens.map((tok) => (
                      <span key={tok} className="px-1.5 py-0.5 rounded bg-surface-0 border border-border font-mono text-[10px] font-bold text-text-primary">
                        {tok}
                      </span>
                    ))}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                  >
                    Open Wire <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB 3: ON-CHAIN CATALYST VERIFIER (CLAIMS VS REALITY)        */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "catalysts" && (
        <motion.div
          key="tab-catalysts"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Architectural Interconnection Hero Banner */}
          <div className="p-5 rounded-2xl bg-surface-1 border border-accent/30 card-highlight shadow-md space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent/20 text-accent">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  Deterministic Catalyst Verification Engine
                  <Badge variant="mint" className="text-[9px] uppercase font-bold">
                    Claims vs Reality
                  </Badge>
                </h3>
                <p className="text-xs text-text-tertiary">
                  We cross-examine public media narratives against verifiable on-chain evidence before allowing signals to enter scoring models.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-text-secondary font-medium">Feeds Reality Check</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-negative flex-shrink-0" />
                <span className="text-text-secondary font-medium">Feeds Risk Radar</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
                <Flame className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-text-secondary font-medium">Feeds Before The Hype</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-text-secondary font-medium">Feeds AI Analyst Memos</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-1/70 p-3 rounded-2xl border border-border card-highlight">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <Input
                placeholder="Search verified catalysts by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-surface-0 border-border text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-surface-0 p-1 rounded-xl border border-border">
              {CATALYST_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCatalystCategory(cat.id)}
                  className={cn(
                    "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                    catalystCategory === cat.id
                      ? "bg-accent text-white shadow-sm"
                      : "text-text-tertiary hover:text-text-primary"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* News Catalyst Cards */}
          <div className="space-y-4">
            {filteredCatalysts.map((item) => {
              const verdictMeta = VERDICT_BADGES[item.claimAudit.verdictBadge] ?? VERDICT_BADGES.UNVERIFIED;
              const VerdictIcon = verdictMeta.icon;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-surface-1/90 border border-border/80 hover:border-accent/40 transition-all card-highlight space-y-4 shadow-sm"
                >
                  {/* Header: Source, Timestamp, and Category */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase border-border/80">
                        {item.category.replace("_", " ")}
                      </Badge>
                      <span className="text-text-tertiary font-semibold">{item.source}</span>
                      <span className="text-text-muted font-mono text-[10px]">
                        • {new Date(item.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Impacted Token Pills */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-text-tertiary">Impacted:</span>
                      {item.impactedCoins.map((c) => (
                        <Link
                          key={c.id}
                          to={`/asset/${c.id}`}
                          className="px-2 py-0.5 rounded-md bg-surface-0 border border-border hover:border-accent text-[11px] font-bold text-text-primary hover:text-accent transition-colors"
                        >
                          {c.symbol.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-base font-extrabold text-text-primary leading-snug tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed mt-1.5">
                      {item.summary}
                    </p>
                  </div>

                  {/* Claim vs. On-Chain Evidence Audit Box */}
                  <div className="p-4 rounded-xl bg-surface-0/90 border border-border/80 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Public Claim vs. Verifiable Reality
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-extrabold px-2 py-0.5 rounded-lg border flex items-center gap-1",
                          verdictMeta.color
                        )}
                      >
                        <VerdictIcon className="h-3 w-3" />
                        {verdictMeta.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-surface-1 border border-border/60">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-0.5">
                          Public Claim / Media Story:
                        </span>
                        <span className="text-text-primary font-medium">"{item.claimAudit.claim}"</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-1 border border-border/60">
                        <span className="text-[10px] uppercase font-bold text-accent block mb-0.5">
                          On-Chain / Verifiable Telemetry:
                        </span>
                        <span className="text-text-secondary leading-relaxed">
                          {item.claimAudit.onChainEvidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Impact Footnote */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                      <span>
                        <strong>Model Integration:</strong> {item.systemImpact.impactSummary}
                      </span>
                    </div>

                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                      >
                        View Official Source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB 4: SOCIAL SENTIMENT & BUZZ RADAR                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "social" && (
        <motion.div
          key="tab-social"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-5 rounded-2xl bg-surface-1 border border-border/80 card-highlight space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent/20 text-accent">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Social Sentiment &amp; Narrative Velocity Radar
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    Tracks mention acceleration, sentiment heat indices, and narrative divergence across Twitter/X, Farcaster, Telegram, and Reddit.
                  </p>
                </div>
              </div>
              <Badge variant="mint" className="text-[10px] font-mono">
                Live Scanner
              </Badge>
            </div>
          </div>

          {/* Social Trending Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOCIAL_BUZZ_TOPICS.map((topic, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-surface-1 border border-border/80 card-highlight space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-accent font-mono">{topic.topic}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {topic.primaryVenue}
                    </Badge>
                  </div>
                  <Badge variant="positive" className="font-mono text-[10px]">
                    {topic.velocity} 24h Spike
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-surface-0 border border-border">
                    <span className="text-[10px] font-sans text-text-muted block">Mention Volume</span>
                    <span className="font-bold text-text-primary">{topic.mentions24h}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-0 border border-border">
                    <span className="text-[10px] font-sans text-text-muted block">Sentiment Score</span>
                    <span className="font-bold text-emerald-400">{topic.sentimentScore}% Bullish</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                  <span className="text-text-secondary text-[11px]">{topic.sentimentLabel}</span>
                  <span className="text-[10px] text-text-muted font-mono">{topic.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB 5: CUSTOM NEWS WATCHER & GATHERER                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "gatherer" && (
        <motion.div
          key="tab-gatherer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-5 rounded-2xl bg-surface-1 border border-border/80 card-highlight space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent/20 text-accent">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Custom News Watcher &amp; Alert Gatherer
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    Automatically filters news and breaking wire stories for the assets in your personal Watchlist.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {watchlist.length} Assets in Watchlist
              </Badge>
            </div>
          </div>

          {/* Watchlist Gathered Feed */}
          {gatheredWatchlistNews.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                <span>Gathered Stories for Your Portfolio Watchlist:</span>
                <span>{gatheredWatchlistNews.length} Matched</span>
              </div>

              {gatheredWatchlistNews.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-surface-1 border border-border/80 card-highlight space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-accent">{item.source} • {item.timeAgo}</span>
                    <Badge variant="mint" className="text-[9px] font-mono">
                      Impact: {item.impactScore}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-extrabold text-text-primary">{item.title}</h4>
                  <p className="text-xs text-text-secondary">{item.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-surface-0 border border-border text-center space-y-3">
              <Bell className="h-8 w-8 text-text-muted mx-auto" />
              <div className="text-sm font-bold text-text-primary">No Direct Watchlist News Triggers Yet</div>
              <p className="text-xs text-text-tertiary max-w-md mx-auto">
                Add coins to your Watchlist from the Market Explorer or Asset Stations to have relevant breaking news gathered here in real-time.
              </p>
              <Button size="sm" asChild variant="outline" className="text-xs font-bold">
                <Link to="/projects">Explore Market Assets</Link>
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
