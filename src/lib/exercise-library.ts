import type { LibraryExercise } from "@/types/exercise";

let _cache: Promise<LibraryExercise[]> | null = null;

export function getAllExercises(): Promise<LibraryExercise[]> {
  if (!_cache) {
    _cache = import("@/data/exercises.json").then(
      (m) => (m.default ?? m) as LibraryExercise[],
    );
  }
  return _cache;
}

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const MIN_TOKEN_LENGTH = 4;

export async function findExerciseByName(
  name: string,
): Promise<LibraryExercise | null> {
  const exercises = await getAllExercises();
  const normalizedInput = normalize(name);

  // 1. Exact slug match
  const slugTarget = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const bySlug = exercises.find((ex) => ex.slug === slugTarget);
  if (bySlug) return bySlug;

  // 2. Normalized name equality
  const byName = exercises.find((ex) => normalize(ex.name) === normalizedInput);
  if (byName) return byName;

  // 3. Longest shared normalized token match
  // Split on word boundaries in the *original* input (before normalization collapses spaces),
  // then normalize each token individually. Without this, "Barbell Row" becomes the single
  // token "barbellrow" which never matches any dataset entry.
  const inputTokens = name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length >= MIN_TOKEN_LENGTH);

  if (inputTokens.length === 0) return null;

  let bestScore = 0;
  let bestMatch: LibraryExercise | null = null;

  for (const ex of exercises) {
    const exNorm = normalize(ex.name);
    let score = 0;
    for (const token of inputTokens) {
      if (exNorm.includes(token)) score += token.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ex;
    }
  }

  return bestScore >= MIN_TOKEN_LENGTH ? bestMatch : null;
}

export interface SearchOptions {
  q?: string;
  bodyPart?: string;
  equipment?: string;
  muscleGroup?: string;
  target?: string;
}

export async function searchExercises(
  opts: SearchOptions,
): Promise<LibraryExercise[]> {
  const exercises = await getAllExercises();
  const q = opts.q?.toLowerCase();

  return exercises.filter((ex) => {
    if (q && !ex.name.toLowerCase().includes(q)) return false;
    if (opts.bodyPart && ex.bodyPart !== opts.bodyPart) return false;
    if (opts.equipment && ex.equipment !== opts.equipment) return false;
    if (opts.muscleGroup && ex.muscleGroup !== opts.muscleGroup) return false;
    if (opts.target && ex.target !== opts.target) return false;
    return true;
  });
}

export async function getFilterOptions(): Promise<{
  bodyParts: string[];
  equipment: string[];
  muscleGroups: string[];
  targets: string[];
}> {
  const exercises = await getAllExercises();

  const bodyParts = [...new Set(exercises.map((ex) => ex.bodyPart).filter(Boolean))].sort();
  const equipment = [...new Set(exercises.map((ex) => ex.equipment).filter(Boolean))].sort();
  const muscleGroups = [...new Set(exercises.map((ex) => ex.muscleGroup).filter(Boolean))].sort();
  const targets = [...new Set(exercises.map((ex) => ex.target).filter(Boolean))].sort();

  return { bodyParts, equipment, muscleGroups, targets };
}
