"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { GOAL_OPTIONS } from "@/lib/constants";
import { Target, Flame, Zap, Heart, Activity } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "./types";

const goalIcons = {
  muscle_building: Zap,
  strength: Activity,
  fat_loss: Flame,
  endurance: Heart,
  rehabilitation: Target,
} as const;

interface GoalsStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function GoalsStep({ form }: GoalsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2
          className="text-2xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          YOUR MISSION
        </h2>
        <p className="font-data text-xs text-muted-foreground">
          Pick your target. Everything else follows.
        </p>
      </div>

      <FormField
        control={form.control}
        name="goalType"
        render={({ field }) => (
          <FormItem>
            <div className="grid gap-2 sm:grid-cols-2">
              {GOAL_OPTIONS.map((goal) => {
                const Icon = goalIcons[goal.value];
                const active = field.value === goal.value;
                return (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => field.onChange(goal.value)}
                    className={`flex items-start gap-3 border p-4 text-left transition-colors ${
                      active
                        ? "border-[#e53e00] bg-[#e53e00]/10"
                        : "border-border hover:border-[#e53e00]/40"
                    }`}
                  >
                    <Icon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-[#e53e00]" : "text-muted-foreground"}`}
                    />
                    <div>
                      <div className="font-data text-xs font-bold uppercase tracking-widest">
                        {goal.label}
                      </div>
                      <div className="mt-0.5 font-data text-[10px] text-muted-foreground">
                        {goal.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="daysPerWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                Days/Week:{" "}
                <span className="font-bold text-foreground">{field.value}</span>
              </FormLabel>
              <Slider
                min={2}
                max={6}
                step={1}
                value={[field.value]}
                onValueChange={([v]) => field.onChange(v)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sessionMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                Session Length:{" "}
                <span className="font-bold text-foreground">{field.value} min</span>
              </FormLabel>
              <Slider
                min={20}
                max={90}
                step={5}
                value={[field.value]}
                onValueChange={([v]) => field.onChange(v)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
