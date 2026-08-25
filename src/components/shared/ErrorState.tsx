import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Service temporarily unavailable",
  description = "Could not connect to data provider. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-negative/5 border border-negative/20 card-highlight",
        className
      )}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute h-14 w-14 rounded-2xl bg-negative/20 blur-lg" />
        <div className="relative rounded-2xl bg-negative/15 border border-negative/30 p-4 shadow-sm">
          <AlertTriangle className="h-7 w-7 text-negative" />
        </div>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-text-tertiary max-w-sm leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5 gap-2" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
