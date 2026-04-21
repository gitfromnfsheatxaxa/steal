"use client";

import { useState, useEffect } from "react";

export function useMouseParallax(strength = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [strength]);

  return offset;
}
