"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LibraryExercise } from "@/types/exercise";
import { getAllExercises } from "@/lib/exercise-library";
import { useI18n } from "@/components/providers/I18nProvider";
import { useExercisesBatchTranslation, useAllExerciseTranslationNames } from "@/hooks/useExerciseTranslation";
import { applyTranslationToLibraryExercise } from "@/lib/exercise-translate";
import { tBodyPart, tEquipment, tMuscle } from "@/lib/exercise-taxonomy";

interface FilterOptions {
  bodyParts: string[];
  equipment: string[];
  muscleGroups: string[];
  targets: string[];
}

interface Props {
  filters: FilterOptions;
}

const PAGINATION_SIZE = 20;

function TileSkeleton() {
  return (
    <div className="border border-[#2a2a2a] bg-[#0a0a0a] overflow-hidden">
      <div className="skeleton-steal aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton-steal h-3 w-3/4" />
        <div className="flex gap-1">
          <div className="skeleton-steal h-3 w-16" />
          <div className="skeleton-steal h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

function ExerciseTile({ exercise, noImgLabel }: { exercise: LibraryExercise; noImgLabel: string }) {
  return (
    <Link
      href={`/exercises/${exercise.slug}`}
      className="group border border-[#2a2a2a] bg-[#0a0a0a] overflow-hidden block transition-all duration-150 hover:-translate-y-0.5 hover:border-[#e53e00]/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#e53e00]"
      style={{ boxShadow: "0 0 0 0 transparent" }}
    >
      <div className="relative aspect-square w-full bg-[#111] overflow-hidden">
        {exercise.image ? (
          <Image
            src={exercise.image}
            alt={exercise.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="stamp text-[#525252] text-[9px] tracking-widest"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {noImgLabel}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-150" />
      </div>

      <div className="p-3">
        <p
          className="font-data text-[11px] font-bold uppercase tracking-widest text-[#e5e5e5] leading-tight mb-2 line-clamp-2 group-hover:text-[#e53e00] transition-colors"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {exercise.name}
        </p>
        <div className="flex flex-wrap gap-1">
          {exercise.bodyPart && (
            <span className="px-1.5 py-0.5 border border-[#2a2a2a] font-data text-[8px] uppercase tracking-widest text-[#71717A]">
              {exercise.bodyPart}
            </span>
          )}
          {exercise.equipment && (
            <span className="px-1.5 py-0.5 border border-[#2a2a2a] font-data text-[8px] uppercase tracking-widest text-[#525252]">
              {exercise.equipment}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-3 py-1.5 font-data text-[10px] font-semibold uppercase tracking-widest transition-all border relative overflow-hidden",
        active
          ? "border-[#e53e00] text-[#e53e00] bg-[#e53e00]/10"
          : "border-[#2a2a2a] text-[#71717A] hover:border-[#525252] hover:text-[#a3a3a3]",
      )}
      style={{ borderLeft: active ? "3px solid #e53e00" : "3px solid transparent" }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export function ExerciseLibrary({ filters }: Props) {
  const { language, t } = useI18n();
  const translationNames = useAllExerciseTranslationNames();
  const [allExercises, setAllExercises] = useState<LibraryExercise[] | null>(
    null,
  );
  const [displayCount, setDisplayCount] = useState(PAGINATION_SIZE);
  const [rawQ, setRawQ] = useState("");
  const [q, setQ] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [equipment, setEquipment] = useState("");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getAllExercises()
      .then((data) => {
        setAllExercises(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleQueryChange = useCallback((val: string) => {
    setRawQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQ(val.trim()), 150);
  }, []);

  const filteredExercises = useMemo(() => {
    if (!allExercises) return [];
    const lowerQ = q.toLowerCase();
    return allExercises.filter((ex) => {
      if (lowerQ) {
        const translatedName = translationNames.get(ex.exerciseId)?.toLowerCase();
        const matchesEn = ex.name.toLowerCase().includes(lowerQ);
        const matchesTranslated = translatedName?.includes(lowerQ) ?? false;
        if (!matchesEn && !matchesTranslated) return false;
      }
      if (bodyPart && ex.bodyPart !== bodyPart) return false;
      if (equipment && ex.equipment !== equipment) return false;
      if (target && ex.target !== target) return false;
      return true;
    });
  }, [allExercises, q, bodyPart, equipment, target, translationNames]);

  useEffect(() => {
    setDisplayCount(PAGINATION_SIZE);
  }, [q, bodyPart, equipment, target]);

  const displayedSlice = useMemo(
    () => filteredExercises.slice(0, displayCount),
    [filteredExercises, displayCount],
  );

  const visibleExtIds = useMemo(
    () => displayedSlice.map((ex) => ex.exerciseId),
    [displayedSlice],
  );

  const { data: translations } = useExercisesBatchTranslation(visibleExtIds);

  const displayedExercises = useMemo(() => {
    if (language === "en") return displayedSlice;
    return displayedSlice.map((ex) => {
      const t = translations.get(ex.exerciseId);
      const merged = applyTranslationToLibraryExercise(ex, t);
      return {
        ...merged,
        bodyPart:
          t?.bodyPart || tBodyPart(ex.bodyPart, language) || ex.bodyPart,
        equipment:
          t?.equipment || tEquipment(ex.equipment, language) || ex.equipment,
        target: t?.target || tMuscle(ex.target, language) || ex.target,
      };
    });
  }, [displayedSlice, translations, language]);

  const hasMore = displayedSlice.length < filteredExercises.length;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#525252] pointer-events-none" />
        <input
          type="search"
          value={rawQ}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={t("library.SEARCH")}
          aria-label="Search exercises"
          className="w-full border border-[#2a2a2a] bg-[#0a0a0a] pl-10 pr-4 py-2.5 font-data text-[11px] uppercase tracking-widest text-[#e5e5e5] placeholder:text-[#525252] focus:outline-none focus:border-[#e53e00]/60 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-custom"
          role="group"
          aria-label="Filter by body part"
        >
          <FilterChip
            label={t("library.ALL")}
            active={bodyPart === ""}
            onClick={() => setBodyPart("")}
          />
          {filters.bodyParts.map((bp) => (
            <FilterChip
              key={bp}
              label={tBodyPart(bp, language).toUpperCase()}
              active={bodyPart === bp}
              onClick={() => setBodyPart(bodyPart === bp ? "" : bp)}
            />
          ))}
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-custom"
          role="group"
          aria-label="Filter by equipment"
        >
          <FilterChip
            label={t("library.ANY_EQUIP")}
            active={equipment === ""}
            onClick={() => setEquipment("")}
          />
          {filters.equipment.map((eq) => (
            <FilterChip
              key={eq}
              label={tEquipment(eq, language).toUpperCase()}
              active={equipment === eq}
              onClick={() => setEquipment(equipment === eq ? "" : eq)}
            />
          ))}
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-custom"
          role="group"
          aria-label="Filter by target muscle"
        >
          <FilterChip
            label={t("library.ALL_MUSCLES")}
            active={target === ""}
            onClick={() => setTarget("")}
          />
          {filters.targets.map((t) => (
            <FilterChip
              key={t}
              label={tMuscle(t, language).toUpperCase()}
              active={target === t}
              onClick={() => setTarget(target === t ? "" : t)}
            />
          ))}
        </div>
      </div>

      {!isLoading && allExercises !== null && (
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-[#1a1a1a]" />
          <span
            className="stamp text-[9px] text-[#525252] tracking-widest"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            {displayedSlice.length} / {filteredExercises.length} {t("library.RESULTS")}
          </span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <TileSkeleton key={i} />
          ))}
        </div>
      ) : displayedExercises.length === 0 ? (
        <div
          className="border border-[#2a2a2a] bg-[#0a0a0a] flex flex-col items-center justify-center py-20 gap-4"
          style={{ borderLeft: "3px solid #525252" }}
        >
          <span
            className="stamp text-[14px] tracking-[0.3em] text-[#525252]"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            {t("library.NO_RESULTS")}
          </span>
          <span
            className="stamp text-[10px] text-[#71717A] tracking-[0.2em]"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            {t("library.NO_RESULTS_DESC")}
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedExercises.map((ex) => (
              <ExerciseTile key={ex.id} exercise={ex} noImgLabel={t("library.NO_IMG")} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setDisplayCount((c) => c + PAGINATION_SIZE)}
                className="px-6 py-3 border border-[#e53e00] bg-[#0a0a0a] text-[#e53e00] font-data text-[10px] font-semibold uppercase tracking-widest hover:bg-[#e53e00] hover:text-white transition-all relative overflow-hidden"
                style={{ borderLeft: "3px solid #e53e00" }}
              >
                {t("library.LOAD_MORE")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
