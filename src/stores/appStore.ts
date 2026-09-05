import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PortfolioHolding,
  CustomAlert,
  ResearchPersona,
  EvidenceAuditTrail,
  UserProfile,
  UserThesis,
  ThesisHistoryEntry,
} from "@/types";

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
  theme: "light" | "dark";

  // ── Authentication & User Profile ──
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;

  // ── Living Thesis Memory ──
  theses: Record<string, UserThesis>;
  thesisHistory: Record<string, ThesisHistoryEntry[]>;

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
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Auth Actions
  login: (profile?: Partial<UserProfile>) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Portfolio Actions
  addHolding: (holding: Omit<PortfolioHolding, "id">) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, updates: Partial<PortfolioHolding>) => void;

  // Alert Actions
  addAlert: (alert: Omit<CustomAlert, "id" | "createdAt" | "triggered">) => void;
  removeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;

  // Thesis Actions
  saveThesis: (thesis: UserThesis) => void;
  addThesisHistoryEntry: (coinId: string, entry: ThesisHistoryEntry) => void;
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
      theme: "dark",
      user: {
        id: "usr-quant-01",
        name: "Alex Sterling",
        email: "alex.sterling@vanguard-quant.io",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Lead Portfolio Analyst",
        tier: "INSTITUTIONAL",
        persona: "RESEARCH",
      },
      isAuthenticated: true,
      isAuthModalOpen: false,
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
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),

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

      // Auth Actions
      login: (customUser) => {
        const defaultUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: "Institutional Investor",
          email: "analyst@cryptovision.ai",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          role: "Quant Strategist",
          tier: "INSTITUTIONAL",
          persona: "RESEARCH",
        };
        set({
          user: { ...defaultUser, ...customUser },
          isAuthenticated: true,
          isAuthModalOpen: false,
        });
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      // Thesis Actions
      theses: {
        bitcoin: {
          coinId: "bitcoin",
          title: "Sovereign Digital Store of Value Thesis",
          coreHypothesis: "Institutional ETF adoption and post-halving programmatic supply scarcity create structural upward price pressure.",
          keyAssumptions: [
            "Institutional inflows remain net positive across 12-month horizon",
            "Hash rate security expands despite reward halving",
            "No hostile global sovereign regulatory bans",
          ],
          expectedCatalysts: [
            "Corporate treasury balance sheet adoption announcements",
            "Global central bank interest rate easing cycle",
          ],
          majorRisks: [
            "Quantum computing cryptography timeline compression",
            "Macroeconomic liquidity squeeze and risk-off contagion",
          ],
          openQuestions: [
            "Will Layer 2 Bitcoin scaling (Lightning/BitVM) generate substantial protocol fee share?",
          ],
          lastUpdated: new Date().toISOString(),
        },
        solana: {
          coinId: "solana",
          title: "High-Throughput Global Execution Engine",
          coreHypothesis: "Monolithic architecture and Firedancer client achieve dominant retail and DeFi market share.",
          keyAssumptions: [
            "Network stability maintained with zero major cluster halts",
            "Fee revenue from priority fees exceeds hardware validator operational costs",
          ],
          expectedCatalysts: [
            "Firedancer validator client mainnet transition",
            "Institutional payments integration partnerships",
          ],
          majorRisks: [
            "Hardware requirement validator centralization",
            "Ecosystem incentive emission cliff tapering",
          ],
          openQuestions: [
            "Can economic fee capture sustain validator profitability without inflation subsidies?",
          ],
          lastUpdated: new Date().toISOString(),
        },
      },
      thesisHistory: {},

      saveThesis: (thesis) =>
        set((s) => ({
          theses: { ...s.theses, [thesis.coinId]: thesis },
        })),

      addThesisHistoryEntry: (coinId, entry) =>
        set((s) => ({
          thesisHistory: {
            ...s.thesisHistory,
            [coinId]: [...(s.thesisHistory[coinId] || []), entry],
          },
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
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        theses: state.theses,
        thesisHistory: state.thesisHistory,
      }),
    }
  )
);

