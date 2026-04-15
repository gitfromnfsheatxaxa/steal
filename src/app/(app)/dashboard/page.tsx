"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useActivePlan, usePlanDays, usePlanExercises, usePlanDaySession } from "@/hooks/usePlans";
import { useStreakData, usePersonalRecords, useSessions, useAllSets } from "@/hooks/useProgress";
import { CounterFX } from "@/components/fx/ImpactFlash";
import { BrandNoiseOverlay } from "@/components/layout/BrandNoiseOverlay";
import { GymBackgroundOverlay } from "@/components/layout/GymBackgroundOverlay";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Flame,
  Trophy,
  BarChart3,
  Settings,
  Dumbbell,
  Target,
  TrendingUp,
  Activity,
  CheckCircle2,
  Play,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Tactical clock ──────────────────────────────────────────────────────────
function TacticalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const dd = String(now.getDate()).padStart(2, "0");
  const mon = months[now.getMonth()];
  const yy = String(now.getFullYear()).slice(2);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  return (
    <span className="font-data text-[11px] tracking-widest text-[#525252] tabular-nums">
      {dd}{mon}{yy} {hh}:{mm}
    </span>
  );
}

// ─── KPI Panel ────────────────────────────────────────────────────────────────
interface KpiPanelProps {
  label: string;
  value: number;
  unit?: string;
  subValue?: string;
  icon: React.ReactNode;
  accent?: "orange" | "green" | "blue" | "default";
  tag?: string;
  trend?: "up" | "down" | "neutral";
}

