"use client";

import { useQuery } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import type { Profile, Goal } from "@/types/profile";

export function useProfile() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<Profile | null>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const records = await pb
          .collection("profiles")
          .getList<Profile>(1, 1, { filter: `user="${userId}"` });
        return records.items[0] ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!userId,
  });
}

export function useGoals() {
  const pb = getPocketBase();
  const userId = pb.authStore.record?.id;

  return useQuery<Goal[]>({
    queryKey: ["goals", userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const records = await pb
          .collection("goals")
          .getList<Goal>(1, 10, { filter: `user="${userId}"` });
        return records.items;
      } catch {
        return [];
      }
    },
    enabled: !!userId,
  });
}
