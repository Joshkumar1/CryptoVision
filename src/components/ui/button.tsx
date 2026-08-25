import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-accent/30 hover:shadow-md",
        secondary:
          "bg-surface-2 text-text-primary border border-border hover:bg-surface-3 hover:border-border-hover",
        ghost:
          "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
        destructive:
          "bg-negative text-white hover:bg-red-400 shadow-sm",
        outline:
          "border border-border bg-transparent text-text-primary hover:bg-surface-2 hover:border-border-hover",
        mint:
          "bg-mint/15 text-mint border border-mint/25 hover:bg-mint/25 hover:border-mint/40",
        gold:
          "bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 hover:border-gold/40",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 rounded-md px-3 text-xs",
        lg:      "h-10 rounded-xl px-6 text-sm font-semibold",
        icon:    "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
