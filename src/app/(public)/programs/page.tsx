"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BrandNoiseOverlay } from "@/components/layout/BrandNoiseOverlay";
import { PlanImageCarousel } from "@/components/programs/PlanImageCarousel";
import { ProgramPreview } from "@/components/programs/ProgramPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Clock, Target, Dumbbell, ChevronRight, Flame, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPocketBase } from "@/lib/pocketbase";
import { getProgramTemplate, getExerciseForWeek } from "@/lib/program-templates";
import type { ProgramTemplateDefinition } from "@/types/plan";
import { activateGuestProgram, useGuestActivePlan } from "@/hooks/useGuestWorkouts";
import { useIsGuestUser } from "@/hooks/useGuestWorkouts";

interface ProgramCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  weeks: number;
  daysPerWeek: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Elite";
  tags: string[];
  imageUrls?: string[];
  comingSoon?: boolean;
  templateId?: string; // Link to program template
}

const PROGRAMS: ProgramCard[] = [
  {
    id: "mentzer",
    title: "TRAIN LIKE MIKE MENTZER",
    subtitle: "Heavy Duty HIT",
    description:
      "One working set per exercise taken to complete failure. Extreme intensity, maximum recovery. The Mentzer way.",
    weeks: 4,
    daysPerWeek: "3-4x/week",
    difficulty: "Advanced",
    tags: ["Hypertrophy", "HIT", "Low Volume"],
    imageUrls: [
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Mike_Mentzer.jpg/250px-Mike_Mentzer.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Mm73D__comnPsYlVo0IUYSc0ADldXYCQvA&s",
    ],
    templateId: "mentzer",
  },
  {
    id: "yates",
    title: "TRAIN LIKE DORIAN YATES",
    subtitle: "Blood & Guts",
    description:
      "One all-out working set after warm-ups. Dorian's Blood & Guts method. Controlled negatives, brutal intensity.",
    weeks: 4,
    daysPerWeek: "4x/week",
    difficulty: "Elite",
    tags: ["Mass", "Strength", "High Intensity"],
    imageUrls: [
      "https://cdn.shopify.com/s/files/1/0709/7905/9960/files/Dorian_Yates_4-Day_Split_Workout_480x480.png?v=1730952240",
      "https://i1.sndcdn.com/artworks-izOMwxbnKyiWFCwy-BGOjRg-t500x500.jpg",
    ],
    templateId: "yates",
  },
  {
    id: "steal-hybrid",
    title: "STEAL HYBRID",
    subtitle: "Strength + Size",
    description:
      "Compound strength work Monday/Thursday. Hypertrophy accessory work Wednesday/Saturday. Progressive overload built in.",
    weeks: 4,
    daysPerWeek: "4x/week",
    difficulty: "Intermediate",
    tags: ["Hybrid", "Progressive", "Balanced"],
    imageUrls: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
      "https://images.unsplash.com/photo-1541534741688-6078c69fb145?q=80&w=800",
    ],
    templateId: "steal-hybrid",
  },
  {
    id: "ppl",
    title: "PUSH / PULL / LEGS",
    subtitle: "Classic Split",
    description:
      "The proven 6-day split. Push (chest/shoulders/triceps), Pull (back/biceps), Legs. Run twice per week.",
    weeks: 4,
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
    weeks: 4,
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
    weeks: 4,
    daysPerWeek: "4-6x/week",
    difficulty: "Advanced",
    tags: ["Powerbuilding", "531", "Strength"],
    comingSoon: true,
  },
];

const DIFFICULTY_CONFIG: Record<string, { border: string; text: string; bg: string }> = {
  Beginner: { border: "border-[#C2410C]/40", text: "text-[#C2410C]", bg: "bg-[#C2410C]/5" },
  Intermediate: { border: "border-[#71717A]/40", text: "text-[#71717A]", bg: "bg-[#71717A]/5" },
  Advanced: { border: "border-[#8B0000]/40", text: "text-[#8B0000]", bg: "bg-[#8B0000]/5" },
  Elite: { border: "border-[#C2410C]/40", text: "text-[#C2410C]", bg: "bg-[#C2410C]/5" },
};

function checkAuthAndRedirect(): boolean {
  const pb = getPocketBase();
  if (!pb.authStore.isValid || !pb.authStore.record) {
    toast.error("Please log in to build custom programs");
    return false;
  }
  return true;
}

