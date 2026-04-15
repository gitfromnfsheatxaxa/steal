"use client";

import { cn } from "@/lib/utils";

type GaugeTone = "rust" | "steel" | "tactical";

interface GaugeRingProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  tone?: GaugeTone;
  size?: number;
  className?: string;
}

const TONE_COLORS: Record<GaugeTone, string> = {
  rust: "var(--rust)",
  steel: "var(--steel-hot)",
  tactical: "var(--tactical)",
};

export function GaugeRing({
  label,
  value,
  max,
  unit,
  tone = "rust",
  size = 160,
  className,
}: GaugeRingProps) {
  const strokeWidth = Math.max(8, size * 0.06);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), max);
  const ratio = max > 0 ? clamped / max : 0;
  const dashOffset = circumference * (1 - ratio);

  const cx = size / 2;
  const cy = size / 2;

  const fgColor = TONE_COLORS[tone];

  return (
    <div
      className={cn("flex flex-col items-center gap-2", className)}
      style={{ width: size }}
      aria-label={`${label}: ${value} out of ${max}${unit ? " " + unit : ""}`}
      role="img"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ display: "block", overflow: "visible" }}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={strokeWidth}
          />
          {/* Foreground arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={fgColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="square"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="font-data"
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: Math.round(size * 0.22),
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              color: "var(--ink-high)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {value}
            <span
              style={{
                fontSize: Math.round(size * 0.1),
                color: "var(--ink-mid)",
                marginLeft: 1,
              }}
            >
              /{max}
            </span>
          </span>
          {unit && (
            <span
              className="stamp"
              style={{
                color: fgColor,
                marginTop: 2,
                fontSize: Math.round(size * 0.07),
                letterSpacing: "0.2em",
              }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Label */}
      <span
        className="stamp"
        style={{
          color: "var(--ink-low)",
          letterSpacing: "0.2em",
          fontSize: 10,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}
