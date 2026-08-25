import { useState } from "react";
import { motion } from "framer-motion";
import { AiResearchPage } from "@/pages/AiResearchPage";
import { BacktestPage } from "@/pages/BacktestPage";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FlaskConical, Bot, LineChart, Sliders } from "lucide-react";

export function ResearchLabPage() {
  const [activeLabTab, setActiveLabTab] = useState<"ai-analyst" | "backtest">("ai-analyst");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header & Lab Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/20">
              <FlaskConical className="h-5 w-5 text-accent animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              CryptoVision Research Lab
            </h1>
            <Badge variant="mint" className="text-[10px] uppercase font-bold">
              Quantitative Suite
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-tertiary ml-11">
            Institutional AI research memorandum generator, multi-strategy algorithmic backtester, and scenario stress-tester.
          </p>
        </div>

        {/* Lab Mode Toggle */}
        <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            onClick={() => setActiveLabTab("ai-analyst")}
            className={cn(
              "flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all",
              activeLabTab === "ai-analyst"
                ? "bg-accent text-white shadow-sm"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
            )}
          >
            <Bot className="h-4 w-4" />
            AI Research Analyst
          </button>
          <button
            onClick={() => setActiveLabTab("backtest")}
            className={cn(
              "flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all",
              activeLabTab === "backtest"
                ? "bg-accent text-white shadow-sm"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface-2"
            )}
          >
            <LineChart className="h-4 w-4" />
            Strategy Backtest Lab
          </button>
        </div>
      </div>

      {/* ── Active Lab View ── */}
      {activeLabTab === "ai-analyst" ? <AiResearchPage /> : <BacktestPage />}
    </div>
  );
}
