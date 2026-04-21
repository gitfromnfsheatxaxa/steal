"use client";

import { useRef, useEffect, useState } from "react";
import { useMouseParallax } from "@/hooks/useMouseParallax";

function useScrollParallax() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const handler = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = 0;
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return scrollY;
}

export function AmbientGymLayer() {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const mouse = useMouseParallax(20);
  const scrollY = useScrollParallax();

  if (prefersReduced) return null;

  const scrollShift = -scrollY * 0.03;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0, background: "var(--background)" }}
    >
      {/* Blob 1 — top-left, large, warm orange */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          top: -200,
          left: -100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(194,65,12,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
          willChange: "transform",
          animation: "forge-blob1 18s ease-in-out infinite",
          transform: `translate(${mouse.x}px, ${mouse.y + scrollShift}px)`,
        }}
      />

      {/* Blob 2 — bottom-right, medium */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          bottom: -100,
          right: -80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(194,65,12,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
          willChange: "transform",
          animation: "forge-blob2 22s ease-in-out infinite",
          transform: `translate(${-mouse.x * 0.7}px, ${-mouse.y * 0.7 + scrollShift}px)`,
        }}
      />

      {/* Blob 3 — center, small, deep */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          top: "40%",
          left: "40%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(150,40,0,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          mixBlendMode: "screen",
          willChange: "transform",
          animation: "forge-blob3 28s ease-in-out infinite",
          transform: `translate(${mouse.x * 0.4}px, ${mouse.y * 0.4 + scrollShift * 0.5}px)`,
        }}
      />

      {/* Tactical grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(194,65,12,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(194,65,12,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "forge-grid-drift 60s linear infinite",
        }}
      />

      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <style>{`
        @keyframes forge-blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes forge-blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-40px, -60px) scale(1.2); }
        }
        @keyframes forge-blob3 {
          0%, 100%  { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(80px, -40px) scale(1.1); }
          66%       { transform: translate(-60px, 50px) scale(0.9); }
        }
        @keyframes forge-grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
