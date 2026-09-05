import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-accent via-purple-500 to-purple-600 text-white border border-white/20 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110 backdrop-blur-md",
        secondary:
          "glass-pill text-text-primary hover:bg-white/12 hover:border-white/25 hover:text-white",
        ghost:
          "text-text-secondary hover:bg-white/[0.08] hover:text-text-primary backdrop-blur-sm",
        destructive:
          "bg-gradient-to-r from-rose-600 to-red-500 text-white border border-white/20 shadow-lg shadow-rose-600/30 hover:brightness-110 backdrop-blur-md",
        outline:
          "border border-white/15 bg-white/[0.04] backdrop-blur-md text-text-primary hover:bg-white/10 hover:border-gold/50 hover:text-gold shadow-sm",
        mint:
          "bg-mint/15 text-mint border border-mint/35 hover:bg-mint/25 hover:border-mint/50 backdrop-blur-md shadow-mint/15 shadow-sm",
        gold:
          "bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25 hover:border-gold/60 backdrop-blur-md shadow-gold/20 shadow-sm font-bold",
        glass:
          "bg-white/[0.08] backdrop-blur-xl border border-white/20 hover:bg-white/[0.14] hover:border-gold/50 text-text-primary shadow-lg shadow-black/25",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 rounded-lg px-3 text-xs",
        lg:      "h-11 rounded-2xl px-6 text-sm font-bold",
        icon:    "h-8 w-8 rounded-xl",
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
