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

  // Select gradient colors based on score threshold
  const gradColors =
    score >= 80
      ? { start: "#2dd4a7", stop: "#6ee7d0", glow: "rgba(45, 212, 167, 0.3)" }
      : score >= 60
      ? { start: "#4f8ef7", stop: "#9abcff", glow: "rgba(79, 142, 247, 0.3)" }
      : score >= 40
      ? { start: "#f0a429", stop: "#fbbe4d", glow: "rgba(240, 164, 41, 0.3)" }
      : { start: "#f25c5c", stop: "#ff8c8c", glow: "rgba(242, 92, 92, 0.3)" };

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
