"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Dumbbell,
  TrendingUp,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "HOME", icon: LayoutDashboard },
  { href: "/programs", label: "PROGRAMS", icon: ClipboardList },
  { href: "/workout", label: "TRAIN", icon: Dumbbell },
  { href: "/progress", label: "STATS", icon: TrendingUp },
  { href: "/settings", label: "GEAR", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#1a1a1a] bg-[#050505]/95 backdrop-blur-sm md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-16 items-center justify-around">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 font-data text-[10px] font-semibold uppercase tracking-widest transition-all",
                active ? "text-[#8B0000]" : "text-[#71717A] hover:text-[#E5E5E5]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  active && "scale-110",
                )}
              />
              <span>{tab.label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-[#8B0000]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}