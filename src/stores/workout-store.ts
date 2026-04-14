import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActiveSetInput } from "@/types/session";

interface ExerciseProgress {
  exerciseId: string;
  exerciseName?: string;
  targetSets: number;
  completedSets: ActiveSetInput[];
}

interface WorkoutState {
  sessionId: string | null;
  planDayId: string | null;
  startedAt: string | null;
  exercises: ExerciseProgress[];
  currentExerciseIndex: number;
  restTimerSeconds: number | null; // null = not running
  restTimerTarget: number; // total rest target in seconds

  // Actions
  startSession: (sessionId: string, planDayId: string | null, exercises: ExerciseProgress[]) => void;
  completeSet: (exerciseIndex: number, set: ActiveSetInput) => void;
  setCurrentExercise: (index: number) => void;
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;
  endSession: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      sessionId: null,
      planDayId: null,
      startedAt: null,
      exercises: [],
      currentExerciseIndex: 0,
      restTimerSeconds: null,
      restTimerTarget: 90,

      startSession: (sessionId, planDayId, exercises) =>
        set({
          sessionId,
          planDayId,
          startedAt: new Date().toISOString(),
          exercises,
          currentExerciseIndex: 0,
          restTimerSeconds: null,
        }),

      completeSet: (exerciseIndex, setData) =>
        set((state) => {
          const exercises = [...state.exercises];
          const exercise = { ...exercises[exerciseIndex] };
          exercise.completedSets = [...exercise.completedSets, setData];
          exercises[exerciseIndex] = exercise;
          return { exercises };
        }),

      setCurrentExercise: (index) => set({ currentExerciseIndex: index }),

      startRestTimer: (seconds) =>
        set({ restTimerSeconds: seconds, restTimerTarget: seconds }),

      clearRestTimer: () => set({ restTimerSeconds: null }),

      endSession: () =>
        set({
          sessionId: null,
          planDayId: null,
          startedAt: null,
          exercises: [],
          currentExerciseIndex: 0,
          restTimerSeconds: null,
        }),
    }),
    {
      name: "st-workout-session",
      // Persist to localStorage so interrupted sessions can be resumed
    },
  ),
);
