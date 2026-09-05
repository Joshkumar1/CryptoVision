import React from "react";

interface CircuitTraceProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  color?: string;
  className?: string;
  duration?: string;
}

export const CircuitTraceBackground: React.FC<CircuitTraceProps> = ({
  position = "top-right",
  color = "#00dc82",
  className = "",
  duration = "14s",
}) => {
  const isLeft = position.includes("left");
  const isBottom = position.includes("bottom");

  const pathId = `circuit-trace-${position}-${Math.random().toString(36).substr(2, 5)}`;

  // Paths modeled directly after abtc.com SVG circuit backbones
  const pathD = isLeft
    ? isBottom
      ? "M 0 220 L 0 140 L 120 140 L 120 40 L 400 40"
      : "M 0 0 L 350 0 L 350 60 L 60 60 L 60 180 L 0 180"
    : isBottom
    ? "M 400 0 L 400 120 L 320 120 L 320 180 L 50 180 L 50 0"
    : "M 0 0 L 280 0 L 280 80 L 340 80 L 340 200 L 400 200";

  return (
    <div
      className={`pointer-events-none absolute hidden md:block overflow-visible select-none ${
        isLeft ? "left-0" : "right-0"
      } ${isBottom ? "bottom-0" : "top-0"} ${className}`}
      style={{ width: "32%", height: "180px" }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full opacity-35"
        viewBox="0 0 400 220"
        fill="none"
        stroke="rgba(52, 211, 153, 0.35)"
        strokeWidth="1.2"
      >
        <path id={pathId} d={pathD} strokeDasharray="3 3" opacity="0.4" />
        <path d={pathD} strokeWidth="0.8" opacity="0.8" />
        <rect x="-4" y="-4" width="8" height="8" fill={color} stroke="none">
          <animateMotion
            dur={duration}
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="linear"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </rect>
      </svg>
    </div>
  );
};
