import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading intelligence data...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 gap-4", className)}>
      <div className="relative flex items-center justify-center">
        {/* Glowing aura */}
        <div className="absolute h-10 w-10 rounded-full bg-accent/20 blur-md animate-pulse" />
        
        {/* Outer orbital ring */}
        <div className="h-9 w-9 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        
        {/* Inner dot */}
        <div className="absolute h-2.5 w-2.5 rounded-full bg-accent animate-ping opacity-75" />
      </div>
      <p className="text-xs font-medium text-text-tertiary tracking-wide uppercase">{message}</p>
    </div>
  );
}
