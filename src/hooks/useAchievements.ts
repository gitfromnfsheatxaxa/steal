"use client";

import { useMemo } from "react";
import { useSessions, useStreakData, usePersonalRecords } from "./useProgress";
import type {
  AchievementDef,
  AchievementId,
  UserAchievement,
} from "@/types/achievement";

export const ACHIEVEMENT_DEFS: Record<AchievementId, AchievementDef> = {
  first_blood: {
    id: "first_blood",
    name: "FIRST BLOOD",
    description: "Complete your first session",
    icon: "I",
    tier: "bronze",
  },
  iron_five: {
    id: "iron_five",
    name: "IRON FIVE",
    description: "5 sessions completed",
    icon: "V",
    tier: "bronze",
  },
  iron_ten: {
    id: "iron_ten",
    name: "IRON TEN",
    description: "10 sessions completed",
    icon: "X",
    tier: "silver",
  },
  grinding: {
    id: "grinding",
    name: "GRINDING",
    description: "20 sessions completed",
    icon: "XX",
    tier: "silver",
  },
  committed: {
    id: "committed",
    name: "COMMITTED",
    description: "50 sessions completed",
    icon: "L",
    tier: "gold",
  },
  centurion: {
    id: "centurion",
    name: "CENTURION",
    description: "100 sessions completed",
    icon: "C",
    tier: "platinum",
  },
  on_fire: {
    id: "on_fire",
    name: "ON FIRE",
    description: "7-day training streak",
    icon: "7",
    tier: "silver",
  },
  unstoppable: {
    id: "unstoppable",
    name: "UNSTOPPABLE",
    description: "14-day streak",
    icon: "14",
    tier: "gold",
  },
  iron_will: {
    id: "iron_will",
    name: "IRON WILL",
    description: "30-day streak",
    icon: "30",
    tier: "platinum",
  },
  month_one: {
    id: "month_one",
    name: "MONTH ONE",
    description: "Trained for over 30 days",
    icon: "30D",
    tier: "bronze",
  },
  pr_hunter: {
    id: "pr_hunter",
    name: "PR HUNTER",
    description: "Set your first personal record",
    icon: "PR",
    tier: "bronze",
  },
};

export function useAchievements(): UserAchievement[] {
  const { data: sessions } = useSessions();
  const streakData = useStreakData();
  const prs = usePersonalRecords();

  return useMemo(() => {
    if (!sessions) return [];
    const unlocked: UserAchievement[] = [];
    const total = sessions.length;
    const oldestSession = sessions[sessions.length - 1];
    const oldestDate = oldestSession
      ? oldestSession.completedAt || oldestSession.startedAt
      : new Date().toISOString();

    const milestones: [number, AchievementId][] = [
      [1, "first_blood"],
      [5, "iron_five"],
      [10, "iron_ten"],
      [20, "grinding"],
      [50, "committed"],
      [100, "centurion"],
    ];
    for (const [count, id] of milestones) {
      if (total >= count) {
        const idx = sessions.length - count;
        const session = sessions[idx >= 0 ? idx : 0];
        unlocked.push({
          id,
          unlockedAt: session.completedAt || session.startedAt,
          def: ACHIEVEMENT_DEFS[id],
        });
      }
    }

    const streakMilestones: [number, AchievementId][] = [
      [7, "on_fire"],
      [14, "unstoppable"],
      [30, "iron_will"],
    ];
    for (const [days, id] of streakMilestones) {
      if (streakData.longestStreak >= days) {
        unlocked.push({
          id,
          unlockedAt: new Date().toISOString(),
          def: ACHIEVEMENT_DEFS[id],
        });
      }
    }

    if (oldestSession) {
      const daysSinceFirst =
        (Date.now() - new Date(oldestDate).getTime()) / 86400000;
      if (daysSinceFirst >= 30) {
        unlocked.push({
          id: "month_one",
          unlockedAt: oldestDate,
          def: ACHIEVEMENT_DEFS["month_one"],
        });
      }
    }

    if (prs.length > 0) {
      unlocked.push({
        id: "pr_hunter",
        unlockedAt: prs[0].date,
        def: ACHIEVEMENT_DEFS["pr_hunter"],
      });
    }

    return unlocked;
  }, [sessions, streakData, prs]);
}
