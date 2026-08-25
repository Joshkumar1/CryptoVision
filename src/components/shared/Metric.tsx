import { cn, getChangeColor, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  change?: number | null;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Metric({ label, value, change, size = "default", className }: MetricProps) {
  const sizeClasses = {
    sm: "text-sm",
    default: "text-lg font-bold tracking-tight",
    lg: "text-2xl font-extrabold tracking-tight",
  };

  const isPositive = change != null && change > 0;
  const isNegative = change != null && change < 0;

  return (
    <div
      className={cn(
        "group flex flex-col gap-1.5 p-3.5 rounded-xl bg-surface-1/70 border border-border/80 card-highlight hover:border-border-hover hover:bg-surface-1 transition-all duration-200",
        className
      )}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary group-hover:text-text-secondary transition-colors">
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <span className={cn("text-text-primary tabular leading-none", sizeClasses[size])}>
          {value}
        </span>
        {change != null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md tabular leading-none",
              isPositive
                ? "bg-positive/10 text-positive border border-positive/20"
                : isNegative
                ? "bg-negative/10 text-negative border border-negative/20"
                : "bg-surface-2 text-text-tertiary border border-border"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {formatPercentage(change)}
          </span>
        )}
      </div>
    </div>
  );
}
