import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { EvidenceDrawer } from "@/components/shared/EvidenceDrawer";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";

export function AppShell() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(79,142,247,0.055) 0%, transparent 70%)",
        }}
      />

      <Sidebar />

      <main
        className={cn(
          "relative flex-1 flex flex-col transition-all duration-250 ease-out z-10",
          sidebarCollapsed ? "ml-[60px]" : "ml-[220px]"
        )}
      >
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Global Evidence Provenance Drawer */}
      <EvidenceDrawer />
    </div>
  );
}

