import React from "react";

export const OrbitingCircless = ({ radius = 100, duration = 4, delay = 0, children }) => {
  return (
    <div
      className="absolute animate-spin-slow"
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <div 
        style={{
          transform: `translateY(${radius}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
