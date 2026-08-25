import { Clock } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

interface DataFreshnessProps {
  timestamp: Date | string;
  className?: string;
}

export function DataFreshness({ timestamp, className }: DataFreshnessProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] text-text-muted", className)}>
      <Clock className="h-3 w-3" />
      Updated {timeAgo(timestamp)}
    </span>
  );
}
