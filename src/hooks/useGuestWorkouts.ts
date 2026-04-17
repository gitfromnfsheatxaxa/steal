"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProgramTemplateDefinition, WarmupCooldown } from "@/types/plan";
import type { ActiveSetInput } from "@/types/session";

const STORAGE_KEYS = {
  GUEST_ACTIVE_PLAN: "guest_active_plan",
  GUEST_PLAN_DAYS: "guest_plan_days",
  GUEST_WORKOUT_SESSIONS: "guest_workout_sessions",
  GUEST_EXERCISES: "guest_exercises",
} as const;

export interface GuestPlanDay {
  id: string;
  planId: string;
  week: number;
  dayOfWeek: number;
  label: string;
  focus: string[];
  warmup?: string;
  cooldown?: string;
  exercises: GuestPlanExercise[];
}

export interface GuestPlanExercise {
  id: string;
  planDayId: string;
  name: string;
  order: number;
  sets: number;
  repsMin: number;
  repsMax: number;
  rpeTarget: number;
  restSeconds: number;
  notes?: string;
}

export interface GuestWorkoutPlan {
  id: string;
  title: string;
  description: string;
  source: "template" | "custom";
  templateId?: string;
  goalType: string;
  environment: string;
  durationWeeks: number;
  currentWeek: number;
  status: "active" | "completed" | "paused";
  activatedAt: string;
}

export interface GuestSession {
  id: string;
  planDayId: string;
  planId: string;
  startedAt: string;
  completedAt?: string;
  status: "in_progress" | "completed";
  mood?: "great" | "good" | "okay" | "rough" | "terrible";
  energyLevel?: number;
  sessionNotes?: string;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    completedSets: ActiveSetInput[];
  }>;
}

// Generate unique IDs for guest mode
function generateId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format WarmupCooldown object to string for localStorage
function formatWarmupCooldown(wc: WarmupCooldown): string {
  return wc.exercises
    .map((ex) => `${ex.name} (${ex.duration})${ex.notes ? ` - ${ex.notes}` : ""}`)
    .join("; ");
}

// Safe localStorage operations
function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    console.error("Failed to save to localStorage");
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    console.error("Failed to remove from localStorage");
  }
}

export function useGuestActivePlan() {
  const [activePlan, setActivePlan] = useState<GuestWorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = safeGetItem(STORAGE_KEYS.GUEST_ACTIVE_PLAN);
    if (data) {
      try {
        setActivePlan(JSON.parse(data));
      } catch {
        setActivePlan(null);
      }
    }
    setIsLoading(false);
  }, []);

  const setActivePlanWithStorage = useCallback((plan: GuestWorkoutPlan | null) => {
    setActivePlan(plan);
    if (plan) {
      safeSetItem(STORAGE_KEYS.GUEST_ACTIVE_PLAN, JSON.stringify(plan));
    } else {
      safeRemoveItem(STORAGE_KEYS.GUEST_ACTIVE_PLAN);
    }
  }, []);

  return { activePlan, setActivePlan: setActivePlanWithStorage, isLoading };
}

export function useGuestPlanDays(planId: string | undefined) {
  const [planDays, setPlanDays] = useState<GuestPlanDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      setPlanDays([]);
      setIsLoading(false);
      return;
    }

    const data = safeGetItem(STORAGE_KEYS.GUEST_PLAN_DAYS);
    if (data) {
      try {
        const allDays: GuestPlanDay[] = JSON.parse(data);
        const filtered = allDays.filter((d) => d.planId === planId);
        setPlanDays(filtered);
      } catch {
        setPlanDays([]);
      }
    }
    setIsLoading(false);
  }, [planId]);

  const addPlanDay = useCallback((day: GuestPlanDay) => {
    const data = safeGetItem(STORAGE_KEYS.GUEST_PLAN_DAYS);
    let allDays: GuestPlanDay[] = [];
    if (data) {
      try {
        allDays = JSON.parse(data);
      } catch {}
    }
    
    // Check if day already exists
    const existingIndex = allDays.findIndex(
      (d) => d.id === day.id || (d.planId === day.planId && d.dayOfWeek === day.dayOfWeek && d.week === day.week)
    );
    
    if (existingIndex >= 0) {
      allDays[existingIndex] = day;
    } else {
      allDays.push(day);
    }
    
    safeSetItem(STORAGE_KEYS.GUEST_PLAN_DAYS, JSON.stringify(allDays));
    setPlanDays(allDays.filter((d) => d.planId === planId));
  }, [planId]);

  const setAllPlanDays = useCallback((days: GuestPlanDay[]) => {
    safeSetItem(STORAGE_KEYS.GUEST_PLAN_DAYS, JSON.stringify(days));
    setPlanDays(days.filter((d) => d.planId === planId));
  }, [planId]);

  return { planDays, addPlanDay, setAllPlanDays, isLoading };
}

