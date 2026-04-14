export type SessionStatus = "in_progress" | "completed" | "skipped";
export type MoodLevel = "great" | "good" | "okay" | "rough" | "terrible";

export interface WorkoutSession {
  id: string;
  user: string;
  planDay: string | null;
  plan: string | null;
  startedAt: string;
  completedAt: string | null;
  status: SessionStatus;
  mood: MoodLevel | null;
  energyLevel: number | null; // 1-5
  sessionNotes: string;
  therapyReflection: string;
  created: string;
  updated: string;
}

export interface SessionSet {
  id: string;
  session: string;
  exercise: string;
  setNumber: number;
  reps: number;
  weight: number; // kg
  rpe: number; // 1-10
  completed: boolean;
  notes: string;
  created: string;
  updated: string;
}

export interface ActiveSetInput {
  reps: number;
  weight: number;
  rpe: number;
  notes?: string;
}
