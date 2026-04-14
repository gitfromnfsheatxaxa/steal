import type { MuscleGroup } from "@/types/exercise";
import type { EquipmentItem, GoalType, Environment } from "@/types/profile";

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "quads", label: "Quads" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "glutes", label: "Glutes" },
  { value: "calves", label: "Calves" },
  { value: "core", label: "Core" },
  { value: "forearms", label: "Forearms" },
  { value: "traps", label: "Traps" },
];

export const EQUIPMENT_OPTIONS: { value: EquipmentItem; label: string }[] = [
  { value: "bodyweight", label: "Bodyweight" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "resistance_bands", label: "Resistance Bands" },
  { value: "pullup_bar", label: "Pull-up Bar" },
  { value: "bench", label: "Bench" },
  { value: "squat_rack", label: "Squat Rack" },
  { value: "cables", label: "Cable Machine" },
  { value: "machines", label: "Gym Machines" },
  { value: "dip_bars", label: "Dip Bars" },
  { value: "foam_roller", label: "Foam Roller" },
];

export const GOAL_OPTIONS: { value: GoalType; label: string; description: string }[] = [
  { value: "muscle_building", label: "Build Muscle", description: "Hypertrophy-focused training to grow and sculpt" },
  { value: "strength", label: "Get Stronger", description: "Heavy compounds to build raw strength" },
  { value: "fat_loss", label: "Lose Fat", description: "High-intensity circuits to burn and tone" },
  { value: "endurance", label: "Build Endurance", description: "Condition your body for lasting performance" },
  { value: "rehabilitation", label: "Rehab & Recovery", description: "Gentle, progressive movement for healing" },
];

export const ENVIRONMENT_OPTIONS: { value: Environment; label: string; description: string }[] = [
  { value: "gym", label: "Gym", description: "Full access to machines, barbells, and cables" },
  { value: "home", label: "Home", description: "Limited equipment — dumbbells, bands, bodyweight" },
  { value: "outdoor", label: "Outdoor", description: "Parks, tracks, and calisthenics setups" },
  { value: "mixed", label: "Mixed", description: "Combination of gym and home training" },
];

export const RPE_SCALE: { value: number; label: string; description: string }[] = [
  { value: 6, label: "6", description: "Very light — could do 4+ more reps" },
  { value: 7, label: "7", description: "Light — could do 3 more reps" },
  { value: 8, label: "8", description: "Moderate — could do 2 more reps" },
  { value: 9, label: "9", description: "Hard — could do 1 more rep" },
  { value: 10, label: "10", description: "Maximum effort — nothing left" },
];

export const FITNESS_LEVELS = [
  { value: "beginner" as const, label: "Beginner", description: "New to structured training (0-1 years)" },
  { value: "intermediate" as const, label: "Intermediate", description: "Consistent training experience (1-3 years)" },
  { value: "advanced" as const, label: "Advanced", description: "Seasoned lifter with solid foundation (3+ years)" },
];

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const MOOD_OPTIONS: { value: string; label: string; emoji: string }[] = [
  { value: "great", label: "Feeling great", emoji: "💪" },
  { value: "good", label: "Good energy", emoji: "😊" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "rough", label: "Rough day", emoji: "😔" },
  { value: "terrible", label: "Really struggling", emoji: "😞" },
];

export const DEFAULT_REST_SECONDS: Record<string, number> = {
  compound: 150, // 2.5 min
  isolation: 75,  // 1.25 min
  cardio: 30,
  mobility: 30,
};
