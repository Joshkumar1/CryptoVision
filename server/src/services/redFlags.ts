/**
 * Red Flag Detection Engine
 * Identifies specific, measurable warning signs from market and technical data.
 * Each flag has a specific metric, threshold, and evidence string.
 */

export type RedFlagSeverity = "HIGH" | "MEDIUM" | "LOW";

export interface RedFlag {
  id: string;
  type: string;
  severity: RedFlagSeverity;
  title: string;
  description: string;
  evidence: string;
  metric?: string;
  value?: string | number;
  recommendation: string;
}

interface RedFlagInput {
  // Market
  marketCap?: number;
  fdv?: number;
  volume24h?: number;
  priceChange24h?: number;
  athChangePercent?: number;   // negative = below ATH
  circulatingSupply?: number;
  totalSupply?: number | null;
  maxSupply?: number | null;

  // Technical
  rsi?: number;
  bollingerWidth?: number;     // % width

  // Developer
  commitCount4Weeks?: number;
  stars?: number;

  // TVL
  tvl?: number | null;
}

export function detectRedFlags(input: RedFlagInput): RedFlag[] {
  const flags: RedFlag[] = [];

  // ── FLAG 1: High FDV / Low Circulating Supply Ratio ──
  if (input.marketCap !== undefined && input.fdv !== undefined && input.fdv > 0) {
    const ratio = input.marketCap / input.fdv;
    if (ratio < 0.15) {
      flags.push({
        id: "high-fdv-ratio",
        type: "HIGH_FDV_RATIO",
        severity: "HIGH",
        title: "Extreme Supply Inflation Risk",
        description:
          `Only ${(ratio * 100).toFixed(0)}% of the fully diluted supply is currently circulating. ` +
          `The remaining ${((1 - ratio) * 100).toFixed(0)}% represents potential future sell pressure.`,
        evidence: `Market Cap: $${(input.marketCap / 1e6).toFixed(0)}M vs FDV: $${(input.fdv / 1e6).toFixed(0)}M`,
        metric: "Market Cap / FDV Ratio",
        value: `${(ratio * 100).toFixed(1)}%`,
        recommendation: "Investigate token vesting schedule and unlock dates before investing.",
      });
    } else if (ratio < 0.3) {
      flags.push({
        id: "moderate-fdv-ratio",
        type: "HIGH_FDV_RATIO",
        severity: "MEDIUM",
        title: "Elevated Supply Inflation Risk",
        description:
          `${(ratio * 100).toFixed(0)}% of the fully diluted supply is circulating. ` +
          `Significant future token supply unlocks are expected.`,
        evidence: `Market Cap / FDV = ${(ratio * 100).toFixed(1)}%`,
        metric: "Market Cap / FDV Ratio",
        value: `${(ratio * 100).toFixed(1)}%`,
        recommendation: "Review vesting schedule and upcoming token unlock dates.",
      });
    }
  }

  // ── FLAG 2: ATH Distance ──
  if (input.athChangePercent !== undefined && input.athChangePercent < -80) {
    flags.push({
      id: "extreme-ath-distance",
      type: "ATH_DISTANCE",
      severity: "MEDIUM",
      title: "Significantly Below All-Time High",
      description:
        `Current price is ${Math.abs(input.athChangePercent).toFixed(0)}% below its all-time high. ` +
        `While this can indicate a buying opportunity, it may also reflect structural decline.`,
      evidence: `ATH change: ${input.athChangePercent.toFixed(1)}%`,
      metric: "Price vs ATH",
      value: `${input.athChangePercent.toFixed(1)}%`,
      recommendation:
        "Investigate reasons for decline. Look for evidence of changed fundamentals vs. market cycle.",
    });
  }

  // ── FLAG 3: Low Liquidity ──
  if (input.volume24h !== undefined && input.marketCap !== undefined && input.marketCap > 0) {
    const volRatio = input.volume24h / input.marketCap;
    if (volRatio < 0.003) {
      flags.push({
        id: "very-low-liquidity",
        type: "LOW_LIQUIDITY",
        severity: "HIGH",
        title: "Critical Liquidity Warning",
        description:
          `24-hour trading volume is only ${(volRatio * 100).toFixed(2)}% of market cap. ` +
          `This extreme illiquidity means even moderate sells can cause significant price impact.`,
        evidence: `Volume: $${(input.volume24h / 1e3).toFixed(0)}K vs MC: $${(input.marketCap / 1e6).toFixed(0)}M`,
        metric: "Volume / Market Cap",
        value: `${(volRatio * 100).toFixed(3)}%`,
        recommendation: "Extreme caution warranted. Low liquidity creates severe exit risk.",
      });
    } else if (volRatio < 0.01) {
      flags.push({
        id: "low-liquidity",
        type: "LOW_LIQUIDITY",
        severity: "MEDIUM",
        title: "Low Liquidity Warning",
        description:
          `24-hour volume is ${(volRatio * 100).toFixed(2)}% of market cap — ` +
          `below typical thresholds for comfortable position sizing.`,
        evidence: `Volume/MC: ${(volRatio * 100).toFixed(2)}%`,
        metric: "Volume / Market Cap",
        value: `${(volRatio * 100).toFixed(2)}%`,
        recommendation: "Be mindful of position sizing. Slippage may be significant.",
      });
    }
  }

  // ── FLAG 4: Developer Inactivity ──
  if (input.commitCount4Weeks !== undefined) {
    if (input.commitCount4Weeks === 0) {
      flags.push({
        id: "zero-developer-activity",
        type: "DEVELOPER_INACTIVITY",
        severity: "HIGH",
        title: "Zero Developer Activity",
        description:
          "No commits have been detected in the past 4 weeks. " +
          "This may indicate development has halted or the project has been abandoned.",
        evidence: "0 commits in past 4 weeks (CoinGecko developer data)",
        metric: "Commits (4 weeks)",
        value: 0,
        recommendation:
          "Investigate whether the team is still active via official channels before proceeding.",
      });
    } else if (input.commitCount4Weeks < 3) {
      flags.push({
        id: "minimal-developer-activity",
        type: "DEVELOPER_INACTIVITY",
        severity: "MEDIUM",
        title: "Minimal Developer Activity",
        description:
          `Only ${input.commitCount4Weeks} commit(s) detected in the past 4 weeks. ` +
          `This is well below the activity levels typical of actively developed protocols.`,
        evidence: `${input.commitCount4Weeks} commits in past 4 weeks`,
        metric: "Commits (4 weeks)",
        value: input.commitCount4Weeks,
        recommendation:
          "Monitor developer activity trend over the next few weeks.",
      });
    }
  }

  // ── FLAG 5: RSI Overbought ──
  if (input.rsi !== undefined) {
    if (input.rsi > 80) {
      flags.push({
        id: "rsi-extreme-overbought",
        type: "EXTREME_RSI",
        severity: "MEDIUM",
        title: "Extreme RSI Overbought",
        description:
          `RSI of ${input.rsi.toFixed(1)} indicates extreme overbought conditions. ` +
          `Historically, RSI above 80 precedes significant pullbacks in crypto markets.`,
        evidence: `RSI (14): ${input.rsi.toFixed(1)}`,
        metric: "RSI (14-period)",
        value: input.rsi.toFixed(1),
        recommendation:
          "Caution if entering new positions. Assess broader market context before acting.",
      });
    } else if (input.rsi > 72) {
      flags.push({
        id: "rsi-overbought",
        type: "EXTREME_RSI",
        severity: "LOW",
        title: "RSI Overbought",
        description:
          `RSI of ${input.rsi.toFixed(1)} is in overbought territory. This is not a sell signal alone, ` +
          `but warrants awareness of potential short-term mean reversion.`,
        evidence: `RSI (14): ${input.rsi.toFixed(1)}`,
        metric: "RSI (14-period)",
        value: input.rsi.toFixed(1),
        recommendation: "Not a standalone sell signal — consider in context of trend strength.",
      });
    }
  }

  // ── FLAG 6: Bollinger Band Squeeze / Explosion ──
  if (input.bollingerWidth !== undefined) {
    if (input.bollingerWidth > 80) {
      flags.push({
        id: "extreme-volatility",
        type: "EXTREME_VOLATILITY",
        severity: "MEDIUM",
        title: "Extreme Price Volatility",
        description:
          `Bollinger Band width of ${input.bollingerWidth.toFixed(0)}% indicates extremely high volatility. ` +
          `Risk of rapid, large price movements in either direction.`,
        evidence: `Bollinger Band width: ${input.bollingerWidth.toFixed(0)}%`,
        metric: "Bollinger Band Width",
        value: `${input.bollingerWidth.toFixed(0)}%`,
        recommendation:
          "Extremely volatile environment. Consider reduced position sizing.",
      });
    }
  }

  // ── FLAG 7: High Price Drop in 24h ──
  if (input.priceChange24h !== undefined && input.priceChange24h < -15) {
    flags.push({
      id: "sharp-price-decline",
      type: "DECLINING_METRICS",
      severity: "HIGH",
      title: "Sharp 24h Price Decline",
      description:
        `Price has fallen ${Math.abs(input.priceChange24h).toFixed(1)}% in the past 24 hours. ` +
        `Sharp declines can indicate breaking news, large sell orders, or structural concerns.`,
      evidence: `24h change: ${input.priceChange24h.toFixed(1)}%`,
      metric: "24h Price Change",
      value: `${input.priceChange24h.toFixed(1)}%`,
      recommendation:
        "Investigate the cause before reacting. Distinguish panic selling from fundamental change.",
    });
  }

  // ── FLAG 8: Unlimited Supply ──
  if (input.maxSupply === null && input.totalSupply === null) {
    flags.push({
      id: "unlimited-supply",
      type: "HIGH_INFLATION",
      severity: "LOW",
      title: "Unlimited Token Supply",
      description:
        "This token has no maximum supply cap. New tokens can be continuously issued, " +
        "creating ongoing inflationary pressure. The rate of issuance is critical to evaluate.",
      evidence: "Max supply: unlimited (null)",
      metric: "Max Supply",
      value: "Unlimited",
      recommendation:
        "Review the protocol's emission schedule and monetary policy carefully.",
    });
  }

  // Sort by severity: HIGH → MEDIUM → LOW
  const severityOrder: Record<RedFlagSeverity, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return flags.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
