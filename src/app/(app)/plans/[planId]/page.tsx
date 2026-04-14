"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPocketBase } from "@/lib/pocketbase";
import { usePlanDays } from "@/hooks/usePlans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Dumbbell } from "lucide-react";
import type { WorkoutPlan } from "@/types/plan";
import { DAYS_OF_WEEK } from "@/lib/constants";
import Link from "next/link";

export default function PlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const pb = getPocketBase();

  const { data: plan, isLoading: planLoading } = useQuery<WorkoutPlan>({
    queryKey: ["plan", planId],
    queryFn: () => pb.collection("workout_plans").getOne<WorkoutPlan>(planId),
  });

  const { data: days, isLoading: daysLoading } = usePlanDays(planId);

  if (planLoading) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-12 text-center">
        <p className="font-data text-sm text-muted-foreground">Program not found.</p>
      </div>
    );
  }

  // Group days by week
  const weeks = new Map<number, typeof days>();
  days?.forEach((day) => {
    const weekDays = weeks.get(day.week) ?? [];
    weekDays.push(day);
    weeks.set(day.week, weekDays);
  });

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            {plan.title}
          </h1>
          <Badge
            variant="outline"
            className="rounded-none border-[#e53e00]/40 font-data text-[10px] uppercase tracking-widest text-[#e53e00]"
          >
            {plan.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-data text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            WEEK {plan.currentWeek} / {plan.durationWeeks}
          </span>
          {plan.goalType && (
            <span className="font-data text-xs uppercase tracking-widest text-muted-foreground">
              {plan.goalType.replace(/_/g, " ")}
            </span>
          )}
          {plan.environment && (
            <span className="font-data text-xs uppercase tracking-widest text-muted-foreground">
              {plan.environment}
            </span>
          )}
        </div>
      </div>

      {/* Weekly breakdown */}
      {daysLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Accordion type="single" collapsible defaultValue={`week-${plan.currentWeek}`}>
          {Array.from(weeks.entries()).map(([weekNum, weekDays]) => (
            <AccordionItem key={weekNum} value={`week-${weekNum}`} className="border-border">
              <AccordionTrigger className="font-data text-xs uppercase tracking-widest hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-bold">WEEK {weekNum}</span>
                  <span className="text-muted-foreground">
                    {weekDays?.length} TRAINING DAYS
                  </span>
                  {weekNum === plan.currentWeek && (
                    <Badge
                      variant="outline"
                      className="rounded-none border-[#e53e00]/40 font-data text-[10px] uppercase tracking-widest text-[#e53e00]"
                    >
                      CURRENT
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {weekDays
                  ?.sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((day) => (
                    <Card key={day.id} className="rounded-none border-border bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <span
                            className="text-sm font-bold uppercase tracking-wide"
                            style={{ fontFamily: "var(--font-heading, system-ui)" }}
                          >
                            {DAYS_OF_WEEK[day.dayOfWeek - 1]} — {day.label}
                          </span>
                          {Array.isArray(day.focus) && day.focus.length > 0 && (
                            <div className="flex gap-1">
                              {day.focus.map((muscle) => (
                                <Badge
                                  key={muscle}
                                  variant="outline"
                                  className="rounded-none border-border font-data text-[10px] uppercase tracking-widest"
                                >
                                  {muscle}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          className="rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
                          size="sm"
                        >
                          <Link href={`/workout/${day.id}`}>
                            <Dumbbell className="mr-2 h-3 w-3" />
                            START WORKOUT
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
