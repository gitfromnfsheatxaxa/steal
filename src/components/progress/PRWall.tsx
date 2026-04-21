"use client";

import { cn } from "@/lib/utils";

interface PRRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  estimated1RM: number;
}

interface PRWallProps {
  records: PRRecord[];
  className?: string;
}

function formatPRDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

const PR_ICONS = ["🏆", "⚡", "🔥"];

function PRCard({ record, index }: { record: PRRecord; index: number }) {
  return (
    <div
      className="glass-acc glass-hover"
      style={{ padding: "14px 10px", textAlign: "center" }}
    >
      <div style={{ fontSize: 22, marginBottom: 8 }}>{PR_ICONS[index % PR_ICONS.length]}</div>
      <div
        className="font-heading uppercase"
        style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 4 }}
      >
        {record.exerciseName}
      </div>
      <div
        className="font-heading"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#C2410C",
          lineHeight: 1,
          textShadow: "0 0 20px rgba(194,65,12,0.5)",
        }}
      >
        {record.estimated1RM}KG
      </div>
      <span
        className="font-data block"
        style={{ fontSize: 7, color: "#333", marginTop: 5, letterSpacing: "0.1em" }}
      >
        {record.weight}KG × {record.reps} · {formatPRDate(record.date)}
      </span>
    </div>
  );
}

export function PRWall({ records, className }: PRWallProps) {
  if (records.length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center py-16", className)}
        aria-live="polite"
      >
        <span
          className="stamp"
          style={{
            fontSize: 13,
            letterSpacing: "0.25em",
            color: "var(--ink-dim)",
            textAlign: "center",
          }}
        >
          NO PRS YET — EARN THEM.
        </span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes prBadgeSpin {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Personal Record"] {
            animation: none !important;
          }
        }
      `}</style>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-3 gap-2",
          className
        )}
        role="list"
        aria-label="Personal records"
      >
        {records.map((record, i) => (
          <div key={`${record.exerciseName}-${i}`} role="listitem">
            <PRCard record={record} index={i} />
          </div>
        ))}
      </div>
    </>
  );
}
