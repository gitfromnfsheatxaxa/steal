import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllExercises } from "@/lib/exercise-library";
import { BrandNoiseOverlay } from "@/components/layout/BrandNoiseOverlay";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const exercises = await getAllExercises();
  return exercises.map((ex) => ({ slug: ex.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const exercises = await getAllExercises();
  const ex = exercises.find((e) => e.slug === slug);
  if (!ex) return {};
  return { title: `${ex.name} | Exercise Library | Steal Therapy` };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { slug } = await params;
  const exercises = await getAllExercises();
  const exercise = exercises.find((ex) => ex.slug === slug);

  if (!exercise) notFound();

  return (
    <div className="space-y-6 py-6">
      {/* ── Back ──────────────────────────────────────────────────────────── */}
      <Link
        href="/exercises"
        className="inline-flex items-center gap-1.5 font-data text-[10px] uppercase tracking-widest text-[#71717A] hover:text-[#e5e5e5] transition-colors group"
      >
        <ChevronLeft className="h-3 w-3 group-hover:text-[#e53e00] transition-colors" />
        LIBRARY
      </Link>

      {/* ── GIF Hero ──────────────────────────────────────────────────────── */}
      <div className="border border-[#2a2a2a] bg-[#0a0a0a] relative overflow-hidden">
        <BrandNoiseOverlay />
        <div className="relative z-10 flex justify-center p-4 sm:p-8 bg-[#050505]">
          {exercise.gif ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exercise.gif}
              alt={exercise.name}
              loading="lazy"
              className="max-h-64 sm:max-h-80 w-auto object-contain"
            />
          ) : exercise.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exercise.image}
              alt={exercise.name}
              loading="lazy"
              className="max-h-64 sm:max-h-80 w-auto object-contain"
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <span
                className="stamp text-[#525252] text-[10px] tracking-widest"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                NO MEDIA
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Name + orange bar ─────────────────────────────────────────────── */}
      <div>
        <h1
          className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#e5e5e5]"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          {exercise.name}
        </h1>
        <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
      </div>

      {/* ── Meta row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "BODY PART", value: exercise.bodyPart },
          { label: "EQUIPMENT", value: exercise.equipment },
          { label: "TARGET", value: exercise.target },
          { label: "CATEGORY", value: exercise.category },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="border border-[#2a2a2a] bg-[#0a0a0a] p-3 relative overflow-hidden"
            style={{ borderLeft: "2px solid #e53e00" }}
          >
            <BrandNoiseOverlay />
            <div className="relative z-10">
              <p
                className="stamp text-[8px] text-[#525252] tracking-widest mb-1"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {label}
              </p>
              <p
                className="font-data text-[11px] font-bold uppercase tracking-widest text-[#e5e5e5]"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {value || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Instructions ──────────────────────────────────────────────────── */}
      {exercise.instructions && (
        <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-4 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <span
                className="stamp text-[9px] uppercase tracking-widest text-[#525252]"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                INSTRUCTIONS
              </span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
            </div>
            <p className="font-data text-[13px] leading-relaxed text-[#a3a3a3]">
              {exercise.instructions}
            </p>
          </div>
        </div>
      )}

      {/* ── Steps ─────────────────────────────────────────────────────────── */}
      {exercise.steps.length > 0 && (
        <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-4 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <span
                className="stamp text-[9px] uppercase tracking-widest text-[#525252]"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                STEPS
              </span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
            </div>
            <ol className="space-y-3">
              {exercise.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="shrink-0 font-data text-[10px] font-bold text-[#e53e00] tabular-nums pt-0.5"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-data text-[13px] leading-relaxed text-[#a3a3a3]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* ── Secondary muscles ─────────────────────────────────────────────── */}
      {exercise.secondaryMuscles.length > 0 && (
        <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-4 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <p
              className="stamp text-[9px] uppercase tracking-widest text-[#525252] mb-3"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              SECONDARY MUSCLES
            </p>
            <div className="flex flex-wrap gap-2">
              {exercise.secondaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="px-2 py-1 border border-[#2a2a2a] font-data text-[9px] uppercase tracking-widest text-[#71717A]"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom HUD ────────────────────────────────────────────────────── */}
      <div className="border-t-2 border-[#e53e00] pt-4">
        <div className="grid grid-cols-3">
          <div className="px-4 py-2 text-center border-r border-[#1a1a1a]">
            <p
              className="stamp text-[8px] text-[#525252] mb-1"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              MUSCLE GROUP
            </p>
            <p
              className="font-data text-[10px] text-[#71717A] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {exercise.muscleGroup || "—"}
            </p>
          </div>
          <div className="px-4 py-2 text-center border-r border-[#1a1a1a]">
            <p
              className="stamp text-[8px] text-[#525252] mb-1"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              TARGET
            </p>
            <p
              className="font-data text-[10px] text-[#71717A] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {exercise.target || "—"}
            </p>
          </div>
          <div className="px-4 py-2 text-center">
            <p
              className="stamp text-[8px] text-[#525252] mb-1"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              EXERCISE ID
            </p>
            <p
              className="font-data text-[10px] text-[#71717A] truncate"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {exercise.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
