import React from "react";

export const OrbitingCircles = ({ radius = 100, duration = 20, delay = 0, reverse = false, children }) => {
  return (
    <div
      className={`absolute ${reverse ? "animate-spin-slow-reverse" : "animate-spin-slow"}`}
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
        <div
          className={reverse ? "animate-spin-slow" : "animate-spin-slow-reverse"}
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
