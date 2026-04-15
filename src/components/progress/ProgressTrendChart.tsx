"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

interface ProgressTrendData {
  week: string;
  avgWeight: number;
  avgReps: number;
  totalSets: number;
}

interface ProgressTrendChartProps {
  data: ProgressTrendData[];
}

export function ProgressTrendChart({ data }: ProgressTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-6 text-center">
        <p className="font-data text-xs uppercase tracking-widest text-[#71717A]">
          Insufficient Data — Log More Sessions
        </p>
      </div>
    );
  }

  const avgWeightTrend = data.map(d => ({ ...d, value: d.avgWeight }));
  const avgRepsTrend = data.map(d => ({ ...d, value: d.avgReps }));

  return (
    <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-3">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="week"
              tick={{ fontSize: 9, fill: "#525252", fontFamily: "var(--font-mono, monospace)" }}
              axisLine={{ stroke: "#2a2a2a", strokeWidth: 1 }}
              tickLine={{ stroke: "#2a2a2a", strokeWidth: 1 }}
              tickMargin={4}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 9, fill: "#e53e00", fontFamily: "var(--font-mono, monospace)" }}
              axisLine={{ stroke: "#2a2a2a", strokeWidth: 1 }}
              tickLine={{ stroke: "#2a2a2a", strokeWidth: 1 }}
              width={35}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 9, fill: "#10b981", fontFamily: "var(--font-mono, monospace)" }}
              axisLine={{ stroke: "#2a2a2a", strokeWidth: 1 }}
              tickLine={{ stroke: "#2a2a2a", strokeWidth: 1 }}
              width={35}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const d = payload[0].payload as ProgressTrendData;
                return (
                  <div style={{
                    background: "#111111",
                    border: "1px solid #2a2a2a",
                    padding: "8px",
                    fontSize: "10px",
                    color: "#e5e5e5",
                  }}>
                    <div style={{ color: "#e53e00", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                      {d.week}
                    </div>
                    <div style={{ color: "#e53e00" }}>Avg Weight: {d.avgWeight.toFixed(1)} kg</div>
                    <div style={{ color: "#10b981" }}>Avg Reps: {d.avgReps.toFixed(1)}</div>
                    <div style={{ color: "#a3a3a3" }}>Total Sets: {d.totalSets}</div>
                  </div>
                );
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgWeight"
              stroke="#e53e00"
              strokeWidth={2}
              dot={{ fill: "#e53e00", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgReps"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#e53e00]" />
          <span className="font-data text-[9px] uppercase tracking-widest text-[#71717A]">Avg Weight (kg)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#10b981]" />
          <span className="font-data text-[9px] uppercase tracking-widest text-[#71717A]">Avg Reps</span>
        </div>
      </div>
    </div>
  );
}