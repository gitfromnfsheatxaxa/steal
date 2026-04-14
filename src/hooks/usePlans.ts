"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import type { WorkoutPlan, PlanDay, PlanExercise, PlanTemplate } from "@/types/plan";

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
