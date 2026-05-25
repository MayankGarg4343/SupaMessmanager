import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const TabsContext = createContext();

export function Tabs({ defaultValue, value: controlledValue, onValueChange, children, className }) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : localValue;

  const setActiveValue = (val) => {
    if (!isControlled) {
      setLocalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={clsx("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={clsx("inline-flex items-center justify-start rounded-xl bg-muted/30 p-1 border border-border/20 backdrop-blur-xs select-none", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const { activeValue, setActiveValue } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => setActiveValue(value)}
      className={clsx(
        "relative rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-all outline-none cursor-pointer text-muted-foreground",
        isActive ? "text-foreground font-bold" : "hover:text-foreground/80",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-0 rounded-lg bg-background shadow-xs border border-border/40"
          transition={{ type: "spring", bounce: 0.15, duration: 0.38 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeValue } = useContext(TabsContext);
  if (activeValue !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={clsx("mt-4 focus-visible:outline-none", className)}
    >
      {children}
    </motion.div>
  );
}
