import { useQuery } from "@tanstack/react-query";
import type { EmergingProject } from "@/types";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface EmergingResponse {
  projects: EmergingProject[];
  beforeTheHype: EmergingProject[];
  total: number;
  computedAt: string;
}

export function useEmergingProjects() {
  return useQuery({
    queryKey: ["emerging", "all"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/emerging`);
      if (!res.ok) throw new Error("Failed to load emerging projects");
      const json = await res.json();
      return json.data as EmergingResponse;
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useBeforeTheHype() {
  return useQuery({
    queryKey: ["emerging", "before-the-hype"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/emerging/before-the-hype`);
      if (!res.ok) throw new Error("Failed to load before-the-hype");
      const json = await res.json();
      return json.data as EmergingProject[];
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
