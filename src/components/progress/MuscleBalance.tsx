"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { Activity } from "lucide-react";
import type { MuscleBalanceData } from "@/types/progress";

interface MuscleBalanceProps {
  data: MuscleBalanceData[];
}

export function MuscleBalance({ data }: MuscleBalanceProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Log more workouts to see your muscle balance breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    muscle: d.muscleGroup,
    sets: d.weeklySets,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4" />
          Muscle Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="muscle"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <Radar
                name="Weekly Sets"
                dataKey="sets"
                stroke="hsl(var(--foreground))"
                fill="hsl(var(--foreground))"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
