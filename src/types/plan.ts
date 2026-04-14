import type { GoalType, Environment } from "./profile";

export type PlanSource = "template" | "custom";
export type PlanStatus = "active" | "completed" | "paused" | "archived";

export interface WorkoutPlan {
  id: string;
  user: string;
  title: string;
  description: string;
  source: PlanSource;
  templateId: string | null;
  goalType: GoalType;
  environment: Environment;
  durationWeeks: number;
  currentWeek: number;
  status: PlanStatus;
  created: string;
  updated: string;
}

export interface PlanDay {
  id: string;
  plan: string;
  week: number;
  dayOfWeek: number; // 1-7
  label: string;
  focus: string[];
  warmup: WarmupCooldown | null;
  cooldown: WarmupCooldown | null;
  created: string;
  updated: string;
}

export interface WarmupCooldown {
  exercises: Array<{
    name: string;
    duration: string; // e.g. "5 min", "30 sec each side"
    notes: string;
  }>;
}

export interface PlanExercise {
  id: string;
  planDay: string;
  exercise: string;
  name?: string; // free-text exercise name (used when no exercise relation)
  order: number;
  sets: number;
  repsMin: number;
  repsMax: number;
  rpeTarget: number; // 1-10
  restSeconds: number;
  notes: string;
  substitutions: string[]; // exercise IDs
  expand?: { exercise?: { id: string; name: string; slug: string } };
  created: string;
  updated: string;
}

export interface PlanTemplate {
  id: string;
  title: string;
  description: string;
  goalType: GoalType;
  environment: Environment;
  difficulty: "beginner" | "intermediate" | "advanced";
  durationWeeks: number;
  structure: PlanTemplateStructure;
  popularity: number;
  created: string;
  updated: string;
}

export interface PlanTemplateStructure {
  days: Array<{
    dayOfWeek: number;
    label: string;
    focus: string[];
    exercises: Array<{
      exerciseSlug: string;
      sets: number;
      repsMin: number;
      repsMax: number;
      rpeTarget: number;
      restSeconds: number;
      notes: string;
    }>;
  }>;
}
