"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplates } from "@/hooks/usePlans";
import { Clock, Dumbbell } from "lucide-react";

export function TemplateGrid() {
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          No templates available yet. Generate a custom plan instead.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{template.title}</CardTitle>
              <Badge variant="outline">{template.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {template.durationWeeks} weeks
                </span>
                <span>{template.goalType.replace("_", " ")}</span>
                <span>{template.environment}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Use This Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
