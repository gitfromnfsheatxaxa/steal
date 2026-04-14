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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden"
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
                "flex flex-col items-center gap-0.5 px-3 py-1 font-data text-[10px] font-semibold uppercase tracking-widest transition-colors",
                active ? "text-[#e53e00]" : "text-muted-foreground",
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
