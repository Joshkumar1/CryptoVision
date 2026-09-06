import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ExpertiseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface ExpertiseState {
  level: ExpertiseLevel;
  setLevel: (level: ExpertiseLevel) => void;
}

export const useExpertiseStore = create<ExpertiseState>()(
  persist(
    (set) => ({
      level: "INTERMEDIATE",
      setLevel: (level: ExpertiseLevel) => set({ level }),
    }),
    {
      name: "cryptovision-expertise-level",
    }
  )
);
