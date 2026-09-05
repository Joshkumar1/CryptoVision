import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { EvidenceDrawer } from "@/components/shared/EvidenceDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function AppShell() {
  const { sidebarCollapsed, theme } = useAppStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="relative flex min-h-screen bg-[#080809] text-white selection:bg-white selection:text-black antialiased overflow-x-hidden transition-colors duration-300 font-ranade inner-app">
      <ScrollToTop />

      {/* ══════════════════════════════════════════════════════════
          ── LUMINOUS GLASSMORPHIC BACKDROP ──
          ══════════════════════════════════════════════════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
        {/* Subtle Cyber Grid Texture */}
        <div className="absolute inset-0 glass-grid-pattern opacity-20" />

        {/* Ambient Radiant Glow Orbs for Rich Glass Refraction */}
        <div className="absolute -top-[10%] right-[15%] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#00dc82]/12 via-emerald-600/[0.06] to-transparent blur-[140px]" />
        <div className="absolute top-[25%] -left-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-purple-600/10 via-indigo-500/[0.05] to-transparent blur-[160px]" />
        <div className="absolute bottom-[5%] right-[5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-cyan-500/10 via-teal-500/[0.04] to-transparent blur-[150px]" />
        <div className="absolute bottom-[30%] left-[25%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-amber-500/[0.05] to-transparent blur-[160px]" />
      </div>

      {/* Glass Sidebar */}
      <Sidebar />

      {/* Main Glass Viewport */}
      <main
        className={cn(
          "relative flex-1 flex flex-col min-w-0 transition-all duration-250 ease-out z-10",
          sidebarCollapsed ? "ml-[60px]" : "ml-[220px]"
        )}
      >
        <Header />
        <div className="flex-1 p-4 sm:p-6 lg:p-7">
          <Outlet />
        </div>
      </main>

      {/* Global Evidence Provenance Drawer */}
      <EvidenceDrawer />

      {/* Global Authentication Modal with Crypto Trends Newsreel */}
      <AuthModal />
    </div>
  );
}
