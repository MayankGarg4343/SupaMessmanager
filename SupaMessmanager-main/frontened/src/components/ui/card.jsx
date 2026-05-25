import React from "react";
import { clsx } from "clsx";

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "glass-panel rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 p-6 transition-all duration-300 hover:border-primary/20",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }) => (
  <div className={clsx("flex flex-col space-y-1.5 pb-4", className)} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={clsx("text-xl font-bold tracking-tight text-foreground", className)}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({ className, ...props }) => (
  <p
    className={clsx("text-sm text-muted-foreground", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className, ...props }) => (
  <div className={clsx("pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className, ...props }) => (
  <div className={clsx("flex items-center pt-4 border-t border-border/20 mt-4", className)} {...props} />
);
CardFooter.displayName = "CardFooter";
