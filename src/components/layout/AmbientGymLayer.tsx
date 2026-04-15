"use client";

import { useEffect, useRef } from "react";

/**
 * AmbientGymLayer — Military-industrial ambient background.
 *
 * Renders:
 * - Full-bleed SVG reticle grid (3% opacity)
 * - Three barbell/weight-plate SVG layers at 6–10% opacity
 * - Faint chain patterns at top and bottom edges (4% opacity)
 * - Vertical scanline sweep (2% opacity, 18s cycle)
 * - Parallax: heaviest layer 0.15× scroll, lightest 0.4× scroll via CSS vars
 * - Two radial blood-red glows (top-center, bottom-left)
 *
 * Skipped entirely when prefers-reduced-motion: reduce.
 */

function useParallaxOnScroll(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let rafId = 0;
    let lastY = window.scrollY;

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y !== lastY) {
          el!.style.setProperty("--parallax-heavy", `${y * 0.15}px`);
          el!.style.setProperty("--parallax-mid", `${y * 0.28}px`);
          el!.style.setProperty("--parallax-light", `${y * 0.4}px`);
          lastY = y;
        }
        rafId = 0;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [rootRef]);
}

// SVG: Military reticle / map grid (40×40 cells, tick marks every 5th)
function ReticleGrid() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        opacity: 0.03,
        transform: "translateY(var(--parallax-light, 0px))",
      }}
    >
      <defs>
        {/* Minor grid line */}
        <pattern id="grid-minor" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--grid-line, rgba(229,229,229,0.6))"
            strokeWidth="0.5"
          />
        </pattern>
        {/* Major grid line every 5 cells (200px) */}
        <pattern id="grid-major" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#grid-minor)" />
          <path
            d="M 200 0 L 0 0 0 200"
            fill="none"
            stroke="var(--ink-high, rgba(229,229,229,1))"
            strokeWidth="1"
          />
          {/* Tick marks at corners */}
          <line x1="0" y1="0" x2="6" y2="0" stroke="var(--ink-high, rgba(229,229,229,1))" strokeWidth="1.2" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-high, rgba(229,229,229,1))" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-major)" />
    </svg>
  );
}

// SVG: Barbell silhouette — heavy layer (bottom-right, large)
function BarbellHeavy() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 120"
      className="pointer-events-none absolute"
      style={{
        opacity: 0.07,
        bottom: "8%",
        right: "-80px",
        width: "520px",
        height: "120px",
        transform: "translateY(calc(-1 * var(--parallax-heavy, 0px)))",
        fill: "var(--ink-low, rgba(113,113,122,1))",
      }}
    >
      {/* Barbell bar */}
      <rect x="60" y="56" width="400" height="8" fill="currentColor" />
      {/* Left weight plates */}
      <rect x="30" y="28" width="30" height="64" rx="0" fill="currentColor" />
      <rect x="18" y="34" width="14" height="52" rx="0" fill="currentColor" />
      <rect x="8" y="40" width="12" height="40" rx="0" fill="currentColor" />
      {/* Right weight plates */}
      <rect x="460" y="28" width="30" height="64" rx="0" fill="currentColor" />
      <rect x="488" y="34" width="14" height="52" rx="0" fill="currentColor" />
      <rect x="500" y="40" width="12" height="40" rx="0" fill="currentColor" />
      {/* Collar rings */}
      <rect x="58" y="44" width="10" height="32" fill="currentColor" />
      <rect x="452" y="44" width="10" height="32" fill="currentColor" />
    </svg>
  );
}

// SVG: Weight plate silhouette — mid layer (top-left)
function WeightPlateMid() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 180"
      className="pointer-events-none absolute"
      style={{
        opacity: 0.06,
        top: "14%",
        left: "-60px",
        width: "320px",
        height: "320px",
        transform: "translateY(var(--parallax-mid, 0px))",
        stroke: "var(--ink-low, rgba(113,113,122,1))",
      }}
    >
      {/* Outer ring */}
      <rect x="4" y="4" width="172" height="172" fill="none" stroke="currentColor" strokeWidth="16" />
      {/* Inner ring */}
      <rect x="32" y="32" width="116" height="116" fill="none" stroke="currentColor" strokeWidth="8" />
      {/* Center hole */}
      <rect x="72" y="72" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="4" />
      {/* Weight label notch */}
      <rect x="76" y="8" width="28" height="10" fill="currentColor" />
    </svg>
  );
}

