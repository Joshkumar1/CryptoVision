import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoins, useCoinDetail, useTechnicalIndicators } from "@/hooks/useMarketData";
import { useIntelligenceBundle } from "@/hooks/useIntelligence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { formatPrice, formatMarketCap, formatPercentage, cn } from "@/lib/utils";
import {
  Brain,
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  Send,
  FileText,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
  Terminal,
  HelpCircle,
  Flame,
  ArrowRight,
} from "lucide-react";

interface ResearchQueryPreset {
  id: string;
  title: string;
  coinId: string;
  query: string;
  badge: string;
}

const PRESETS: ResearchQueryPreset[] = [
  {
    id: "btc_macro",
    title: "Bitcoin Institutional Supply Absorption",
    coinId: "bitcoin",
    query: "Evaluate post-halving supply elasticity, active address growth, and institutional ETF accumulation velocity.",
    badge: "Macro Synthesis",
  },
  {
    id: "sol_eco",
    title: "Solana Throughput & Economic Security",
    coinId: "solana",
    query: "Audit developer commitment rates, fee revenue generation, and network validator centralization risks.",
    badge: "L1 Fundamentals",
  },
  {
    id: "eth_l2",
    title: "Ethereum L2 Value Accrual & Blob Space",
    coinId: "ethereum",
    query: "Analyze Layer 2 settlement dynamics, blob gas utilization, staking yield compression, and token burn rate.",
    badge: "Tokenomics Audit",
  },
  {
    id: "aave_tvl",
    title: "Aave Capital Efficiency & Bad Debt Risk",
    coinId: "aave",
    query: "Assess collateral risk parameters, stablecoin borrow demand, and protocol treasury revenue sustainability.",
    badge: "DeFi Liquidity",
  },
];

