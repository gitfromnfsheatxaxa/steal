"use client";

/**
 * BrandNoiseOverlay — Stronger grain texture scoped to a single panel.
 *
 * Drop this inside any `.panel` or data card as an absolutely-positioned child.
 * It uses mix-blend-overlay so it interacts with the surface color underneath.
 *
 * Usage:
 *   <div className="panel relative">
 *     <BrandNoiseOverlay />
 *     ... panel content ...
 *   </div>
 */
export function BrandNoiseOverlay() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{ opacity: 0.06, zIndex: 0 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="h-full w-full"
      >
        <filter id="panel-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.9
                    0 0 0 0 0.9
                    0 0 0 0 0.9
                    0 0 0 0.9 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#panel-noise)" />
      </svg>
    </span>
  );
}
