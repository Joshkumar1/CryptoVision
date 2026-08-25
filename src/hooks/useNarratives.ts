import { useQuery } from "@tanstack/react-query";
import type { Narrative } from "@/types";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useNarratives() {
  return useQuery({
    queryKey: ["narratives", "all"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/narratives`);
      if (!res.ok) throw new Error("Failed to load narratives");
      const json = await res.json();
      return json.data as Narrative[];
    },
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}

export function useNarrative(narrativeId: string | undefined) {
  return useQuery({
    queryKey: ["narratives", narrativeId],
    queryFn: async () => {
      const res = await fetch(`${API}/api/narratives/${narrativeId}`);
      if (!res.ok) throw new Error("Narrative not found");
      const json = await res.json();
      return json.data as Narrative;
    },
    enabled: !!narrativeId,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}
