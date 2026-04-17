"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import type { WorkoutPlan, PlanDay, PlanExercise, PlanTemplate } from "@/types/plan";
import type { WorkoutSession } from "@/types/session";

export function usePlans() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<WorkoutPlan[]>({
    queryKey: ["plans", userId],
    queryFn: async () => {
      if (!userId) return [];
      const records = await pb
        .collection("workout_plans")
        .getList<WorkoutPlan>(1, 50, {
          filter: `user="${userId}"`,
          sort: "-created",
        });
      return records.items;
    },
    enabled: !!userId,
  });
}

export function usePlanDaySession(planDayId: string | undefined) {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<WorkoutSession | null>({
    queryKey: ["planDaySession", planDayId, userId],
    queryFn: async () => {
      if (!planDayId || !userId) return null;
      try {
        const records = await pb
          .collection("workout_sessions")
          .getList<WorkoutSession>(1, 1, {
            filter: `planDay="${planDayId}" && user="${userId}" && status="completed"`,
            sort: "-completedAt",
          });
        return records.items[0] ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!planDayId && !!userId,
  });
}

/** Fetch all completed sessions for a given plan (used for sequential locking). */
export function usePlanCompletedSessions(planId: string | undefined) {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<Set<string>>({
    queryKey: ["planCompletedDays", planId, userId],
    queryFn: async () => {
      if (!planId || !userId) return new Set<string>();
      const records = await pb
        .collection("workout_sessions")
        .getList<WorkoutSession>(1, 200, {
          filter: `plan="${planId}" && user="${userId}" && status="completed"`,
          fields: "planDay",
        });
      return new Set(records.items.map((r) => r.planDay).filter((id): id is string => !!id));
    },
    enabled: !!planId && !!userId,
  });
}

export function useActivePlan() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<WorkoutPlan | null>({
    queryKey: ["activePlan", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const records = await pb
          .collection("workout_plans")
          .getList<WorkoutPlan>(1, 1, {
            filter: `user="${userId}" && status="active"`,
            sort: "-created",
          });
        return records.items[0] ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!userId,
  });
}

export function usePlanDays(planId: string | undefined) {
  const pb = getPocketBase();

  return useQuery<PlanDay[]>({
    queryKey: ["planDays", planId],
    queryFn: async () => {
      if (!planId) return [];
      const records = await pb
        .collection("plan_days")
        .getList<PlanDay>(1, 100, {
          filter: `plan="${planId}"`,
          sort: "week,dayOfWeek",
        });
      return records.items;
    },
    enabled: !!planId,
  });
}

export function usePlanExercises(planDayId: string | undefined) {
  const pb = getPocketBase();

  return useQuery<PlanExercise[]>({
    queryKey: ["planExercises", planDayId],
    queryFn: async () => {
      if (!planDayId) return [];
      const records = await pb
        .collection("plan_exercises")
        .getList<PlanExercise>(1, 50, {
          filter: `planDay="${planDayId}"`,
          sort: "order",
          expand: "exercise",
        });
      return records.items;
    },
    enabled: !!planDayId,
  });
}

export function useTemplates() {
  const pb = getPocketBase();

  return useQuery<PlanTemplate[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const records = await pb
        .collection("plan_templates")
        .getList<PlanTemplate>(1, 50, { sort: "-popularity" });
      return records.items;
    },
  });
}

export function useUpdatePlanStatus() {
  const pb = getPocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      status,
    }: {
      planId: string;
      status: WorkoutPlan["status"];
    }) => {
      return pb.collection("workout_plans").update(planId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["activePlan"] });
    },
  });
}

export function useDeletePlan() {
  const pb = getPocketBase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      // First, get all plan days for this plan
      const planDays = await pb
        .collection("plan_days")
        .getFullList({ filter: `plan="${planId}"` });

      // Delete all plan exercises for each plan day
      for (const planDay of planDays) {
        await pb
          .collection("plan_exercises")
          .getFullList({ filter: `planDay="${planDay.id}"` })
          .then((exercises) =>
            Promise.all(exercises.map((ex: any) => pb.collection("plan_exercises").delete(ex.id)))
          );
        
        // Delete the plan day
        await pb.collection("plan_days").delete(planDay.id);
      }

      // Finally, delete the workout plan
      return pb.collection("workout_plans").delete(planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["activePlan"] });
    },
  });
}
