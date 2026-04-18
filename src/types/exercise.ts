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

/** Exercise record from the static exercises dataset (hasaneyldrm/exercises-dataset). */
export interface LibraryExercise {
  id: string;
  name: string;
  slug: string;
  category: string;
  bodyPart: string;
  equipment: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  target: string;
  instructions: string;
  steps: string[];
  image: string;
  gif: string;
}
