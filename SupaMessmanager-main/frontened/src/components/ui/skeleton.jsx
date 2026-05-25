import React from "react";
import { clsx } from "clsx";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/10",
        className
      )}
      {...props}
    />
  );
}
