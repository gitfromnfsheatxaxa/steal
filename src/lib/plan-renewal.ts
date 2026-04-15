/**
 * Plan Renewal Utilities
 * 
 * Handles the logic for renewing/extending one-week challenge programs
 * with rotated exercises for the next week.
 */

import { getPocketBase } from "./pocketbase";
import { getProgramTemplate, getExerciseForWeek } from "./program-templates";
import type { ProgramTemplateDefinition, ExerciseWithVariations } from "@/types/plan";

/**
 * Renew/extend a plan to the next week with rotated exercises
 */
export async function renewPlan(
  planId: string,
  templateId: string,
  currentWeek: number
): Promise<{ success: boolean; message: string; newPlanId?: string }> {
  try {
    const pb = getPocketBase();
    const userId = pb.authStore.record?.id;
    
    if (!userId) {
      return { success: false, message: "Not logged in" };
    }

    const template = getProgramTemplate(templateId);
    if (!template) {
      return { success: false, message: "Template not found" };
    }

    // Calculate next week
    const nextWeek = currentWeek + 1;
    const rotationLength = template.weeklyStructure.rotationLength;
    
    // If we've completed the full rotation, start over at week 1
    const actualWeek = nextWeek > rotationLength ? 1 : nextWeek;

    // Get the plan and update it
    await pb.collection("workout_plans").update(planId, {
      currentWeek: actualWeek,
      status: "active",
    });

    // Delete old plan days for this week
    const oldPlanDays = await pb.collection("plan_days").getFullList({
      filter: `plan = "${planId}" && week = ${currentWeek}`,
    });

    for (const day of oldPlanDays) {
      // Delete plan exercises for this day
      const exercises = await pb.collection("plan_exercises").getFullList({
        filter: `planDay = "${day.id}"`,
      });
      for (const ex of exercises) {
        await pb.collection("plan_exercises").delete(ex.id);
      }
      // Delete the plan day
      await pb.collection("plan_days").delete(day.id);
    }

    // Create new plan days for the next week with rotated exercises
    await createPlanDaysForWeek(template, planId, actualWeek, userId);

    return {
      success: true,
      message: `Week ${actualWeek} activated with fresh exercises!`,
      newPlanId: planId,
    };
  } catch (error) {
    console.error("[RENEW PLAN]", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create plan days and exercises for a specific week
 */
async function createPlanDaysForWeek(
  template: ProgramTemplateDefinition,
  planId: string,
  weekNumber: number,
  userId: string
): Promise<void> {
  const pb = getPocketBase();
  
  for (const day of template.weeklyStructure.days) {
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
    }
  }
}

/**
 * Check if a week is completable (all days have been completed)
 */
export function isWeekCompletable(
  weekDays: Array<{ status?: string; completedAt?: string }>,
  requiredDays: number
): boolean {
  const completedDays = weekDays.filter(
    (day) => day.status === "completed" || day.completedAt
  );
  return completedDays.length >= requiredDays;
}

/**
 * Get the next week number for a plan
 */
export function getNextWeek(currentWeek: number, rotationLength: number): number {
  const nextWeek = currentWeek + 1;
  return nextWeek > rotationLength ? 1 : nextWeek;
}

/**
 * Check if renewal is available (week is complete)
 */
export function canRenewPlan(
  currentWeek: number,
  weekDays: Array<{ status?: string }>,
  rotationLength: number
): boolean {
  // Can renew if current week days are all completed
  const completedDays = weekDays.filter((day) => day.status === "completed");
  const requiredDays = weekDays.length;
  
  return completedDays.length === requiredDays;
}