// Market regime detection based on BTC price data
export function detectRegime(btcPrices: { ts: number; price: number }[]) {
  if (btcPrices.length < 50) {
    return { state: "NEUTRAL" as const, description: "Insufficient data for regime detection.", confidence: 30 };
  }

  const prices = btcPrices.map((p) => p.price);
  const recent = prices.slice(-7);
  const sma50 = average(prices.slice(-50));
  const sma200 = prices.length >= 200 ? average(prices.slice(-200)) : sma50;
  const currentPrice = prices[prices.length - 1];

  // Volatility (std dev of 7d returns)
  const returns = recent.slice(1).map((p, i) => (p - recent[i]) / recent[i]);
  const volatility = stdDev(returns) * 100;

  // Trend signals
  const aboveSma50 = currentPrice > sma50;
  const aboveSma200 = currentPrice > sma200;
  const goldenCross = sma50 > sma200;
  const weekChange = (currentPrice - recent[0]) / recent[0] * 100;

  if (volatility > 5) {
    return {
      state: "HIGH_VOLATILITY" as const,
      description: `Market showing elevated volatility (${volatility.toFixed(1)}% 7d). Exercise caution with position sizing.`,
      confidence: 60,
    };
  }

  if (aboveSma50 && aboveSma200 && goldenCross && weekChange > 0) {
    return {
      state: "BULLISH" as const,
      description: `BTC trading above key moving averages with positive momentum (${weekChange > 0 ? "+" : ""}${weekChange.toFixed(1)}% 7d).`,
      confidence: Math.min(85, 50 + Math.abs(weekChange) * 3),
    };
  }

  if (!aboveSma50 && !aboveSma200 && weekChange < 0) {
    return {
      state: "BEARISH" as const,
      description: `BTC below key moving averages with negative momentum (${weekChange.toFixed(1)}% 7d). Risk management is critical.`,
      confidence: Math.min(85, 50 + Math.abs(weekChange) * 3),
    };
  }

  return {
    state: "NEUTRAL" as const,
    description: "Mixed signals across indicators. No strong directional bias detected.",
    confidence: 45,
  };
}

function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr: number[]): number {
  const avg = average(arr);
  const sq = arr.map((v) => (v - avg) ** 2);
  return Math.sqrt(average(sq));
}