export function useGuestWorkoutSessions() {
  const [sessions, setSessions] = useState<GuestSession[]>([]);

  useEffect(() => {
    const data = safeGetItem(STORAGE_KEYS.GUEST_WORKOUT_SESSIONS);
    if (data) {
      try {
        setSessions(JSON.parse(data));
      } catch {
        setSessions([]);
      }
    }
  }, []);

  const saveSession = useCallback((session: GuestSession) => {
    const data = safeGetItem(STORAGE_KEYS.GUEST_WORKOUT_SESSIONS);
    let allSessions: GuestSession[] = [];
    if (data) {
      try {
        allSessions = JSON.parse(data);
      } catch {}
    }

    const existingIndex = allSessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      allSessions[existingIndex] = session;
    } else {
      allSessions.push(session);
    }

    safeSetItem(STORAGE_KEYS.GUEST_WORKOUT_SESSIONS, JSON.stringify(allSessions));
    setSessions(allSessions);
  }, []);

  const getCompletedSessionForPlanDay = useCallback(
    (planDayId: string): GuestSession | null => {
      const data = safeGetItem(STORAGE_KEYS.GUEST_WORKOUT_SESSIONS);
      if (!data) return null;
      try {
        const allSessions: GuestSession[] = JSON.parse(data);
        return (
          allSessions.find(
            (s) => s.planDayId === planDayId && s.status === "completed"
          ) ?? null
        );
      } catch {
        return null;
      }
    },
    []
  );

  const clearAllData = useCallback(() => {
    safeRemoveItem(STORAGE_KEYS.GUEST_ACTIVE_PLAN);
    safeRemoveItem(STORAGE_KEYS.GUEST_PLAN_DAYS);
    safeRemoveItem(STORAGE_KEYS.GUEST_WORKOUT_SESSIONS);
    safeRemoveItem(STORAGE_KEYS.GUEST_EXERCISES);
    setSessions([]);
  }, []);

  return {
    sessions,
    saveSession,
    getCompletedSessionForPlanDay,
    clearAllData,
  };
}

export function activateGuestProgram(
  program: {
    id: string;
    title: string;
    description: string;
    templateId?: string;
    weeks: number;
  },
  template?: ProgramTemplateDefinition
): GuestWorkoutPlan {
  const plan: GuestWorkoutPlan = {
    id: generateId(),
    title: program.title,
    description: program.description,
    source: "template",
    templateId: program.templateId,
    goalType: "muscle_building",
    environment: "gym",
    durationWeeks: program.weeks,
    currentWeek: 1,
    status: "active",
    activatedAt: new Date().toISOString(),
  };

  safeSetItem(STORAGE_KEYS.GUEST_ACTIVE_PLAN, JSON.stringify(plan));

  // Create plan days from template
  if (template) {
    const planDays: GuestPlanDay[] = [];
    for (const day of template.weeklyStructure.days) {
      const planDay: GuestPlanDay = {
        id: generateId(),
        planId: plan.id,
        week: 1,
        dayOfWeek: day.dayOfWeek,
        label: day.label,
        focus: day.focus,
        warmup: day.warmup ? formatWarmupCooldown(day.warmup) : undefined,
        cooldown: day.cooldown ? formatWarmupCooldown(day.cooldown) : undefined,
        exercises: day.exercises.map((ex, i) => ({
          id: generateId(),
          planDayId: "",
          name: ex.primary.name,
          order: i + 1,
          sets: ex.primary.sets,
          repsMin: ex.primary.repsMin,
          repsMax: ex.primary.repsMax,
          rpeTarget: ex.primary.rpeTarget,
          restSeconds: ex.primary.restSeconds,
          notes: ex.primary.notes,
        })),
      };
      // Update exercise references
      planDay.exercises.forEach((ex) => {
        (ex as any).planDayId = planDay.id;
      });
      planDays.push(planDay);
    }
    safeSetItem(STORAGE_KEYS.GUEST_PLAN_DAYS, JSON.stringify(planDays));
  }

  return plan;
}

export function useIsGuestUser() {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Auth is stored in a cookie (pb_auth), not localStorage.
    // Also check the PocketBase SDK auth store directly.
    try {
      const { getPocketBase } = require("@/lib/pocketbase");
      const pb = getPocketBase();
      if (pb.authStore.isValid && pb.authStore.record?.id) {
        setIsGuest(false);
        return;
      }
    } catch {}

    // Fallback: check cookie directly
    try {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("pb_auth="));
      if (cookie) {
        const value = decodeURIComponent(cookie.split("=")[1]);
        const authData = JSON.parse(value);
        if (authData.record && authData.token) {
          setIsGuest(false);
          return;
        }
      }
    } catch {}

    setIsGuest(true);
  }, []);

  return isGuest;
}