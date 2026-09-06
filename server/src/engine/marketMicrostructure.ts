/**
 * Market Microstructure Engine
 * Analyzes exchange-level market quality beyond simple 24h volume.
 * Consumes Binance order book and ticker data.
 */

import { BinanceProvider, type BinanceOrderBook, type BinanceTicker24h } from "../providers/binance.js";
import { getBinanceSymbol } from "../models/identifiers.js";

export interface MarketMicrostructure {
  assetId: string;
  symbol: string;
  liquidityQuality: "DEEP" | "ADEQUATE" | "THIN" | "ILLIQUID" | "UNAVAILABLE";
  spreadBps: number | null;           // bid-ask spread in basis points
  depthBid10Pct: number | null;       // USD liquidity within 10% below mid
  depthAsk10Pct: number | null;       // USD liquidity within 10% above mid
  slippageSensitivity: string;
  volumeConcentration: number | null;  // trade count / volume ratio
  quoteVolume24h: number | null;
  tradeCount24h: number | null;
  volatility24h: number | null;
  source: string;
  analyzedAt: string;
}

const binance = new BinanceProvider();

/**
 * Analyze market microstructure for an asset.
 */
export async function analyzeMarketMicrostructure(assetId: string): Promise<MarketMicrostructure> {
  const symbol = getBinanceSymbol(assetId);
  const base: MarketMicrostructure = {
    assetId,
    symbol: symbol || "UNKNOWN",
    liquidityQuality: "UNAVAILABLE",
    spreadBps: null,
    depthBid10Pct: null,
    depthAsk10Pct: null,
    slippageSensitivity: "Cannot assess — no exchange data available",
    volumeConcentration: null,
    quoteVolume24h: null,
    tradeCount24h: null,
    volatility24h: null,
    source: "binance",
    analyzedAt: new Date().toISOString(),
  };

  if (!symbol) return base;

  // Fetch data in parallel
  const [orderBook, ticker] = await Promise.all([
    binance.getOrderBook(symbol, 100),
    binance.getTicker24h(symbol),
  ]);

  if (ticker) {
    base.quoteVolume24h = ticker.quoteVolume;
    base.tradeCount24h = ticker.count;
    base.volatility24h = Math.abs(ticker.priceChangePercent);

    // Bid-ask spread
    if (ticker.bidPrice > 0 && ticker.askPrice > 0) {
      const mid = (ticker.bidPrice + ticker.askPrice) / 2;
      base.spreadBps = Math.round(((ticker.askPrice - ticker.bidPrice) / mid) * 10_000);
    }

    // Volume concentration (trades per $1M volume)
    if (ticker.quoteVolume > 0) {
      base.volumeConcentration = Math.round(ticker.count / (ticker.quoteVolume / 1_000_000));
    }
  }

  if (orderBook) {
    const mid = ticker
      ? (ticker.bidPrice + ticker.askPrice) / 2
      : orderBook.bids.length > 0
        ? parseFloat(orderBook.bids[0][0])
        : 0;

    if (mid > 0) {
      // Depth within 10% of mid price
      base.depthBid10Pct = sumDepth(orderBook.bids, mid, -0.10);
      base.depthAsk10Pct = sumDepth(orderBook.asks, mid, 0.10);
    }
  }

  // Determine liquidity quality
  if (base.quoteVolume24h !== null && base.depthBid10Pct !== null) {
    base.liquidityQuality = assessLiquidity(base.quoteVolume24h, base.depthBid10Pct, base.spreadBps);
  } else if (base.quoteVolume24h !== null) {
    // Fallback to volume-only assessment
    if (base.quoteVolume24h > 50_000_000) base.liquidityQuality = "DEEP";
    else if (base.quoteVolume24h > 5_000_000) base.liquidityQuality = "ADEQUATE";
    else if (base.quoteVolume24h > 500_000) base.liquidityQuality = "THIN";
    else base.liquidityQuality = "ILLIQUID";
  }

  // Slippage sensitivity assessment
  base.slippageSensitivity = assessSlippage(base);

  return base;
}

function sumDepth(levels: [string, string][], midPrice: number, pctRange: number): number {
  const boundary = midPrice * (1 + pctRange);
  let total = 0;
  for (const [priceStr, qtyStr] of levels) {
    const price = parseFloat(priceStr);
    const qty = parseFloat(qtyStr);
    if (pctRange < 0 && price < boundary) break;
    if (pctRange > 0 && price > boundary) break;
    total += price * qty;
  }
  return Math.round(total);
}

function assessLiquidity(
  quoteVolume: number,
  bidDepth: number,
  spreadBps: number | null
): MarketMicrostructure["liquidityQuality"] {
  if (quoteVolume > 50_000_000 && bidDepth > 1_000_000 && (spreadBps === null || spreadBps < 10)) {
    return "DEEP";
  }
  if (quoteVolume > 5_000_000 && bidDepth > 100_000) {
    return "ADEQUATE";
  }
  if (quoteVolume > 500_000) {
    return "THIN";
  }
  return "ILLIQUID";
}

function assessSlippage(ms: MarketMicrostructure): string {
  if (ms.liquidityQuality === "DEEP") {
    return "Low slippage expected for most position sizes. Deep liquidity across the book.";
  }
  if (ms.liquidityQuality === "ADEQUATE") {
    return "Moderate slippage possible for large orders (>$100K). Standard liquidity.";
  }
  if (ms.liquidityQuality === "THIN") {
    return "Significant slippage risk for orders above $10K. Thin order book.";
  }
  if (ms.liquidityQuality === "ILLIQUID") {
    return "Severe slippage risk. Exit may be difficult. Use limit orders only.";
  }
  return "Cannot assess — no exchange data available.";
}
