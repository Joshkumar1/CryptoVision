import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

// Accepts both uppercase ("HIGH", "VERY_HIGH") and capitalized ("High") formats
const riskColors: Record<string, string> = {
  // Uppercase variants (from backend)
  LOW:       "bg-positive-muted text-positive",
  MODERATE:  "bg-warning-muted text-warning",
  HIGH:      "bg-orange-500/15 text-orange-400",
  VERY_HIGH: "bg-negative-muted text-negative",
  // Capitalized variants (legacy)
  Low:        "bg-positive-muted text-positive",
  Medium:     "bg-warning-muted text-warning",
  "Very High": "bg-negative-muted text-negative",
};

const riskLabels: Record<string, string> = {
  LOW:       "Low Risk",
  MODERATE:  "Moderate",
  HIGH:      "High Risk",
  VERY_HIGH: "Very High",
};

export function RiskBadge({ level, className }: { level: string; className?: string }) {
  const label = riskLabels[level] ?? level.replace("_", " ");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        riskColors[level] || "bg-surface-2 text-text-secondary",
        className
      )}
    >
      {label}
    </span>
  );
}
