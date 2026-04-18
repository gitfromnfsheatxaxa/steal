import { getAllExercises, getFilterOptions } from "@/lib/exercise-library";
import { BrandNoiseOverlay } from "@/components/layout/BrandNoiseOverlay";
import { ExerciseLibrary } from "./ExerciseLibrary";

export const revalidate = 3600;

export const metadata = {
  title: "Exercise Library | Steal Therapy",
};

export default async function ExercisesPage() {
  const [filters, all] = await Promise.all([
    getFilterOptions(),
    getAllExercises(),
  ]);

  return (
    <div className="space-y-6 py-6">
      <div className="border-b border-[#2a2a2a] pb-4 relative overflow-hidden">
        <BrandNoiseOverlay />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="stamp text-[9px] tracking-[0.3em] text-[#525252]"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                FIELD MANUAL
              </span>
              <div className="h-px w-8 bg-[#2a2a2a]" />
              <span
                className="stamp text-[8px] text-[#e53e00] tracking-widest"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {all.length > 0 ? "LOADED" : "READY"}
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#e5e5e5]"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              Exercise Library
            </h1>
            <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className="stamp text-[9px] tracking-[0.15em] text-[#525252]"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              ENTRIES
            </span>
            <span
              className="font-data text-xl font-bold tabular-nums text-[#e53e00]"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {all.length.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <ExerciseLibrary filters={filters} />
    </div>
  );
}
