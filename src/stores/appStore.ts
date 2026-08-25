import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PortfolioHolding, CustomAlert, ResearchPersona, EvidenceAuditTrail } from "@/types";

interface AppState {
  sidebarCollapsed: boolean;
  searchQuery: string;
  currency: string;
  language: string;
  persona: ResearchPersona;
  watchlist: string[]; // coinIds
  holdings: PortfolioHolding[];
  alerts: CustomAlert[];
  evidenceModalData: EvidenceAuditTrail | null;

  toggleSidebar: () => void;
  setSearchQuery: (q: string) => void;
  setCurrency: (c: string) => void;
  setLanguage: (l: string) => void;
  setPersona: (p: ResearchPersona) => void;
  openEvidenceModal: (data: EvidenceAuditTrail) => void;
  closeEvidenceModal: () => void;
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  toggleWatchlist: (coinId: string) => void;
  isWatched: (coinId: string) => boolean;

  // Portfolio Actions
  addHolding: (holding: Omit<PortfolioHolding, "id">) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, updates: Partial<PortfolioHolding>) => void;

  // Alert Actions
  addAlert: (alert: Omit<CustomAlert, "id" | "createdAt" | "triggered">) => void;
  removeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      searchQuery: "",
      currency: "usd",
      language: "en",
      persona: "RESEARCH",
      evidenceModalData: null,
      watchlist: ["bitcoin", "ethereum", "solana"],
      holdings: [
        {
          id: "hold-1",
          coinId: "bitcoin",
          amount: 0.45,
          buyPrice: 62500,
          buyDate: "2024-03-15",
          notes: "DCA Core Position",
        },
        {
          id: "hold-2",
          coinId: "ethereum",
          amount: 3.2,
          buyPrice: 2850,
          buyDate: "2024-04-10",
          notes: "Staking allocation",
        },
        {
          id: "hold-3",
          coinId: "solana",
          amount: 25.0,
          buyPrice: 135,
          buyDate: "2024-05-01",
          notes: "Ecosystem play",
        },
      ],
      alerts: [
        {
          id: "alt-1",
          coinId: "bitcoin",
          coinName: "Bitcoin",
          type: "PRICE_ABOVE",
          targetValue: 100000,
          createdAt: new Date().toISOString(),
          triggered: false,
          message: "BTC target breakout above $100k",
        },
        {
          id: "alt-2",
          coinId: "solana",
          coinName: "Solana",
          type: "RSI_OVERSOLD",
          targetValue: 30,
          createdAt: new Date().toISOString(),
          triggered: false,
          message: "SOL RSI dip below 30 (accumulation)",
        },
      ],

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setPersona: (persona) => set({ persona }),
      openEvidenceModal: (evidenceModalData) => set({ evidenceModalData }),
      closeEvidenceModal: () => set({ evidenceModalData: null }),

      addToWatchlist: (coinId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(coinId) ? s.watchlist : [...s.watchlist, coinId],
        })),

      removeFromWatchlist: (coinId) =>
        set((s) => ({ watchlist: s.watchlist.filter((id) => id !== coinId) })),

      toggleWatchlist: (coinId) => {
        const { watchlist } = get();
        if (watchlist.includes(coinId)) {
          set({ watchlist: watchlist.filter((id) => id !== coinId) });
        } else {
          set({ watchlist: [...watchlist, coinId] });
        }
      },

      isWatched: (coinId) => get().watchlist.includes(coinId),

      // Portfolio Actions
      addHolding: (holding) =>
        set((s) => ({
          holdings: [
            ...s.holdings,
            {
              ...holding,
              id: `hold-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            },
          ],
        })),

      removeHolding: (id) =>
        set((s) => ({ holdings: s.holdings.filter((h) => h.id !== id) })),

      updateHolding: (id, updates) =>
        set((s) => ({
          holdings: s.holdings.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      // Alert Actions
      addAlert: (alert) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            {
              ...alert,
              id: `alt-${Date.now()}`,
              createdAt: new Date().toISOString(),
              triggered: false,
            },
          ],
        })),

      removeAlert: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

      dismissAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, triggered: true } : a)),
        })),
    }),
    {
      name: "cryptovision-store-v2",
      partialize: (state: AppState) => ({
        currency: state.currency,
        language: state.language,
        persona: state.persona,
        watchlist: state.watchlist,
        sidebarCollapsed: state.sidebarCollapsed,
        holdings: state.holdings,
        alerts: state.alerts,
      }),
    }
  )
);
