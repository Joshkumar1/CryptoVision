import { useQuery } from "@tanstack/react-query";
import type { Narrative } from "@/types";

const API = import.meta.env.VITE_API_URL || "";

const FALLBACK_NARRATIVES: any[] = [
  {
    id: "ai-crypto",
    name: "AI & Crypto",
    description: "Projects combining artificial intelligence with blockchain infrastructure.",
    emoji: "🤖",
    coinIds: ["fetch-ai", "near", "render-token", "bittensor"],
    momentum: 8.5,
    strength: 88,
    weekChange: 6.2,
    monthChange: 14.5,
    assetCount: 9,
  },
  {
    id: "rwa",
    name: "Real World Assets",
    description: "Tokenization of real-world assets including real estate, bonds, and commodities.",
    emoji: "🏦",
    coinIds: ["ondo-finance", "centrifuge", "goldfinch"],
    momentum: 5.2,
    strength: 82,
    weekChange: 4.1,
    monthChange: 9.8,
    assetCount: 7,
  },
  {
    id: "depin",
    name: "DePIN",
    description: "Decentralized Physical Infrastructure Networks — incentivizing real-world hardware.",
    emoji: "📡",
    coinIds: ["helium", "filecoin", "render-token", "akash-network"],
    momentum: 4.8,
    strength: 79,
    weekChange: 3.5,
    monthChange: 8.2,
    assetCount: 8,
  },
  {
    id: "l1",
    name: "Layer 1 Blockchains",
    description: "Base layer blockchain networks providing security and settlement.",
    emoji: "⛓️",
    coinIds: ["bitcoin", "ethereum", "solana", "avalanche-2"],
    momentum: 3.9,
    strength: 75,
    weekChange: 2.8,
    monthChange: 7.1,
    assetCount: 14,
  },
  {
    id: "defi",
    name: "DeFi",
    description: "Decentralized financial protocols including DEXs, lending, and derivatives.",
    emoji: "💱",
    coinIds: ["uniswap", "aave", "maker", "synthetix-network-token"],
    momentum: 2.1,
    strength: 68,
    weekChange: 1.4,
    monthChange: 4.9,
    assetCount: 13,
  },
];

export function useNarratives() {
  return useQuery({
    queryKey: ["narratives", "all"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API}/api/narratives`);
        if (!res.ok) throw new Error("Failed to load narratives");
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data as Narrative[];
        }
        return FALLBACK_NARRATIVES as Narrative[];
      } catch (err) {
        console.warn("Using resilient fallback for narratives:", err);
        return FALLBACK_NARRATIVES as Narrative[];
      }
    },
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}

export function useNarrative(narrativeId: string | undefined) {
  return useQuery({
    queryKey: ["narratives", narrativeId],
    queryFn: async () => {
      try {
        const res = await fetch(`${API}/api/narratives/${narrativeId}`);
        if (!res.ok) throw new Error("Narrative not found");
        const json = await res.json();
        return json.data as Narrative;
      } catch (err) {
        const found = FALLBACK_NARRATIVES.find((n) => n.id === narrativeId);
        if (found) return found as Narrative;
        throw err;
      }
    },
    enabled: !!narrativeId,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}
