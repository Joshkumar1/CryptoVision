import { useQuery } from "@tanstack/react-query";
import type { IntelligenceScore, RealityCheck, RedFlag } from "@/types";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "API error");
  return json.data as T;
}

// ── Intelligence Score ──────────────────────────────────────────────────────

export function useIntelligenceScore(coinId: string | undefined) {
  return useQuery({
    queryKey: ["intelligence", "score", coinId],
    queryFn: () => fetchJson<IntelligenceScore>(`/api/intelligence/${coinId}/score`),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// ── Reality Check ──────────────────────────────────────────────────────────

export function useRealityCheck(coinId: string | undefined) {
  return useQuery({
    queryKey: ["intelligence", "reality-check", coinId],
    queryFn: () => fetchJson<RealityCheck>(`/api/intelligence/${coinId}/reality-check`),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// ── Red Flags ──────────────────────────────────────────────────────────────

export function useRedFlags(coinId: string | undefined) {
  return useQuery({
    queryKey: ["intelligence", "red-flags", coinId],
    queryFn: () => fetchJson<RedFlag[]>(`/api/intelligence/${coinId}/red-flags`),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// ── Full Intelligence Bundle ───────────────────────────────────────────────

interface IntelligenceBundle {
  score: IntelligenceScore;
  realityCheck: RealityCheck;
  redFlags: RedFlag[];
  coinId: string;
}

export function useIntelligenceBundle(coinId: string | undefined) {
  return useQuery({
    queryKey: ["intelligence", "bundle", coinId],
    queryFn: () => fetchJson<IntelligenceBundle>(`/api/intelligence/${coinId}`),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
