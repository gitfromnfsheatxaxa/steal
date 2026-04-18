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
  alternatives: string[];
  videoUrl: string | null;
  created: string;
  updated: string;
}

/**
 * Normalized exercise record surfaced to UI consumers.
 * Shape is stable even after the underlying source API changes.
 */
export interface LibraryExercise {
  id: string;
  exerciseId: string;
  name: string;
  slug: string;
  category: string;
  difficulty: string;
  bodyPart: string;
  equipment: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  target: string;
  instructions: string;
  steps: string[];
  overview: string;
  tips: string[];
  variations: string[];
  image: string;
  gif: string;
  videoUrl: string;
}
