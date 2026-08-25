import { cn } from "@/lib/utils";

export function ConfidenceBadge({ value, className }: { value: number; className?: string }) {
  const color = value >= 70 ? "text-positive" : value >= 40 ? "text-warning" : "text-negative";
  return (
    <span className={cn("text-xs font-medium", color, className)}>
      {value}% confidence
    </span>
  );
}
