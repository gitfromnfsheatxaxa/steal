"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import { useRestTimer } from "@/hooks/useRestTimer";
import { useWorkoutStore } from "@/stores/workout-store";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { RestTimer } from "@/components/workout/RestTimer";
import { MoodCheck } from "@/components/workout/MoodCheck";
import { WorkoutSummary } from "@/components/workout/WorkoutSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clock, CheckCircle2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { PlanDay, PlanExercise } from "@/types/plan";
import type { MoodLevel, ActiveSetInput } from "@/types/session";

export default function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const pb = getPocketBase();
  const timer = useRestTimer();
  const store = useWorkoutStore();

  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [notes, setNotes] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Initialise from persisted startedAt so timer survives page reloads
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    if (store.startedAt) {
      return Math.max(0, Math.floor((Date.now() - new Date(store.startedAt).getTime()) / 1000));
    }
    return 0;
  });

  const { data: planDay, isLoading: dayLoading } = useQuery<PlanDay>({
    queryKey: ["planDay", sessionId],
    queryFn: () => pb.collection("plan_days").getOne<PlanDay>(sessionId),
  });

  const { data: planExercises, isLoading: exLoading } = useQuery<PlanExercise[]>({
    queryKey: ["planExercises", sessionId],
    queryFn: async () => {
      const records = await pb
        .collection("plan_exercises")
        .getList<PlanExercise>(1, 50, {
          filter: `planDay="${sessionId}"`,
          sort: "order",
          expand: "exercise",
        });
      return records.items;
    },
    enabled: !!sessionId,
  });

  // Start a fresh session in the store only if none is active
  useEffect(() => {
    if (planExercises && planExercises.length > 0 && !store.sessionId) {
      store.startSession(
        sessionId,
        sessionId,
        planExercises.map((ex, i) => ({
          exerciseId: ex.expand?.exercise?.id ?? "",
          exerciseName:
            ex.name?.trim() ||
            ex.expand?.exercise?.name ||
            ex.notes?.trim() ||
            `Exercise ${i + 1}`,
          targetSets: ex.sets,
          completedSets: [],
        })),
      );
    }
  }, [planExercises, sessionId, store]);

  // Tick every second
  useEffect(() => {
    if (showSummary) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [showSummary]);

  // Resolve exercise display name: live query > store persisted > fallback
  const getExerciseName = (ex: PlanExercise, i: number): string =>
    ex.name?.trim() ||
    ex.expand?.exercise?.name ||
    store.exercises[i]?.exerciseName ||
    `Exercise ${i + 1}`;

  function handleCompleteSet(exerciseIndex: number, data: ActiveSetInput) {
    store.completeSet(exerciseIndex, data);
    const ex = planExercises?.[exerciseIndex];
    if (ex?.restSeconds) timer.start(ex.restSeconds);
    toast.success("Set logged.", { duration: 1500 });
  }

  async function handleFinishWorkout() {
    setIsFinishing(true);
    try {
      const pb = getPocketBase();
      const userId = pb.authStore.record?.id;

      const session = await pb.collection("workout_sessions").create({
        user: userId,
        planDay: sessionId,
        plan: planDay?.plan || "",
        startedAt: store.startedAt ?? new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        status: "completed",
        mood,
        energyLevel:
          mood === "great" ? 5 : mood === "good" ? 4 : mood === "okay" ? 3 : mood === "rough" ? 2 : 1,
        sessionNotes: notes,
      });

      for (let i = 0; i < store.exercises.length; i++) {
        const ex = store.exercises[i];
        // Only send exercise relation if it came from a verified exercises-collection expand
        const verifiedExerciseId = planExercises?.[i]?.expand?.exercise?.id ?? null;
        for (let s = 0; s < ex.completedSets.length; s++) {
          const set = ex.completedSets[s];
          const exerciseRelation = verifiedExerciseId ? { exercise: verifiedExerciseId } : {};
          await pb.collection("session_sets").create({
            session: session.id,
            ...exerciseRelation,
            setNumber: s + 1,
            reps: set.reps,
            weight: set.weight,
            rpe: set.rpe,
            completed: true,
            notes: set.notes || "",
          });
        }
      }

      store.endSession();
      setShowSummary(true);
      toast.success("Session saved.");
    } catch (err) {
      const pbErr = err as { status?: number; response?: unknown; data?: unknown; message?: string };
      console.error("[FINISH SESSION]", pbErr.status, JSON.stringify(pbErr.response ?? pbErr.data));
      toast.error("Failed to save. Check your connection and try again.");
    } finally {
      setIsFinishing(false);
    }
  }

  if (showSummary) {
    return (
      <WorkoutSummary
        duration={elapsedSeconds}
        exercises={store.exercises.map((ex, i) => ({
          name: ex.exerciseName || getExerciseName(planExercises?.[i] ?? ({} as PlanExercise), i),
          completedSets: ex.completedSets,
        }))}
      />
    );
  }

  if (dayLoading || exLoading) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="skeleton-steal h-8 w-48 rounded-none" />
        <Skeleton className="skeleton-steal h-64 rounded-none" />
        <Skeleton className="skeleton-steal h-64 rounded-none" />
      </div>
    );
  }

  if (!planExercises || planExercises.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-data text-sm uppercase tracking-widest text-muted-foreground">
          No exercises found for this session.
        </p>
      </div>
    );
  }

  const totalSets = store.exercises.reduce((sum, ex) => sum + ex.completedSets.length, 0);
  const targetSets = store.exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
  const progressPct = targetSets > 0 ? Math.round((totalSets / targetSets) * 100) : 0;

  return (
    <div className="space-y-5 py-4">
      {/* Header */}
      <div className="space-y-3">
        <div>
          <h1
            className="text-3xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            {planDay?.label || "WORKOUT"}
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-data text-sm tabular-nums text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-[#e53e00]" />
            {formatDuration(elapsedSeconds)}
          </span>
          <Badge
            variant="outline"
            className="rounded-none border-[#e53e00]/40 font-data text-[10px] uppercase tracking-widest text-[#e53e00]"
          >
            {totalSets} / {targetSets} SETS
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-border">
          <div
            className="h-1 bg-[#e53e00] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {planExercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exerciseName={getExerciseName(ex, i)}
            exerciseNumber={i + 1}
            sets={ex.sets}
            repsMin={ex.repsMin}
            repsMax={ex.repsMax}
            rpeTarget={ex.rpeTarget}
            restSeconds={ex.restSeconds}
            notes={ex.notes}
            completedSets={store.exercises[i]?.completedSets ?? []}
            onCompleteSet={(data) => handleCompleteSet(i, data)}
            isActive={store.currentExerciseIndex === i}
          />
        ))}
      </div>

      {/* Finish section */}
      <div className="space-y-4 border border-border bg-card p-5">
        <h2
          className="text-base font-extrabold uppercase tracking-widest"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          WRAP IT UP
        </h2>

        <MoodCheck value={mood} onChange={setMood} label="HOW'D IT GO?" />

        <div className="space-y-1.5">
          <label
            className="font-data text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            htmlFor="session-notes"
          >
            Notes
          </label>
          <Textarea
            id="session-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What to remember. What to fix. What to crush next time."
            rows={2}
            className="rounded-none border-border bg-input font-data text-sm"
          />
        </div>

        <Button
          onClick={handleFinishWorkout}
          disabled={isFinishing || totalSets === 0}
          className="w-full rounded-none bg-[#e53e00] font-data text-sm font-bold uppercase tracking-widest text-white hover:bg-[#ff4500] disabled:opacity-40"
          size="lg"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isFinishing ? "SAVING..." : "FINISH SESSION"}
        </Button>

        {totalSets === 0 && (
          <p className="text-center font-data text-xs text-muted-foreground">
            Log at least one set to finish.
          </p>
        )}
      </div>

      {/* Rest timer */}
      <RestTimer
        secondsLeft={timer.secondsLeft}
        isRunning={timer.isRunning}
        onStart={timer.start}
        onStop={timer.reset}
        defaultSeconds={90}
      />
    </div>
  );
}
