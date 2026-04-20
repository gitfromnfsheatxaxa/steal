"use client";

import { useQuery } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import { useI18n } from "@/components/providers/I18nProvider";
import type { ExerciseTranslation } from "@/lib/exercise-translate";

type Locale = ExerciseTranslation["locale"];

/**
 * Fetch a single translation row by (exerciseExtId, activeLanguage).
 * Short-circuits (returns null) when the active language is English — no
 * PocketBase call is issued.
 */
export function useExerciseTranslation(exerciseExtId: string | undefined) {
  const { language } = useI18n();
  const pb = getPocketBase();

  return useQuery<ExerciseTranslation | null>({
    queryKey: ["exerciseTranslation", exerciseExtId, language],
    enabled: !!exerciseExtId && language !== "en" && !!pb.authStore.isValid,
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      if (!exerciseExtId) return null;
      try {
        const record = await pb
          .collection("exercise_translations")
          .getFirstListItem<ExerciseTranslation>(
            `exerciseExtId="${exerciseExtId}" && locale="${language}"`,
          );
        return record;
      } catch {
        return null;
      }
    },
  });
}

/**
 * Batch-fetch translations for a list of exerciseExtIds in one PB request.
 * Returns a map keyed by exerciseExtId.
 */
export function useExercisesBatchTranslation(
  exerciseExtIds: string[],
): { data: Map<string, ExerciseTranslation>; isLoading: boolean } {
  const { language } = useI18n();
  const pb = getPocketBase();

  const query = useQuery<Map<string, ExerciseTranslation>>({
    queryKey: ["exerciseTranslations", language, exerciseExtIds.slice().sort().join(",")],
    enabled:
      language !== "en" &&
      exerciseExtIds.length > 0 &&
      pb.authStore.isValid,
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const map = new Map<string, ExerciseTranslation>();
      if (exerciseExtIds.length === 0) return map;

      // Chunk into groups of 80 to stay under PB filter length caps.
      const chunks: string[][] = [];
      for (let i = 0; i < exerciseExtIds.length; i += 80) {
        chunks.push(exerciseExtIds.slice(i, i + 80));
      }

      for (const chunk of chunks) {
        const idsFilter = chunk
          .map((id) => `exerciseExtId="${id}"`)
          .join(" || ");
        const records = await pb
          .collection("exercise_translations")
          .getFullList<ExerciseTranslation>({
            filter: `locale="${language}" && (${idsFilter})`,
          });
        for (const r of records) {
          map.set(r.exerciseExtId, r);
        }
      }
      return map;
    },
  });

  return {
    data: query.data ?? new Map<string, ExerciseTranslation>(),
    isLoading: query.isLoading,
  };
}

/**
 * Fetch ALL exercise names for the active language in one PocketBase call.
 * Returns a Map<exerciseExtId, translatedName> used to power multilingual search.
 * Short-circuits for English (no call needed).
 */
export function useAllExerciseTranslationNames(): Map<string, string> {
  const { language } = useI18n();
  const pb = getPocketBase();

  const { data } = useQuery<Map<string, string>>({
    queryKey: ["allExerciseTranslationNames", language],
    enabled: language !== "en" && !!pb.authStore.isValid,
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const records = await pb
        .collection("exercise_translations")
        .getFullList<{ exerciseExtId: string; name: string }>({
          filter: `locale="${language}"`,
          fields: "exerciseExtId,name",
        });
      const map = new Map<string, string>();
      for (const r of records) {
        if (r.name) map.set(r.exerciseExtId, r.name);
      }
      return map;
    },
  });

  return data ?? new Map<string, string>();
}

/**
 * Convenience: server/helper lookup by locale string (for RSC renders
 * that read the active language from a cookie).
 */
export async function fetchExerciseTranslation(
  exerciseExtId: string,
  locale: Locale,
): Promise<ExerciseTranslation | null> {
  if (locale === "en") return null;
  const pb = getPocketBase();
  try {
    return await pb
      .collection("exercise_translations")
      .getFirstListItem<ExerciseTranslation>(
        `exerciseExtId="${exerciseExtId}" && locale="${locale}"`,
      );
  } catch {
    return null;
  }
}
