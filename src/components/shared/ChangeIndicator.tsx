import { cn, formatPercentage, getChangeColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ChangeIndicatorProps {
  value: number | null | undefined;
  className?: string;
}

export function ChangeIndicator({ value, className }: ChangeIndicatorProps) {
  if (value == null) return <span className="text-text-muted">—</span>;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", getChangeColor(value), className)}>
      <Icon className="h-3 w-3" />
      {formatPercentage(value)}
    </span>
  );
}
