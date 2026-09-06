/**
 * Binance Market Data Provider
 * PUBLIC endpoints only — no trading/execution.
 * Used for market microstructure analysis.
 */

import { HttpClient } from "../infra/httpClient.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";

export interface BinanceOHLCV {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteVolume: number;
  trades: number;
}

export interface BinanceOrderBook {
  lastUpdateId: number;
  bids: [string, string][];  // [price, qty]
  asks: [string, string][];
}

export interface BinanceTicker24h {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  lastPrice: number;
  volume: number;
  quoteVolume: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  count: number;            // trade count
  bidPrice: number;
  askPrice: number;
}

export class BinanceProvider {
  readonly name = "binance";
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      provider: "binance",
      baseUrl: "https://api.binance.com",
      timeout: 5_000,
    });
  }

  /** Get OHLCV klines */
  async getKlines(
    symbol: string,
    interval: string = "1d",
    limit: number = 100
  ): Promise<BinanceOHLCV[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any[]>(
        "/api/v3/klines",
        { symbol: symbol.toUpperCase(), interval, limit },
        "MARKET"
      );
      if (!result?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.map((k: any[]): BinanceOHLCV => ({
        openTime: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
        closeTime: k[6],
        quoteVolume: parseFloat(k[7]),
        trades: k[8],
      }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  /** Get order book depth */
  async getOrderBook(symbol: string, limit: number = 100): Promise<BinanceOrderBook | null> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/api/v3/depth",
        { symbol: symbol.toUpperCase(), limit },
        "REALTIME"
      );
      if (!result?.data) return null;

      recordProviderSuccess(this.name, Date.now() - start);

      return {
        lastUpdateId: result.data.lastUpdateId,
        bids: result.data.bids,
        asks: result.data.asks,
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  /** Get 24h ticker */
  async getTicker24h(symbol: string): Promise<BinanceTicker24h | null> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/api/v3/ticker/24hr",
        { symbol: symbol.toUpperCase() },
        "MARKET"
      );
      if (!result?.data) return null;

      recordProviderSuccess(this.name, Date.now() - start);
      const d = result.data;

      return {
        symbol: d.symbol,
        priceChange: parseFloat(d.priceChange),
        priceChangePercent: parseFloat(d.priceChangePercent),
        lastPrice: parseFloat(d.lastPrice),
        volume: parseFloat(d.volume),
        quoteVolume: parseFloat(d.quoteVolume),
        highPrice: parseFloat(d.highPrice),
        lowPrice: parseFloat(d.lowPrice),
        openPrice: parseFloat(d.openPrice),
        count: d.count,
        bidPrice: parseFloat(d.bidPrice),
        askPrice: parseFloat(d.askPrice),
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  /** Get multiple 24h tickers */
  async getAllTickers(): Promise<BinanceTicker24h[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any[]>(
        "/api/v3/ticker/24hr",
        {},
        "MARKET"
      );
      if (!result?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data
        .filter((d: any) => d.symbol.endsWith("USDT"))
        .map((d: any): BinanceTicker24h => ({
          symbol: d.symbol,
          priceChange: parseFloat(d.priceChange),
          priceChangePercent: parseFloat(d.priceChangePercent),
          lastPrice: parseFloat(d.lastPrice),
          volume: parseFloat(d.volume),
          quoteVolume: parseFloat(d.quoteVolume),
          highPrice: parseFloat(d.highPrice),
          lowPrice: parseFloat(d.lowPrice),
          openPrice: parseFloat(d.openPrice),
          count: d.count,
          bidPrice: parseFloat(d.bidPrice),
          askPrice: parseFloat(d.askPrice),
        }));
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }
}
