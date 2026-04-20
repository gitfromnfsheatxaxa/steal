"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPocketBase } from "@/lib/pocketbase";
import type { WorkoutSession, SessionSet } from "@/types/session";
import type { StreakData, PersonalRecord } from "@/types/progress";
import { estimate1RM } from "@/lib/utils";

// Combined data type for all progress data
export interface ProgressData {
  sessions: WorkoutSession[];
  allSets: SessionSet[];
}

/**
 * Single combined query that fetches all sessions and sets in one go.
 * This avoids PocketBase SDK auto-cancellation issues when multiple hooks
 * query the same collection.
 */
export function useProgressData() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<ProgressData>({
    queryKey: ["progressData", userId],
    queryFn: async () => {
      if (!userId) {
        return { sessions: [], allSets: [] };
      }

      try {
        console.log("[useProgressData] Fetching data for user:", userId);

        // Fetch all sessions (no filter to avoid PocketBase filter issues)
        const sessionsResponse = await pb
          .collection("workout_sessions")
          .getList<WorkoutSession>(1, 200, { expand: "planDay" });

        console.log("[useProgressData] Total sessions in DB:", sessionsResponse.totalItems);

        // Filter by current user and completed status in JS
        const userSessions = sessionsResponse.items.filter((s) => s.user === userId);
        const completedSessions = userSessions.filter((s) => s.status === "completed");

        console.log("[useProgressData] User sessions:", userSessions.length);
        console.log("[useProgressData] Completed sessions:", completedSessions.length);

        // Fetch sets for completed sessions
        let allSets: SessionSet[] = [];
        if (completedSessions.length > 0) {
          const sessionIds = completedSessions.map((s) => s.id);
          const filter = sessionIds.map((id) => `session="${id}"`).join(" || ");

          const setsResponse = await pb
            .collection("session_sets")
            .getList<SessionSet>(1, 5000, { filter, expand: "exercise" });

          allSets = setsResponse.items;
          console.log("[useProgressData] Sets fetched:", allSets.length);
        }

        return {
          sessions: completedSessions,
          allSets,
        };
      } catch (error: any) {
        console.error("[useProgressData] Error:", error.message);
        return { sessions: [], allSets: [] };
      }
    },
    enabled: !!userId,
    retry: 1,
  });
}

