"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  ClipboardList,
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { href: "/programs", label: "PROGRAMS", icon: ClipboardList },
  { href: "/progress", label: "PROGRESS", icon: TrendingUp },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container-app flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            <Dumbbell className="h-5 w-5 text-[#e53e00]" />
            <span className="hidden text-xl font-extrabold uppercase tracking-widest text-foreground sm:inline">
              STEAL
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-0 md:flex" role="navigation">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 py-4 font-data text-xs font-semibold uppercase tracking-widest transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e53e00]" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User menu"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border bg-card">
              <div className="px-2 py-1.5 font-data text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {user?.name || user?.email || "User"}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="font-data text-xs uppercase tracking-widest">
                  <Settings className="mr-2 h-4 w-4" />
                  SETTINGS
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="font-data text-xs uppercase tracking-widest text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                SIGN OUT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
