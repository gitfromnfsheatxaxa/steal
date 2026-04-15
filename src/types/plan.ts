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
  imageUrls?: string[] | string;
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
    duration: string;
    notes: string;
  }>;
}

export interface PlanExercise {
  id: string;
  planDay: string;
  exercise: string;
  name?: string;
  order: number;
  sets: number;
  repsMin: number;
  repsMax: number;
  rpeTarget: number;
  restSeconds: number;
  notes: string;
  substitutions: string[]; // exercise IDs
  weekVariations?: ExerciseVariation[]; // Alternative exercises for rotation
  expand?: { exercise?: { id: string; name: string; slug: string } };
  created: string;
  updated: string;
}

export interface ExerciseVariation {
  weekRange: [number, number]; // [startWeek, endWeek]
  exerciseId: string;
  name: string;
  sets?: number;
  repsMin?: number;
  repsMax?: number;
  notes?: string;
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
  imageUrls?: string[];
  tagline?: string;
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
      variations?: ExerciseVariationTemplate[];
    }>;
    warmup?: WarmupCooldown;
    cooldown?: WarmupCooldown;
  }>;
  // One-week challenge structure
  weeklyRotation?: {
    rotationType: "exercise" | "intensity" | "volume";
    maxWeeks: number; // How many weeks before renewal needed
  };
}

export interface ExerciseVariationTemplate {
  weekNumber: number;
  exerciseSlug: string;
  name: string;
  sets?: number;
  repsMin?: number;
  repsMax?: number;
  notes?: string;
}

// Predefined program templates with exercise rotations
export interface ProgramTemplateDefinition {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Elite";
  daysPerWeek: string;
  tags: string[];
  imageUrls: string[];
  goalType: GoalType;
  environment: Environment;
  weeklyStructure: WeeklyProgramStructure;
}

export interface WeeklyProgramStructure {
  // The base week structure (repeats with variations)
  days: Array<{
    dayOfWeek: number;
    label: string;
    focus: string[];
    exercises: Array<{
      primary: ExerciseWithVariations;
    }>;
    warmup?: WarmupCooldown;
    cooldown?: WarmupCooldown;
  }>;
  // How many weeks the rotation lasts before renewal
  rotationLength: number;
}

export interface ExerciseWithVariations {
  // Primary exercise (Week 1)
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  rpeTarget: number;
  restSeconds: number;
  notes?: string;
  // Alternative exercises for subsequent weeks
  variations: ExerciseVariationDef[];
}

export interface ExerciseVariationDef {
  weekNumber: number;
  name: string;
  sets?: number;
  repsMin?: number | string; // Can be number or string like "8-10"
  repsMax?: number | string;
  notes?: string;
}
