"use client";

import { Flame, Calendar, Trophy, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StreakData } from "@/types/progress";

interface StreakTrackerProps {
  data: StreakData;
}

interface StatBoxProps {
  icon: LucideIcon;
  value: number;
  label: string;
}

function StatBox({ icon: Icon, value, label }: StatBoxProps) {
  return (
    <div className="border border-border bg-card p-4">
      <Icon className="mb-2 h-5 w-5 text-[#e53e00]" aria-hidden="true" />
      <div className="font-data text-3xl font-bold tabular-nums text-foreground">
        {value}
      </div>
      <div className="mt-1 h-0.5 w-8 bg-[#e53e00]" aria-hidden="true" />
      <div className="label-section mt-2">{label}</div>
    </div>
  );
}

export function StreakTracker({ data }: StreakTrackerProps) {
  const stats: StatBoxProps[] = [
    { icon: Flame, value: data.currentStreak, label: "Day Streak" },
    { icon: Trophy, value: data.longestStreak, label: "Best Streak" },
    { icon: Calendar, value: data.thisWeekSessions, label: "This Week" },
    { icon: TrendingUp, value: data.totalSessions, label: "Total Sessions" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <StatBox key={stat.label} {...stat} />
      ))}
    </div>
  );
}
