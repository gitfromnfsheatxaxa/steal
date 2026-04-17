"use client";

import { SetRow } from "./SetRow";
import type { ActiveSetInput } from "@/types/session";
import { formatDuration } from "@/lib/utils";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

interface ExerciseCardProps {
  exerciseName: string;
  exerciseNumber: number;
  sets: number;
  repsMin: number;
  repsMax: number;
  rpeTarget: number;
  restSeconds: number;
  notes: string;
  completedSets: ActiveSetInput[];
  onCompleteSet: (data: ActiveSetInput) => void;
  isActive: boolean;
}

export function ExerciseCard({
  exerciseName,
  exerciseNumber,
  sets,
  repsMin,
  repsMax,
  rpeTarget,
  restSeconds,
  notes,
  completedSets,
  onCompleteSet,
  isActive,
}: ExerciseCardProps) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const targetReps = repsMin === repsMax ? `${repsMin}` : `${repsMin}–${repsMax}`;
  const allComplete = completedSets.length >= sets;

  return (
    <div
      className={cn(
        "border bg-card transition-colors",
        allComplete
          ? "border-[#16a34a]/30 bg-[#16a34a]/5"
          : isActive
            ? "border-[#e53e00]/50"
            : "border-border",
      )}
    >
      {/* Exercise header — tap to collapse */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        {/* Number badge */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-background font-data text-xs font-bold tabular-nums text-muted-foreground">
          {exerciseNumber}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-extrabold uppercase leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            {exerciseName}
          </p>
          <div className="mt-0.5 flex items-center gap-3">
            <span className="font-data text-xs text-muted-foreground">
              {sets} × {targetReps}
            </span>
            {restSeconds > 0 && (
              <span className="flex items-center gap-1 font-data text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(restSeconds)}
              </span>
            )}
            <span className="font-data text-xs tabular-nums text-[#e53e00]">
              {completedSets.length}/{sets} {t("dashboard.DONE").toLowerCase()}
            </span>
          </div>
        </div>

        {collapsed ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {/* Body */}
      {!collapsed && (
        <div className="border-t border-border">
          {/* Coach note */}
          {notes?.trim() && (
            <div className="border-b border-border bg-[#1a1a1a] px-4 py-2">
              <p className="font-data text-xs text-muted-foreground">{notes}</p>
            </div>
          )}

          {/* Column headers */}
          <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 px-4 py-2">
            <span className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">#</span>
            <span className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">kg</span>
            <span className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">Reps</span>
            <span />
          </div>

          {/* Set rows */}
          <div className="divide-y divide-border">
            {Array.from({ length: sets }).map((_, i) => (
              <SetRow
                key={i}
                setNumber={i + 1}
                targetReps={targetReps}
                completed={completedSets[i]}
                previousWeight={completedSets[i - 1]?.weight}
                previousReps={completedSets[i - 1]?.reps}
                onComplete={onCompleteSet}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
