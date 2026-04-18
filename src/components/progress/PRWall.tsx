"use client";

import { motion } from "framer-motion";
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

function PRCard({ record }: { record: PRRecord }) {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        background: "#000000",
        border: "1px solid var(--border-strong)",
        borderLeft: "3px solid var(--rust)",
        padding: "14px 14px 12px 16px",
      }}
      whileHover={{
        scale: 1.01,
        rotate: 0.3,
        boxShadow: "0 0 0 1px var(--rust), 0 0 20px -4px var(--rust-glow)",
        transition: { duration: 0.08 },
      }}
      initial={false}
    >
      {/* Rust notch — top-left corner clip */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 16,
          height: 16,
          background: "var(--rust)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          pointerEvents: "none",
        }}
      />

      {/* PR badge — top right */}
      <div
        aria-label="Personal Record"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "var(--rust)",
          color: "#fff",
          fontSize: 9,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          padding: "2px 4px",
          lineHeight: 1.2,
          userSelect: "none",
          animation: "prBadgeSpin 8s linear infinite",
        }}
      >
        PR
      </div>

      {/* Estimated 1RM */}
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="metric-xl"
          style={{ color: "var(--ink-high)", lineHeight: 1 }}
        >
          {record.estimated1RM}
        </span>
        <span
          className="stamp"
          style={{
            color: "var(--rust)",
            fontSize: 11,
            letterSpacing: "0.15em",
            alignSelf: "flex-end",
            paddingBottom: 2,
          }}
        >
          KG
        </span>
      </div>

      {/* Exercise name */}
      <div
        style={{
          fontFamily: "var(--font-heading, system-ui, sans-serif)",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          color: "var(--ink-high)",
          marginTop: 6,
          lineHeight: 1.2,
        }}
      >
        {record.exerciseName}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        <span
          className="stamp"
          style={{
            color: "var(--ink-mid)",
            fontSize: 10,
            letterSpacing: "0.15em",
          }}
        >
          {record.weight}KG × {record.reps}
        </span>
        <span
          className="stamp"
          style={{
            color: "var(--ink-low)",
            fontSize: 10,
            letterSpacing: "0.15em",
          }}
        >
          {formatPRDate(record.date)}
        </span>
      </div>
    </motion.div>
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
            <PRCard record={record} />
          </div>
        ))}
      </div>
    </>
  );
}
