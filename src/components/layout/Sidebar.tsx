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
} from "lucide-react";

// Primary Navigation according to Product Identity:
// Home | Discover | News | Projects | Narratives | Compare | Research Lab | Learn
const PRIMARY_NAV = [
  { label: "Home",         href: "/overview",     icon: LayoutDashboard },
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
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, watchlist } = useAppStore();

  const isActive = (href: string) => {
    if (href === "/overview" && location.pathname === "/") return true;
    if (href === "/projects" && (location.pathname === "/projects" || location.pathname === "/market")) return true;
    if (href === "/discover" && (location.pathname === "/discover" || location.pathname === "/opportunities")) return true;
    if (href === "/research-lab" && (location.pathname === "/research-lab" || location.pathname === "/ai-research" || location.pathname === "/backtest")) return true;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col",
        "border-r border-border glass",
        "transition-all duration-250 ease-out",
        sidebarCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Brand Logo & Name */}
      <div className="flex h-[56px] items-center gap-2.5 px-3.5 border-b border-border flex-shrink-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-accent glow-accent">
          <span className="text-white text-xs font-black tracking-tighter">CV</span>
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="text-sm font-extrabold text-text-primary tracking-tight gradient-text-accent flex items-center gap-1"
            >
              CryptoVision <span className="text-xs text-accent">AI</span>
            </motion.span>
          </div>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
              Explore & Investigate
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-150",
                      active
                        ? "bg-accent/12 text-accent font-bold nav-active-glow"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <item.icon className={cn("shrink-0", sidebarCollapsed ? "h-4.5 w-4.5" : "h-4 w-4")} />
                    {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Utilities: Watchlist & Risk Radar */}
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
              Monitoring
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {UTILITY_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-150",
                      active
                        ? "bg-accent/12 text-accent font-bold nav-active-glow"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                    )}
                  >
                    <item.icon className={cn("shrink-0", sidebarCollapsed ? "h-4.5 w-4.5" : "h-4 w-4")} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.href === "/watchlist" && watchlist.length > 0 && (
                          <span className="text-[10px] font-bold bg-gold/20 text-gold rounded-full px-1.5 py-0.5 leading-none tabular">
                            {watchlist.length}
                          </span>
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
      <div className="border-t border-border px-2 py-2 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-150",
                active
                  ? "bg-accent/12 text-accent font-bold"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-all duration-150"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
