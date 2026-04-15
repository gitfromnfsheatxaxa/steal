"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Tactical screen-switch variants — slide-in with blur + scale
const pageVariants = {
  initial: {
    opacity: 0,
    x: 28,
    scale: 0.985,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    x: -14,
    scale: 0.99,
    filter: "blur(4px)",
  },
} as const;

// Reduced-motion variants — opacity only, no movement or blur
const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.24;

// Red scanline that sweeps left-to-right on route change
function ScanlineSweep() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-full"
      style={{ zIndex: 50 }}
      initial={{ x: "-100%", opacity: 1 }}
      animate={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--rust-glow, rgba(185,28,28,0.35)) 50%, transparent 100%)",
          height: "1px",
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          opacity: 0.6,
        }}
      />
    </motion.div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  const variants = shouldReduce ? reducedVariants : pageVariants;
  const transition: Transition = shouldReduce
    ? { duration: 0.15, ease: [0, 0, 1, 1] }
    : { duration: DURATION, ease: [...EASE], type: "tween" };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className="relative will-change-transform"
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Scanline sweep on enter — skipped when reduced motion */}
        {!shouldReduce && <ScanlineSweep />}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
