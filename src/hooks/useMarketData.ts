import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Coin, MarketOverview, MarketRegime, CoinDetail, ChartDataPoint, TrendingCoin } from "@/types";

export function useMarketOverview() {
  return useQuery<{ overview: MarketOverview; regime: MarketRegime }>({
    queryKey: ["market", "overview"],
    queryFn: async () => {
      const { data } = await api.get("/market/overview");
      return data;
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

export function useCoins(page = 0, perPage = 50, currency = "usd") {
  return useQuery<Coin[]>({
    queryKey: ["market", "coins", page, perPage, currency],
    queryFn: async () => {
      const { data } = await api.get("/market/coins", {
        params: { page, per_page: perPage, currency, sparkline: true },
      });
      return data;
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

export function useTrending() {
  return useQuery<TrendingCoin[]>({
    queryKey: ["market", "trending"],
    queryFn: async () => {
      const { data } = await api.get("/market/trending");
      return data;
    },
    staleTime: 300_000,
  });
}

export function useCoinDetail(coinId: string) {
  return useQuery<CoinDetail>({
    queryKey: ["asset", coinId],
    queryFn: async () => {
      const { data } = await api.get(`/assets/${coinId}`);
      return data;
    },
    staleTime: 60_000,
    enabled: !!coinId,
  });
}

export function useCoinChart(coinId: string, days = "7") {
  return useQuery<ChartDataPoint[]>({
    queryKey: ["asset", coinId, "chart", days],
    queryFn: async () => {
      const { data } = await api.get(`/assets/${coinId}/chart`, { params: { days } });
      return data;
    },
    staleTime: 60_000,
    enabled: !!coinId,
  });
}

export interface TechnicalSummary {
  rsi: { value: number; signal: string };
  macd: { value: number; signal: number; histogram: number; trend: string };
  movingAverages: { sma20: number; sma50: number; aboveSma20: boolean; aboveSma50: boolean };
  bollingerBands: { upper: number; middle: number; lower: number; width: number; position: string };
  overall: { signal: string; bullishSignals: number; bearishSignals: number };
}

export function useTechnicalIndicators(coinId: string) {
  return useQuery<TechnicalSummary>({
    queryKey: ["asset", coinId, "technical"],
    queryFn: async () => {
      const { data } = await api.get(`/assets/${coinId}/technical`);
      return data;
    },
    staleTime: 120_000,
    enabled: !!coinId,
  });
}
