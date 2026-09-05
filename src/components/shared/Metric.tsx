import { cn, formatPercentage } from "@/lib/utils";
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
    sm: "text-base font-bold",
    default: "text-xl sm:text-2xl font-black tracking-tight",
    lg: "text-2xl sm:text-3xl font-black tracking-tight",
  };

  const isPositive = change != null && change > 0;
  const isNegative = change != null && change < 0;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between gap-3 p-4 sm:p-5 rounded-2xl serene-card border border-white/10 hover:border-white/20 transition-all duration-200 shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
          {label}
        </span>
        {change != null && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full tabular leading-none",
              isPositive
                ? "bg-[#00dc82]/10 text-[#00dc82] border border-[#00dc82]/20"
                : isNegative
                ? "bg-[#ff5b5b]/10 text-[#ff5b5b] border border-[#ff5b5b]/20"
                : "bg-white/5 text-white/50 border border-white/10"
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

      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("text-white tabular leading-none", sizeClasses[size])}>
          {value}
        </span>
      </div>
    </div>
  );
}