export default function ProgramsPage() {
  const router = useRouter();
  const [activating, setActivating] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramTemplateDefinition | null>(null);
  const isGuest = useIsGuestUser();
  const { activePlan: guestActivePlan } = useGuestActivePlan();

  function handleStartProgram(program: ProgramCard) {
    if (program.comingSoon) return;
    
    // If we have a template, show preview first
    if (program.templateId) {
      const template = getProgramTemplate(program.templateId);
      if (template) {
        setSelectedProgram(template);
        return;
      }
    }
    
    // Fallback to direct activation
    activateProgram(program);
  }

  async function activateProgram(program: ProgramCard) {
    setActivating(program.id);
    try {
      // Check if user is a guest
      const pb = getPocketBase();
      const userId = pb.authStore.record?.id;
      
      if (!userId) {
        // Guest mode - activate program in localStorage
        const template = getProgramTemplate(program.templateId || "");
        const guestPlan = activateGuestProgram(
          {
            id: program.id,
            title: program.title,
            description: program.description,
            templateId: program.templateId,
            weeks: program.weeks,
          },
          template || undefined
        );
        
        toast.success(`${program.subtitle} activated (Guest Mode)`);
        router.push("/workout");
        return;
      }

      // Check if a plan from this template already exists for this user
      const existingPlans = await pb.collection("workout_plans").getFullList({
        filter: `user = "${userId}" && title = "${program.title}"`,
        fields: "id,status",
      });

      console.log("[ACTIVATE PROGRAM] Existing plans found:", existingPlans.length);

      if (existingPlans.length > 0) {
        const existingPlan = existingPlans[0];
        console.log("[ACTIVATE PROGRAM] Resuming existing plan:", existingPlan.id);
        
        // Check if the existing plan has plan days for the current week
        const planDays = await pb.collection("plan_days").getFullList({
          filter: `plan = "${existingPlan.id}" && week = ${existingPlan.currentWeek || 1}`,
        });
        console.log("[ACTIVATE PROGRAM] Existing plan days count:", planDays.length);

        // If no plan days exist, create them
        if (planDays.length === 0) {
          console.log("[ACTIVATE PROGRAM] No plan days found, creating them...");
          const template = getProgramTemplate(program.templateId || "");
          if (template) {
            await createPlanDaysForWeek(template, existingPlan.id, existingPlan.currentWeek || 1);
          }
        }
        
        if (existingPlan.status !== "active") {
          await pb.collection("workout_plans").update(existingPlan.id, {
            status: "active",
          });
        }

        toast.success(`${program.subtitle} already exists. Resuming...`);
        router.push(`/plans/${existingPlan.id}`);
        return;
      }

      // Create the plan
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

      // Get the template and create plan days + exercises for week 1
      const template = getProgramTemplate(program.templateId || "");
      if (template) {
        await createPlanDaysForWeek(template, plan.id, 1);
      }

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

  async function createPlanDaysForWeek(
    template: ProgramTemplateDefinition,
    planId: string,
    weekNumber: number
  ) {
    const pb = getPocketBase();
    console.log("[CREATE PLAN DAYS] Creating days for week", weekNumber, "template:", template.title);
    
    try {
      for (const day of template.weeklyStructure.days) {
        console.log("[CREATE PLAN DAYS] Creating day:", day.label);
        
        // Create plan day
        const planDay = await pb.collection("plan_days").create({
          plan: planId,
          week: weekNumber,
          dayOfWeek: day.dayOfWeek,
          label: day.label,
          focus: day.focus,
          warmup: day.warmup,
          cooldown: day.cooldown,
        });
        console.log("[CREATE PLAN DAYS] Created plan day:", planDay.id);

        // Create exercises for this day with week-specific variations
        for (let i = 0; i < day.exercises.length; i++) {
          const exercise = day.exercises[i];
          const exerciseData = getExerciseForWeek(exercise.primary, weekNumber);
          
          await pb.collection("plan_exercises").create({
            planDay: planDay.id,
            name: exerciseData.name,
            order: i + 1,
            sets: exerciseData.sets,
            repsMin: typeof exerciseData.repsMin === "number" ? exerciseData.repsMin : 8,
            repsMax: typeof exerciseData.repsMax === "number" ? exerciseData.repsMax : 12,
            rpeTarget: exercise.primary.rpeTarget,
            restSeconds: exercise.primary.restSeconds,
            notes: exerciseData.notes || exercise.primary.notes,
          });
          console.log("[CREATE PLAN DAYS] Created exercise:", exerciseData.name);
        }
      }
      console.log("[CREATE PLAN DAYS] Successfully created all days and exercises");
    } catch (error) {
      console.error("[CREATE PLAN DAYS] Error:", error);
      throw error;
    }
  }

  async function handlePreviewActivate(program: ProgramTemplateDefinition) {
    // Find the corresponding program card
    const programCard = PROGRAMS.find(p => p.templateId === program.id);
    if (programCard) {
      setSelectedProgram(null);
      await activateProgram(programCard);
    }
  }

  function handlePreviewBack() {
    setSelectedProgram(null);
  }

  function handleViewMyPrograms() {
    if (!checkAuthAndRedirect()) {
      return;
    }
    router.push("/dashboard");
  }

  function handleBuildCustom() {
    if (!checkAuthAndRedirect()) {
      return;
    }
    router.push("/plans/create");
  }

  // If a program is selected, show preview
  if (selectedProgram) {
    return (
      <ProgramPreview
        program={selectedProgram}
        onActivate={handlePreviewActivate}
        onBack={handlePreviewBack}
        activating={activating === selectedProgram.id}
      />
    );
  }

  return (
    <div className="page-enter space-y-10 py-6">
      {/* Header Section — brutal, aggressive */}
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="h-0.5 w-12 bg-[#e53e00]" />
          <h1
            className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#e5e5e5]"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            PROGRAMS
          </h1>
        </div>
        <p className="mt-2 max-w-xl text-sm text-[#71717A]">
          Pick a proven program. Execute. No AI. No excuses. Just work.
        </p>
      </div>

      {/* Pre-determined Programs */}
      <section className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#2a2a2a]" />
          <span className="font-data text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71717A]">
            SELECT YOUR PATH
          </span>
          <div className="h-px flex-1 bg-[#2a2a2a]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => {
            const difficultyConfig = DIFFICULTY_CONFIG[program.difficulty];
            return (
              <div
                key={program.id}
                className={cn(
                  "group relative flex flex-col bg-[#0a0a0a] transition-all duration-150 overflow-hidden",
                  !program.comingSoon && "cursor-pointer border border-[#2a2a2a] hover:border-[#e53e00]/50 hover:bg-[#111111]",
                  program.comingSoon && "border border-[#2a2a2a] opacity-50",
                )}
                onClick={() => !program.comingSoon && handleStartProgram(program)}
              >
                {/* Image Carousel for programs with images */}
                {program.imageUrls && program.imageUrls.length > 0 && !program.comingSoon && (
                  <PlanImageCarousel
                    imageUrls={program.imageUrls}
                    className="aspect-video"
                    autoSlideInterval={5000}
                    showNavigation={false}
                    showIndicators={true}
                  />
                )}
                
                <BrandNoiseOverlay />
                {program.comingSoon && (
                  <div className="absolute right-3 top-3 z-20 border border-[#2a2a2a] bg-[#050505] px-2 py-0.5">
                    <span className="font-data text-[10px] uppercase tracking-widest text-[#71717A]">
                      SOON
                    </span>
                  </div>
                )}

                {!program.comingSoon && (
                  <div className="absolute right-3 top-3 z-20 bg-[#e53e00] p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Flame className="h-3 w-3 text-white" />
                  </div>
                )}

                <div className="flex-1 p-5 relative z-10">
                  <div className="mb-3">
                    <p className="font-data text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                      {program.subtitle}
                    </p>
                    <h3
                      className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight text-[#E5E5E5]"
                      style={{ fontFamily: "var(--font-heading, system-ui)" }}
                    >
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-[#71717A]">
                    {program.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-none border font-data text-[10px] uppercase tracking-widest",
                        difficultyConfig.border,
                        difficultyConfig.text,
                      )}
                    >
                      {program.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-none border border-[#2a2a2a] font-data text-[10px] uppercase tracking-widest text-[#71717A]"
                    >
                      <Clock className="mr-1 h-2.5 w-2.5" />
                      {program.weeks}W
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-none border border-[#2a2a2a] font-data text-[10px] uppercase tracking-widest text-[#71717A]"
                    >
                      <Dumbbell className="mr-1 h-2.5 w-2.5" />
                      {program.daysPerWeek}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {program.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#1a1a1a] px-2 py-0.5 font-data text-[9px] uppercase tracking-widest text-[#71717A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#2a2a2a] p-4 relative z-10">
                  <Button
                    disabled={!!program.comingSoon || activating === program.id}
                    className={cn(
                      "w-full rounded-none font-data text-xs font-bold uppercase tracking-widest transition-all",
                      program.comingSoon
                        ? "bg-[#1a1a1a] text-[#71717A]"
                        : "bg-[#e53e00] text-white hover:bg-[#ff4500]",
                    )}
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
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-[#2a2a2a]" />
        <span className="font-data text-[10px] uppercase tracking-widest text-[#71717A]">
          OR
        </span>
        <div className="h-px flex-1 bg-[#2a2a2a]" />
      </div>

      {/* Custom Program Builder */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#2a2a2a]" />
          <span className="font-data text-[10px] font-semibold uppercase tracking-[0.2em] text-[#71717A]">
            CUSTOM PROGRAM
          </span>
          <div className="h-px flex-1 bg-[#2a2a2a]" />
        </div>

        <div className="relative overflow-hidden border border-[#2a2a2a] bg-[#0a0a0a] p-6" style={{ borderLeft: "3px solid #e53e00" }}>
          <BrandNoiseOverlay />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3
                className="text-2xl font-black uppercase tracking-tight text-[#e5e5e5]"
                style={{ fontFamily: "var(--font-heading, system-ui)" }}
              >
                BUILD YOUR OWN
              </h3>
              <p className="mt-1 max-w-md text-sm text-[#71717A]">
                Full control. Your exercises, your splits, your progression. Build it from scratch.
              </p>
            </div>
            <Button
              onClick={handleBuildCustom}
              disabled={activating !== null}
              className="shrink-0 rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
            >
              <Pencil className="mr-2 h-3 w-3" />
              BUILD MANUALLY
            </Button>
          </div>
        </div>
      </section>

      {/* My Programs link */}
      <div className="border-t border-[#1a1a1a] pt-4">
        <button
          onClick={handleViewMyPrograms}
          className="group flex items-center gap-2 font-data text-xs font-semibold uppercase tracking-widest text-[#71717A] transition-colors hover:text-[#E5E5E5]"
        >
          <Target className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          VIEW MY PROGRAMS
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}