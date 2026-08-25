import { cn, getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ScoreRing({ score, size = 64, strokeWidth = 5, label, className }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  const gradId = `score-grad-${Math.round(score)}-${size}`;

  // Select gradient colors based on score threshold in Gold & Deep Purple theme
  const gradColors =
    score >= 80
      ? { start: "#f5c542", stop: "#fef08a", glow: "rgba(245, 197, 66, 0.45)" } // Imperial Gold
      : score >= 60
      ? { start: "#a855f7", stop: "#e9d5ff", glow: "rgba(168, 85, 247, 0.40)" } // Amethyst Purple
      : score >= 40
      ? { start: "#d97706", stop: "#fbbf24", glow: "rgba(217, 119, 6, 0.35)" } // Amber
      : { start: "#f43f5e", stop: "#fda4af", glow: "rgba(244, 63, 94, 0.35)" }; // Rose Crimson

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-1.5", className)}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradColors.start} />
              <stop offset="100%" stopColor={gradColors.stop} />
            </linearGradient>
            <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={gradColors.glow} />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-surface-2/80"
          />

          {/* Active Score Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={`url(#${gradId})`}
            filter={`url(#glow-${gradId})`}
            className="fill-none ring-score"
          />
        </svg>

        {/* Center Score Text */}
        <span
          className={cn(
            "absolute text-sm font-extrabold tabular leading-none",
            getScoreColor(score)
          )}
        >
          {score}
        </span>
      </div>

      {label && (
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
