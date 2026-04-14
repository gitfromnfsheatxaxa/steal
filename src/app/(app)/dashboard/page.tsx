"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useActivePlan } from "@/hooks/usePlans";
import { useProfile } from "@/hooks/useProfile";
import { useStreakData, usePersonalRecords } from "@/hooks/useProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  TrendingUp,
  Calendar,
  ArrowRight,
  Trophy,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: activePlan, isLoading: planLoading } = useActivePlan();
  const streakData = useStreakData();
  const personalRecords = usePersonalRecords();

  const firstName = (user?.name?.split(" ")[0] || "ATHLETE").toUpperCase();

  return (
    <div className="space-y-6 py-4">
      {/* Greeting */}
      <div className="space-y-0.5">
        <h1
          className="text-3xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          READY TO WORK, {firstName}?
        </h1>
        <div className="h-0.5 w-12 bg-[#e53e00]" />
      </div>

      {/* No profile — prompt onboarding */}
      {!profileLoading && !profile && (
        <div className="border border-dashed border-[#e53e00]/40 bg-[#e53e00]/5 p-6">
          <h3
            className="text-lg font-bold uppercase tracking-wide"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            FINISH YOUR PROFILE
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Set your stats so we can build your program.
          </p>
          <Button
            asChild
            className="mt-4 rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
          >
            <Link href="/onboarding">
              SET UP PROFILE
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      )}

      {/* Active Plan Card */}
      {planLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : activePlan ? (
        <Card className="rounded-none border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-base font-bold uppercase tracking-wide"
                style={{ fontFamily: "var(--font-heading, system-ui)" }}
              >
                {activePlan.title}
              </CardTitle>
              <Badge
                variant="outline"
                className="rounded-none border-[#e53e00]/40 font-data text-[10px] uppercase tracking-widest text-[#e53e00]"
              >
                WEEK {activePlan.currentWeek} / {activePlan.durationWeeks}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{activePlan.description}</p>
            <div className="flex gap-2">
              <Button
                asChild
                className="flex-1 rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
              >
                <Link href={`/plans/${activePlan.id}`}>
                  <Dumbbell className="mr-2 h-3 w-3" />
                  START SESSION
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-none border-border font-data text-xs font-bold uppercase tracking-widest hover:border-foreground/40"
              >
                <Link href={`/plans/${activePlan.id}`}>
                  <Calendar className="mr-2 h-3 w-3" />
                  VIEW PROGRAM
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        profile && (
          <div className="border border-dashed border-border p-6">
            <h3
              className="text-lg font-bold uppercase tracking-wide"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              NO ACTIVE PROGRAM
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a program or pick a template. Start today.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                asChild
                className="rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
              >
                <Link href="/programs">
                  <Dumbbell className="mr-2 h-3 w-3" />
                  FIND A PROGRAM
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-border font-data text-xs font-bold uppercase tracking-widest hover:border-foreground/40"
              >
                <Link href="/programs">BROWSE TEMPLATES</Link>
              </Button>
            </div>
          </div>
        )
      )}

      {/* Quick Stats Grid */}
      <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
        <Card className="rounded-none border-0 bg-card">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#e53e00]/10">
              <Dumbbell className="h-5 w-5 text-[#e53e00]" />
            </div>
            <div>
              <div className="font-data text-2xl font-bold tabular-nums">
                {streakData.thisWeekSessions}
              </div>
              <div className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                Sessions This Week
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-0 bg-card">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#e53e00]/10">
              <TrendingUp className="h-5 w-5 text-[#e53e00]" />
            </div>
            <div>
              <div className="font-data text-2xl font-bold tabular-nums">
                {streakData.currentStreak}
              </div>
              <div className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                Day Streak
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-0 bg-card">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#e53e00]/10">
              <Trophy className="h-5 w-5 text-[#e53e00]" />
            </div>
            <div>
              <div className="font-data text-2xl font-bold tabular-nums">
                {personalRecords.length}
              </div>
              <div className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                PRs Set
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