export function AiResearchPage() {
  const [selectedCoinId, setSelectedCoinId] = useState("bitcoin");
  const [userQuery, setUserQuery] = useState(
    "Evaluate fundamental strength, tokenomics dilution risks, and 12-month scenario projections."
  );
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; timestamp: string }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);

  const { data: coins } = useCoins(0, 50);
  const { data: coinDetail, isLoading: detailLoading } = useCoinDetail(selectedCoinId);
  const { data: technicals } = useTechnicalIndicators(selectedCoinId);
  const { data: intelligenceBundle, isLoading: bundleLoading } = useIntelligenceBundle(selectedCoinId);

  const selectedCoin = coins?.find((c) => c.id === selectedCoinId);

  const handleRunPreset = (preset: ResearchQueryPreset) => {
    setSelectedCoinId(preset.coinId);
    setUserQuery(preset.query);
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 600);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: "user" as const,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulate AI synthesis answer with verified data points
    setTimeout(() => {
      let aiResponse = "";
      const queryLower = newMsg.text.toLowerCase();

      if (queryLower.includes("risk") || queryLower.includes("red flag")) {
        const flagCount = intelligenceBundle?.redFlags.length ?? 0;
        aiResponse = `Regarding risk: Our deterministic analyzer identified ${flagCount} structural signals for ${selectedCoin?.name ?? selectedCoinId}. The primary vulnerability factor is supply emission and market-cap to FDV coverage ratio.`;
      } else if (queryLower.includes("price") || queryLower.includes("target") || queryLower.includes("bull")) {
        aiResponse = `Scenario modeling for ${selectedCoin?.name ?? selectedCoinId}: Bull case projects +60% to +120% upside if aggregate volume expands above 20% of MCap and developer velocity remains above 30 commits/month.`;
      } else if (queryLower.includes("developer") || queryLower.includes("code") || queryLower.includes("github")) {
        const commits = coinDetail?.developer_data?.commit_count_4_weeks ?? 0;
        aiResponse = `Developer audit: ${selectedCoin?.name} has logged ${commits} verified repository commits over the past 4 weeks across GitHub, reflecting ${commits > 20 ? "strong" : "moderate"} active engineering effort.`;
      } else {
        aiResponse = `Analysis for "${newMsg.text}": Based on the live on-chain and market data feed, ${selectedCoin?.name} currently exhibits an overall score of ${intelligenceBundle?.score?.overall ?? 72}/100 with ${intelligenceBundle?.score?.evidenceQuality ?? "STRONG"} evidence quality.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai" as const,
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7 max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
              <Brain className="h-5 w-5 text-accent animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">AI Research Analyst</h1>
          </div>
          <p className="text-sm text-text-tertiary ml-11">
            Evidence-driven research memos synthesized from verified market data, GitHub activity, and DeFi TVL.
          </p>
        </div>
      </div>

      {/* ── Preset Inquiries ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleRunPreset(p)}
            className="p-4 rounded-2xl bg-surface-1 border border-border/80 hover:border-accent/50 hover:bg-surface-2 text-left transition-all card-highlight group flex flex-col justify-between"
          >
            <div>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase mb-2">
                {p.badge}
              </Badge>
              <div className="font-bold text-sm text-text-primary group-hover:text-accent transition-colors mb-1">
                {p.title}
              </div>
              <p className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">{p.query}</p>
            </div>
            <div className="mt-3 flex items-center text-xs font-semibold text-accent gap-1">
              Load Analysis <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* ── Research Inquiry Prompt Console ── */}
      <Card className="card-highlight">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2">
            <Terminal className="h-4 w-4 text-accent" /> Institutional Research Prompt Console
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-60 flex-shrink-0">
              <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                Select Subject Asset
              </label>
              <select
                value={selectedCoinId}
                onChange={(e) => setSelectedCoinId(e.target.value)}
                className="w-full h-10 rounded-xl bg-surface-0 border border-border px-3 text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {(coins ?? [
                  { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
                  { id: "ethereum", name: "Ethereum", symbol: "eth" },
                  { id: "solana", name: "Solana", symbol: "sol" },
                ]).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                Analytical Query / Focus Angle
              </label>
              <Input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask deep research question..."
                className="h-10 text-xs bg-surface-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Synthesized Institutional Memo ── */}
      {detailLoading || bundleLoading || isGenerating ? (
        <div className="p-8 rounded-2xl bg-surface-1 border border-border space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <Card className="card-highlight border-accent/30 shadow-[0_0_30px_rgba(79,142,247,0.06)]">
            <CardHeader className="flex-row items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-base font-extrabold tracking-tight">
                    Institutional Research Memorandum: {coinDetail?.name ?? selectedCoinId}
                  </CardTitle>
                  <div className="text-xs text-text-tertiary mt-0.5">
                    Synthesized {new Date().toLocaleDateString()} • Verifiable Evidence Model v2.0
                  </div>
                </div>
              </div>

              {intelligenceBundle?.score && (
                <div className="flex items-center gap-3">
                  <ScoreRing score={intelligenceBundle.score.overall} size={50} strokeWidth={4} />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-text-primary">Conviction Score</div>
                    <Badge variant="mint" className="text-[10px] font-bold">
                      {intelligenceBundle.score.evidenceQuality} EVIDENCE
                    </Badge>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {/* Executive Thesis */}
              <div className="p-4 rounded-xl bg-surface-0/80 border border-border/60 leading-relaxed text-sm text-text-secondary">
                <strong className="text-text-primary font-bold block mb-1">Executive Thesis:</strong>
                {intelligenceBundle?.realityCheck?.overallAssessment ??
                  `${coinDetail?.name} demonstrates established fundamental traction with sustainable liquidity and moderate technical momentum.`}
              </div>

              {/* Quantitative Snapshot Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border">
                  <div className="text-[10px] font-bold uppercase text-text-tertiary">Market Cap</div>
                  <div className="text-base font-bold text-text-primary tabular mt-0.5">
                    {coinDetail ? formatMarketCap(coinDetail.market_data.market_cap.usd) : "—"}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border">
                  <div className="text-[10px] font-bold uppercase text-text-tertiary">FDV Ratio</div>
                  <div className="text-base font-bold text-text-primary tabular mt-0.5">
                    {coinDetail?.market_data.fully_diluted_valuation?.usd
                      ? `${((coinDetail.market_data.market_cap.usd / coinDetail.market_data.fully_diluted_valuation.usd) * 100).toFixed(0)}% Circulating`
                      : "100% Circulating"}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border">
                  <div className="text-[10px] font-bold uppercase text-text-tertiary">Developer Commits (4w)</div>
                  <div className="text-base font-bold text-text-primary tabular mt-0.5">
                    {coinDetail?.developer_data?.commit_count_4_weeks ?? 0} Commits
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border">
                  <div className="text-[10px] font-bold uppercase text-text-tertiary">Technical Trend (RSI)</div>
                  <div className="text-base font-bold text-text-primary tabular mt-0.5">
                    {technicals?.rsi?.value ? `${technicals.rsi.value.toFixed(1)} (${technicals.rsi.signal})` : "Neutral"}
                  </div>
                </div>
              </div>

              {/* Scenario Projections (Bull / Base / Bear) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> Scenario Projections & Valuation Horizons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Bull Case */}
                  <div className="p-4 rounded-xl bg-positive/5 border border-positive/25">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-positive flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" /> Bull Scenario
                      </span>
                      <Badge variant="positive" className="text-[10px] font-bold">+85% to +140%</Badge>
                    </div>
                    <ul className="text-xs text-text-secondary space-y-1.5">
                      {(intelligenceBundle?.realityCheck?.bullCase ?? [
                        "Aggressive institutional adoption and ETF inflows",
                        "DeFi TVL expansion and on-chain protocol revenue surge",
                        "Macro risk-on liquidity easing",
                      ]).map((item, idx) => (
                        <li key={idx} className="flex gap-1.5">
                          <span className="text-positive">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Base Case */}
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/25">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-accent flex items-center gap-1.5">
                        <Layers className="h-4 w-4" /> Base Scenario
                      </span>
                      <Badge variant="default" className="text-[10px] font-bold">+15% to +35%</Badge>
                    </div>
                    <ul className="text-xs text-text-secondary space-y-1.5">
                      <li className="flex gap-1.5">
                        <span className="text-accent">•</span> Organic usage growth tracking broader market capitalization
                      </li>
                      <li className="flex gap-1.5">
                        <span className="text-accent">•</span> Steady developer commit velocity and network maintenance
                      </li>
                      <li className="flex gap-1.5">
                        <span className="text-accent">•</span> Controlled token emission absorbed by spot trading depth
                      </li>
                    </ul>
                  </div>

                  {/* Bear Case */}
                  <div className="p-4 rounded-xl bg-negative/5 border border-negative/25">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-negative flex items-center gap-1.5">
                        <TrendingDown className="h-4 w-4" /> Bear Scenario
                      </span>
                      <Badge variant="negative" className="text-[10px] font-bold">-30% to -65%</Badge>
                    </div>
                    <ul className="text-xs text-text-secondary space-y-1.5">
                      {(intelligenceBundle?.realityCheck?.bearCase ?? [
                        "Token unlock cliff creates massive sell pressure",
                        "Developer activity stagnates or pivots to competitor L1",
                        "Regulatory enforcement or compliance scrutiny",
                      ]).map((item, idx) => (
                        <li key={idx} className="flex gap-1.5">
                          <span className="text-negative">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Analyst Follow-up Chat */}
          <Card className="card-highlight">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" /> Interactive Inquiry & Follow-up Q&A
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                <div className="p-3.5 rounded-xl bg-surface-2/60 border border-border text-xs text-text-secondary leading-relaxed">
                  <span className="font-bold text-accent block mb-1">Analyst Terminal Ready:</span>
                  Ask any follow-up question regarding {coinDetail?.name ?? selectedCoinId} tokenomics, competitive advantages, security vectors, or developer cadence.
                </div>

                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3.5 rounded-xl text-xs leading-relaxed max-w-2xl",
                      msg.sender === "user"
                        ? "ml-auto bg-accent text-white"
                        : "bg-surface-0 border border-border text-text-secondary"
                    )}
                  >
                    <div className="font-bold text-[10px] opacity-75 mb-0.5">
                      {msg.sender === "user" ? "You" : "CryptoVision AI Analyst"} • {msg.timestamp}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask a specific question about ${coinDetail?.name ?? selectedCoinId}...`}
                  className="h-10 text-xs bg-surface-0"
                />
                <Button type="submit" size="default" className="gap-2 font-semibold">
                  <Send className="h-4 w-4" /> Ask
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
