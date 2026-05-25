import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AreaChart({ data, height = 200, strokeColor = "#f97316", fillColor }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartId = useId().replace(/:/g, "");

  if (!data || data.length === 0) return null;
  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const min = 0;
  const range = max - min;
  const width = 500;
  
  // Calculate points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    // Keep padding at top and bottom
    const y = height - 40 - ((d.value - min) / range) * (height - 80);
    return { x, y, label: d.label, value: d.value };
  });

  // Construct SVG paths
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - 30} L ${points[0].x} ${height - 30} Z`;

  // Custom gradient setup based on stroke color
  const getGradientColors = (color) => {
    if (color === "var(--primary)" || color === "#f97316" || color === "#fb923c") {
      return { strokeEnd: "#f59e0b", fillStart: "#f97316", fillEnd: "#ea580c" };
    }
    if (color === "#3b82f6" || color === "#3b82f6") {
      return { strokeEnd: "#60a5fa", fillStart: "#3b82f6", fillEnd: "#2563eb" };
    }
    if (color === "#ef4444" || color === "#f87171") {
      return { strokeEnd: "#f87171", fillStart: "#ef4444", fillEnd: "#dc2626" };
    }
    if (color === "#fbbf24" || color === "#f59e0b") {
      return { strokeEnd: "#fcd34d", fillStart: "#fbbf24", fillEnd: "#d97706" };
    }
    return { strokeEnd: color, fillStart: color, fillEnd: color };
  };

  const colors = getGradientColors(strokeColor);
  const areaGradId = `areaGrad-${chartId}`;
  const strokeGradId = `strokeGrad-${chartId}`;
  const glowId = `glow-${chartId}`;
  const shadowId = `shadow-${chartId}`;

  // Find active hovered point
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  
  // Calculate tooltip bounding
  let tooltipX = activePoint ? activePoint.x : 0;
  if (tooltipX < 50) tooltipX = 50;
  if (tooltipX > width - 50) tooltipX = width - 50;

  return (
    <div className="w-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="overflow-visible w-full h-auto">
        <defs>
          {/* Stroke Gradient */}
          <linearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={strokeColor} />
            <stop offset="100%" stopColor={colors.strokeEnd} />
          </linearGradient>

          {/* Area Fill Gradient */}
          <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.fillStart} stopOpacity={0.25} />
            <stop offset="100%" stopColor={colors.fillEnd} stopOpacity={0} />
          </linearGradient>

          {/* Glow Filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow Filter */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>
        
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = 30 + ratio * (height - 70);
          return (
            <line
              key={index}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="currentColor"
              className="text-border/20"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Hover Crosshair Vertical Line */}
        <AnimatePresence>
          {activePoint && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              x1={activePoint.x}
              y1={25}
              x2={activePoint.x}
              y2={height - 30}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Area fill path with transition */}
        <motion.path
          d={areaPath}
          fill={`url(#${areaGradId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Stroke path with draw transition */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={`url(#${strokeGradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Data points */}
        {points.map((p, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g key={i} className="pointer-events-none">
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? "7" : "4.5"}
                fill={isHovered ? strokeColor : "hsl(var(--background))"}
                stroke={strokeColor}
                strokeWidth={isHovered ? "3" : "2.5"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 120 }}
              />
              
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  className="opacity-30 animate-ping"
                />
              )}
            </g>
          );
        })}

        {/* Floating Tooltip Group */}
        <AnimatePresence>
          {activePoint && (
            <motion.g
              initial={{ opacity: 0, y: activePoint.y - 30 }}
              animate={{ opacity: 1, y: activePoint.y - 42 }}
              exit={{ opacity: 0, y: activePoint.y - 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              transform={`translate(${tooltipX}, 0)`}
              filter={`url(#${shadowId})`}
              className="pointer-events-none"
            >
              {/* Tooltip background (glass panel) */}
              <rect
                x="-50"
                y="-18"
                width="100"
                height="40"
                rx="10"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                className="opacity-95"
              />
              
              <text
                x="0"
                y="-4"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                className="fill-muted-foreground uppercase tracking-wider"
              >
                {activePoint.label}
              </text>
              
              <text
                x="0"
                y="12"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={strokeColor === "var(--primary)" ? "hsl(var(--primary))" : strokeColor}
              >
                {activePoint.value}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Axis Labels */}
        <g>
          {points.map((p, i) => {
            // Show start, middle and end labels to avoid clutter
            const isLabelVisible = i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1;
            if (!isLabelVisible) return null;
            return (
              <text
                key={i}
                x={p.x}
                y={height - 8}
                textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                fontSize="10"
                fontWeight="600"
                className="fill-muted-foreground uppercase tracking-widest"
              >
                {p.label}
              </text>
            );
          })}
        </g>

        {/* Hover detection zones (invisible vertical bars) */}
        {points.map((p, i) => {
          const colWidth = width / points.length;
          const startX = p.x - colWidth / 2;
          return (
            <rect
              key={`detect-${i}`}
              x={startX}
              y={0}
              width={colWidth}
              height={height - 25}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function PremiumBarChart({ data, height = 200, barColor = "var(--primary)" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartId = useId().replace(/:/g, "");

  if (!data || data.length === 0) return null;
  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  
  // Set SVG coordinate width to 320 to achieve a narrower, taller aspect ratio.
  // This forces the browser to scale up the height of the chart relative to the card width.
  const width = 320;
  const barGap = 20;
  const totalGaps = barGap * (data.length - 1);
  
  // Clamping max width of bars to 24 to keep them slender, and centering them.
  const barWidth = Math.min(24, (width - 40 - totalGaps) / data.length);
  const totalChartWidth = data.length * barWidth + totalGaps;
  const offset = (width - totalChartWidth) / 2;

  // Custom gradient setup based on barColor
  const getGradientColors = (color) => {
    if (color === "var(--primary)" || color === "#f97316" || color === "#fb923c") {
      return { start: "#ea580c", end: "#f59e0b" };
    }
    if (color === "#3b82f6" || color === "#60a5fa") {
      return { start: "#2563eb", end: "#60a5fa" };
    }
    if (color === "#fbbf24" || color === "#f59e0b") {
      return { start: "#d97706", end: "#fcd34d" };
    }
    if (color === "#ef4444" || color === "#f87171") {
      return { start: "#dc2626", end: "#f87171" };
    }
    return { start: color, end: color };
  };

  const colors = getGradientColors(barColor);
  const barGradId = `barGrad-${chartId}`;
  const shadowId = `shadow-${chartId}`;

  // Find active hovered item
  const activeItem = hoveredIndex !== null ? { ...data[hoveredIndex], index: hoveredIndex } : null;

  return (
    <div className="w-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="overflow-visible w-full h-auto">
        <defs>
          {/* Bar Gradient */}
          <linearGradient id={barGradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {data.map((d, i) => {
          // Increase vertical range by using (height - 30) for max barHeight
          const barHeight = (d.value / max) * (height - 30);
          const x = offset + i * (barWidth + barGap);
          const y = height - 20 - barHeight;
          const isHovered = hoveredIndex === i;
          const isAnyHovered = hoveredIndex !== null;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Track (SaaS style) */}
              <rect
                x={x}
                y={10}
                width={barWidth}
                height={height - 30}
                rx="4"
                className="fill-muted/5 stroke-border/5"
                strokeWidth="0.5"
              />

              {/* Glowing hover card spotlight behind bar */}
              {isHovered && (
                <rect
                  x={x - 4}
                  y={8}
                  width={barWidth + 8}
                  height={height - 26}
                  rx="8"
                  fill={colors.start}
                  className="opacity-5 blur-md pointer-events-none"
                />
              )}

              {/* Animated Foreground Bar */}
              <motion.rect
                x={x}
                y={height - 20}
                width={barWidth}
                height={0}
                rx="4"
                fill={`url(#${barGradId})`}
                animate={{
                  y: y,
                  height: barHeight,
                  opacity: !isAnyHovered || isHovered ? 1 : 0.4,
                  scaleX: isHovered ? 1.05 : 1,
                }}
                originX={`${x + barWidth / 2}px`}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: i * 0.02,
                }}
              />

              {/* Bottom label */}
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                className="fill-muted-foreground uppercase tracking-wider pointer-events-none"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Floating Tooltip for Bar Chart */}
        <AnimatePresence>
          {activeItem && (() => {
            const barHeight = (activeItem.value / max) * (height - 30);
            const x = offset + activeItem.index * (barWidth + barGap);
            const y = height - 20 - barHeight;
            let tooltipX = x + barWidth / 2;
            if (tooltipX < 50) tooltipX = 50;
            if (tooltipX > width - 50) tooltipX = width - 50;

            return (
              <motion.g
                initial={{ opacity: 0, y: y - 10 }}
                animate={{ opacity: 1, y: y - 22 }}
                exit={{ opacity: 0, y: y - 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                transform={`translate(${tooltipX}, 0)`}
                filter={`url(#${shadowId})`}
                className="pointer-events-none"
              >
                {/* Tooltip Background */}
                <rect
                  x="-50"
                  y="-18"
                  width="100"
                  height="40"
                  rx="10"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  className="opacity-95"
                />

                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  className="fill-muted-foreground uppercase tracking-wider"
                >
                  {activeItem.label}
                </text>

                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={barColor === "var(--primary)" ? "hsl(var(--primary))" : barColor}
                >
                  {activeItem.value}
                </text>
              </motion.g>
            );
          })()}
        </AnimatePresence>
      </svg>
    </div>
  );
}

export function Sparkline({ data, width = 120, height = 30, strokeColor = "var(--primary)" }) {
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height} className="opacity-20">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  }

  const values = data.map((d) => (typeof d === "object" ? d.value : d));
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const range = max - min || 1;
  const points = values
    .map((val, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 3 - ((val - min) / range) * (height - 6);
      return `${x},${y}`;
    })
    .join(" ");

  const chartId = useId().replace(/:/g, "");
  const sparkGradId = `sparkGrad-${chartId}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={sparkGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Area fill under sparkline */}
      <path
        d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
        fill={`url(#${sparkGradId})`}
      />
      {/* Sparkline path */}
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
