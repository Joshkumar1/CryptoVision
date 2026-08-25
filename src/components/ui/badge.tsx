import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors tracking-wide",
  {
    variants: {
      variant: {
        default:     "bg-accent/15 text-accent border border-accent/20",
        secondary:   "bg-surface-2 text-text-secondary border border-border",
        positive:    "bg-positive/12 text-positive border border-positive/20",
        negative:    "bg-negative/12 text-negative border border-negative/20",
        warning:     "bg-warning/12 text-warning border border-warning/20",
        destructive: "bg-negative text-white border border-transparent",
        outline:     "border border-border text-text-secondary bg-transparent",
        gold:        "bg-gold/12 text-gold border border-gold/20",
        mint:        "bg-mint/12 text-mint border border-mint/20",
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
