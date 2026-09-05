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
      "Size positions dynamically using your tolerated loss, volatility tier, stop distance, and liquidity depth instead of arbitrary static rules.",
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

  // Risk Simulator State (Educational Simulation)
  const [accountSize, setAccountSize] = useState(25000);
  const [maxToleratedLossPct, setMaxToleratedLossPct] = useState(2.0);
  const [volatilityTier, setVolatilityTier] = useState<"LOW" | "MODERATE" | "HIGH">("MODERATE");
  const [stopDistancePct, setStopDistancePct] = useState(6.0);
  const [liquidityTier, setLiquidityTier] = useState<"DEEP" | "MODERATE" | "THIN">("MODERATE");
  const [portfolioCorrelation, setPortfolioCorrelation] = useState(0.65);
  const [scenarioDrawdownPct, setScenarioDrawdownPct] = useState(35);
  const [entryPrice, setEntryPrice] = useState(50000);

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

  // Calculations: Dynamic Risk Simulator
  const maxToleratedLossDollars = accountSize * (maxToleratedLossPct / 100);
  const volMultiplier = volatilityTier === "HIGH" ? 0.75 : volatilityTier === "LOW" ? 1.15 : 1.0;
  const liqMultiplier = liquidityTier === "THIN" ? 0.70 : liquidityTier === "DEEP" ? 1.0 : 0.88;
  const corrMultiplier = Math.max(0.7, 1 - (portfolioCorrelation * 0.25));
  const basePositionDollars = stopDistancePct > 0 ? (maxToleratedLossDollars / (stopDistancePct / 100)) : 0;
  const illustrativePositionDollars = Math.min(accountSize * 0.4, basePositionDollars * volMultiplier * liqMultiplier * corrMultiplier);
  const positionUnits = entryPrice > 0 ? illustrativePositionDollars / entryPrice : 0;
  const potentialLossDollars = illustrativePositionDollars * (stopDistancePct / 100);
  const stressCaseLossDollars = illustrativePositionDollars * (scenarioDrawdownPct / 100);
  const liquidityNotes =
    liquidityTier === "THIN"
      ? "High slippage vulnerability: 2.5%–4.0% estimated slippage upon market liquidation."
      : liquidityTier === "MODERATE"
      ? "Moderate depth: execute with limit orders to avoid crossing wide spreads."
      : "Deep institutional orderbook: minimal execution slippage expected.";

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
              { id: "position_sizing", label: "Risk Simulator" },
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

          {/* Tool 2: Risk Simulator (Educational Simulation) */}
          {activeTool === "position_sizing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                  <span>
                    <strong>EDUCATIONAL SIMULATION:</strong> This simulator illustrates how volatility, liquidity depth, correlation, and tail-risk drawdowns interact with sizing. It does not dictate rigid static rules (such as a hardcoded 1% limit).
                  </span>
                </div>
                <Badge variant="warning" className="font-mono text-[10px] uppercase font-bold flex-shrink-0">
                  Educational Simulation
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4 p-5 rounded-2xl bg-surface-0/60 border border-border">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Scale className="h-4 w-4 text-accent" /> Simulation Parameters
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-tertiary block mb-1">
                        Portfolio Size ($)
                      </label>
                      <Input
                        type="number"
                        value={accountSize}
                        onChange={(e) => setAccountSize(Number(e.target.value))}
                        className="h-9 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-tertiary block mb-1">
                        Max Tolerated Loss (%)
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        value={maxToleratedLossPct}
                        onChange={(e) => setMaxToleratedLossPct(Number(e.target.value))}
                        className="h-9 text-xs font-bold text-negative"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-tertiary block mb-1">
                        Volatility Profile
                      </label>
                      <div className="flex gap-1">
                        {(["LOW", "MODERATE", "HIGH"] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setVolatilityTier(v)}
                            className={cn(
                              "flex-1 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all",
                              volatilityTier === v
                                ? "bg-accent text-white border-accent"
                                : "bg-surface-1 text-text-muted border-border hover:bg-surface-2"
                            )}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-tertiary block mb-1">
                        Stop Distance (%)
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        value={stopDistancePct}
                        onChange={(e) => setStopDistancePct(Number(e.target.value))}
                        className="h-9 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-tertiary block mb-1">
                        Liquidity Profile
                      </label>
                      <div className="flex gap-1">
                        {(["DEEP", "MODERATE", "THIN"] as const).map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setLiquidityTier(l)}
                            className={cn(
                              "flex-1 py-1 text-[10px] font-mono font-bold rounded-lg border transition-all",
                              liquidityTier === l
                                ? "bg-accent text-white border-accent"
                                : "bg-surface-1 text-text-muted border-border hover:bg-surface-2"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-text-tertiary block mb-1">
                        Correlation ({portfolioCorrelation.toFixed(2)})
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={portfolioCorrelation}
                        onChange={(e) => setPortfolioCorrelation(Number(e.target.value))}
                        className="w-full accent-accent mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-rose-400 block mb-1">
                      Stress-Case Scenario Drawdown ({scenarioDrawdownPct}%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="75"
                      step="5"
                      value={scenarioDrawdownPct}
                      onChange={(e) => setScenarioDrawdownPct(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>

                {/* Sizing & Stress Results */}
                <div className="p-5 rounded-2xl bg-surface-0/90 border border-border flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-0.5">
                        Illustrative Position Size
                      </span>
                      <div className="flex items-baseline gap-2 font-mono">
                        <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                          {formatPrice(illustrativePositionDollars)}
                        </span>
                        <span className="text-xs text-text-muted">
                          ({((illustrativePositionDollars / accountSize) * 100).toFixed(1)}% of portfolio)
                        </span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-1">
                        Sized dynamically against {volatilityTier.toLowerCase()} volatility and {liquidityTier.toLowerCase()} liquidity.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-surface-1 border border-border">
                        <span className="text-[10px] font-bold uppercase text-text-muted block font-sans">
                          Potential Loss (at Stop)
                        </span>
                        <span className="text-base font-extrabold text-negative mt-0.5 block">
                          -{formatPrice(potentialLossDollars)}
                        </span>
                        <span className="text-[10px] text-text-tertiary">
                          {((potentialLossDollars / accountSize) * 100).toFixed(1)}% of account
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                        <span className="text-[10px] font-bold uppercase text-rose-300 block font-sans">
                          Stress-Case Loss ({scenarioDrawdownPct}%)
                        </span>
                        <span className="text-base font-extrabold text-rose-400 mt-0.5 block">
                          -{formatPrice(stressCaseLossDollars)}
                        </span>
                        <span className="text-[10px] text-text-tertiary">
                          {((stressCaseLossDollars / accountSize) * 100).toFixed(1)}% of account
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-1 border border-border space-y-1 text-xs">
                    <span className="font-bold text-text-primary block text-[11px]">
                      Liquidity &amp; Execution Considerations:
                    </span>
                    <p className="text-text-secondary text-[11px] leading-relaxed">
                      {liquidityNotes}
                    </p>
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
