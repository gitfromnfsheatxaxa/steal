"use client";

import { useMemo, useEffect, useState } from "react";
import {
  useStreakData,
  usePersonalRecords,
  useSessions,
  useAllSets,
  useMuscleDistribution,
  useProgressData,
} from "@/hooks/useProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { CalendarHeatmap } from "@/components/progress/CalendarHeatmap";
import { MusclePieChart } from "@/components/progress/MusclePieChart";
import { PRWall } from "@/components/progress/PRWall";
import { AchievementsBoard } from "@/components/progress/AchievementsBoard";
import { CounterFX } from "@/components/fx/ImpactFlash";
import { BrandNoiseOverlay } from "@/components/layout/BrandNoiseOverlay";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateVolume, estimate1RM } from "@/lib/utils";
import { EnhancedVolumeChart } from "@/components/progress/EnhancedVolumeChart";
import { ProgressTrendChart } from "@/components/progress/ProgressTrendChart";
import { RepsDistributionChart } from "@/components/progress/RepsDistributionChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";

// ============================================================================
// LiveClock — ticking monospace HH:MM:SS
// ============================================================================
function LiveClock() {
  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString("en-GB", { hour12: false })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="stamp"
      style={{
        fontVariantNumeric: "tabular-nums",
        fontSize: 11,
        letterSpacing: "0.15em",
        color: "#525252",
      }}
    >
      {time}
    </span>
  );
}