function KpiPanel({ label, value, unit, subValue, icon, accent = "orange", tag = "01", trend }: KpiPanelProps) {
  const accentColors = {
    orange: { border: "#e53e00", text: "#e53e00" },
    green: { border: "#10b981", text: "#10b981" },
    blue: { border: "#3b82f6", text: "#3b82f6" },
    default: { border: "#525252", text: "#71717A" },
  };
  const colors = accentColors[accent];

  return (
    <div
      className="border border-[#2a2a2a] bg-[#0a0a0a] p-3 relative overflow-hidden"
      style={{ borderLeft: `2px solid ${colors.border}` }}
    >
      <BrandNoiseOverlay />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span style={{ color: colors.text }}>{icon}</span>
            <span className="stamp text-[9px] tracking-[0.15em] text-[#71717A]">{label}</span>
          </div>
          <span className="stamp text-[8px] text-[#525252]">{tag}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div
              className="metric-xl tabular-nums"
              style={{ 
                color: colors.text,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 800,
              }}
            >
              <CounterFX value={value} />
            </div>
            {unit && (
              <div className="stamp mt-1 text-[9px] text-[#71717A]">{unit}</div>
            )}
            {subValue && (
              <div className="stamp mt-0.5 text-[8px] text-[#525252]">{subValue}</div>
            )}
          </div>
          {trend && (
            <TrendingUp 
              className={`h-4 w-4 ${
                trend === "up" ? "text-[#10b981]" : 
                trend === "down" ? "text-[#ef4444]" : "text-[#525252]"
              }`} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Session History Item ─────────────────────────────────────────────────────
interface SessionHistoryItemProps {
  dayLabel: string;
  muscleTags: string[];
  isCompleted: boolean;
  isUpcoming?: boolean;
  isLocked?: boolean;
  dateStr?: string;
}

function SessionHistoryItem({ dayLabel, muscleTags, isCompleted, isUpcoming, isLocked, dateStr }: SessionHistoryItemProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 py-2 px-3 border border-[#2a2a2a] relative overflow-hidden",
      isCompleted ? "bg-[#0a0a0a]" : isLocked ? "bg-[#0a0a0a]" : "bg-[#111111]"
    )}>
      {isCompleted && (
        <div className="absolute inset-0 bg-[#10b981]/5 pointer-events-none" />
      )}
      {isUpcoming && !isLocked && (
        <div className="absolute inset-0 bg-[#e53e00]/5 pointer-events-none" />
      )}
      {isLocked && (
        <div className="absolute inset-0 bg-[#2a2a2a]/10 pointer-events-none" />
      )}
      
      <div className="relative z-10 flex items-center gap-3 flex-1">
        {isCompleted ? (
          <div className="flex items-center justify-center w-8 h-8 bg-[#10b981]/10 border border-[#10b981]/30">
            <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
          </div>
        ) : isLocked ? (
          <div className="flex items-center justify-center w-8 h-8 bg-[#525252]/10 border border-[#525252]/30">
            <Calendar className="h-4 w-4 text-[#525252]" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 bg-[#e53e00]/10 border border-[#e53e00]/30">
            <Calendar className="h-4 w-4 text-[#e53e00]" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-data text-xs font-bold uppercase tracking-wide",
              isCompleted ? "text-[#a3a3a3]" : isLocked ? "text-[#525252]" : "text-[#e5e5e5]"
            )}>
              {dayLabel}
            </span>
            {isCompleted && (
              <span className="stamp text-[8px] text-[#10b981]">DONE</span>
            )}
            {isUpcoming && !isLocked && (
              <span className="stamp text-[8px] text-[#e53e00]">NEXT</span>
            )}
            {isLocked && (
              <span className="stamp text-[8px] text-[#525252]">LOCKED</span>
            )}
          </div>
          {muscleTags.length > 0 && (
            <div className="flex gap-1 mt-0.5">
              {muscleTags.slice(0, 3).map((tag) => (
                <span key={tag} className={cn(
                  "px-1 py-0.5 border font-data text-[8px] uppercase tracking-widest",
                  isLocked 
                    ? "border-[#2a2a2a] text-[#3a3a3a]" 
                    : "border-[#2a2a2a] text-[#525252]"
                )}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {dateStr && !isLocked && (
          <span className="font-data text-[9px] text-[#525252]">{dateStr}</span>
        )}
        {isLocked && (
          <span className="font-data text-[9px] text-[#3a3a3a]">--</span>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton grid ────────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="space-y-6 py-6">
      <div className="border border-[#2a2a2a] bg-[#0a0a0a] p-5">
        <div className="skeleton-steal h-6 w-64 mb-2" />
        <div className="skeleton-steal h-4 w-40" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-[#2a2a2a] bg-[#0a0a0a] p-3 min-h-[140px]">
            <div className="skeleton-steal h-3 w-20 mb-4" />
            <div className="skeleton-steal h-12 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 border border-[#2a2a2a] bg-[#0a0a0a] p-6 min-h-[280px]">
          <div className="skeleton-steal h-4 w-32 mb-4" />
          <div className="skeleton-steal h-8 w-56 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-steal h-3 w-full" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 border border-[#2a2a2a] bg-[#0a0a0a] p-5 min-h-[280px]">
          <div className="skeleton-steal h-3 w-24 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-steal h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Active Mission panel ─────────────────────────────────────────────────────
function ActiveMissionPanel({ planId }: { planId: string }) {
  const { data: days, isLoading } = usePlanDays(planId);
  const { data: sessions } = useSessions();
  const today = new Date().getDay() || 7;

  // Find the next session in line (first uncompleted one)
  const nextSessionDay = useMemo(() => {
    if (!days || days.length === 0) return null;
    
    // Sort days by week first, then by dayOfWeek
    const sortedDays = [...days].sort((a, b) => {
      if (a.week !== b.week) return a.week - b.week;
      return a.dayOfWeek - b.dayOfWeek;
    });

    // Create a map of completed planDay IDs
    const completedPlanDayIds = new Set(
      sessions
        ?.filter(s => s.status === 'completed')
        .map(s => s.planDay)
        .filter((id): id is string => !!id) || []
    );

    // Find the first uncompleted session
    return sortedDays.find(d => !completedPlanDayIds.has(d.id)) || sortedDays[0];
  }, [days, sessions]);

  const { data: exercises, isLoading: exLoading } = usePlanExercises(
    nextSessionDay?.id
  );
  const { data: completedSession } = usePlanDaySession(nextSessionDay?.id);

  if (isLoading || exLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-steal h-4 w-full" />
        ))}
      </div>
    );
  }

  if (!nextSessionDay) {
    return (
      <p className="stamp text-[10px] text-[#525252]">NO TRAINING DAYS CONFIGURED</p>
    );
  }

  const estMinutes = exercises
    ? Math.round((exercises.reduce((acc, ex) => acc + ex.sets * (ex.restSeconds + 45), 0)) / 60)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="stamp text-[9px] tracking-[0.2em] text-[#525252]">DAY</span>
        <span className="font-data text-sm font-bold text-[#e5e5e5] uppercase tracking-widest">
          {nextSessionDay.label}
        </span>
        {nextSessionDay.focus.length > 0 && (
          <div className="flex gap-1">
            {nextSessionDay.focus.map((f: string) => (
              <span
                key={f}
                className="px-2 py-0.5 border border-[#2a2a2a] font-data text-[9px] uppercase tracking-widest text-[#71717A]"
              >
                {f}
              </span>
            ))}
          </div>
        )}
        {completedSession && (
          <div className="flex items-center gap-1.5 text-[#10b981]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-data text-[9px] uppercase tracking-widest">COMPLETED</span>
          </div>
        )}
      </div>

      {exercises && exercises.length > 0 && (
        <div className="space-y-1.5">
          <div className="h-px bg-[#1a1a1a]" />
          {exercises.slice(0, 6).map((ex, i) => {
            const exName = ex.expand?.exercise?.name ?? ex.name ?? ex.exercise;
            return (
              <div
                key={ex.id}
                className="flex items-center gap-3 py-1.5 px-2 hover:bg-[#1a1a1a] transition-colors group"
              >
                <span className="stamp text-[8px] text-[#525252] w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-data text-xs text-[#e5e5e5] flex-1 uppercase tracking-wide group-hover:text-[#e53e00] transition-colors truncate">
                  {exName}
                </span>
                <span className="stamp text-[9px] text-[#71717A] shrink-0">
                  {ex.sets}×{ex.repsMin}
                  {ex.repsMin !== ex.repsMax ? `-${ex.repsMax}` : ""}
                </span>
              </div>
            );
          })}
          {exercises.length > 6 && (
            <p className="stamp text-[9px] text-[#525252] pl-2">
              +{exercises.length - 6} MORE
            </p>
          )}
        </div>
      )}

      {estMinutes > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <span className="stamp text-[9px] text-[#525252]">EST. {estMinutes} MIN</span>
        </div>
      )}

      <Button
        asChild
        disabled={!!completedSession}
        className={cn(
          "w-full rounded-none font-data text-xs font-black uppercase tracking-widest h-11",
          completedSession
            ? "bg-[#16a34a] text-white cursor-default"
            : "bg-[#e53e00] text-white hover:bg-[#ff4500]"
        )}
      >
        <Link href={`/workout/${nextSessionDay.id}`}>
          {completedSession ? (
            <>
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              [ COMPLETED ]
            </>
          ) : (
            <>
              <Play className="mr-2 h-3.5 w-3.5" />
              [ DEPLOY — START ]
            </>
          )}
        </Link>
      </Button>
    </div>
  );
}

// ─── Session History Panel ────────────────────────────────────────────────────
function SessionHistoryPanel({ planId }: { planId: string }) {
  const { data: days, isLoading } = usePlanDays(planId);
  const { data: sessions } = useSessions();

  const today = new Date().getDay() || 7; // 1=Monday, 7=Sunday

  // Calculate upcoming session dates
  function getNextSessionDate(dayOfWeek: number, weekOffset: number = 0): string {
    const now = new Date();
    const currentDay = now.getDay() || 7;
    let daysUntil = dayOfWeek - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    daysUntil += weekOffset * 7;
    
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const dd = String(nextDate.getDate()).padStart(2, "0");
    const mon = months[nextDate.getMonth()];
    return `${dd}${mon}`;
  }

  // Get the sequential index of a plan day (for ordering)
  function getDaySequenceIndex(day: any): number {
    return (day.week - 1) * 7 + (day.dayOfWeek - 1);
  }

  // Build session history data
  const sessionHistory = useMemo(() => {
    if (!days) return { upcoming: [], completed: [] };

    // Create a map of completed planDay IDs with their completion status
    const completedSessionMap = new Map(
      sessions
        ?.filter(s => s.status === 'completed')
        .map(s => [s.planDay, true]) || []
    );

    // Sort days by week first, then by dayOfWeek for proper sequential order
    const sortedDays = [...days].sort((a, b) => {
      if (a.week !== b.week) return a.week - b.week;
      return a.dayOfWeek - b.dayOfWeek;
    });

    // Find the FIRST uncompleted session - this is the current active session
    const firstUncompletedIndex = sortedDays.findIndex(d => !completedSessionMap.has(d.id));
    const startIndex = firstUncompletedIndex >= 0 ? firstUncompletedIndex : 0;

    const upcoming: Array<SessionHistoryItemProps & { dateStr: string; isLocked: boolean }> = [];
    const completed: SessionHistoryItemProps[] = [];

    // Function to calculate the next date for a given day of week
    function calculateSessionDate(dayOfWeek: number, sessionIndex: number): string {
      const now = new Date();
      const currentDay = now.getDay() || 7; // 1=Monday, 7=Sunday
      
      // Calculate days until the target day of week
      let daysUntil = dayOfWeek - currentDay;
      if (daysUntil <= 0) daysUntil += 7;
      
      // Add week offset based on session position
      // For sessions in the same week pattern, calculate based on actual day differences
      const weekOffset = Math.floor(sessionIndex / sortedDays.filter(d => d.week === 1).length);
      daysUntil += weekOffset * 7;
      
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysUntil);
      
      const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      const dd = String(targetDate.getDate()).padStart(2, "0");
      const mon = months[targetDate.getMonth()];
      return `${dd}${mon}`;
    }

    // Collect upcoming sessions (starting from the first uncompleted one)
    let collectedCount = 0;
    
    for (let i = startIndex; i < sortedDays.length && collectedCount < 3; i++) {
      const day = sortedDays[i];
      const isCompleted = completedSessionMap.has(day.id);
      
      if (!isCompleted) {
        const dateStr = calculateSessionDate(day.dayOfWeek, collectedCount);
        
        upcoming.push({
          dayLabel: day.label,
          muscleTags: Array.isArray(day.focus) ? day.focus : [],
          isCompleted: false,
          isUpcoming: collectedCount === 0, // Only the first one is "NEXT"
          dateStr,
          isLocked: collectedCount > 0, // All after the first are locked
        });
        collectedCount++;
      }
    }

    // Collect completed sessions (last 2 completed, in reverse order)
    const allCompleted = sortedDays
      .filter(d => completedSessionMap.has(d.id))
      .slice(-2)
      .reverse();
    
    for (const day of allCompleted) {
      completed.push({
        dayLabel: day.label,
        muscleTags: Array.isArray(day.focus) ? day.focus : [],
        isCompleted: true,
      });
    }

    return { upcoming, completed };
  }, [days, sessions, today]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-steal h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!days || days.length === 0) {
    return (
      <p className="stamp text-[10px] text-[#525252]">NO SCHEDULE DATA</p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Upcoming section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="stamp text-[9px] tracking-[0.2em] text-[#e53e00]">UPCOMING</span>
          <div className="h-px flex-1 bg-[#2a2a2a]" />
        </div>
        <div className="space-y-1.5">
          {sessionHistory.upcoming.length > 0 ? (
            sessionHistory.upcoming.map((item, i) => (
              <SessionHistoryItem key={i} {...item} />
            ))
          ) : (
            <p className="stamp text-[9px] text-[#525252] py-2">ALL SESSIONS COMPLETED</p>
          )}
        </div>
      </div>

      {/* Completed section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="stamp text-[9px] tracking-[0.2em] text-[#10b981]">COMPLETED</span>
          <div className="h-px flex-1 bg-[#2a2a2a]" />
        </div>
        <div className="space-y-1.5">
          {sessionHistory.completed.length > 0 ? (
            sessionHistory.completed.map((item, i) => (
              <SessionHistoryItem key={i} {...item} />
            ))
          ) : (
            <p className="stamp text-[9px] text-[#525252] py-2">NO COMPLETED SESSIONS YET</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Recent activity feed ─────────────────────────────────────────────────────
function RecentFeed() {
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const { data: allSets, isLoading: setsLoading } = useAllSets();

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  // Combine loading states
  const isLoading = sessionsLoading || setsLoading;

  // Get recent completed sessions sorted by completion date
  const recentSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    return [...sessions]
      .sort((a, b) => {
        const dateA = new Date(a.completedAt ?? a.startedAt ?? a.created).getTime();
        const dateB = new Date(b.completedAt ?? b.startedAt ?? b.created).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [sessions]);

  function formatTacticalDate(dateStr: string) {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mon = months[d.getMonth()];
    const yy = String(d.getFullYear()).slice(2);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${dd}${mon}${yy} ${hh}${mm}`;
  }

  function getSessionVolume(sessionId: string): string {
    if (!allSets || allSets.length === 0) return "—";
    const sets = allSets.filter((s) => s.session === sessionId);
    if (sets.length === 0) return "—";
    const total = sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
    if (total === 0) return "—";
    return (total / 1000).toFixed(1) + "T";
  }

  function getSessionSetCount(sessionId: string): number {
    if (!allSets || allSets.length === 0) return 0;
    const count = allSets.filter((s) => s.session === sessionId).length;
    return count;
  }

  function getPlanDayLabel(session: any): string {
    // Try to get the plan day label from session expand data
    if (session.expand?.planDay?.label) {
      return session.expand.planDay.label;
    }
    // Fallback to session notes or status
    if (session.sessionNotes) {
      return session.sessionNotes.toUpperCase().slice(0, 20);
    }
    return "WORKOUT";
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-steal h-8 w-full" />
        ))}
      </div>
    );
  }

  if (!recentSessions.length) {
    return (
      <div className="border border-dashed border-[#2a2a2a] p-6 text-center">
        <span className="stamp text-[9px] text-[#525252]">NO SESSION HISTORY</span>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {recentSessions.map((session, i) => {
        const sets = getSessionSetCount(session.id);
        const volume = getSessionVolume(session.id);
        const dateStr = formatTacticalDate(session.completedAt ?? session.startedAt ?? session.created);
        const planDayLabel = getPlanDayLabel(session);
        
        return (
          <div
            key={session.id}
            className={cn(
              "flex items-center gap-3 py-2.5 px-3 hover:bg-[#1a1a1a] transition-colors",
              i < recentSessions.length - 1 && "border-b border-[#1a1a1a]"
            )}
          >
            <span className="font-data text-[10px] text-[#525252] tabular-nums shrink-0 w-28">
              {dateStr}
            </span>
            <span className="text-[#2a2a2a] select-none">—</span>
            <span className="font-data text-[11px] text-[#a3a3a3] uppercase tracking-wide flex-1 truncate">
              {planDayLabel}
            </span>
            <span className="font-data text-[10px] text-[#71717A] shrink-0">
              {sets} SETS
            </span>
            <span className="font-data text-[10px] text-[#e53e00] shrink-0 w-12 text-right">
              {volume}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Recent PRs strip ──────────────────────────────────────────────────────────
function RecentPRs() {
  const records = usePersonalRecords();

  const top3 = records.slice(0, 3);

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  function formatShortDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}${months[d.getMonth()]}${String(d.getFullYear()).slice(2)}`;
  }

  if (!top3.length) {
    return (
      <div className="border border-dashed border-[#2a2a2a] p-6 text-center">
        <span className="stamp text-[9px] text-[#525252]">NO PRs YET</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {top3.map((pr, i) => (
        <div
          key={pr.exerciseId}
          className="border border-[#2a2a2a] bg-[#0a0a0a] p-3 flex items-center gap-3"
        >
          <span className="stamp text-[8px] text-[#525252] w-5 shrink-0">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-data text-[10px] text-[#e5e5e5] uppercase tracking-wide truncate">
              {pr.exerciseName}
            </p>
            <p className="stamp text-[9px] text-[#525252] mt-0.5">
              {formatShortDate(pr.date)}
            </p>
          </div>
          <span className="font-data text-xs font-bold text-[#e53e00] shrink-0">
            {pr.weight}kg×{pr.reps}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Quick ops tiles ──────────────────────────────────────────────────────────
const QUICK_OPS = [
  { label: "PROGRAMS", href: "/programs", icon: <Dumbbell className="h-4 w-4" />, kbd: "P" },
  { label: "PROGRESS", href: "/progress", icon: <TrendingUp className="h-4 w-4" />, kbd: "R" },
  { label: "LOG SESSION", href: "/workout", icon: <Activity className="h-4 w-4" />, kbd: "L" },
  { label: "SETTINGS", href: "/settings", icon: <Settings className="h-4 w-4" />, kbd: "S" },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { data: activePlan, isLoading: planLoading } = useActivePlan();
  const streakData = useStreakData();
  const personalRecords = usePersonalRecords();
  const { data: allSets } = useAllSets();
  const { data: sessions } = useSessions();

  const firstName = (user?.name?.split(" ")[0] ?? "OPERATOR").toUpperCase();

  const totalVolumeTons = useMemo(() => {
    if (!allSets) return 0;
    const total = allSets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
    return Math.round(total / 1000);
  }, [allSets]);

  const prsThisMonth = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return personalRecords.filter((pr) => new Date(pr.date) >= monthStart).length;
  }, [personalRecords]);

  // Debug: log sessions data
  useEffect(() => {
    if (sessions) {
      console.log("[DASHBOARD] Sessions loaded:", sessions.length);
      sessions.forEach((s, i) => {
        console.log(`  Session ${i + 1}:`, s.id, s.status, s.completedAt);
      });
    }
  }, [sessions]);

  if (planLoading) {
    return <SkeletonGrid />;
  }

  return (
    <div className="relative space-y-6 py-6">
      {/* Gym background overlay */}
      <GymBackgroundOverlay className="fixed inset-0 -z-10" opacity={0.02} />
      
      {/* ── Hero strip ─────────────────────────────────────────────────────── */}
      <div className="border-b border-[#2a2a2a] pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="stamp text-[9px] tracking-[0.3em] text-[#525252] mb-1">STEAL THERAPY</p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-[#e5e5e5]">
              OPERATIONS DASHBOARD
            </h1>
            <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <TacticalClock />
            <span className="stamp text-[9px] text-[#525252]">OPERATOR: {firstName}</span>
          </div>
        </div>
      </div>

      {/* ── KPI row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiPanel
          label="CURRENT STREAK"
          value={streakData.currentStreak}
          unit="DAYS"
          subValue={`BEST: ${streakData.longestStreak}D`}
          icon={<Flame className="h-3.5 w-3.5" />}
          accent="green"
          tag="01"
          trend="up"
        />
        <KpiPanel
          label="THIS WEEK"
          value={streakData.thisWeekSessions}
          unit="SESSIONS"
          icon={<Zap className="h-3.5 w-3.5" />}
          accent="orange"
          tag="02"
          trend="up"
        />
        <KpiPanel
          label="TOTAL VOLUME"
          value={totalVolumeTons}
          unit="TONNES LIFTED"
          icon={<BarChart3 className="h-3.5 w-3.5" />}
          accent="orange"
          tag="03"
          trend="up"
        />
        <KpiPanel
          label="PRS THIS MONTH"
          value={prsThisMonth}
          unit="RECORDS SET"
          icon={<Trophy className="h-3.5 w-3.5" />}
          accent="blue"
          tag="04"
          trend={prsThisMonth > 0 ? "up" : "neutral"}
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Mission — col 8 */}
        <div className="lg:col-span-8 border border-[#2a3e00] bg-[#0a0a0a] p-6 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="stamp text-[9px] tracking-[0.25em] text-[#525252]">MISSION BRIEFING</span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              {activePlan && (
                <span className="stamp text-[9px] text-[#10b981] tracking-widest">ACTIVE</span>
              )}
            </div>

            {activePlan ? (
              <>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-tight text-[#e5e5e5]">
                    {activePlan.title}
                  </h2>
                  <p className="stamp text-[9px] text-[#525252] mt-1">
                    WK {activePlan.currentWeek} / {activePlan.durationWeeks} — {activePlan.goalType?.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="h-px bg-[#1a1a1a]" />
                <ActiveMissionPanel planId={activePlan.id} />
              </>
            ) : (
              <div className="flex flex-col gap-4 py-6">
                <p className="stamp text-[10px] text-[#525252]">NO ACTIVE MISSION ASSIGNED</p>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#e5e5e5]">
                  NO ACTIVE PROGRAM
                </h2>
                <p className="text-sm text-[#71717A] max-w-sm">
                  Deploy a program from the unit catalog or build your own. Stop waiting, start working.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    asChild
                    className="rounded-none bg-[#e53e00] font-data text-xs font-black uppercase tracking-widest text-white hover:bg-[#ff4500] h-10"
                  >
                    <Link href="/programs">
                      <Dumbbell className="mr-2 h-3 w-3" />
                      [ FIND A PROGRAM ]
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none border-[#2a2a2a] font-data text-xs font-bold uppercase tracking-widest text-[#e5e5e5] hover:border-[#e53e00]/50 hover:bg-[#1a1a1a] h-10"
                  >
                    <Link href="/plans">BROWSE TEMPLATES</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session History — col 4 */}
        <div className="lg:col-span-4 border border-[#2a2a2a] bg-[#0a0a0a] p-5 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="stamp text-[9px] tracking-[0.25em] text-[#525252]">SESSION HISTORY</span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
            </div>
            {activePlan ? (
              <SessionHistoryPanel planId={activePlan.id} />
            ) : (
              <p className="stamp text-[10px] text-[#525252]">NO ACTIVE PROGRAM</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom feed + PRs ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent activity feed — col 8 */}
        <div className="lg:col-span-8 border border-[#2a2a2a] bg-[#0a0a0a] p-5 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="stamp text-[9px] tracking-[0.25em] text-[#525252]">ACTIVITY LOG</span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <Link
                href="/progress"
                className="stamp text-[9px] text-[#525252] hover:text-[#e53e00] transition-colors"
              >
                VIEW ALL →
              </Link>
            </div>
            <RecentFeed />
          </div>
        </div>

        {/* Recent PRs — col 4 */}
        <div className="lg:col-span-4 border border-[#2a2a2a] bg-[#0a0a0a] p-5 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="stamp text-[9px] tracking-[0.25em] text-[#525252]">RECENT PRs</span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <Trophy className="h-3 w-3 text-[#71717A]" />
            </div>
            <RecentPRs />
          </div>
        </div>
      </div>

      {/* ── Bottom HUD ─────────────────────────────────────────────────────── */}
      <div className="border-t-2 border-[#e53e00] pt-4">
        <div className="grid grid-cols-3">
          <div className="px-4 py-2 text-center border-r border-[#1a1a1a]">
            <p className="stamp text-[8px] text-[#525252] mb-1">LAST SYNC</p>
            <p className="font-data text-[10px] text-[#71717A]">LIVE</p>
          </div>
          <div className="px-4 py-2 text-center border-r border-[#1a1a1a]">
            <p className="stamp text-[8px] text-[#525252] mb-1">DEVICE</p>
            <p className="font-data text-[10px] text-[#71717A] uppercase">WEB</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="stamp text-[8px] text-[#525252] mb-1">BUILD</p>
            <p className="font-data text-[10px] text-[#71717A]">STEAL v2</p>
          </div>
        </div>
      </div>
    </div>
  );
}