// SVG: Barbell — light / foreground layer (center-right, rotated)
function BarbellLight() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 380 80"
      className="pointer-events-none absolute"
      style={{
        opacity: 0.045,
        top: "38%",
        right: "4%",
        width: "340px",
        height: "70px",
        transform: `translateY(calc(-1 * var(--parallax-light, 0px))) rotate(-6deg)`,
        fill: "var(--ink-low, rgba(113,113,122,1))",
      }}
    >
      {/* Bar */}
      <rect x="40" y="36" width="300" height="6" fill="currentColor" />
      {/* Left plates */}
      <rect x="18" y="18" width="22" height="44" fill="currentColor" />
      <rect x="8" y="24" width="12" height="32" fill="currentColor" />
      {/* Right plates */}
      <rect x="340" y="18" width="22" height="44" fill="currentColor" />
      <rect x="360" y="24" width="12" height="32" fill="currentColor" />
    </svg>
  );
}

// SVG: Chain pattern — repeating horizontal links
function ChainPattern({ position }: { position: "top" | "bottom" }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute left-0 right-0 w-full"
      style={{
        opacity: 0.04,
        height: "28px",
        [position]: 0,
      }}
    >
      <defs>
        <pattern
          id={`chain-${position}`}
          width="40"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          {/* Horizontal oval link */}
          <ellipse cx="20" cy="14" rx="14" ry="7" fill="none" stroke="var(--ink-low, rgba(229,229,229,1))" strokeWidth="2.5" />
          {/* Connector pin */}
          <rect x="18" y="6" width="4" height="16" fill="var(--ink-dim, rgba(229,229,229,0.5))" />
        </pattern>
      </defs>
      <rect width="100%" height="28" fill={`url(#chain-${position})`} />
    </svg>
  );
}

// Scanline — a 2px tall line that sweeps the full viewport height
function Scanline() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0"
      style={{
        height: "2px",
        top: 0,
        background:
          "linear-gradient(90deg, transparent 0%, var(--ink-high, rgba(229,229,229,0.18)) 50%, transparent 100%)",
        opacity: 0.02,
        animation: "scanline 18s linear infinite",
        zIndex: 2,
      }}
    />
  );
}

// Radial blood-red atmospheric glows
function AtmosphereGlows() {
  return (
    <>
      {/* Top-center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, var(--primary-glow, rgba(159, 18, 57, 0.12)) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      {/* Bottom-left glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          bottom: "-80px",
          left: "-60px",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse 60% 50% at 20% 100%, var(--primary-glow, rgba(139, 0, 0, 0.10)) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
    </>
  );
}

export function AmbientGymLayer() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Respect reduced motion — bail out early in effect hook
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useParallaxOnScroll(prefersReduced ? { current: null } : rootRef);

  // Return empty fragment if reduced motion is preferred
  if (prefersReduced) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 0,
        // CSS vars consumed by children via inline style
        ["--parallax-heavy" as string]: "0px",
        ["--parallax-mid" as string]: "0px",
        ["--parallax-light" as string]: "0px",
        color: "var(--ink-high, rgba(229,229,229,1))",
      }}
    >
      {/* Layer 1: reticle grid — lightest (parallax 0.4×) */}
      <ReticleGrid />

      {/* Layer 2: atmosphere glows */}
      <AtmosphereGlows />

      {/* Layer 3: chain edges */}
      <ChainPattern position="top" />
      <ChainPattern position="bottom" />

      {/* Layer 4: barbell silhouettes */}
      <BarbellHeavy />
      <WeightPlateMid />
      <BarbellLight />

      {/* Layer 5: scanline sweep */}
      <Scanline />
    </div>
  );
}