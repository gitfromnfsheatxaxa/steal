"use client";

import { MOOD_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { MoodLevel } from "@/types/session";

interface MoodCheckProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
  label: string;
}

export function MoodCheck({ value, onChange, label }: MoodCheckProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-2">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value as MoodLevel)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 transition-colors",
              value === option.value
                ? "border-foreground bg-accent"
                : "border-border hover:border-foreground/30",
            )}
            aria-label={option.label}
          >
            <span className="text-xl">{option.emoji}</span>
            <span className="text-xs text-muted-foreground">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
