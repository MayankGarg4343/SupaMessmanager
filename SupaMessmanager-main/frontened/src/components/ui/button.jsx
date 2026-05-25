import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variants = {
      default:
        "bg-linear-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-amber-400 active:scale-98 dark:shadow-orange-950/20",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40",
      outline:
        "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
      ghost:
        "text-foreground hover:bg-accent hover:text-accent-foreground",
      link:
        "text-primary underline-offset-4 hover:underline",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    };

    const sizes = {
      default: "h-11 px-5 py-2.5",
      sm: "h-9 px-3 rounded-lg text-xs",
      lg: "h-13 px-8 rounded-2xl text-base",
      icon: "h-11 w-11 rounded-xl",
    };

    const CombinedButton = (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );

    if (disabled) return CombinedButton;

    return (
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {CombinedButton}
      </motion.div>
    );
  }
);

Button.displayName = "Button";
