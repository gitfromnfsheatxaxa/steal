"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, User, LogOut, Settings, LayoutDashboard, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "navbar.DASHBOARD" },
  { href: "/programs", label: "navbar.PROGRAMS" },
  { href: "/plans", label: "navbar.PLANS" },
  { href: "/progress", label: "navbar.PROGRESS" },
  { href: "/exercises", label: "navbar.LIBRARY" },
] as const;

/** UTC clock — updates every second, tabular-nums mono */
function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const hh = now.getUTCHours().toString().padStart(2, "0");
      const mm = now.getUTCMinutes().toString().padStart(2, "0");
      const ss = now.getUTCSeconds().toString().padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span
      className="font-data text-[11px] tabular-nums text-ink-mid select-none"
      aria-label="Current time in UTC"
    >
      {time}
      <span className="ml-1 text-ink-low">UTC</span>
    </span>
  );
}

/** Tactical-green status dot with slow pulse */
function StatusIndicator({ t }: { t: (path: string) => string }) {
  return (
    <span className="flex items-center gap-1.5" aria-label="System online">
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-tactical opacity-75"
          style={{ animation: "st-pulse 2s ease-in-out infinite" }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-tactical" />
      </span>
      <span className="stamp text-tactical hidden lg:inline">{t("navbar.ONLINE")}</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const displayName: string =
    (typeof user?.name === "string" && user.name.length > 0
      ? user.name
      : typeof user?.email === "string" && user.email.length > 0
        ? user.email
        : "OPERATOR") as string;

  return (
    <header
      className="sticky top-0 z-40 h-14 bg-surface-1"
      style={{ borderBottom: "1px solid rgba(185,28,28,0.4)" }}
    >
      <div className="container-app flex h-full items-center justify-between">

        {/* ── LEFT: wordmark ── */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex flex-col leading-none select-none"
            aria-label="Steal — go to dashboard"
          >
            <span
              className="text-ink-high font-black tracking-tight leading-none"
              style={{
                fontFamily: "'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              STEEL
            </span>
            <span className="stamp text-ink-low" style={{ letterSpacing: "0.3em" }}>
              {t("navbar.STEEL")}
            </span>
          </Link>

          {/* ── CENTER: nav links with animated underline ── */}
          <nav
            className="hidden items-center md:flex"
            role="navigation"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center px-4 py-4 font-data text-[11px] font-semibold uppercase tracking-widest transition-colors duration-100",
                    active
                      ? "text-rust"
                      : "text-ink-mid hover:text-ink-high",
                  )}
                >
                  {t(link.label)}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-rust"
                      style={{ originX: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── RIGHT: clock / status / theme / avatar ── */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="hidden items-center gap-2 lg:flex">
            <LiveClock />
          </div>

          {/* Status dot */}
          <div className="hidden items-center sm:flex">
            <StatusIndicator t={t} />
          </div>

          {/* Hairline divider */}
          <span
            className="hidden h-5 w-px bg-surface-4 sm:block"
            aria-hidden="true"
          />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="h-8 w-8 rounded-none text-ink-mid hover:bg-surface-3 hover:text-ink-high"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User menu"
                className="h-8 w-8 rounded-none border border-surface-4 text-ink-mid hover:border-rust hover:bg-surface-3 hover:text-ink-high"
              >
                <User className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-none border-surface-3 bg-surface-1 p-0"
              style={{ borderColor: "rgba(185,28,28,0.3)" }}
            >
              {/* User identity header */}
              {/* Language Selector */}
              <div className="border-b border-surface-3 px-3 py-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-3.5 w-3.5 text-ink-mid" />
                  <p className="stamp text-ink-low">{t("navbar.OPERATOR")}</p>
                </div>
                <p className="font-data mt-0.5 truncate text-[11px] font-semibold uppercase tracking-wider text-ink-high">
                  {displayName}
                </p>
              </div>

              <div className="border-b border-surface-3 px-3 py-2">
                <p className="stamp text-[9px] text-ink-mid mb-2">LANGUAGE</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLanguage("en")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-data uppercase tracking-widest border transition-colors",
                      language === "en"
                        ? "border-rust text-rust bg-surface-3"
                        : "border-surface-4 text-ink-mid hover:border-rust hover:text-ink-high"
                    )}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("ru")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-data uppercase tracking-widest border transition-colors",
                      language === "ru"
                        ? "border-rust text-rust bg-surface-3"
                        : "border-surface-4 text-ink-mid hover:border-rust hover:text-ink-high"
                    )}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setLanguage("uz")}
                    className={cn(
                      "px-2 py-1 text-[10px] font-data uppercase tracking-widest border transition-colors",
                      language === "uz"
                        ? "border-rust text-rust bg-surface-3"
                        : "border-surface-4 text-ink-mid hover:border-rust hover:text-ink-high"
                    )}
                  >
                    UZ
                  </button>
                </div>
              </div>

              <div className="py-1">
                <DropdownMenuItem asChild className="rounded-none px-3 py-2 focus:bg-surface-3">
                  <Link href="/dashboard" className="flex items-center gap-2 font-data text-[11px] uppercase tracking-widest text-ink-mid hover:text-ink-high">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    {t("navbar.DASHBOARD")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-none px-3 py-2 focus:bg-surface-3">
                  <Link href="/settings" className="flex items-center gap-2 font-data text-[11px] uppercase tracking-widest text-ink-mid hover:text-ink-high">
                    <Settings className="h-3.5 w-3.5" />
                    {t("navbar.SETTINGS")}
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-surface-3" />

              <div className="py-1">
                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-none px-3 py-2 font-data text-[11px] uppercase tracking-widest text-rust focus:bg-surface-3 focus:text-rust cursor-pointer"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  {t("navbar.SIGN_OUT")}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tactical pulse keyframe — injected inline to avoid globals.css modification */}
      <style>{`
        @keyframes st-pulse {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50%       { transform: scale(2); opacity: 0;    }
        }
      `}</style>
      <style>{`
        .stamp {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.15em;
        }
      `}</style>
    </header>
  );
}
