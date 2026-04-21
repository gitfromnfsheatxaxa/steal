"use client";

import { useQuery } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import type { SessionLogEntry } from "@/lib/workout-history";

interface RawSessionSet {
  id: string;
  session: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  notes: string; // exercise name stored here
  expand?: {
    session?: {
      id: string;
      startedAt: string;
      completedAt: string;
      mood: string | null;
      sessionNotes: string;
      energyLevel: number;
    };
  };
}

export function useQuickSessions() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<SessionLogEntry[]>({
    queryKey: ["quickSessions", userId],
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    queryFn: async () => {
      const sets = await pb.collection("session_sets").getFullList<RawSessionSet>({
        filter: `session.user = "${userId}" && session.plan = "" && session.planDay = ""`,
        expand: "session",
        sort: "-created",
        fields: "id,session,setNumber,weight,reps,rpe,notes,expand",
      });

      // Group sets by session ID
      const sessionMap = new Map<string, {
        sessionId: string;
        date: string;
        duration: number;
        mood: string | null;
        notes: string;
        exerciseMap: Map<string, { weight: number; reps: number; rpe: number; setNumber: number }[]>;
        exerciseOrder: string[];
      }>();

      for (const s of sets) {
        const sessionData = s.expand?.session;
        if (!sessionData) continue;

        if (!sessionMap.has(s.session)) {
          const start = new Date(sessionData.startedAt).getTime();
          const end = new Date(sessionData.completedAt).getTime();
          sessionMap.set(s.session, {
            sessionId: s.session,
            date: sessionData.completedAt,
            duration: Math.floor((end - start) / 1000),
            mood: sessionData.mood ?? null,
            notes: sessionData.sessionNotes ?? "",
            exerciseMap: new Map(),
            exerciseOrder: [],
          });
        }

        const sess = sessionMap.get(s.session)!;
        const exName = s.notes || "Unknown Exercise";

        if (!sess.exerciseMap.has(exName)) {
          sess.exerciseMap.set(exName, []);
          sess.exerciseOrder.push(exName);
        }
        sess.exerciseMap.get(exName)!.push({
          weight: s.weight,
          reps: s.reps,
          rpe: s.rpe,
          setNumber: s.setNumber,
        });
      }

      // Convert to SessionLogEntry[]
      const result: SessionLogEntry[] = [];
      for (const sess of sessionMap.values()) {
        result.push({
          id: sess.sessionId,
          date: sess.date,
          duration: sess.duration,
          mood: sess.mood,
          notes: sess.notes,
          exercises: sess.exerciseOrder.map((exName) => {
            const exSets = (sess.exerciseMap.get(exName) ?? [])
              .sort((a, b) => a.setNumber - b.setNumber)
              .map(({ weight, reps, rpe }) => ({ weight, reps, rpe }));
            return { name: exName, image: "", sets: exSets };
          }),
        });
      }

      // Sort newest first
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return result;
    },
  });
}
