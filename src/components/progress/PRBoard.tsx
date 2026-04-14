"use client";

import { formatWeight, formatDate } from "@/lib/utils";
import type { PersonalRecord } from "@/types/progress";

interface PRBoardProps {
  records: PersonalRecord[];
}

export function PRBoard({ records }: PRBoardProps) {
  if (records.length === 0) {
    return (
      <div className="border border-border bg-card p-6 text-center">
        <p className="font-data text-sm uppercase tracking-wider text-muted-foreground">
          No records yet. Add weight. Come back.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card divide-y divide-border">
      {records.slice(0, 10).map((pr, i) => (
        <div
          key={pr.exerciseId}
          className="flex items-center justify-between gap-3 p-3 sm:p-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-data flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-[#1a1a1a] text-xs font-bold tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div
                className="truncate text-sm font-bold uppercase tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-heading, system-ui)" }}
              >
                {pr.exerciseName}
              </div>
              <div className="font-data mt-0.5 text-xs tabular-nums text-muted-foreground">
                {formatWeight(pr.weight)} × {pr.reps}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-data inline-block border border-[#e53e00]/30 bg-[#e53e00]/10 px-2 py-0.5 text-xs uppercase tabular-nums tracking-wider text-[#e53e00]">
              {formatWeight(pr.estimated1RM)} e1RM
            </span>
            <div className="font-data mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {formatDate(pr.date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
