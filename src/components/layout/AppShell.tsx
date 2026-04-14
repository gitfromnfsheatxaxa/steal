"use client";

import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { PageTransition } from "@/components/providers/PageTransition";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="steal-bg-elements relative flex min-h-dvh flex-col">
      {/* Desktop/tablet top bar */}
      <Navbar />

      {/* Main content with padding for bottom nav on mobile */}
      <main className="relative z-[1] flex-1 pb-20 pt-4 md:pb-6">
        <div className="container-app">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
