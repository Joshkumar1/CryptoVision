import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import {
  LayoutDashboard,
  Compass,
  Newspaper,
  Layers,
  BarChart3,
  GitCompareArrows,
  FlaskConical,
  GraduationCap,
  ShieldAlert,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Flame,
} from "lucide-react";

// Primary Navigation according to Product Identity:
// Home | Discover | News | Projects | Narratives | Compare | Research Lab | Learn
const PRIMARY_NAV = [
  { label: "Dashboard",    href: "/overview",     icon: LayoutDashboard },
  { label: "Discover",     href: "/discover",     icon: Compass },
  { label: "News",         href: "/news",         icon: Newspaper },
  { label: "Projects",     href: "/projects",     icon: BarChart3 },
  { label: "Narratives",   href: "/narratives",   icon: Layers },
  { label: "Compare",      href: "/compare",      icon: GitCompareArrows },
  { label: "Research Lab", href: "/research-lab", icon: FlaskConical },
  { label: "Learn",        href: "/learn",        icon: GraduationCap },
];

const UTILITY_NAV = [
  { label: "Watchlist",       href: "/watchlist",     icon: Star },
  { label: "Risk Radar",      href: "/risk",          icon: ShieldAlert },
  { label: "Due Diligence",   href: "/due-diligence", icon: Sparkles },
  { label: "Trust Center",    href: "/trust",         icon: ShieldAlert },
];

const BOTTOM_ITEMS = [
  { label: "Trends Newsreel", href: "/news?tab=newsreel", icon: Flame },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, watchlist } = useAppStore();

  const isActive = (href: string) => {
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      return location.pathname === path && location.search.includes(query);
    }
    if (href === "/overview" && location.pathname === "/") return true;
    if (href === "/projects" && (location.pathname === "/projects" || location.pathname === "/market")) return true;
    if (href === "/discover" && (location.pathname === "/discover" || location.pathname === "/opportunities")) return true;
    if (href === "/research-lab" && (location.pathname === "/research-lab" || location.pathname === "/ai-research" || location.pathname === "/backtest")) return true;
    if (href === "/news" && location.pathname === "/news" && location.search.includes("tab=newsreel")) return false;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col",
        "border-r border-white/10 bg-[#080b12]/80 backdrop-blur-2xl shadow-[4px_0_30px_rgba(0,0,0,0.6)]",
        "transition-all duration-250 ease-out",
        sidebarCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Brand Logo & Name (Editorial Flagship Link) */}
      <Link
        to="/"
        title="Return to Flagship"
        className="flex h-[64px] items-center gap-2.5 px-4 border-b border-white/10 flex-shrink-0 group hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black font-serif italic font-bold text-xs shadow-md transition-transform group-hover:scale-105">
          ✦
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight flex items-center leading-none">
              CryptoVision
            </span>
            <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase mt-1">
              Institutional AI
            </span>
          </div>
        )}
      </Link>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5 no-scrollbar">
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-white/40">
              Workspace
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all duration-200",
                      active
                        ? "bg-white/[0.09] backdrop-blur-md text-white font-semibold border border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.18)]"
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white font-medium hover:border hover:border-white/5"
                    )}
                  >
                    <item.icon className={cn("shrink-0", sidebarCollapsed ? "h-4.5 w-4.5" : "h-4 w-4", active ? "text-[#00dc82]" : "text-white/60")} />
                    {!sidebarCollapsed && (
                      <div className="flex items-center justify-between flex-1 truncate">
                        <span className="truncate">{item.label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82] shadow-[0_0_8px_#00dc82]" />}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Utilities: Watchlist & Risk Radar */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-white/40">
              Analysis & Due Diligence
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {UTILITY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all duration-200",
                      active
                        ? "bg-white/10 text-white font-semibold border border-white/15 shadow-sm"
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white font-medium"
                    )}
                  >
                    <item.icon className={cn("shrink-0", sidebarCollapsed ? "h-4.5 w-4.5" : "h-4 w-4", active ? "text-[#00dc82]" : "text-white/60")} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.href === "/watchlist" && watchlist.length > 0 && (
                          <span className="text-[10px] font-mono font-semibold bg-white/10 text-[#00dc82] border border-white/10 rounded-full px-2 py-0.5 leading-none">
                            {watchlist.length}
                          </span>
                        )}
                        {active && item.href !== "/watchlist" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00dc82]" />
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Bottom Settings & Collapse */}
      <div className="border-t border-white/10 px-2.5 py-3 space-y-1">
        {/* Link back to Flagship Landing */}
        <Link
          to="/"
          title={sidebarCollapsed ? "Flagship Editorial" : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-all font-medium"
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center font-serif text-[11px] text-white">✦</span>
          {!sidebarCollapsed && <span className="flex-1 text-xs">Flagship Canvas</span>}
        </Link>

        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all duration-200",
                active
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white font-medium"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-[#00dc82]" : "text-white/60")} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-white/40 hover:text-white hover:bg-white/[0.04] transition-all duration-150 mt-1"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="text-[11px] font-mono">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
