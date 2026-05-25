import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";

export function Dialog({ open, onOpenChange, children }) {
  // Simple state controller to close/open dialog with overlays
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Glassmorphic Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-panel p-6 shadow-2xl dark:shadow-black/50 border border-border/40"
          >
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div className={clsx("flex flex-col space-y-1.5 text-left pb-4", className)} {...props} />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <h3
      className={clsx("text-lg font-bold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={clsx("text-sm text-muted-foreground pt-1", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-border/20 mt-4", className)}
      {...props}
    />
  );
}
