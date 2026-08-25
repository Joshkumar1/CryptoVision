import { cn } from "@/lib/utils";

const strengthColors = {
  Weak: { dot: "bg-red-400", text: "text-red-400" },
  Moderate: { dot: "bg-amber-400", text: "text-amber-400" },
  Strong: { dot: "bg-emerald-400", text: "text-emerald-400" },
};

export function SignalBadge({ strength, className }: { strength: "Weak" | "Moderate" | "Strong"; className?: string }) {
  const c = strengthColors[strength];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      <span className={c.text}>{strength}</span>
    </span>
  );
}
