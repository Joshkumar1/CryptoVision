import { cn } from "@/lib/utils";

interface MetricGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricGroup({ children, className }: MetricGroupProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", className)}>
      {children}
    </div>
  );
}
