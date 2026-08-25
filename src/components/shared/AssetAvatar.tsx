import { cn } from "@/lib/utils";
import { useState } from "react";

interface AssetAvatarProps {
  image: string;
  name: string;
  symbol: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export function AssetAvatar({
  image,
  name,
  symbol,
  size = "md",
  showName = true,
  className,
}: AssetAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "h-7 w-7 ring-1 ring-border/80",
    md: "h-9 w-9 ring-1.5 ring-border/80",
    lg: "h-12 w-12 ring-2 ring-border/80",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {imgError ? (
        <div
          className={cn(
            "rounded-full gradient-accent flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0",
            sizeClasses[size]
          )}
        >
          {symbol.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img
          src={image}
          alt={name}
          className={cn(
            "rounded-full bg-surface-2 object-cover shadow-sm flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
            sizeClasses[size]
          )}
          onError={() => setImgError(true)}
        />
      )}
      {showName && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors leading-tight truncate">
            {name}
          </span>
          <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider">
            {symbol}
          </span>
        </div>
      )}
    </div>
  );
}
