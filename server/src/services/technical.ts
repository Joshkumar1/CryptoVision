// Technical analysis calculations from price arrays

export function calculateSMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return result;
}

export function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    result.push(prices[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

export function calculateRSI(prices: number[], period = 14): number[] {
  const result: number[] = [];
  const changes: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  for (let i = 0; i < changes.length; i++) {
    if (i < period) {
      result.push(NaN);
      continue;
    }

    const window = changes.slice(i - period, i);
    const gains = window.filter((c) => c > 0);
    const losses = window.filter((c) => c < 0).map((c) => Math.abs(c));

    const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    }
  }

  // Shift by 1 to align with prices (changes array is 1 shorter)
  return [NaN, ...result];
}

export function calculateMACD(prices: number[]): {
  macd: number[];
  signal: number[];
  histogram: number[];
} {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = calculateEMA(macdLine, 9);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);

  return { macd: macdLine, signal: signalLine, histogram };
}

export function calculateBollingerBands(
  prices: number[],
  period = 20,
  stdDevMultiplier = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  const sma = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance = slice.reduce((sum, val) => sum + (val - mean) ** 2, 0) / period;
      const stdDev = Math.sqrt(variance);
      upper.push(mean + stdDevMultiplier * stdDev);
      lower.push(mean - stdDevMultiplier * stdDev);
    }
  }

  return { upper, middle: sma, lower };
}

// Generate a summary of technical indicators for a given price history
export function generateTechnicalSummary(prices: number[]) {
  if (prices.length < 30) {
    return { error: "Insufficient data for technical analysis" };
  }

  const currentPrice = prices[prices.length - 1];

  // RSI
  const rsiValues = calculateRSI(prices);
  const rsi = rsiValues[rsiValues.length - 1];
  const rsiSignal =
    rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral";

  // MACD
  const { macd, signal, histogram } = calculateMACD(prices);
  const macdCurrent = macd[macd.length - 1];
  const signalCurrent = signal[signal.length - 1];
  const histCurrent = histogram[histogram.length - 1];
  const macdSignal = histCurrent > 0 ? "Bullish" : "Bearish";

  // Moving Averages
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const sma20Current = sma20[sma20.length - 1];
  const sma50Current = sma50[sma50.length - 1];
  const aboveSma20 = currentPrice > sma20Current;
  const aboveSma50 = currentPrice > sma50Current;

  // Bollinger Bands
  const bb = calculateBollingerBands(prices);
  const bbUpper = bb.upper[bb.upper.length - 1];
  const bbLower = bb.lower[bb.lower.length - 1];
  const bbMiddle = bb.middle[bb.middle.length - 1];
  const bbWidth = ((bbUpper - bbLower) / bbMiddle) * 100;
  const bbPosition =
    currentPrice > bbUpper
      ? "Above upper band"
      : currentPrice < bbLower
        ? "Below lower band"
        : "Within bands";

  // Overall signal
  let bullishSignals = 0;
  let bearishSignals = 0;
  if (rsi < 30) bullishSignals++;
  if (rsi > 70) bearishSignals++;
  if (histCurrent > 0) bullishSignals++;
  else bearishSignals++;
  if (aboveSma20) bullishSignals++;
  else bearishSignals++;
  if (aboveSma50) bullishSignals++;
  else bearishSignals++;

  const overallSignal =
    bullishSignals > bearishSignals
      ? "Bullish"
      : bearishSignals > bullishSignals
        ? "Bearish"
        : "Neutral";

  return {
    rsi: { value: Math.round(rsi * 100) / 100, signal: rsiSignal },
    macd: {
      value: Math.round(macdCurrent * 100) / 100,
      signal: Math.round(signalCurrent * 100) / 100,
      histogram: Math.round(histCurrent * 100) / 100,
      trend: macdSignal,
    },
    movingAverages: {
      sma20: Math.round(sma20Current * 100) / 100,
      sma50: Math.round(sma50Current * 100) / 100,
      aboveSma20,
      aboveSma50,
    },
    bollingerBands: {
      upper: Math.round(bbUpper * 100) / 100,
      middle: Math.round(bbMiddle * 100) / 100,
      lower: Math.round(bbLower * 100) / 100,
      width: Math.round(bbWidth * 100) / 100,
      position: bbPosition,
    },
    overall: {
      signal: overallSignal,
      bullishSignals,
      bearishSignals,
    },
  };
}
