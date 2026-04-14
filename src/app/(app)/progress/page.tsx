"use client";

import { useMemo } from "react";
import {
  useStreakData,
  usePersonalRecords,
  useSessions,
  useAllSets,
  useMuscleDistribution,
} from "@/hooks/useProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { StreakTracker } from "@/components/progress/StreakTracker";
import { PRBoard } from "@/components/progress/PRBoard";
import { VolumeChart } from "@/components/progress/VolumeChart";
import { LiftProgressionChart } from "@/components/progress/LiftProgressionChart";
import { MuscleDistribution } from "@/components/progress/MuscleDistribution";
import { AchievementsBoard } from "@/components/progress/AchievementsBoard";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateVolume } from "@/lib/utils";

interface Section {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: Section) {
  return (
    <section className="space-y-3">
      <h2
        className="label-section"
        style={{ letterSpacing: "0.2em" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProgressPage() {
  const { data: sessions, isLoading: sessionsLoading, isError: sessionsError } = useSessions();
  const { data: allSets, isLoading: setsLoading, isError: setsError } = useAllSets();
  const { data: muscleData, isLoading: muscleLoading } = useMuscleDistribution();
  const streakData = useStreakData();
  const personalRecords = usePersonalRecords();
  const achievements = useAchievements();

  const volumeData = useMemo(() => {
    if (!sessions || !allSets || sessions.length === 0) return [];

    // Map session -> total volume from sets
    const sessionVolume = new Map<string, number>();
    for (const set of allSets) {
      const v = calculateVolume(1, set.reps, set.weight);
      sessionVolume.set(set.session, (sessionVolume.get(set.session) ?? 0) + v);
    }

    // Aggregate by week
    const weekMap = new Map<string, { ts: number; volume: number }>();
    for (const session of sessions) {
      const d = new Date(session.completedAt || session.startedAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const ts = weekStart.getTime();
      const key = weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const vol = sessionVolume.get(session.id) ?? 0;
      const existing = weekMap.get(key);
      if (existing) {
        existing.volume += vol;
      } else {
        weekMap.set(key, { ts, volume: vol });
      }
    }

    return Array.from(weekMap.entries())
      .map(([week, { ts, volume }]) => ({
        week,
        volume: Math.round(volume),
        ts,
      }))
      .sort((a, b) => a.ts - b.ts)
      .slice(-8)
      .map(({ week, volume }) => ({ week, volume }));
  }, [sessions, allSets]);

  const topExerciseIds = useMemo(
    () => personalRecords.slice(0, 3).map((pr) => pr.exerciseId),
    [personalRecords],
  );

  const exerciseNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const pr of personalRecords) {
      map[pr.exerciseId] = pr.exerciseName;
    }
    return map;
  }, [personalRecords]);

  const isLoading = sessionsLoading || setsLoading;
  const isError = sessionsError || setsError;

  if (isError) {
    return (
      <div className="container-app py-12">
        <div className="border border-destructive/40 bg-destructive/5 p-6">
          <p className="font-data text-xs font-semibold uppercase tracking-widest text-destructive">
            FAILED TO LOAD DATA
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-app space-y-6 py-6">
        <div>
          <Skeleton className="skeleton-steal h-8 w-32 rounded-none" />
          <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="skeleton-steal h-28 rounded-none" />
          ))}
        </div>
        <Skeleton className="skeleton-steal h-72 rounded-none" />
        <Skeleton className="skeleton-steal h-72 rounded-none" />
        <Skeleton className="skeleton-steal h-64 rounded-none" />
      </div>
    );
  }

  return (
    <div className="container-app space-y-8 py-6">
      <header>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          STATS
        </h1>
        <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
      </header>

      <Section title="Streak">
        <StreakTracker data={streakData} />
      </Section>

      <Section title="Volume">
        <VolumeChart data={volumeData} />
      </Section>

      <Section title="Lift Progression">
        <LiftProgressionChart
          sets={allSets ?? []}
          topExerciseIds={topExerciseIds}
          exerciseNames={exerciseNames}
        />
      </Section>

      <Section title="Personal Records">
        <PRBoard records={personalRecords} />
      </Section>

      <Section title="Muscle Distribution — This Month">
        {muscleLoading ? (
          <Skeleton className="skeleton-steal h-64 rounded-none" />
        ) : (
          <MuscleDistribution data={muscleData ?? []} />
        )}
      </Section>

      <Section title="Achievements">
        <AchievementsBoard unlocked={achievements} />
      </Section>
    </div>
  );
}
