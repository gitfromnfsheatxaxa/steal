"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPocketBase } from "@/lib/pocketbase";
import type { WorkoutSession, SessionSet } from "@/types/session";
import type { StreakData, PersonalRecord } from "@/types/progress";
import { estimate1RM } from "@/lib/utils";

export function useSessions() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<WorkoutSession[]>({
    queryKey: ["sessions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const records = await pb
        .collection("workout_sessions")
        .getList<WorkoutSession>(1, 200, {
          filter: `user="${userId}"`,
          sort: "-completedAt",
        });
      // Filter completed sessions in JS to avoid PocketBase select-field filter quirks
      return records.items.filter((s) => s.status === "completed");
    },
    enabled: !!userId,
  });
}

export function useSessionSets(sessionId: string | undefined) {
  const pb = getPocketBase();

  return useQuery<SessionSet[]>({
    queryKey: ["sessionSets", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const records = await pb
        .collection("session_sets")
        .getList<SessionSet>(1, 200, {
          filter: `session="${sessionId}"`,
          sort: "setNumber",
        });
      return records.items;
    },
    enabled: !!sessionId,
  });
}

export function useAllSets() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<SessionSet[]>({
    queryKey: ["allSets", userId],
    queryFn: async () => {
      if (!userId) return [];
      // Get all sessions first
      const sessions = await pb
        .collection("workout_sessions")
        .getList<WorkoutSession>(1, 200, {
          filter: `user="${userId}"`,
        });

      const completedItems = sessions.items.filter((s) => s.status === "completed");
      if (completedItems.length === 0) return [];

      const sessionIds = completedItems.map((s) => s.id);
      const filter = sessionIds.map((id) => `session="${id}"`).join(" || ");

      const sets = await pb
        .collection("session_sets")
        .getList<SessionSet>(1, 5000, { filter });

      return sets.items;
    },
    enabled: !!userId,
  });
}

export function useStreakData(): StreakData {
  const { data: sessions } = useSessions();

  return useMemo<StreakData>(() => {
    if (!sessions || sessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalSessions: 0,
        thisWeekSessions: 0,
        thisMonthSessions: 0,
      };
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const sessionDates = sessions
      .map((s) => new Date(s.completedAt || s.startedAt).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i) // unique dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sessionDates[0] === today || sessionDates[0] === yesterday) {
      for (let i = 0; i < sessionDates.length; i++) {
        const expected = new Date(Date.now() - i * 86400000).toDateString();
        if (sessionDates.includes(expected)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Longest streak
    let longestStreak = currentStreak;
    let tempStreak = 1;
    for (let i = 1; i < sessionDates.length; i++) {
      const prev = new Date(sessionDates[i - 1]).getTime();
      const curr = new Date(sessionDates[i]).getTime();
      if (prev - curr <= 86400000 * 1.5) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalSessions: sessions.length,
      thisWeekSessions: sessions.filter(
        (s) => new Date(s.completedAt || s.startedAt) >= weekStart,
      ).length,
      thisMonthSessions: sessions.filter(
        (s) => new Date(s.completedAt || s.startedAt) >= monthStart,
      ).length,
    };
  }, [sessions]);
}

export function useMuscleDistribution() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<{ name: string; value: number; percentage: number }[]>({
    queryKey: ["muscleDistribution", userId],
    queryFn: async () => {
      if (!userId) return [];

      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Fetch sessions; filter status + date in JS to avoid PocketBase select-field/date filter quirks
      const sessions = await pb
        .collection("workout_sessions")
        .getList<WorkoutSession>(1, 200, {
          filter: `user="${userId}"`,
          sort: "-completedAt",
        });

      const thisMonthSessions = sessions.items.filter((s) => {
        if (s.status !== "completed") return false;
        const d = new Date(s.completedAt || s.startedAt);
        return d >= monthStart;
      });

      if (thisMonthSessions.length === 0) return [];

      const planDayIds = Array.from(
        new Set(
          thisMonthSessions
            .map((s) => s.planDay)
            .filter((id): id is string => !!id),
        ),
      );

      if (planDayIds.length === 0) return [];

      const muscleCount: Record<string, number> = {};

      // Chunk to avoid oversized filter strings (PB URL limit)
      const CHUNK = 30;
      const chunks: string[][] = [];
      for (let i = 0; i < planDayIds.length; i += CHUNK) {
        chunks.push(planDayIds.slice(i, i + CHUNK));
      }

      for (const chunk of chunks) {
        const chunkFilter = chunk.map((id) => `id="${id}"`).join(" || ");
        const planDays = await pb
          .collection("plan_days")
          .getList(1, CHUNK + 5, { filter: chunkFilter });
        for (const day of planDays.items) {
          const focus = (day as { focus?: string[] }).focus ?? [];
          for (const muscle of focus) {
            muscleCount[muscle] = (muscleCount[muscle] ?? 0) + 1;
          }
        }
      }

      const total = Object.values(muscleCount).reduce((a, b) => a + b, 0);
      if (total === 0) return [];

      return Object.entries(muscleCount)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          percentage: Math.round((value / total) * 100),
        }));
    },
    enabled: !!userId,
  });
}

export function useWeightLog() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<{ date: string; weight: number }[]>({
    queryKey: ["weightLog", userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const records = await pb
          .collection("weight_logs")
          .getList<{ date: string; weight: number }>(1, 100, {
            filter: `user="${userId}"`,
            sort: "date",
          });
        return records.items;
      } catch {
        return [];
      }
    },
    enabled: !!userId,
  });
}

export function usePersonalRecords(): PersonalRecord[] {
  const { data: sets } = useAllSets();

  return useMemo<PersonalRecord[]>(() => {
    if (!sets || sets.length === 0) return [];

    // Group by exercise, find max estimated 1RM
    const byExercise = new Map<string, SessionSet[]>();
    for (const set of sets) {
      const existing = byExercise.get(set.exercise) ?? [];
      existing.push(set);
      byExercise.set(set.exercise, existing);
    }

    const records: PersonalRecord[] = [];
    for (const [exerciseId, exerciseSets] of byExercise) {
      let bestSet: SessionSet | null = null;
      let best1RM = 0;

      for (const set of exerciseSets) {
        const e1rm = estimate1RM(set.weight, set.reps);
        if (e1rm > best1RM) {
          best1RM = e1rm;
          bestSet = set;
        }
      }

      if (bestSet) {
        records.push({
          exerciseId,
          exerciseName: exerciseId, // resolves from exercise ID until exercises collection is populated
          weight: bestSet.weight,
          reps: bestSet.reps,
          date: bestSet.created,
          estimated1RM: best1RM,
        });
      }
    }

    return records.sort((a, b) => b.estimated1RM - a.estimated1RM);
  }, [sets]);
}