// ============================================================================
// PanelHeader — compact header for each panel
// ============================================================================
interface PanelHeaderProps {
  label: string;
  sub?: string;
  panelNum?: string;
}
function PanelHeader({ label, sub, panelNum }: PanelHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-2">
      <div>
        <div
          className="stamp"
          style={{ 
            color: "#e5e5e5", 
            letterSpacing: "0.15em", 
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            className="stamp mt-0.5"
            style={{ 
              color: "#71717A", 
              fontSize: 8, 
              letterSpacing: "0.12em" 
            }}
          >
            {sub}
          </div>
        )}
      </div>
      {panelNum && (
        <span
          className="stamp"
          style={{ 
            color: "#525252", 
            fontSize: 8, 
            letterSpacing: "0.08em" 
          }}
        >
          {panelNum}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// KPI Panel — single stat with trend indicator
// ============================================================================
interface KPIPanelProps {
  label: string;
  value: number | string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  panelNum: string;
  accent?: "orange" | "green" | "blue";
}
function KPIPanel({ label, value, subValue, trend, panelNum, accent = "orange" }: KPIPanelProps) {
  const accentColors = {
    orange: { border: "#e53e00", text: "#e53e00", dot: "#e53e00" },
    green: { border: "#10b981", text: "#10b981", dot: "#10b981" },
    blue: { border: "#3b82f6", text: "#3b82f6", dot: "#3b82f6" },
  };
  const colors = accentColors[accent];

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div
      className="border border-[#2a2a2a] bg-[#0a0a0a] p-3 relative overflow-hidden"
      style={{ borderLeft: `2px solid ${colors.border}` }}
    >
      <BrandNoiseOverlay />
      <div className="relative z-10">
        <PanelHeader label={label} panelNum={panelNum} />
        <div className="flex items-end justify-between mt-2">
          <div>
            <div
              className="metric-xl"
              style={{ 
                color: colors.text, 
                lineHeight: 1,
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <CounterFX value={typeof value === "number" ? value : parseInt(value.toString()) || 0} />
            </div>
            {subValue && (
              <div className="stamp mt-1" style={{ color: "#71717A", fontSize: 9 }}>
                {subValue}
              </div>
            )}
          </div>
          {trend && (
            <TrendIcon 
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

// ============================================================================
// SignalLost — error state panel
// ============================================================================
function SignalLost({ onRetry, t }: { onRetry?: () => void; t: (p: string) => string }) {
  return (
    <div
      className="border border-[#ef4444]/40 bg-[#0a0a0a] flex flex-col items-center justify-center py-16 gap-4"
      style={{ borderLeft: "3px solid #ef4444" }}
    >
      <div
        className="stamp"
        style={{ fontSize: 14, letterSpacing: "0.3em", color: "#ef4444" }}
      >
        {t("progress.SIGNAL_LOST")}
      </div>
      <div className="stamp" style={{ color: "#525252", fontSize: 10 }}>
        {t("progress.SIGNAL_LOST_DESC")}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="stamp"
          style={{
            color: "#e5e5e5",
            border: "1px solid #ef4444",
            padding: "6px 16px",
            fontSize: 10,
            letterSpacing: "0.2em",
            background: "transparent",
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          {t("progress.RETRY")}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// SkeletonGrid — loading state
// ============================================================================
function SkeletonGrid() {
  return (
    <div className="space-y-3">
      {/* Hero */}
      <Skeleton className="skeleton-steal h-20 rounded-none" />
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="skeleton-steal h-28 rounded-none" />
        ))}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Skeleton className="skeleton-steal h-64 rounded-none lg:col-span-2" />
        <Skeleton className="skeleton-steal h-64 rounded-none" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Skeleton className="skeleton-steal h-56 rounded-none" />
        <Skeleton className="skeleton-steal h-56 rounded-none" />
      </div>
      {/* PR Wall */}
      <Skeleton className="skeleton-steal h-48 rounded-none" />
      {/* Bottom strip */}
      <Skeleton className="skeleton-steal h-16 rounded-none" />
    </div>
  );
}

// ============================================================================
// EmptyState — when no data exists
// ============================================================================
function EmptyState({ t }: { t: (p: string) => string }) {
  return (
    <div
      className="border border-[#2a2a2a] bg-[#0a0a0a] flex flex-col items-center justify-center py-20 gap-6"
      style={{ borderLeft: "3px solid #525252" }}
    >
      <BrandNoiseOverlay />
      <div
        className="stamp relative z-10"
        style={{ fontSize: 14, letterSpacing: "0.3em", color: "#525252", textAlign: "center" }}
      >
        {t("progress.NO_DATA_ACQUIRED")}
      </div>
      <div
        className="stamp relative z-10"
        style={{ fontSize: 10, letterSpacing: "0.2em", color: "#71717A", textAlign: "center" }}
      >
        {t("progress.NO_DATA_DESC")}
      </div>
    </div>
  );
}

// ============================================================================
// Main page
// ============================================================================
export default function ProgressPage() {
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useSessions();
  const {
    data: allSets,
    isLoading: setsLoading,
    isError: setsError,
    refetch: refetchSets,
  } = useAllSets();
  const muscleData = useMuscleDistribution();
  const muscleLoading = false; // Computed data, no loading state
  const streakData = useStreakData();
  const personalRecords = usePersonalRecords();
  const achievements = useAchievements();
  const { t } = useI18n();

  // -- Volume data for enhanced chart --
  const enhancedVolumeData = useMemo(() => {
    if (!sessions || !allSets || sessions.length === 0) return [];

    const sessionVolMap = new Map<string, { volume: number; sessions: number; rpeSum: number; rpeCount: number }>();
    
    for (const session of sessions) {
      sessionVolMap.set(session.id, { volume: 0, sessions: 1, rpeSum: 0, rpeCount: 0 });
    }
    
    for (const set of allSets) {
      const vol = calculateVolume(1, set.reps, set.weight);
      const existing = sessionVolMap.get(set.session);
      if (existing) {
        existing.volume += vol;
        if (set.rpe > 0) {
          existing.rpeSum += set.rpe;
          existing.rpeCount++;
        }
      }
    }

    // Group by week
    const weekMap = new Map<string, { ts: number; volume: number; sessions: number; rpeSum: number; rpeCount: number }>();
    for (const [sessionId, data] of sessionVolMap.entries()) {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) continue;
      
      const d = new Date(session.completedAt ?? session.startedAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().slice(0, 10);
      
      const existing = weekMap.get(key);
      if (existing) {
        existing.volume += data.volume;
        existing.sessions += data.sessions;
        existing.rpeSum += data.rpeSum;
        existing.rpeCount += data.rpeCount;
      } else {
        weekMap.set(key, {
          ts: weekStart.getTime(),
          volume: data.volume,
          sessions: data.sessions,
          rpeSum: data.rpeSum,
          rpeCount: data.rpeCount,
        });
      }
    }

    return Array.from(weekMap.entries())
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        volume: Math.round(data.volume),
        avgRpe: data.rpeCount > 0 ? data.rpeSum / data.rpeCount : 0,
        sessions: data.sessions,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.week + ", 2024").getTime();
        const dateB = new Date(b.week + ", 2024").getTime();
        return dateA - dateB;
      })
      .slice(-8);
  }, [sessions, allSets]);

  // -- Progress trend data --
  const progressTrendData = useMemo(() => {
    if (!sessions || !allSets || sessions.length === 0) return [];

    // Group sets by week and exercise
    const weekExerciseData = new Map<string, Map<string, { weights: number[]; reps: number[]; sets: number }>>();
    
    for (const session of sessions) {
      const d = new Date(session.completedAt ?? session.startedAt);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const weekKey = weekStart.toISOString().slice(0, 10);
      
      if (!weekExerciseData.has(weekKey)) {
        weekExerciseData.set(weekKey, new Map());
      }
      
      const weekData = weekExerciseData.get(weekKey)!;
      
      // Find sets for this session
      const sessionSets = allSets.filter(s => s.session === session.id);
      for (const set of sessionSets) {
        if (!set.exercise) continue;
        if (!weekData.has(set.exercise)) {
          weekData.set(set.exercise, { weights: [], reps: [], sets: 0 });
        }
        const exData = weekData.get(set.exercise)!;
        exData.weights.push(set.weight);
        exData.reps.push(set.reps);
        exData.sets++;
      }
    }

    // Aggregate to weekly averages
    return Array.from(weekExerciseData.entries())
      .map(([week, exMap]) => {
        let totalWeight = 0;
        let totalReps = 0;
        let totalSets = 0;
        
        for (const [, data] of exMap.entries()) {
          totalWeight += data.weights.reduce((a, b) => a + b, 0);
          totalReps += data.reps.reduce((a, b) => a + b, 0);
          totalSets += data.sets;
        }
        
        const totalDataPoints = totalSets;
        return {
          week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          avgWeight: totalDataPoints > 0 ? totalWeight / totalDataPoints : 0,
          avgReps: totalDataPoints > 0 ? totalReps / totalDataPoints : 0,
          totalSets,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.week + ", 2024").getTime();
        const dateB = new Date(b.week + ", 2024").getTime();
        return dateA - dateB;
      })
      .slice(-8);
  }, [sessions, allSets]);

  // -- Reps distribution data --
  const repsDistributionData = useMemo(() => {
    if (!allSets || allSets.length === 0) return [];

    const repRanges = [
      { label: "1-3", min: 1, max: 3 },
      { label: "4-5", min: 4, max: 5 },
      { label: "6-8", min: 6, max: 8 },
      { label: "9-10", min: 9, max: 10 },
      { label: "11-12", min: 11, max: 12 },
      { label: "13+", min: 13, max: 999 },
    ];

    return repRanges.map(range => ({
      reps: range.label,
      count: allSets.filter(s => s.reps >= range.min && s.reps <= range.max).length,
    })).filter(d => d.count > 0);
  }, [allSets]);

  // -- Heatmap sessions prop with volume --
  const heatmapSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.map((s) => {
      // Calculate volume for this session
      const sessionVolume = allSets
        .filter((set) => set.session === s.id)
        .reduce((acc, set) => acc + (set.weight * set.reps), 0);
      
      return {
        completedAt: s.completedAt ?? s.startedAt,
        startedAt: s.startedAt,
        volume: sessionVolume,
      };
    });
  }, [sessions, allSets]);

  // -- Muscle pie chart data (percentage distribution) --
  const musclePieData = useMemo(() => {
    if (!muscleData || muscleData.length === 0) return [];
    
    const totalVolume = muscleData.reduce((sum: number, d: { value: number }) => sum + d.value, 0);
    if (totalVolume === 0) return [];

    const colors = [
      "#e53e00", "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
      "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316",
      "#6366f1", "#6b7280"
    ];

    return muscleData.slice(0, 12).map((d: { name: string; value: number }, index: number) => ({
      muscle: d.name,
      percentage: (d.value / totalVolume) * 100,
      volume: d.value,
      color: colors[index % colors.length],
    }));
  }, [muscleData]);

  // -- Donut: push / pull / legs split --
  const splitCounts = useMemo(() => {
    if (!muscleData || muscleData.length === 0) return { push: 1, pull: 1, legs: 1 };

    const PUSH_MUSCLES = ["chest", "shoulder", "shoulders", "tricep", "triceps"];
    const PULL_MUSCLES = ["back", "bicep", "biceps", "lat", "lats", "rear delt", "rear delts", "traps"];
    const LEGS_MUSCLES = ["leg", "legs", "quad", "quads", "hamstring", "hamstrings", "glute", "glutes", "calf", "calves"];

    let push = 0;
    let pull = 0;
    let legs = 0;

    for (const d of muscleData) {
      const name = d.name.toLowerCase();
      if (PUSH_MUSCLES.some((m) => name.includes(m))) push += d.value;
      else if (PULL_MUSCLES.some((m) => name.includes(m))) pull += d.value;
      else if (LEGS_MUSCLES.some((m) => name.includes(m))) legs += d.value;
      else push += d.value;
    }

    return { push: push || 1, pull: pull || 1, legs: legs || 1 };
  }, [muscleData]);

  // -- Top exercises for LiftProgressionChart --
  const topExerciseIds = useMemo(
    () => personalRecords.slice(0, 3).map((pr) => pr.exerciseId),
    [personalRecords]
  );
  const exerciseNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const pr of personalRecords) {
      map[pr.exerciseId] = pr.exerciseName;
    }
    return map;
  }, [personalRecords]);

  // -- HUD bottom strip derivations --
  const hudStats = useMemo(() => {
    if (!allSets || allSets.length === 0)
      return { totalReps: 0, avgRpe: 0, heaviestWeight: 0, heaviestReps: 0, heaviestRpe: 0, totalVolume: 0 };

    let totalReps = 0;
    let rpeSum = 0;
    let rpeCount = 0;
    let heaviestWeight = 0;
    let heaviestReps = 0;
    let heaviestRpe = 0;
    let totalVolume = 0;

    for (const set of allSets) {
      totalReps += set.reps;
      totalVolume += calculateVolume(1, set.reps, set.weight);
      if (set.rpe > 0) {
        rpeSum += set.rpe;
        rpeCount++;
      }
      if (set.weight > heaviestWeight) {
        heaviestWeight = set.weight;
        heaviestReps = set.reps;
        heaviestRpe = set.rpe;
      }
    }

    return {
      totalReps,
      avgRpe: rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : 0,
      heaviestWeight,
      heaviestReps,
      heaviestRpe,
      totalVolume,
    };
  }, [allSets]);

  // -- Total volume for gauge --
  const totalVolume = useMemo(() => {
    if (!allSets || allSets.length === 0) return 0;
    return Math.round(allSets.reduce((acc, s) => acc + calculateVolume(1, s.reps, s.weight), 0));
  }, [allSets]);

  // -- Calculate trends --
  const calculateTrend = (current: number, previous: number): "up" | "down" | "neutral" => {
    if (previous === 0) return current > 0 ? "up" : "neutral";
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return "up";
    if (change < -5) return "down";
    return "neutral";
  };

  const isLoading = sessionsLoading || setsLoading;
  const isError = sessionsError || setsError;

  const handleRetry = () => {
    void refetchSessions();
    void refetchSets();
  };

  // -- Error state --
  if (isError) {
    return (
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#e5e5e5]" style={{ fontFamily: "var(--font-heading, system-ui)" }}>
            {t("progress.STATS")}
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        </div>
        <SignalLost onRetry={handleRetry} t={t} />
      </div>
    );
  }

  // -- Loading state --
  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#e5e5e5]" style={{ fontFamily: "var(--font-heading, system-ui)" }}>
            {t("progress.STATS")}
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        </div>
        <SkeletonGrid />
      </div>
    );
  }

  // -- Empty state --
  if (!sessions || sessions.length === 0) {
    return (
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#e5e5e5]" style={{ fontFamily: "var(--font-heading, system-ui)" }}>
            {t("progress.STATS")}
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        </div>
        <EmptyState t={t} />
      </div>
    );
  }

  // ============================================================================
  // Full tactical readout render
  // ============================================================================
  return (
    <div className="space-y-6 py-6">
      {/* ── HERO HEADER ────────────────────────────────────────────── */}
      <div className="border-b border-[#2a2a2a] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-extrabold uppercase tracking-tight text-[#e5e5e5]"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              {t("progress.STATS")}
            </h1>
            <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="stamp" style={{ color: "#71717A", fontSize: 10, letterSpacing: "0.15em" }}>
                {t("progress.LAST_SYNC")}
              </span>
              <LiveClock />
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI ROW ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPIPanel
          label={t("progress.TOTAL_SESSIONS")}
          value={streakData.totalSessions}
          subValue={t("progress.LIFETIME")}
          trend="up"
          panelNum="01"
          accent="orange"
        />
        <KPIPanel
          label={t("progress.CURRENT_STREAK")}
          value={streakData.currentStreak}
          subValue={`${t("progress.BEST")}: ${streakData.longestStreak}D`}
          trend={streakData.currentStreak > 0 ? "up" : "neutral"}
          panelNum="02"
          accent="green"
        />
        <KPIPanel
          label={t("progress.TOTAL_VOLUME")}
          value={Math.round(totalVolume / 1000)}
          subValue={`${Math.round(totalVolume).toLocaleString()} KG`}
          trend="up"
          panelNum="03"
          accent="orange"
        />
        <KPIPanel
          label={t("progress.THIS_MONTH")}
          value={streakData.thisMonthSessions}
          subValue={`${streakData.thisWeekSessions} ${t("progress.THIS_WK")}`}
          trend="up"
          panelNum="04"
          accent="blue"
        />
      </div>

      {/* ── MAIN CHARTS ROW ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Enhanced Volume Chart — spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="border border-card-border bg-card p-3 relative overflow-hidden">
            <BrandNoiseOverlay />
            <div className="relative z-10">
              <PanelHeader 
                label={t("progress.WEEKLY_VOLUME")}
                sub={t("progress.LAST_8_WEEKS")} 
                panelNum="05"
              />
              <EnhancedVolumeChart data={enhancedVolumeData} />
            </div>
          </div>
        </div>

        {/* Progress Trend Chart */}
        <div>
          <div className="border border-card-border bg-card p-3 relative overflow-hidden">
            <BrandNoiseOverlay />
            <div className="relative z-10">
              <PanelHeader 
                label={t("progress.PROGRESS_TREND")}
                sub={t("progress.WEIGHT_VS_REPS")} 
                panelNum="06"
              />
              <ProgressTrendChart data={progressTrendData} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECONDARY CHARTS ROW ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Calendar Heatmap */}
        <div className="border border-card-border bg-card p-3 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <PanelHeader 
              label={t("progress.CONTACT_MATRIX")}
              sub={t("progress.LAST_26_WEEKS")}
              panelNum="07"
            />
            <div className="overflow-x-auto">
              <CalendarHeatmap sessions={heatmapSessions} />
            </div>
          </div>
        </div>

        {/* Reps Distribution */}
        <div className="border border-card-border bg-card p-3 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <PanelHeader 
              label={t("progress.REP_DISTRIBUTION")}
              sub={t("progress.INTENSITY_PROFILE")} 
              panelNum="08"
            />
            <RepsDistributionChart data={repsDistributionData} />
          </div>
        </div>
      </div>

      {/* ── MUSCLE BALANCE + PR WALL ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Muscle Pie Chart */}
        <div className="border border-card-border bg-card p-3 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <PanelHeader 
              label={t("progress.MUSCLE_BALANCE")}
              sub={t("progress.TRAINING_DISTRIBUTION")} 
              panelNum="09"
            />
            {muscleLoading ? (
              <Skeleton className="skeleton-steal h-64 rounded-none" />
            ) : musclePieData.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <span className="stamp" style={{ color: "#525252", letterSpacing: "0.2em" }}>
                  {t("progress.NO_MUSCLE_DATA")}
                </span>
              </div>
            ) : (
              <MusclePieChart data={musclePieData} />
            )}
          </div>
        </div>

        {/* PR Wall */}
        <div className="border border-card-border bg-card p-3 relative overflow-hidden">
          <BrandNoiseOverlay />
          <div className="relative z-10">
            <PanelHeader 
              label={t("progress.PR_WALL")}
              sub={t("progress.PERSONAL_RECORDS")} 
              panelNum="10"
            />
            <PRWall records={personalRecords.slice(0, 6)} />
          </div>
        </div>
      </div>

        {/* ── ACHIEVEMENTS ────────────────────────────────────────────── */}
        <div className="border border-card-border bg-card p-3 relative overflow-hidden">
        <BrandNoiseOverlay />
        <div className="relative z-10">
          <PanelHeader 
            label={t("progress.MERIT_BOARD")}
            sub={t("progress.ACHIEVEMENTS_UNLOCKED")}
            panelNum="11"
          />
          <AchievementsBoard unlocked={achievements} />
        </div>
      </div>

      {/* ── BOTTOM HUD STRIP ────────────────────────────────────────────── */}
      <div className="border-t-2 border-[#e53e00] pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span className="stamp" style={{ color: "#71717A", fontSize: 9, letterSpacing: "0.1em" }}>
              {t("progress.TOTAL_REPS")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: "#e5e5e5",
                lineHeight: 1,
              }}
            >
              <CounterFX value={hudStats.totalReps} />
            </span>
            <span className="stamp" style={{ color: "#e53e00", fontSize: 9 }}>
              {t("progress.REPS_LOGGED")}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-[#2a2a2a] pl-4">
            <span className="stamp" style={{ color: "#71717A", fontSize: 9, letterSpacing: "0.1em" }}>
              {t("progress.AVG_RPE")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: hudStats.avgRpe >= 8 ? "#e53e00" : "#e5e5e5",
                lineHeight: 1,
              }}
            >
              {hudStats.avgRpe > 0 ? hudStats.avgRpe.toFixed(1) : "—"}
            </span>
            <span className="stamp" style={{ color: "#71717A", fontSize: 9 }}>
              {t("progress.INTENSITY_10")}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-[#2a2a2a] pl-4">
            <span className="stamp" style={{ color: "#71717A", fontSize: 9, letterSpacing: "0.1em" }}>
              {t("progress.HEAVIEST_SET")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: "#10b981",
                lineHeight: 1,
              }}
            >
              {hudStats.heaviestWeight > 0 ? hudStats.heaviestWeight : "—"}
            </span>
            <span className="stamp" style={{ color: "#71717A", fontSize: 9 }}>
              {hudStats.heaviestWeight > 0
                ? `KG × ${hudStats.heaviestReps} @ RPE ${hudStats.heaviestRpe}`
                : t("progress.NO_DATA")}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-[#2a2a2a] pl-4">
            <span className="stamp" style={{ color: "#71717A", fontSize: 9, letterSpacing: "0.1em" }}>
              {t("progress.TOTAL_VOLUME")}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: "#e53e00",
                lineHeight: 1,
              }}
            >
              {Math.round(hudStats.totalVolume / 1000)}
            </span>
            <span className="stamp" style={{ color: "#e53e00", fontSize: 9 }}>
              {t("progress.TONNE")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}