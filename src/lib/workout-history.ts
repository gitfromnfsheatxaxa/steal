export const EXERCISE_HISTORY_KEY = "st-exercise-history";
export const SESSION_LOG_KEY = "st-session-log";

export interface HistorySet {
  weight: number;
  reps: number;
  rpe: number;
}

export interface HistoryEntry {
  sets: HistorySet[];
  date: string;
}

export type ExerciseHistory = Record<string, HistoryEntry>;

export interface SessionLogEntry {
  id: string;
  date: string;
  duration: number;
  mood: string | null;
  notes: string;
  exercises: Array<{
    name: string;
    image: string;
    sets: HistorySet[];
  }>;
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function readExerciseHistory(): ExerciseHistory {
  try {
    const raw = JSON.parse(localStorage.getItem(EXERCISE_HISTORY_KEY) || "{}");
    // Migrate old format { weight, reps, rpe, date } → { sets: [{...}], date }
    const migrated: ExerciseHistory = {};
    for (const [key, val] of Object.entries(raw)) {
      const entry = val as Record<string, unknown>;
      if (Array.isArray(entry.sets)) {
        migrated[key] = entry as unknown as HistoryEntry;
      } else if (typeof entry.weight === "number") {
        migrated[key] = {
          sets: [{ weight: entry.weight as number, reps: entry.reps as number, rpe: (entry.rpe as number) ?? 8 }],
          date: (entry.date as string) ?? new Date().toISOString(),
        };
      }
    }
    return migrated;
  } catch {
    return {};
  }
}

export function readSessionLog(): SessionLogEntry[] {
  try { return JSON.parse(localStorage.getItem(SESSION_LOG_KEY) || "[]"); }
  catch { return []; }
}

export function persistWorkoutSession(
  exercises: Array<{
    name: string;
    exercise: { gif?: string; image?: string } | null;
    sets: Array<{ weight: string; reps: string; rpe: number; completed: boolean }>;
  }>,
  sessionId: string,
  startTs: number,
  mood: string | null,
  notes: string,
) {
  try {
    const history = readExerciseHistory();
    for (const ex of exercises) {
      const completed = ex.sets
        .filter((s) => s.completed && (s.weight !== "" || s.reps !== ""))
        .map((s) => ({ weight: Number(s.weight) || 0, reps: Number(s.reps) || 0, rpe: s.rpe }));
      if (completed.length === 0) continue;
      history[normalizeName(ex.name)] = { sets: completed, date: new Date().toISOString() };
    }
    localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(history));

    const log = readSessionLog();
    const entry: SessionLogEntry = {
      id: sessionId,
      date: new Date().toISOString(),
      duration: Math.floor((Date.now() - startTs) / 1000),
      mood,
      notes,
      exercises: exercises
        .filter((ex) => ex.sets.some((s) => s.completed))
        .map((ex) => ({
          name: ex.name,
          image: ex.exercise?.gif || ex.exercise?.image || "",
          sets: ex.sets
            .filter((s) => s.completed)
            .map((s) => ({ weight: Number(s.weight) || 0, reps: Number(s.reps) || 0, rpe: s.rpe })),
        })),
    };
    log.unshift(entry);
    localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(log.slice(0, 100)));
  } catch {
    // storage unavailable — silent fail
  }
}
