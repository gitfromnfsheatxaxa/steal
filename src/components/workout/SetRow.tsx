"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ActiveSetInput } from "@/types/session";
import { Check } from "lucide-react";

interface SetRowProps {
  setNumber: number;
  targetReps: string;
  previousWeight?: number;
  previousReps?: number;
  completed?: ActiveSetInput;
  onComplete: (data: ActiveSetInput) => void;
}

export function SetRow({
  setNumber,
  targetReps,
  previousWeight,
  previousReps,
  completed,
  onComplete,
}: SetRowProps) {
  const [weight, setWeight] = useState(completed?.weight ?? previousWeight ?? 0);
  const [reps, setReps] = useState(completed?.reps ?? previousReps ?? 0);

  const isCompleted = !!completed;

  function handleComplete() {
    if (reps === 0 && weight === 0) return;
    onComplete({ weight, reps, rpe: 7 });
  }

  if (isCompleted) {
    return (
      <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 bg-[#16a34a]/5 px-4 py-3">
        <span className="font-data text-sm font-bold tabular-nums text-[#16a34a]">
          {setNumber}
        </span>
        <span className="font-data text-base font-bold tabular-nums text-foreground">
          {completed.weight > 0 ? `${completed.weight}` : "—"}
        </span>
        <span className="font-data text-base font-bold tabular-nums text-foreground">
          {completed.reps}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#16a34a]">
          <Check className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 px-4 py-3">
      <span className="font-data text-sm font-bold tabular-nums text-muted-foreground">
        {setNumber}
      </span>

      {/* Weight input */}
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={2.5}
          value={weight || ""}
          onChange={(e) => setWeight(Number(e.target.value))}
          placeholder={previousWeight ? String(previousWeight) : "kg"}
          className={cn(
            "h-12 w-full border border-border bg-input px-3 text-center font-data text-base font-bold tabular-nums text-foreground",
            "placeholder:text-muted-foreground/50",
            "focus:border-[#e53e00] focus:outline-none",
          )}
          aria-label={`Set ${setNumber} weight`}
        />
      </div>

      {/* Reps input */}
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={reps || ""}
          onChange={(e) => setReps(Number(e.target.value))}
          placeholder={previousReps ? String(previousReps) : targetReps}
          className={cn(
            "h-12 w-full border border-border bg-input px-3 text-center font-data text-base font-bold tabular-nums text-foreground",
            "placeholder:text-muted-foreground/50",
            "focus:border-[#e53e00] focus:outline-none",
          )}
          aria-label={`Set ${setNumber} reps`}
        />
      </div>

      {/* Done button */}
      <button
        type="button"
        onClick={handleComplete}
        disabled={reps === 0 && weight === 0}
        className={cn(
          "flex h-12 w-9 items-center justify-center transition-colors",
          reps > 0 || weight > 0
            ? "bg-[#e53e00] text-white hover:bg-[#ff4500]"
            : "bg-border text-muted-foreground",
        )}
        aria-label={`Log set ${setNumber}`}
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
}
