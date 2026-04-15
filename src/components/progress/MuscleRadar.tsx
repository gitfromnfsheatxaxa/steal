"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface MuscleDataPoint {
  muscle: string;
  value: number;
  max: number;
}

interface MuscleRadarProps {
  data: MuscleDataPoint[];
  className?: string;
}

export function MuscleRadar({ data, className }: MuscleRadarProps) {
  // Recharts radar works on a single numeric field — we pass two:
  // "value" (filled rust polygon) and "max" (outlined white-dim polygon)
  const chartData = data.map((d) => ({
    muscle: d.muscle.toUpperCase(),
    value: d.value,
    max: d.max,
  }));

  const monoTickStyle = {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: 10,
    textTransform: "uppercase" as const,
    fill: "rgba(163,163,163,0.9)",
    letterSpacing: "0.1em",
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Corner stamp */}
      <div
        className="absolute top-0 left-0 z-10 stamp"
        style={{
          background: "var(--rust)",
          color: "#fff",
          padding: "2px 6px",
          fontSize: 9,
          letterSpacing: "0.2em",
        }}
      >
        BALANCE METRIC 01
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData} margin={{ top: 24, right: 16, bottom: 8, left: 16 }}>
          <PolarGrid
            stroke="rgba(229,229,229,0.06)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="muscle"
            tick={monoTickStyle}
            tickLine={false}
          />
          {/* Max outline polygon */}
          <Radar
            name="Target"
            dataKey="max"
            stroke="rgba(229,229,229,0.25)"
            fill="transparent"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={false}
          />
          {/* Current filled polygon */}
          <Radar
            name="Current"
            dataKey="value"
            stroke="var(--rust)"
            fill="var(--rust)"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
