import type { MuscleGroup } from "./exercise";

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  estimated1RM: number;
}

export interface VolumeDataPoint {
  week: string; // ISO date of week start
  totalVolume: number; // sets * reps * weight
  muscleGroupVolume: Partial<Record<MuscleGroup, number>>;
}

export interface StreakData {
  currentStreak: number; // consecutive days with a session
  longestStreak: number;
  totalSessions: number;
  thisWeekSessions: number;
  thisMonthSessions: number;
}

export interface MuscleBalanceData {
  muscleGroup: MuscleGroup;
  weeklyVolume: number; // total weekly volume (sets * reps * weight)
  weeklySets: number;
}
