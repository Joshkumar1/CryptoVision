import { cn } from "@/lib/utils";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-surface-1/40 border border-border/60 card-highlight",
        className
      )}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute h-14 w-14 rounded-2xl bg-accent/10 blur-lg" />
        <div className="relative rounded-2xl bg-surface-2/90 border border-border p-4 shadow-sm">
          <Icon className="h-7 w-7 text-accent" />
        </div>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-text-tertiary max-w-sm leading-relaxed">{description}</p>
      {action && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