interface ProgressHookResult {
  data: WorkoutSession[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface SetsHookResult {
  data: SessionSet[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Backwards compatible hook that returns only sessions.
 * Uses the combined query for efficiency.
 */
export function useSessions(): ProgressHookResult {
  const { data, isLoading, isError, error, refetch } = useProgressData();

  return {
    data: data?.sessions ?? [],
    isLoading,
    isError,
    error: error instanceof Error ? error : null,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Backwards compatible hook that returns only sets.
 * Uses the combined query for efficiency.
 */
export function useAllSets(): SetsHookResult {
  const { data, isLoading, isError, error, refetch } = useProgressData();

  return {
    data: data?.allSets ?? [],
    isLoading,
    isError,
    error: error instanceof Error ? error : null,
    refetch: async () => {
      await refetch();
    },
  };
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
    
    // Week starts on Monday (adjust if you prefer Sunday)
    const weekStart = new Date(now);
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(now.getDate() - daysSinceMonday);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get unique session dates sorted newest to oldest
    interface SessionDateInfo {
      date: Date;
      dateString: string;
      timestamp: number;
    }
    
    const sessionDatesRaw = sessions
      .map((s) => {
        const date = new Date(s.completedAt || s.startedAt || s.created);
        return {
          date,
          dateString: date.toDateString(),
          timestamp: date.getTime()
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
    
    // Deduplicate by date string
    const sessionDates: SessionDateInfo[] = [];
    for (const item of sessionDatesRaw) {
      if (!sessionDates.some(d => d.dateString === item.dateString)) {
        sessionDates.push(item);
      }
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if we have sessions today or yesterday to start counting streak
    if (sessionDates.length > 0 && (sessionDates[0].dateString === today || sessionDates[0].dateString === yesterday)) {
      for (let i = 0; i < sessionDates.length; i++) {
        const expectedDate = new Date(Date.now() - i * 86400000).toDateString();
        if (sessionDates.some(d => d.dateString === expectedDate)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak (historical)
    let longestStreak = currentStreak;
    let tempStreak = 1;
    for (let i = 1; i < sessionDates.length; i++) {
      const prevDate = sessionDates[i - 1].timestamp;
      const currDate = sessionDates[i].timestamp;
      const daysDiff = (prevDate - currDate) / 86400000;
      
      // Allow up to 1.5 days gap (handles overnight sessions)
      if (daysDiff <= 1.5) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Count sessions this week and month
    const thisWeekSessions = sessions.filter((s) => {
      const sessionDate = new Date(s.completedAt || s.startedAt || s.created);
      return sessionDate >= weekStart;
    }).length;

    const thisMonthSessions = sessions.filter((s) => {
      const sessionDate = new Date(s.completedAt || s.startedAt || s.created);
      return sessionDate >= monthStart;
    }).length;

    return {
      currentStreak,
      longestStreak,
      totalSessions: sessions.length,
      thisWeekSessions,
      thisMonthSessions,
    };
  }, [sessions]);
}

export function useMuscleDistribution() {
  const { data } = useProgressData();
  const sessions = data?.sessions ?? [];
  const allSets = data?.allSets ?? [];

  return useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    if (!allSets || allSets.length === 0) return [];

    // Muscle group mapping based on exercise names
    const MUSCLE_MAPPING: Record<string, string[]> = {
      // Chest
      'chest': ['bench press', 'incline press', 'decline press', 'chest press', 'flye', 'fly', 'crossover', 'dumbbell press', 'barbell press'],
      // Back
      'back': ['row', 'pullup', 'pull-up', 'pulldown', 'lat pulldown', 'deadlift', 'barbell row', 'dumbbell row', 'cable row', 't-bar'],
      // Shoulders
      'shoulder': ['overhead press', 'shoulder press', 'lateral raise', 'lateral', 'front raise', 'rear delt', 'rear fly', 'arnold press', 'military press'],
      // Biceps
      'bicep': ['curl', 'bicep curl', 'hammer curl', 'preacher curl', 'concentration curl', 'incline curl', 'barbell curl', 'dumbbell curl'],
      // Triceps
      'tricep': ['pushdown', 'extension', 'tricep extension', 'overhead extension', 'skull crusher', 'close grip', 'diamond pushup', 'dip'],
      // Quads
      'quad': ['squat', 'leg press', 'leg extension', 'lunge', 'bulgarian', 'goblet squat', 'front squat', 'hack squat', 'sissy squat'],
      // Hamstrings
      'hamstring': ['leg curl', 'rdl', 'romanian', 'stiff leg', 'nordic', 'good morning'],
      // Glutes
      'glute': ['hip thrust', 'glute bridge', 'cable kickback', 'frog pump', 'abductor'],
      // Calves
      'calf': ['calf raise', 'standing calf', 'seated calf', 'donkey calf'],
      // Traps
      'trap': ['shrug', 'trap bar', 'face pull', 'reverse fly'],
      // Abs
      'abs': ['plank', 'crunch', 'leg raise', 'cable crunch', 'hanging knee', 'ab wheel', 'russian twist'],
    };

    // Count exercises per muscle group
    const muscleCounts = new Map<string, number>();
    const muscleVolumes = new Map<string, number>();

    for (const set of allSets) {
      const expandedName = (set as unknown as { expand?: { exercise?: { name?: string } } }).expand?.exercise?.name;
      const exerciseName = expandedName?.toLowerCase() || '';
      const volume = set.weight * set.reps;

      let matchedMuscle = 'other';
      for (const [muscle, keywords] of Object.entries(MUSCLE_MAPPING)) {
        if (keywords.some((kw) => exerciseName.includes(kw))) {
          matchedMuscle = muscle;
          break;
        }
      }

      muscleCounts.set(matchedMuscle, (muscleCounts.get(matchedMuscle) || 0) + 1);
      muscleVolumes.set(matchedMuscle, (muscleVolumes.get(matchedMuscle) || 0) + volume);
    }

    // Format for display - use volume as primary metric
    const muscleDisplayNames: Record<string, string> = {
      chest: 'CHEST',
      back: 'BACK',
      shoulder: 'SHOULDER',
      bicep: 'BICEP',
      tricep: 'TRICEP',
      quad: 'QUAD',
      hamstring: 'HAMSTRING',
      glute: 'GLUTE',
      calf: 'CALF',
      trap: 'TRAP',
      abs: 'ABS',
      other: 'OTHER',
    };

    const result = Array.from(muscleVolumes.entries())
      .map(([muscle, volumeSum]) => {
        const count = muscleCounts.get(muscle) || 0;
        return {
          name: muscleDisplayNames[muscle] || muscle.toUpperCase(),
          value: count,
          volume: volumeSum,
          count,
        };
      })
      .sort((a, b) => b.value - a.value);

    console.log('[useMuscleDistribution] Muscle data:', result);
    return result;
  }, [sessions, allSets]);
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

    // Group sets by exercise
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
        type WithExpand = { expand?: { exercise?: { name?: string } } };
        const exerciseName =
          (exerciseSets
            .find((s) => (s as unknown as WithExpand).expand?.exercise?.name) as unknown as WithExpand | undefined)
            ?.expand?.exercise?.name ?? exerciseId;
        records.push({
          exerciseId,
          exerciseName,
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