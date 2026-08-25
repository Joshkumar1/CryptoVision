import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface NewsCatalyst {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  impactedCoins: Array<{ id: string; name: string; symbol: string }>;
  category: "REGULATORY" | "DEVELOPMENT" | "TOKENOMICS" | "EXPLOIT_SECURITY" | "INSTITUTIONAL" | "ECOSYSTEM";
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL" | "HIGH_VOLATILITY";
  verificationVerdict: "VERIFIED_ON_CHAIN" | "SPECULATIVE_CLAIM" | "CONFIRMED_FUD" | "OFFICIAL_STATEMENT";
  claimAudit: {
    claim: string;
    onChainEvidence: string;
    verdictBadge: "SUPPORTED" | "CONTRADICTED" | "MIXED" | "UNVERIFIED";
  };
  systemImpact: {
    feedsRealityCheck: boolean;
    feedsRiskRadar: boolean;
    feedsBeforeTheHype: boolean;
    feedsAiAnalyst: boolean;
    impactSummary: string;
  };
}

export function useNewsCatalysts(category?: string, coinId?: string) {
  return useQuery<NewsCatalyst[]>({
    queryKey: ["news", category ?? "ALL", coinId ?? "ALL"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "ALL") params.append("category", category);
      if (coinId) params.append("coinId", coinId);

      const res = await fetch(`${API}/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch news catalysts");
      const json = await res.json();
      return json.data as NewsCatalyst[];
    },
    staleTime: 60 * 1000,
  });
}

export function useCoinNewsImpact(coinId: string | undefined) {
  return useQuery<NewsCatalyst[]>({
    queryKey: ["news", "impact", coinId],
    queryFn: async () => {
      if (!coinId) return [];
      const res = await fetch(`${API}/api/news/impact/${coinId}`);
      if (!res.ok) throw new Error("Failed to fetch coin news impact");
      const json = await res.json();
      return json.data as NewsCatalyst[];
    },
    enabled: !!coinId,
    staleTime: 60 * 1000,
  });
}
