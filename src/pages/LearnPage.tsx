import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPercentage, cn } from "@/lib/utils";
import {
  GraduationCap,
  Calculator,
  BookOpen,
  ShieldAlert,
  Coins,
  Percent,
  TrendingUp,
  Activity,
  Layers,
  Scale,
  Sparkles,
  HelpCircle,
  Globe2,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

type ActiveTool = "impermanent_loss" | "position_sizing" | "staking_apy";

interface MasterclassModule {
  id: string;
  category: string;
  title: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
}

const MODULES: MasterclassModule[] = [
  {
    id: "tokenomics",
    category: "Fundamental Analysis",
    title: "Deconstructing Crypto Tokenomics & Supply Cliffs",
    readTime: "5 min read",
    summary:
      "Understand why low circulating supply with massive Fully Diluted Valuation (FDV) creates sustained structural sell pressure on retail investors.",
    keyTakeaways: [
      "Market Cap measures current liquid value; FDV measures theoretical max supply value.",
      "A circulating ratio below 20% indicates significant future unlock dilution.",
      "Always verify token vesting schedules and major cliff unlock dates before long-term holding.",
    ],
  },
  {
    id: "impermanent_loss",
    category: "DeFi Mechanics",
    title: "Understanding & Mitigating Impermanent Loss in AMMs",
    readTime: "6 min read",
    summary:
      "Automated Market Makers (AMMs) rebalance token pools constantly. When price ratios diverge, liquidity providers suffer opportunity loss compared to simple holding.",
    keyTakeaways: [
      "A 2x price divergence causes ~5.7% impermanent loss.",
      "A 5x price divergence causes ~25.5% impermanent loss.",
      "Trading fee APY must exceed the impermanent loss rate for liquidity provision to be profitable.",
    ],
  },
  {
    id: "risk_mgmt",
    category: "Portfolio Discipline",
    title: "The Mathematical Law of Risk Management & Ruin",
    readTime: "4 min read",
    summary:
      "A 50% loss requires a 100% gain to break even. Sizing every position according to predefined dollar risk prevents catastrophic account drawdowns.",
    keyTakeaways: [
      "Never risk more than 1%–2% of total portfolio equity on any single trade.",
      "Determine position size from your invalidation stop-loss, not arbitrary round numbers.",
      "Aim for a minimum 2:1 Reward-to-Risk ratio to maintain positive expectancy.",
    ],
  },
  {
    id: "technical_indicators",
    category: "Technical Analysis",
    title: "Technical Indicator Convergence & False Breakouts",
    readTime: "5 min read",
    summary:
      "Single indicators frequently generate noise. High-probability setups emerge when momentum (RSI), trend (Moving Averages), and volume expand simultaneously.",
    keyTakeaways: [
      "RSI divergence (price makes higher high while RSI makes lower high) signals trend exhaustion.",
      "Moving average crossovers are lagging confirmation tools, not instant entry triggers.",
      "Volume expansion confirms the validity of support/resistance breakouts.",
    ],
  },
];

const PLAIN_ENGLISH_EXPLAINERS = [
  {
    term: "FDV (Fully Diluted Valuation)",
    plainTitle: "The 'Printed vs. Circulating' Trap",
    analogy:
      "Imagine a company prints 100 million shares, but only sells 5 million to the public today at $10 each. The Market Cap looks small ($50M), but if all 100M shares unlock tomorrow at $10, the company must be worth $1 Billion (FDV). When the remaining 95 million shares unlock, they dilute the existing holders.",
    verdict: "High FDV + Low Circulating Supply = Major Future Price Drag.",
  },
  {
    term: "Impermanent Loss",
    plainTitle: "The Rebalancing Opportunity Cost",
    analogy:
      "If you put $50 of ETH and $50 of USD in a decentralized pool, and ETH surges 5x, the pool automatically sells your rising ETH for USD so the pool stays 50/50. When you withdraw, you have more USD and less ETH than if you had simply held the ETH in your wallet.",
    verdict: "Only supply liquidity if trading fee APY outpaces the price divergence.",
  },
  {
    term: "Orderbook Liquidity vs. Market Cap",
    plainTitle: "The Paper Wealth Illusion",
    analogy:
      "A coin can have a $500M market cap because someone bought 1 token for $5. But if there is only $20,000 of real buy orders in the orderbook, selling even $50,000 of tokens will crash the price by 70%.",
    verdict: "Always check 24h Volume and Orderbook Depth before sizing large positions.",
  },
];

export function LearnPage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>("impermanent_loss");

  // Impermanent Loss State
  const [tokenAPriceChange, setTokenAPriceChange] = useState(100);
  const [tokenBPriceChange, setTokenBPriceChange] = useState(0);

  // Position Sizing State
  const [accountSize, setAccountSize] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(50000);
  const [stopLossPrice, setStopLossPrice] = useState(47500);
  const [targetPrice, setTargetPrice] = useState(57500);

  // Staking APY State
  const [stakedAmount, setStakedAmount] = useState(5000);
  const [apyPercent, setApyPercent] = useState(12);
  const [stakingDays, setStakingDays] = useState(365);
  const [compoundFrequency, setCompoundFrequency] = useState<"daily" | "weekly" | "monthly">("daily");

  // Calculations: Impermanent Loss
  const rA = (100 + tokenAPriceChange) / 100;
  const rB = (100 + tokenBPriceChange) / 100;
  const priceRatio = rA / rB;
  const holdValueRatio = (rA + rB) / 2;
  const poolValueRatio = Math.sqrt(priceRatio) * rB;
  const impermanentLossPct = ((poolValueRatio - holdValueRatio) / holdValueRatio) * 100;

  // Calculations: Position Sizing
  const riskAmountDollars = accountSize * (riskPercent / 100);
  const stopLossDistanceDollars = Math.abs(entryPrice - stopLossPrice);
  const stopLossDistancePct = (stopLossDistanceDollars / entryPrice) * 100;
  const targetDistanceDollars = Math.abs(targetPrice - entryPrice);
  const riskRewardRatio = stopLossDistanceDollars > 0 ? (targetDistanceDollars / stopLossDistanceDollars).toFixed(2) : "0";
  const positionUnits = stopLossDistanceDollars > 0 ? riskAmountDollars / stopLossDistanceDollars : 0;
  const totalPositionSizeDollars = positionUnits * entryPrice;

  // Calculations: Staking APY
  const periodsPerYear = compoundFrequency === "daily" ? 365 : compoundFrequency === "weekly" ? 52 : 12;
  const totalPeriods = (stakingDays / 365) * periodsPerYear;
  const ratePerPeriod = apyPercent / 100 / periodsPerYear;
  const finalStakingBalance = stakedAmount * Math.pow(1 + ratePerPeriod, totalPeriods);
  const totalYieldEarned = finalStakingBalance - stakedAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
            <GraduationCap className="h-5 w-5 text-accent animate-pulse" />
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Crypto Financial Modeling & Learning Lab
          </h1>
        </div>
        <p className="text-sm text-text-tertiary ml-11">
          Interactive mathematical calculators, plain-English conceptual explainers, and institutional masterclasses.
        </p>
      </div>

      {/* ── 🌍 SIGNATURE FEATURE: LOCAL INTELLIGENCE & PLAIN-ENGLISH EXPLAINERS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-accent" /> Plain-English Concept Demystifiers
              <Badge variant="mint" className="text-[9px] uppercase font-bold">
                Local Intelligence
              </Badge>
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Demystifying complex financial tokenomics into plain, intuitive real-world analogies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAIN_ENGLISH_EXPLAINERS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-1 border border-border card-highlight flex flex-col justify-between space-y-3"
            >
              <div>
                <Badge variant="gold" className="text-[10px] font-bold uppercase mb-2">
                  {item.term}
                </Badge>
                <h3 className="text-sm font-extrabold text-text-primary leading-snug">
                  {item.plainTitle}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-2.5 bg-surface-0/80 p-3 rounded-xl border border-border/60">
                  {item.analogy}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 text-xs font-semibold text-accent flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{item.verdict}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive Financial Calculators Suite ── */}
      <Card className="card-highlight border-accent/30 shadow-[0_0_30px_rgba(79,142,247,0.06)]">
        <CardHeader className="pb-3 border-b border-border/60 flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-2">
            <Calculator className="h-4 w-4 text-accent" /> Quantitative Financial Simulators
          </CardTitle>
          <div className="flex gap-1 bg-surface-0 p-1 rounded-xl border border-border">
            {[
              { id: "impermanent_loss", label: "Impermanent Loss" },
              { id: "position_sizing", label: "Position Risk Sizer" },
              { id: "staking_apy", label: "Staking APY Yield" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as ActiveTool)}
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                  activeTool === t.id
                    ? "bg-accent text-white shadow-sm"
                    : "text-text-tertiary hover:text-text-primary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Tool 1: Impermanent Loss Calculator */}
          {activeTool === "impermanent_loss" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-5 rounded-2xl bg-surface-0/60 border border-border">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Coins className="h-4 w-4 text-accent" /> Asset Price Assumptions
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-text-secondary mb-1">
                      <span>Token A Price Change</span>
                      <span className="text-positive font-bold">
                        {tokenAPriceChange >= 0 ? "+" : ""}
                        {tokenAPriceChange}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="500"
                      step="5"
                      value={tokenAPriceChange}
                      onChange={(e) => setTokenAPriceChange(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-text-secondary mb-1">
                      <span>Token B Price Change (or Stablecoin)</span>
                      <span className="text-accent font-bold">
                        {tokenBPriceChange >= 0 ? "+" : ""}
                        {tokenBPriceChange}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="500"
                      step="5"
                      value={tokenBPriceChange}
                      onChange={(e) => setTokenBPriceChange(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                  </div>
                </div>

                {/* Calculation Output Results */}
                <div className="p-5 rounded-2xl bg-surface-0/90 border border-border flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">
                      Estimated Impermanent Loss
                    </div>
                    <div className="text-3xl font-extrabold text-negative tabular">
                      {impermanentLossPct.toFixed(2)}%
                    </div>
                    <p className="text-xs text-text-tertiary mt-2 leading-relaxed">
                      Compared to simply holding 50/50 outside the liquidity pool, providing liquidity results in{" "}
                      <strong className="text-negative font-bold">{Math.abs(impermanentLossPct).toFixed(2)}% less value</strong>{" "}
                      due to automated asset rebalancing.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-text-tertiary">Break-Even Fee Requirement:</span>
                    <Badge variant="warning">
                      +{Math.abs(impermanentLossPct).toFixed(2)}% Fee Yield Required
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool 2: Position Sizing & Risk Management Calculator */}
          {activeTool === "position_sizing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-5 rounded-2xl bg-surface-0/60 border border-border">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Scale className="h-4 w-4 text-accent" /> Portfolio & Trade Parameters
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                        Total Portfolio ($)
                      </label>
                      <Input
                        type="number"
                        value={accountSize}
                        onChange={(e) => setAccountSize(Number(e.target.value))}
                        className="h-9 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                        Risk Per Trade (%)
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(Number(e.target.value))}
                        className="h-9 text-xs font-bold text-negative"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-text-tertiary block mb-1">Entry ($)</label>
                      <Input
                        type="number"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        className="h-9 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-negative block mb-1">Stop Loss ($)</label>
                      <Input
                        type="number"
                        value={stopLossPrice}
                        onChange={(e) => setStopLossPrice(Number(e.target.value))}
                        className="h-9 text-xs font-bold text-negative"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-positive block mb-1">Target ($)</label>
                      <Input
                        type="number"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                        className="h-9 text-xs font-bold text-positive"
                      />
                    </div>
                  </div>
                </div>

                {/* Sizing Results */}
                <div className="p-5 rounded-2xl bg-surface-0/90 border border-border flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-surface-1 border border-border">
                        <div className="text-[10px] font-bold uppercase text-text-tertiary">Max Allowed Risk ($)</div>
                        <div className="text-xl font-extrabold text-negative tabular mt-0.5">
                          {formatPrice(riskAmountDollars)}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-1 border border-border">
                        <div className="text-[10px] font-bold uppercase text-text-tertiary">Reward / Risk Ratio</div>
                        <div className="text-xl font-extrabold text-positive tabular mt-0.5">
                          {riskRewardRatio} R:R
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/30">
                      <div className="text-xs font-bold uppercase tracking-wider text-accent mb-0.5">
                        Recommended Position Sizing
                      </div>
                      <div className="text-2xl font-extrabold text-text-primary tabular">
                        {formatPrice(totalPositionSizeDollars)}
                      </div>
                      <div className="text-xs text-text-secondary mt-1">
                        Exact Quantity: <strong className="text-text-primary font-mono">{positionUnits.toFixed(4)} Units</strong> (Stop loss distance: {stopLossDistancePct.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool 3: Staking APY Yield Simulator */}
          {activeTool === "staking_apy" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-5 rounded-2xl bg-surface-0/60 border border-border">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Percent className="h-4 w-4 text-accent" /> Staking & Compounding Assumptions
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                        Initial Principal ($)
                      </label>
                      <Input
                        type="number"
                        value={stakedAmount}
                        onChange={(e) => setStakedAmount(Number(e.target.value))}
                        className="h-9 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                        Annual APY (%)
                      </label>
                      <Input
                        type="number"
                        value={apyPercent}
                        onChange={(e) => setApyPercent(Number(e.target.value))}
                        className="h-9 text-xs font-bold text-positive"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-text-tertiary block mb-1">
                      Compound Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-surface-1 p-1 rounded-xl border border-border">
                      {(["daily", "weekly", "monthly"] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setCompoundFrequency(freq)}
                          className={cn(
                            "text-xs font-bold py-1.5 rounded-lg capitalize transition-all",
                            compoundFrequency === freq
                              ? "bg-accent text-white shadow-sm"
                              : "text-text-tertiary hover:text-text-primary"
                          )}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Staking Yield Output */}
                <div className="p-5 rounded-2xl bg-surface-0/90 border border-border flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">
                      Total Projected Yield
                    </div>
                    <div className="text-3xl font-extrabold text-positive tabular">
                      +{formatPrice(totalYieldEarned)}
                    </div>
                    <div className="text-sm font-semibold text-text-secondary mt-1">
                      Final Balance: <strong className="text-text-primary font-bold">{formatPrice(finalStakingBalance)}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-1 border border-border text-xs text-text-tertiary leading-relaxed mt-4">
                    <strong className="text-text-secondary font-semibold block mb-0.5">Inflation Warning:</strong>
                    Ensure the real token emission rate is lower than the staking APY to avoid holding diluted principal.
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Institutional Crypto Masterclasses ── */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" /> Institutional Knowledge & Masterclasses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map((mod) => (
            <Card key={mod.id} className="card-highlight h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                    {mod.category}
                  </Badge>
                  <span className="text-[11px] text-text-tertiary font-medium">{mod.readTime}</span>
                </div>
                <CardTitle className="text-base font-bold leading-snug">{mod.title}</CardTitle>
                <p className="text-xs text-text-tertiary leading-relaxed mt-2">{mod.summary}</p>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="p-3.5 rounded-xl bg-surface-0/70 border border-border space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-accent tracking-wider">
                    Core Mathematical Principles:
                  </div>
                  <ul className="text-xs text-text-secondary space-y-1">
                    {mod.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex gap-2 leading-relaxed">
                        <span className="text-accent font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
