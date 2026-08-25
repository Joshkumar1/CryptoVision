import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNewsCatalysts, type NewsCatalyst } from "@/hooks/useNews";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";
import {
  Newspaper,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Brain,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
} from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Catalysts" },
  { id: "REGULATORY", label: "Regulatory" },
  { id: "DEVELOPMENT", label: "Dev Releases" },
  { id: "TOKENOMICS", label: "Token Unlocks" },
  { id: "EXPLOIT_SECURITY", label: "Security & Exploits" },
  { id: "INSTITUTIONAL", label: "Institutional Flows" },
];

const VERDICT_BADGES = {
  SUPPORTED: {
    label: "On-Chain Supported",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
    dot: "🟢",
  },
  CONTRADICTED: {
    label: "Contradicted / False",
    color: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: XCircle,
    dot: "🔴",
  },
  MIXED: {
    label: "Mixed Evidence",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
    dot: "🟡",
  },
  UNVERIFIED: {
    label: "Unverified Claim",
    color: "bg-surface-2 text-text-tertiary border-border",
    icon: HelpCircle,
    dot: "⚪",
  },
};

export function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const { data: catalysts, isLoading, error, refetch } = useNewsCatalysts(selectedCategory);

  if (isLoading) return <LoadingState message="Connecting live news catalyst intelligence stream..." />;
  if (error) return <ErrorState title="Catalyst Stream Offline" description="Could not load live news feeds." onRetry={() => refetch()} />;

  const filtered = (catalysts ?? []).filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.impactedCoins.some((coin) => coin.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-7 max-w-7xl mx-auto"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
              <Newspaper className="h-5 w-5 text-accent animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              News & Catalyst Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-tertiary ml-11">
            Don't just read headlines. We cross-examine public claims against verifiable on-chain evidence and feed our intelligence models.
          </p>
        </div>
      </div>

      {/* ── Architectural Interconnection Hero Banner ── */}
      <div className="p-5 rounded-2xl bg-surface-1 border border-accent/30 card-highlight shadow-md space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-accent/20 text-accent">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              Interconnected Signal Engine
              <Badge variant="mint" className="text-[9px] uppercase font-bold">
                Unified Intelligence
              </Badge>
            </h3>
            <p className="text-xs text-text-tertiary">
              News is not an isolated feed. Every event dynamically updates Reality Check, Risk Radar, and Early Signal scores.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span className="text-text-secondary font-medium">Feeds Reality Check</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-negative flex-shrink-0" />
            <span className="text-text-secondary font-medium">Feeds Risk Radar</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
            <Flame className="h-4 w-4 text-gold flex-shrink-0" />
            <span className="text-text-secondary font-medium">Feeds Before The Hype</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-0/80 border border-border/80 flex items-center gap-2">
            <Brain className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-text-secondary font-medium">Feeds AI Analyst Memos</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-1/70 p-3 rounded-2xl border border-border card-highlight">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input
            placeholder="Search news by keyword or token (e.g. ETF, unlock, Solana)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-surface-0 border-border"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-surface-0 p-1 rounded-xl border border-border">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                selectedCategory === cat.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── News Catalyst Cards ── */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const verdictMeta = VERDICT_BADGES[item.claimAudit.verdictBadge] ?? VERDICT_BADGES.UNVERIFIED;
          const VerdictIcon = verdictMeta.icon;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-surface-1/90 border border-border/80 hover:border-accent/40 transition-all card-highlight space-y-4 shadow-sm"
            >
              {/* Header: Source, Timestamp, and Category */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase border-border/80">
                    {item.category.replace("_", " ")}
                  </Badge>
                  <span className="text-text-tertiary font-semibold">{item.source}</span>
                  <span className="text-text-muted font-mono text-[10px]">
                    • {new Date(item.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Impacted Token Pills */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Impacted:</span>
                  {item.impactedCoins.map((c) => (
                    <Link
                      key={c.id}
                      to={`/asset/${c.id}`}
                      className="px-2 py-0.5 rounded-md bg-surface-0 border border-border hover:border-accent text-[11px] font-bold text-text-primary hover:text-accent transition-colors"
                    >
                      {c.symbol.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h3 className="text-base font-extrabold text-text-primary leading-snug tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mt-1.5">
                  {item.summary}
                </p>
              </div>

              {/* ── Claim vs. On-Chain Evidence Audit Box ── */}
              <div className="p-4 rounded-xl bg-surface-0/90 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Public Claim vs. Verifiable Reality
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-extrabold px-2 py-0.5 rounded-lg border flex items-center gap-1",
                      verdictMeta.color
                    )}
                  >
                    <VerdictIcon className="h-3 w-3" />
                    {verdictMeta.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface-1 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-0.5">
                      Public Claim / Media Story:
                    </span>
                    <span className="text-text-primary font-medium">"{item.claimAudit.claim}"</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-1 border border-border/60">
                    <span className="text-[10px] uppercase font-bold text-accent block mb-0.5">
                      On-Chain / Verifiable Telemetry:
                    </span>
                    <span className="text-text-secondary leading-relaxed">
                      {item.claimAudit.onChainEvidence}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Impact Footnote */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <span>
                    <strong>Model Integration:</strong> {item.systemImpact.impactSummary}
                  </span>
                </div>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                  >
                    View Official Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
