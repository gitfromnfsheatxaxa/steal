"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dumbbell, Trophy, BarChart3 } from "lucide-react";

interface PRRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  estimated1RM: number;
}

interface PRWallProps {
  prs: PRRecord[];
  className?: string;
}

export function PRWall({ prs, className }: PRWallProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Sort by estimated1RM descending and take top 5
  const sorted = [...prs].sort((a, b) => b.estimated1RM - a.estimated1RM).slice(0, 5);

  if (sorted.length === 0) {
    return (
      <div className={cn("glass p-8 text-center", className)}>
        <div className="stamp text-xs tracking-widest text-[#525252]">PERSONAL RECORDS</div>
        <p className="text-[#A3A3A3] mt-2 stamp text-[10px]">No PRs yet — keep forging</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes sparkPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15) rotate(-5deg); }
        }
        .spark-anim { animation: sparkPulse 1.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .spark-anim { animation: none; }
        }
      `}</style>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
        {sorted.map((pr, i) => {
          const Icon = i === 0 ? Trophy : i === 1 ? BarChart3 : Dumbbell;
          const formatDate = (iso: string) => {
            const d = new Date(iso);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
          };
          return (
            <div
              key={pr.exerciseName}
              className="group relative p-5 transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(10,10,10,0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {mounted && i < 2 && (
                <div className="absolute top-2 right-2 spark-anim">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E", boxShadow: "0 0 12px #22C55E" }} />
                </div>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <Icon className="h-6 w-6 text-[#22C55E] mb-2" />
                  <div className="stamp text-[10px] tracking-[0.2em] text-[#C8C8C8]">PERSONAL RECORD</div>
                  <p className="font-bold text-lg text-[#E5E5E5] mt-1 uppercase">{pr.exerciseName}</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-mono font-bold text-[#22C55E] tabular-nums">{pr.estimated1RM}</span>
                  <span className="text-xs text-[#A3A3A3] block">{pr.weight}kg × {pr.reps}</span>
                </div>
              </div>
              <div className="text-[10px] text-[#666] mt-4 pt-3 border-t border-white/10 flex justify-between stamp">
                <span>{formatDate(pr.date)}</span>
                <span className="text-[#22C55E]">HIGHEST e1RM</span>
              </div>
              {/* Hover glow */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.08), transparent 70%)",
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}