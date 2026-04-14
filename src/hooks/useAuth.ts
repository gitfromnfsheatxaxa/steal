"use client";

import { useAuthContext } from "@/components/providers/AuthProvider";

/**
 * Re-export the auth context hook for convenience.
 * Components import from `@/hooks/useAuth` rather than the provider directly.
 */
export function useAuth() {
  return useAuthContext();
}
