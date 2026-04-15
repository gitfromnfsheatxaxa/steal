"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * GymBackgroundOverlay — Gym-themed background elements
 * 
 * Adds subtle gym-related icons (dumbbells, plates, barbells) scattered across the background
 * Uses mix-blend-overlay for subtle integration with the surface color
 */
interface GymBackgroundOverlayProps {
  className?: string;
  opacity?: number;
}

export function GymBackgroundOverlay({ className, opacity = 0.03 }: GymBackgroundOverlayProps) {
  // Generate random gym icon positions
  const icons = useMemo(() => {
    const iconTypes = ["dumbbell", "plate", "barbell", "kettlebell"];
    const generatedIcons = [];
    
    for (let i = 0; i < 20; i++) {
      generatedIcons.push({
        id: i,
        type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 40,
        rotation: Math.random() * 360,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
    
    return generatedIcons;
  }, []);

  const DumbbellIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.5 6.5h11v11h-11z" opacity="0.3"/>
      <path d="M4 9v6h2V9H4zm14 0v6h2V9h-2zM2 11v2h20v-2H2zm2-3h2v8H4V8zm14 0h2v8h-2V8z"/>
    </svg>
  );

  const PlateIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" opacity="0.4"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );

  const BarbellIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="9" width="4" height="6" rx="1"/>
      <rect x="18" y="9" width="4" height="6" rx="1"/>
      <rect x="6" y="11" width="12" height="2"/>
      <circle cx="8" cy="12" r="1.5" opacity="0.5"/>
      <circle cx="16" cy="12" r="1.5" opacity="0.5"/>
    </svg>
  );

  const KettlebellIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4a3 3 0 013 3v2H9V7a3 3 0 013-3z"/>
      <path d="M6 10h12v4a6 6 0 01-12 0v-4z" opacity="0.6"/>
      <circle cx="12" cy="16" r="5" opacity="0.8"/>
    </svg>
  );

  const renderIcon = (icon: { type: string; size: number }) => {
    switch (icon.type) {
      case "dumbbell":
        return <DumbbellIcon size={icon.size} />;
      case "plate":
        return <PlateIcon size={icon.size} />;
      case "barbell":
        return <BarbellIcon size={icon.size} />;
      case "kettlebell":
        return <KettlebellIcon size={icon.size} />;
      default:
        return <DumbbellIcon size={icon.size} />;
    }
  };

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 mix-blend-overlay overflow-hidden", className)}
      style={{ opacity, zIndex: 0 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="h-full w-full"
      >
        <filter id="gym-icons">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.3 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#gym-icons)" />
        
        {/* Gym icons scattered across the background */}
        <g fill="currentColor" className="text-[#e53e00]">
          {icons.map((icon) => (
            <g
              key={icon.id}
              transform={`translate(${icon.x}%, ${icon.y}%) rotate(${icon.rotation})`}
              style={{ opacity: icon.opacity * 0.1 }}
            >
              {renderIcon(icon)}
            </g>
          ))}
        </g>
      </svg>
    </span>
  );
}