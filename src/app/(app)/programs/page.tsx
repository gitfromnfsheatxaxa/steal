"use client";

import Link from "next/link";
import { useState } from "react";
import { useActivePlan, useUpdatePlanStatus } from "@/hooks/usePlans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Clock, Target, Dumbbell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPocketBase } from "@/lib/pocketbase";

interface ProgramCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  weeks: number;
  daysPerWeek: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Elite";
  tags: string[];
  comingSoon?: boolean;
}

const PROGRAMS: ProgramCard[] = [
  {
    id: "mentzer",
    title: "TRAIN LIKE MIKE MENTZER",
    subtitle: "Heavy Duty HIT",
    description:
      "One working set per exercise taken to complete failure. Extreme intensity, maximum recovery. The Mentzer way.",
    weeks: 8,
    daysPerWeek: "3-4x/week",
    difficulty: "Advanced",
    tags: ["Hypertrophy", "HIT", "Low Volume"],
  },
  {
    id: "yates",
    title: "TRAIN LIKE DORIAN YATES",
    subtitle: "Blood & Guts",
    description:
      "One all-out working set after warm-ups. Dorian's Blood & Guts method. Controlled negatives, brutal intensity.",
    weeks: 10,
    daysPerWeek: "4x/week",
    difficulty: "Elite",
    tags: ["Mass", "Strength", "High Intensity"],
  },
  {
    id: "steal-hybrid",
    title: "STEAL HYBRID",
    subtitle: "Strength + Size",
    description:
      "Compound strength work Monday/Thursday. Hypertrophy accessory work Wednesday/Saturday. Progressive overload built in.",
    weeks: 12,
    daysPerWeek: "4x/week",
    difficulty: "Intermediate",
    tags: ["Hybrid", "Progressive", "Balanced"],
  },
  {
    id: "ppl",
    title: "PUSH / PULL / LEGS",
    subtitle: "Classic Split",
    description:
      "The proven 6-day split. Push (chest/shoulders/triceps), Pull (back/biceps), Legs. Run twice per week.",
    weeks: 8,
    daysPerWeek: "6x/week",
    difficulty: "Intermediate",
    tags: ["Hypertrophy", "Volume", "Split"],
    comingSoon: true,
  },
  {
    id: "5x5",
    title: "STARTING STRENGTH 5x5",
    subtitle: "Raw Power",
    description:
      "Squat, deadlift, bench, press, row. Five sets of five. Add weight every session. Beginner strength done right.",
    weeks: 12,
    daysPerWeek: "3x/week",
    difficulty: "Beginner",
    tags: ["Strength", "Powerlifting", "Compound"],
    comingSoon: true,
  },
  {
    id: "nsuns",
    title: "nSuns 531",
    subtitle: "Powerbuilding",
    description:
      "Linear progression on the big four lifts with hypertrophy accessories. Wendler's 531 methodology, optimized.",
    weeks: 16,
    daysPerWeek: "4-6x/week",
    difficulty: "Advanced",
    tags: ["Powerbuilding", "531", "Strength"],
    comingSoon: true,
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "border-[#16a34a]/40 text-[#16a34a]",
  Intermediate: "border-[#888888]/40 text-[#888888]",
  Advanced: "border-[#e53e00]/40 text-[#e53e00]",
  Elite: "border-purple-500/40 text-purple-400",
};

export default function ProgramsPage() {
  const router = useRouter();
  const { data: activePlan } = useActivePlan();
  const updateStatus = useUpdatePlanStatus();
  const [activating, setActivating] = useState<string | null>(null);

  async function handleActivateTemplate(program: ProgramCard) {
    if (program.comingSoon) return;
    setActivating(program.id);
    try {
      const pb = getPocketBase();
      const userId = pb.authStore.record?.id;
      if (!userId) {
        toast.error("Not logged in.");
        return;
      }

      // Deactivate current plan if any
      if (activePlan) {
        await updateStatus.mutateAsync({
          planId: activePlan.id,
          status: "paused",
        });
      }

      // Create a new plan from this template
      const plan = await pb.collection("workout_plans").create({
        user: userId,
        title: program.title,
        description: program.description,
        source: "template",
        goalType: "muscle_building",
        environment: "gym",
        durationWeeks: program.weeks,
        currentWeek: 1,
        status: "active",
      });

      toast.success(`${program.subtitle} activated.`);
      router.push(`/plans/${plan.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[START PROGRAM]", err);
      toast.error(`Failed to activate: ${msg}`);
    } finally {
      setActivating(null);
    }
  }

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div>
        <h1
          className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          PROGRAMS
        </h1>
        <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        <p className="mt-3 text-sm text-muted-foreground">
          Pick a proven program or build your own. No AI. No excuses.
        </p>
      </div>

      {/* Pre-determined Programs */}
      <section className="space-y-4">
        <h2 className="font-data text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          PRE-DETERMINED PROGRAMS
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => (
            <div
              key={program.id}
              className={cn(
                "group relative flex flex-col border border-border bg-card p-5 transition-colors",
                !program.comingSoon && "cursor-pointer hover:border-[#e53e00]/50",
                program.comingSoon && "opacity-60",
              )}
            >
              {program.comingSoon && (
                <span className="absolute right-3 top-3 border border-border bg-background px-2 py-0.5 font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  SOON
                </span>
              )}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-data text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {program.subtitle}
                  </p>
                  <h3
                    className="mt-0.5 text-lg font-extrabold uppercase leading-tight tracking-tight"
                    style={{ fontFamily: "var(--font-heading, system-ui)" }}
                  >
                    {program.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-none font-data text-[10px] uppercase tracking-widest",
                      DIFFICULTY_COLOR[program.difficulty],
                    )}
                  >
                    {program.difficulty}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-none border-border font-data text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    <Clock className="mr-1 h-2.5 w-2.5" />
                    {program.weeks}W
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-none border-border font-data text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    <Dumbbell className="mr-1 h-2.5 w-2.5" />
                    {program.daysPerWeek}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {program.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#1a1a1a] px-2 py-0.5 font-data text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => handleActivateTemplate(program)}
                  disabled={!!program.comingSoon || activating === program.id}
                  className="w-full rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500] disabled:opacity-40"
                >
                  {activating === program.id
                    ? "ACTIVATING..."
                    : program.comingSoon
                      ? "COMING SOON"
                      : "START PROGRAM"}
                  {!program.comingSoon && <ChevronRight className="ml-1 h-3 w-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
          OR
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Manual Builder CTA */}
      <section className="space-y-4">
        <h2 className="font-data text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          CUSTOM PROGRAM
        </h2>
        <div className="border border-dashed border-[#e53e00]/40 bg-[#e53e00]/5 p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3
                className="text-2xl font-extrabold uppercase tracking-tight"
                style={{ fontFamily: "var(--font-heading, system-ui)" }}
              >
                BUILD YOUR OWN
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Full control. Your exercises, your splits, your progression. Build it from scratch.
              </p>
            </div>
            <Button
              asChild
              className="shrink-0 rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
            >
              <Link href="/plans/create">
                <Pencil className="mr-2 h-3 w-3" />
                BUILD MANUALLY
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* My Programs link */}
      <div className="border-t border-border pt-4">
        <Link
          href="/plans"
          className="flex items-center gap-2 font-data text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <Target className="h-3 w-3" />
          VIEW MY PROGRAMS
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
