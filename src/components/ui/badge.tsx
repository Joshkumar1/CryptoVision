import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold transition-all tracking-wide backdrop-blur-md",
  {
    variants: {
      variant: {
        default:     "bg-accent/15 text-accent border border-accent/35 shadow-sm",
        secondary:   "bg-white/[0.06] text-text-secondary border border-white/12 hover:border-white/25",
        positive:    "bg-positive/15 text-positive border border-positive/30 shadow-sm",
        negative:    "bg-negative/15 text-negative border border-negative/30 shadow-sm",
        warning:     "bg-warning/15 text-warning border border-warning/35 shadow-sm",
        destructive: "bg-gradient-to-r from-rose-600 to-red-500 text-white border border-transparent shadow-sm",
        outline:     "border border-white/15 text-text-secondary bg-white/[0.04]",
        gold:        "bg-gold/15 text-gold border border-gold/40 shadow-gold-subtle font-extrabold",
        mint:        "bg-mint/15 text-mint border border-mint/35 shadow-sm",
        glass:       "bg-white/[0.08] text-text-primary border border-white/25 backdrop-blur-xl shadow-inner",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
