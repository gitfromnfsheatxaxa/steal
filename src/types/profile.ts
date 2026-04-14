export interface Limitation {
  area: string;
  severity: "mild" | "moderate" | "severe";
  notes: string;
}

export interface Profile {
  id: string;
  user: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: "male" | "female" | "other";
  bodyFatPct: number | null;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  limitations: Limitation[];
  injuryHistory: string;
  created: string;
  updated: string;
}

export interface ProfileFormData {
  age: number;
  height: number;
  weight: number;
  gender: "male" | "female" | "other";
  bodyFatPct?: number;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  limitations: Limitation[];
  injuryHistory: string;
}

export type GoalType =
  | "muscle_building"
  | "strength"
  | "fat_loss"
  | "endurance"
  | "rehabilitation";

export type Environment = "gym" | "home" | "outdoor" | "mixed";

export type EquipmentItem =
  | "barbell"
  | "dumbbells"
  | "kettlebell"
  | "pullup_bar"
  | "resistance_bands"
  | "cables"
  | "machines"
  | "bench"
  | "squat_rack"
  | "dip_bars"
  | "foam_roller"
  | "bodyweight";

export interface Goal {
  id: string;
  user: string;
  type: GoalType;
  environment: Environment;
  equipment: EquipmentItem[];
  daysPerWeek: number;
  sessionMinutes: number;
  priority: "primary" | "secondary";
  created: string;
  updated: string;
}

export interface GoalFormData {
  type: GoalType;
  environment: Environment;
  equipment: EquipmentItem[];
  daysPerWeek: number;
  sessionMinutes: number;
  priority: "primary" | "secondary";
}
