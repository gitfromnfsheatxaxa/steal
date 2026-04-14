export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "forearms"
  | "traps";

export type ExerciseCategory = "compound" | "isolation" | "cardio" | "mobility";
export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  muscleGroups: MuscleGroup[];
  equipment: string[];
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  instructions: string;
  alternatives: string[]; // exercise IDs
  videoUrl: string | null;
  created: string;
  updated: string;
}
