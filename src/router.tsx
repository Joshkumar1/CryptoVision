import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorBoundary, RouteErrorFallback } from "@/components/shared/ErrorBoundary";

// ── Dynamic Route-Based Code-Splitting ──
const ExploreModulePage = lazy(() =>
  import("@/pages/ExploreModulePage").then((m) => ({ default: m.ExploreModulePage }))
);
const ResearchModulePage = lazy(() =>
  import("@/pages/ResearchModulePage").then((m) => ({ default: m.ResearchModulePage }))
);
const AnalyzeModulePage = lazy(() =>
  import("@/pages/AnalyzeModulePage").then((m) => ({ default: m.AnalyzeModulePage }))
);
const OverviewPage = lazy(() =>
  import("@/pages/OverviewPage").then((m) => ({ default: m.OverviewPage }))
);
const OpportunitiesPage = lazy(() =>
  import("@/pages/OpportunitiesPage").then((m) => ({ default: m.OpportunitiesPage }))
);
const NewsPage = lazy(() =>
  import("@/pages/NewsPage").then((m) => ({ default: m.NewsPage }))
);
const MarketPage = lazy(() =>
  import("@/pages/MarketPage").then((m) => ({ default: m.MarketPage }))
);
const NarrativesPage = lazy(() =>
  import("@/pages/NarrativesPage").then((m) => ({ default: m.NarrativesPage }))
);
const ComparePage = lazy(() =>
  import("@/pages/ComparePage").then((m) => ({ default: m.ComparePage }))
);
const ResearchLabPage = lazy(() =>
  import("@/pages/ResearchLabPage").then((m) => ({ default: m.ResearchLabPage }))
);
const LearnPage = lazy(() =>
  import("@/pages/LearnPage").then((m) => ({ default: m.LearnPage }))
);
const AssetDetailPage = lazy(() =>
  import("@/pages/AssetDetailPage").then((m) => ({ default: m.AssetDetailPage }))
);
const WatchlistPage = lazy(() =>
  import("@/pages/WatchlistPage").then((m) => ({ default: m.WatchlistPage }))
);
const RiskRadarPage = lazy(() =>
  import("@/pages/RiskRadarPage").then((m) => ({ default: m.RiskRadarPage }))
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);
const TrustCenterPage = lazy(() =>
  import("@/pages/TrustCenterPage").then((m) => ({ default: m.TrustCenterPage }))
);
const DueDiligencePage = lazy(() =>
  import("@/pages/DueDiligencePage").then((m) => ({ default: m.DueDiligencePage }))
);
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const FlagshipLandingPage = lazy(() =>
  import("@/pages/FlagshipLandingPage").then((m) => ({ default: m.FlagshipLandingPage }))
);

export const router = createBrowserRouter([
  // ── Flagship Institutional Landing Page (abtc.com-style reference) ──
  {
    path: "/",
    errorElement: <RouteErrorFallback />,
    element: (
      <ErrorBoundary>
        <Suspense fallback={<LoadingState message="Connecting to CryptoVision Institutional..." />}>
          <FlagshipLandingPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/home",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/institutional",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/app",
    element: <Navigate to="/explore" replace />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingState message="Connecting to Terminal Auth..." />}>
        <LoginPage />
      </Suspense>
    ),
  },
  // ── Pro Terminal Workspace Routes (wrapped in AppShell) ──
  {
    element: <AppShell />,
    errorElement: <RouteErrorFallback />,
    children: [
      // ── Primary Asset Intelligence Modules ──
      {
        path: "explore",
        element: (
          <Suspense fallback={<LoadingState message="Loading Explore Market Intelligence..." />}>
            <ExploreModulePage />
          </Suspense>
        ),
      },
      {
        path: "research",
        element: (
          <Suspense fallback={<LoadingState message="Loading Research Asset Intelligence..." />}>
            <ResearchModulePage />
          </Suspense>
        ),
      },
      {
        path: "research/:assetId",
        element: (
          <Suspense fallback={<LoadingState message="Loading Research Asset Intelligence..." />}>
            <ResearchModulePage />
          </Suspense>
        ),
      },
      {
        path: "analyze",
        element: (
          <Suspense fallback={<LoadingState message="Loading Quantitative Analysis Workspace..." />}>
            <AnalyzeModulePage />
          </Suspense>
        ),
      },
      {
        path: "analyze/:assetId",
        element: (
          <Suspense fallback={<LoadingState message="Loading Quantitative Analysis Workspace..." />}>
            <AnalyzeModulePage />
          </Suspense>
        ),
      },
      {
        path: "overview",
        element: <Navigate to="/explore" replace />,
      },
      {
        path: "discover",
        element: <Navigate to="/explore" replace />,
      },
      { path: "opportunities", element: <Navigate to="/discover" replace /> },
      {
        path: "news",
        element: (
          <Suspense fallback={<LoadingState message="Connecting News Catalysts..." />}>
            <NewsPage />
          </Suspense>
        ),
      },
      { path: "newsreel", element: <Navigate to="/news?tab=newsreel" replace /> },

      {
        path: "projects",
        element: (
          <Suspense fallback={<LoadingState message="Loading Projects Heatmap..." />}>
            <MarketPage />
          </Suspense>
        ),
      },
      { path: "market", element: <Navigate to="/projects" replace /> },
      {
        path: "narratives",
        element: (
          <Suspense fallback={<LoadingState message="Loading Narratives..." />}>
            <NarrativesPage />
          </Suspense>
        ),
      },
      {
        path: "compare",
        element: (
          <Suspense fallback={<LoadingState message="Loading Comparison Lab..." />}>
            <ComparePage />
          </Suspense>
        ),
      },
      {
        path: "research-lab",
        element: (
          <Suspense fallback={<LoadingState message="Loading Research Lab..." />}>
            <ResearchLabPage />
          </Suspense>
        ),
      },
      { path: "ai-research", element: <Navigate to="/research-lab" replace /> },
      { path: "backtest", element: <Navigate to="/research-lab" replace /> },
      {
        path: "learn",
        element: (
          <Suspense fallback={<LoadingState message="Loading Financial Modeling Lab..." />}>
            <LearnPage />
          </Suspense>
        ),
      },

      // ── Detail, Wizard & Utility Routes ──
      {
        path: "asset/:coinId",
        element: (
          <Suspense fallback={<LoadingState message="Loading Asset Intelligence Station..." />}>
            <AssetDetailPage />
          </Suspense>
        ),
      },
      {
        path: "due-diligence",
        element: (
          <Suspense fallback={<LoadingState message="Loading Due-Diligence Wizard..." />}>
            <DueDiligencePage />
          </Suspense>
        ),
      },
      {
        path: "watchlist",
        element: (
          <Suspense fallback={<LoadingState message="Loading Portfolio & Watchlist..." />}>
            <WatchlistPage />
          </Suspense>
        ),
      },
      {
        path: "risk",
        element: (
          <Suspense fallback={<LoadingState message="Loading Risk Radar..." />}>
            <RiskRadarPage />
          </Suspense>
        ),
      },
      {
        path: "trust",
        element: (
          <Suspense fallback={<LoadingState message="Loading Trust Center..." />}>
            <TrustCenterPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<LoadingState message="Loading System Settings..." />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
