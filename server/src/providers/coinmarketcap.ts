/**
 * CoinMarketCap Provider Adapter
 * SECONDARY market data source for cross-validation.
 * Implements MarketDataProvider interface.
 */

import { HttpClient } from "../infra/httpClient.js";
import { config } from "../config/env.js";
import { recordProviderSuccess, recordProviderError } from "../monitoring/providerHealth.js";
import type {
  MarketDataProvider,
  GlobalMarketData,
  CoinsMarketOptions,
  ProviderCoinMarket,
  ProviderCoinDetail,
  ProviderChartPoint,
  ProviderTrendingCoin,
  ProviderSearchResult,
} from "./interfaces.js";

export class CoinMarketCapProvider implements MarketDataProvider {
  readonly name = "coinmarketcap";
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient({
      provider: "coinmarketcap",
      baseUrl: config.coinmarketcap.baseUrl,
      headers: config.coinmarketcap.hasKey
        ? { "X-CMC_PRO_API_KEY": config.coinmarketcap.apiKey }
        : {},
      timeout: 10_000,
    });
  }

  async getGlobalMarketData(): Promise<GlobalMarketData | null> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/v1/global-metrics/quotes/latest",
        {},
        "MARKET"
      );
      if (!result) return null;

      const d = result.data?.data;
      if (!d) return null;

      const quote = d.quote?.USD;
      if (!quote) return null;

      recordProviderSuccess(this.name, Date.now() - start);

      return {
        totalMarketCap: quote.total_market_cap || 0,
        totalVolume: quote.total_volume_24h || 0,
        btcDominance: d.btc_dominance || 0,
        ethDominance: d.eth_dominance || 0,
        activeCryptocurrencies: d.active_cryptocurrencies || 0,
        marketCapChangePercentage24h: quote.total_market_cap_yesterday_percentage_change || 0,
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  async getCoinsMarket(options: CoinsMarketOptions = {}): Promise<ProviderCoinMarket[]> {
    const { page = 0, perPage = 50, currency = "USD" } = options;
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/v1/cryptocurrency/listings/latest",
        {
          start: page * perPage + 1,
          limit: perPage,
          convert: currency.toUpperCase(),
          sort: "market_cap",
          sort_dir: "desc",
        },
        "MARKET"
      );

      if (!result?.data?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.data.map((coin: any): ProviderCoinMarket => {
        const quote = coin.quote?.[currency.toUpperCase()] || {};
        return {
          id: String(coin.id),
          symbol: coin.symbol,
          name: coin.name,
          image: null as any,
          currentPrice: quote.price || 0,
          marketCap: quote.market_cap || 0,
          marketCapRank: coin.cmc_rank || 0,
          fdv: quote.fully_diluted_market_cap || null,
          volume24h: quote.volume_24h || 0,
          high24h: null,
          low24h: null,
          priceChange24h: quote.volume_change_24h || 0,
          priceChangePercent24h: quote.percent_change_24h || 0,
          priceChangePercent1h: quote.percent_change_1h || null,
          priceChangePercent7d: quote.percent_change_7d || null,
          circulatingSupply: coin.circulating_supply || 0,
          totalSupply: coin.total_supply || null,
          maxSupply: coin.max_supply || null,
          ath: null,
          athChangePercent: null,
          sparkline7d: null,
        };
      });
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return [];
    }
  }

  async getCoinDetail(coinId: string): Promise<ProviderCoinDetail | null> {
    const start = Date.now();
    try {
      // CMC uses numeric IDs; this param also accepts slug
      const result = await this.client.get<any>(
        "/v2/cryptocurrency/info",
        { id: coinId },
        "MARKET"
      );
      if (!result?.data?.data) return null;

      const coin = Object.values(result.data.data)[0] as any;
      if (!coin) return null;

      recordProviderSuccess(this.name, Date.now() - start);

      return {
        id: String(coin.id),
        symbol: coin.symbol,
        name: coin.name,
        description: coin.description || "",
        image: coin.logo || "",
        marketCapRank: null,
        links: {
          homepage: coin.urls?.website || [],
          blockchain: coin.urls?.explorer || [],
          repos: coin.urls?.source_code || [],
        },
        marketData: {
          currentPrice: 0,
          marketCap: 0,
          fdv: null,
          volume24h: 0,
          high24h: null,
          low24h: null,
          priceChangePercent24h: 0,
          priceChangePercent7d: null,
          priceChangePercent30d: null,
          priceChangePercent1y: null,
          ath: null,
          athChangePercent: null,
          atl: null,
          circulatingSupply: 0,
          totalSupply: null,
          maxSupply: null,
        },
      };
    } catch (err: any) {
      recordProviderError(this.name, err.message);
      return null;
    }
  }

  async getCoinChart(_coinId: string, _days: number): Promise<ProviderChartPoint[]> {
    // CMC historical endpoint requires paid plan — return empty
    return [];
  }

  async getTrending(): Promise<ProviderTrendingCoin[]> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/v1/cryptocurrency/trending/latest",
        { limit: 10, convert: "USD" },
        "MARKET"
      );
      if (!result?.data?.data) return [];

      recordProviderSuccess(this.name, Date.now() - start);

      return result.data.data.map((coin: any): ProviderTrendingCoin => ({
        id: String(coin.id),
        name: coin.name,
        symbol: coin.symbol,
        marketCapRank: coin.cmc_rank || null,
        thumb: coin.logo || "",
      }));
    } catch {
      return [];
    }
  }

  async search(query: string): Promise<ProviderSearchResult> {
    // CMC doesn't have a dedicated search endpoint on free tier
    // Use the mapping data instead
    return { coins: [] };
  }

  async getSimplePrices(coinIds: string[], currency = "USD"): Promise<Record<string, number>> {
    const start = Date.now();
    try {
      const result = await this.client.get<any>(
        "/v1/cryptocurrency/quotes/latest",
        {
          id: coinIds.join(","),
          convert: currency.toUpperCase(),
        },
        "REALTIME"
      );
      if (!result?.data?.data) return {};

      recordProviderSuccess(this.name, Date.now() - start);

      const prices: Record<string, number> = {};
      for (const [id, coin] of Object.entries(result.data.data) as any[]) {
        prices[id] = coin.quote?.[currency.toUpperCase()]?.price || 0;
      }
      return prices;
    } catch {
      return {};
    }
  }
}
