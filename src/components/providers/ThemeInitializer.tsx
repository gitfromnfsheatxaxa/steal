"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    // Read stored theme or system preference
    const stored = localStorage.getItem("st-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored ?? (prefersDark ? "dark" : "light");
    
    // Apply theme class immediately
    document.documentElement.classList.toggle("light", theme === "light");
  }, []);

  return null;
}