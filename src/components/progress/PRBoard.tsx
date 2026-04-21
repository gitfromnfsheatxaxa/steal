"use client";

import { cn } from "@/lib/utils";
import type { PersonalRecord } from "@/types/progress";

function estKg(oneRM: number, reps: number): string {
  if (oneRM <= 0) return "—";
  return String(Math.round(oneRM / (1 + reps / 30)));
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso)
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
  } catch {
    return "—";
  }
}

const COLS = ["EXERCISE", "1RM", "3RM~", "5RM~", "DATE"];

interface PRBoardProps {
  records: PersonalRecord[];
  className?: string;
}

export function PRBoard({ records, className }: PRBoardProps) {
  if (records.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-10", className)}>
        <span className="font-data text-[10px] text-[#333] tracking-[0.2em] uppercase">
          No records yet — earn them.
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-hidden", className)}
      role="table"
      aria-label="Personal records board"
      style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
        gap: 1,
      }}
    >
      {/* Header row */}
      {COLS.map((h) => (
        <div
          key={h}
          role="columnheader"
          style={{ padding: "4px 7px", background: "rgba(0,0,0,0.4)" }}
        >
          <span className="font-data text-[7px] text-[#222] tracking-[0.08em] uppercase">{h}</span>
        </div>
      ))}

      {/* Data rows */}
      {records.map((pr, i) => {
        const bg = i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.2)";
        const baseCellStyle = {
          padding: "5px 7px",
          background: bg,
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        };

        return [
          <div key={`${i}-0`} role="cell" style={baseCellStyle}>
            <span className="font-data text-[10px] text-[#555] uppercase leading-tight block truncate">
              {pr.exerciseName}
            </span>
          </div>,
          <div key={`${i}-1`} role="cell" style={baseCellStyle}>
            <span className="font-data text-[12px] font-bold text-[#C2410C]">
              {Math.round(pr.estimated1RM)}
            </span>
          </div>,
          <div key={`${i}-2`} role="cell" style={baseCellStyle}>
            <span className="font-data text-[10px] text-[#333]">
              {estKg(pr.estimated1RM, 3)}
            </span>
          </div>,
          <div key={`${i}-3`} role="cell" style={baseCellStyle}>
            <span className="font-data text-[10px] text-[#333]">
              {estKg(pr.estimated1RM, 5)}
            </span>
          </div>,
          <div key={`${i}-4`} role="cell" style={baseCellStyle}>
            <span className="font-data text-[9px] text-[#2a2a2a]">
              {fmtDate(pr.date)}
            </span>
          </div>,
        ];
      })}
    </div>
  );
}
