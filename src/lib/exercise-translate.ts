import type { LibraryExercise } from "@/types/exercise";
import type { ExerciseV2 } from "@/lib/exercise-db-api";

/**
 * Stored translation row, keyed by (exerciseExtId, locale).
 * Array fields are stored as newline-joined strings to fit PocketBase's
 * text columns; split back on read.
 */
export interface ExerciseTranslation {
  exerciseExtId: string;
  locale: "en" | "ru" | "uz";
  name?: string;
  overview?: string;
  description?: string;
  instructions?: string;
  exerciseTips?: string;
  variations?: string;
  secondaryMuscles?: string;
  bodyPart?: string;
  equipment?: string;
  muscleGroup?: string;
  target?: string;
  category?: string;
  difficulty?: string;
}

function splitLines(value: string | undefined): string[] | null {
  if (!value) return null;
  const parts = value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : null;
}

/**
 * Overlay a translation on top of the canonical English library exercise.
 * Each field falls back to the English value when not translated.
 */
export function applyTranslationToLibraryExercise(
  ex: LibraryExercise,
  t: ExerciseTranslation | null | undefined,
): LibraryExercise {
  if (!t) return ex;

  const steps = splitLines(t.instructions) ?? ex.steps;
  const tips = splitLines(t.exerciseTips) ?? ex.tips;
  const variations = splitLines(t.variations) ?? ex.variations;
  const secondaryMuscles = splitLines(t.secondaryMuscles) ?? ex.secondaryMuscles;

  return {
    ...ex,
    name: t.name || ex.name,
    bodyPart: t.bodyPart || ex.bodyPart,
    equipment: t.equipment || ex.equipment,
    muscleGroup: t.muscleGroup || ex.muscleGroup,
    target: t.target || ex.target,
    category: t.category || ex.category,
    difficulty: t.difficulty || ex.difficulty,
    overview: t.overview || ex.overview,
    instructions: steps.join(" "),
    steps,
    tips,
    variations,
    secondaryMuscles,
  };
}

/**
 * Same overlay but applied directly to a raw V2 API shape, returning a
 * LibraryExercise. Convenience for server renders that already have the
 * ExerciseV2 in hand.
 */
export function applyTranslationToV2(
  ex: ExerciseV2,
  t: ExerciseTranslation | null | undefined,
): ExerciseV2 {
  if (!t) return ex;
  return {
    ...ex,
    name: t.name || ex.name,
    bodyParts: t.bodyPart ? [t.bodyPart] : ex.bodyParts,
    equipments: t.equipment ? [t.equipment] : ex.equipments,
    targetMuscles: t.target ? [t.target] : ex.targetMuscles,
    secondaryMuscles: splitLines(t.secondaryMuscles) ?? ex.secondaryMuscles,
    instructions: splitLines(t.instructions) ?? ex.instructions,
    exerciseTips: splitLines(t.exerciseTips) ?? ex.exerciseTips,
    variations: splitLines(t.variations) ?? ex.variations,
    overview: t.overview || ex.overview,
    category: t.category || ex.category,
    difficulty: t.difficulty || ex.difficulty,
  };
}
