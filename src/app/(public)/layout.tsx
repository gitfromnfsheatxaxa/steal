"use client";

import { AppShell } from "@/components/layout/AppShell";
import type { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}