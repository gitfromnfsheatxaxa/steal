"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WorkoutPlan } from "@/types/plan";
import { formatRelativeDate } from "@/lib/utils";
import { Calendar, Target } from "lucide-react";

interface PlanCardProps {
  plan: WorkoutPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const statusColors: Record<string, string> = {
    active: "bg-success/10 text-success",
    completed: "bg-muted text-muted-foreground",
    paused: "bg-warning/10 text-warning",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <Link href={`/plans/${plan.id}`}>
      <Card className="transition-colors hover:border-foreground/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">
              {plan.title}
            </CardTitle>
            <Badge className={statusColors[plan.status]} variant="secondary">
              {plan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Week {plan.currentWeek}/{plan.durationWeeks}
            </span>
            {plan.goalType && (
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {plan.goalType.replace(/_/g, " ")}
              </span>
            )}
            <span>{formatRelativeDate(plan.created)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
