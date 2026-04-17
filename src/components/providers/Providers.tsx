"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { I18nProvider } from "./I18nProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <I18nProvider>
            {children}
            <Toaster position="bottom-center" richColors />
          </I18nProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
