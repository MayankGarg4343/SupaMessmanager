import React from "react";

export const OrbitingCircles = ({ radius = 100, duration = 4, delay = 0, children }) => {
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
          transform: `translateX(${radius}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
