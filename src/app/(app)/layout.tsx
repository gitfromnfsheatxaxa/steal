"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowGuestWorkout =
    pathname === "/workout" || pathname.startsWith("/workout/");

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !allowGuestWorkout) {
      router.replace("/login");
    }
  }, [allowGuestWorkout, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-40" />
          <Skeleton className="mx-auto h-4 w-60" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !allowGuestWorkout) return null;

  return <AppShell>{children}</AppShell>;
}
