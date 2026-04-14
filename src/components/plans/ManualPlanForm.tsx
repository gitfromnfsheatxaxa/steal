"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getPocketBase } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DAYS_OF_WEEK, MUSCLE_GROUPS } from "@/lib/constants";
import { Plus, X, ChevronDown, ChevronUp, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Zod schema ──────────────────────────────────────────────────────────────

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name required"),
  sets: z.number().min(1).max(20),
  repsMin: z.number().min(1).max(100),
  repsMax: z.number().min(1).max(100),
  rpeTarget: z.number().min(6).max(10),
  restSeconds: z.number().min(30).max(600),
  notes: z.string().optional(),
});

const daySchema = z.object({
  dayOfWeek: z.number().min(1).max(7),
  label: z.string().min(1, "Day label required"),
  focus: z.array(z.string()).min(1, "Select at least one muscle group"),
  exercises: z.array(exerciseSchema).min(1, "Add at least one exercise"),
});

const manualPlanSchema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  goalType: z.enum(["muscle_building", "strength", "fat_loss", "endurance", "rehabilitation"]),
  environment: z.enum(["gym", "home", "outdoor", "mixed"]),
  durationWeeks: z.number().min(1).max(52),
  days: z.array(daySchema).min(1, "Add at least one training day"),
});

type ManualPlanValues = z.infer<typeof manualPlanSchema>;
type DayValues = z.infer<typeof daySchema>;
type ExerciseValues = z.infer<typeof exerciseSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<ManualPlanValues["goalType"], string> = {
  muscle_building: "Muscle Building",
  strength: "Strength",
  fat_loss: "Fat Loss",
  endurance: "Endurance",
  rehabilitation: "Rehabilitation",
};

const ENV_LABELS: Record<ManualPlanValues["environment"], string> = {
  gym: "Gym",
  home: "Home",
  outdoor: "Outdoor",
  mixed: "Mixed",
};

const REST_PRESETS = [
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
  { label: "2m", value: 120 },
  { label: "3m", value: 180 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExerciseRow({
  index,
  dayIndex,
  form,
  onRemove,
}: {
  index: number;
  dayIndex: number;
  form: ReturnType<typeof useForm<ManualPlanValues>>;
  onRemove: () => void;
}) {
  const base = `days.${dayIndex}.exercises.${index}` as const;

  return (
    <div className="space-y-3 border border-border bg-[#0d0d0d] p-3">
      <div className="flex items-center justify-between">
        <span className="font-data text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          EXERCISE {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Remove exercise"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Name */}
      <FormField
        control={form.control}
        name={`${base}.name`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="e.g. Barbell Back Squat"
                className="rounded-none border-border bg-input font-data text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sets / Reps / RPE */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FormField
          control={form.control}
          name={`${base}.sets`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                Sets
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  className="rounded-none border-border bg-input font-data text-sm"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${base}.repsMin`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                Reps Min
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  className="rounded-none border-border bg-input font-data text-sm"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${base}.repsMax`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                Reps Max
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  className="rounded-none border-border bg-input font-data text-sm"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${base}.rpeTarget`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                RPE
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={6}
                  max={10}
                  step={0.5}
                  className="rounded-none border-border bg-input font-data text-sm"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Rest */}
      <FormField
        control={form.control}
        name={`${base}.restSeconds`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
              Rest — {field.value}s
            </FormLabel>
            <div className="flex items-center gap-2">
              {REST_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => field.onChange(p.value)}
                  className={cn(
                    "border px-2 py-1 font-data text-[10px] uppercase tracking-widest transition-colors",
                    field.value === p.value
                      ? "border-[#e53e00] bg-[#e53e00]/10 text-[#e53e00]"
                      : "border-border text-muted-foreground hover:border-[#e53e00]/40",
                  )}
                >
                  {p.label}
                </button>
              ))}
              <Slider
                min={30}
                max={600}
                step={15}
                value={[field.value]}
                onValueChange={([v]) => field.onChange(v)}
                className="flex-1"
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes */}
      <FormField
        control={form.control}
        name={`${base}.notes`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Coaching note (optional)"
                className="rounded-none border-border bg-input font-data text-xs text-muted-foreground"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

function DayEditor({
  dayIndex,
  form,
  onRemove,
}: {
  dayIndex: number;
  form: ReturnType<typeof useForm<ManualPlanValues>>;
  onRemove: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { fields: exFields, append: appendEx, remove: removeEx } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.exercises`,
  });

  const dayLabel = form.watch(`days.${dayIndex}.label`) || `Day ${dayIndex + 1}`;

  const defaultExercise: ExerciseValues = {
    name: "",
    sets: 3,
    repsMin: 8,
    repsMax: 12,
    rpeTarget: 8,
    restSeconds: 90,
    notes: "",
  };

  return (
    <div className="border border-border bg-card">
      {/* Day header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className="font-bold uppercase tracking-wide"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            {dayLabel}
          </span>
          <span className="font-data text-[10px] text-muted-foreground">
            {exFields.length} exercises
          </span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-1 text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Remove day"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-4 p-4">
          {/* Day of week + Label */}
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={`days.${dayIndex}.dayOfWeek`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                    Day of Week
                  </FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-none border-border bg-input font-data text-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-border bg-card">
                      {DAYS_OF_WEEK.map((d, i) => (
                        <SelectItem
                          key={i + 1}
                          value={String(i + 1)}
                          className="font-data text-sm uppercase tracking-wide"
                        >
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`days.${dayIndex}.label`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                    Session Label
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Push Day, Upper Body"
                      className="rounded-none border-border bg-input font-data text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Muscle focus */}
          <FormField
            control={form.control}
            name={`days.${dayIndex}.focus`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  Muscle Focus
                </FormLabel>
                <div className="flex flex-wrap gap-1.5">
                  {MUSCLE_GROUPS.map((mg) => {
                    const selected = (field.value as string[]).includes(mg.value);
                    return (
                      <button
                        key={mg.value}
                        type="button"
                        onClick={() => {
                          const curr = field.value as string[];
                          field.onChange(
                            selected
                              ? curr.filter((v) => v !== mg.value)
                              : [...curr, mg.value],
                          );
                        }}
                        className={cn(
                          "border px-2 py-1 font-data text-[10px] uppercase tracking-widest transition-colors",
                          selected
                            ? "border-[#e53e00] bg-[#e53e00]/10 text-[#e53e00]"
                            : "border-border text-muted-foreground hover:border-[#e53e00]/40",
                        )}
                      >
                        {mg.label}
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exercises */}
          <div className="space-y-2">
            <p className="label-section">Exercises</p>
            {exFields.map((f, ei) => (
              <ExerciseRow
                key={f.id}
                index={ei}
                dayIndex={dayIndex}
                form={form}
                onRemove={() => removeEx(ei)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendEx(defaultExercise)}
              className="rounded-none border-border font-data text-xs font-bold uppercase tracking-widest hover:border-[#e53e00]/40"
            >
              <Plus className="mr-1.5 h-3 w-3" />
              ADD EXERCISE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function ManualPlanForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const defaultDay: DayValues = {
    dayOfWeek: 1,
    label: "",
    focus: [],
    exercises: [
      { name: "", sets: 3, repsMin: 8, repsMax: 12, rpeTarget: 8, restSeconds: 90, notes: "" },
    ],
  };

  const form = useForm<ManualPlanValues>({
    resolver: zodResolver(manualPlanSchema),
    defaultValues: {
      title: "",
      description: "",
      goalType: "muscle_building",
      environment: "gym",
      durationWeeks: 4,
      days: [defaultDay],
    },
  });

  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({
    control: form.control,
    name: "days",
  });

  async function onSubmit(values: ManualPlanValues) {
    setSaving(true);
    try {
      const pb = getPocketBase();
      const userId = pb.authStore.record?.id;
      if (!userId) throw new Error("Not authenticated");

      // Create the plan
      const savedPlan = await pb.collection("workout_plans").create({
        user: userId,
        title: values.title,
        description: values.description ?? "",
        source: "custom",
        goalType: values.goalType,
        environment: values.environment,
        durationWeeks: values.durationWeeks,
        currentWeek: 1,
        status: "active",
      });

      // Repeat days across all weeks
      for (let week = 1; week <= values.durationWeeks; week++) {
        for (const day of values.days) {
          const savedDay = await pb.collection("plan_days").create({
            plan: savedPlan.id,
            week,
            dayOfWeek: day.dayOfWeek,
            label: day.label,
            focus: day.focus,
            warmup: null,
            cooldown: null,
          });

          for (let i = 0; i < day.exercises.length; i++) {
            const ex = day.exercises[i];
            await pb.collection("plan_exercises").create({
              planDay: savedDay.id,
              exercise: "",
              name: ex.name ?? "",
              order: i + 1,
              sets: ex.sets,
              repsMin: ex.repsMin,
              repsMax: ex.repsMax,
              rpeTarget: ex.rpeTarget,
              restSeconds: ex.restSeconds,
              notes: ex.notes ?? "",
              substitutions: [],
            });
          }
        }
      }

      toast.success("Program built. Get to work.");
      router.push(`/plans/${savedPlan.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Plan metadata ── */}
        <div className="border border-border bg-card p-4 space-y-4">
          <p className="label-section">Program Details</p>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  Program Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 4-Day Upper/Lower Split"
                    className="rounded-none border-border bg-input font-data text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  Description (optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's the focus of this program?"
                    rows={2}
                    className="rounded-none border-border bg-input font-data text-sm"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="goalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                    Goal
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-border bg-input font-data text-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-border bg-card">
                      {(Object.keys(GOAL_LABELS) as ManualPlanValues["goalType"][]).map((k) => (
                        <SelectItem key={k} value={k} className="font-data text-sm">
                          {GOAL_LABELS[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                    Environment
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-none border-border bg-input font-data text-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-border bg-card">
                      {(Object.keys(ENV_LABELS) as ManualPlanValues["environment"][]).map((k) => (
                        <SelectItem key={k} value={k} className="font-data text-sm">
                          {ENV_LABELS[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="durationWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  Duration — {field.value} weeks
                </FormLabel>
                <Slider
                  min={1}
                  max={52}
                  step={1}
                  value={[field.value]}
                  onValueChange={([v]) => field.onChange(v)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Training days ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="label-section">Training Days</p>
            <span className="font-data text-[10px] text-muted-foreground">
              Repeated across all {form.watch("durationWeeks")} weeks
            </span>
          </div>

          {dayFields.map((f, di) => (
            <DayEditor
              key={f.id}
              dayIndex={di}
              form={form}
              onRemove={() => removeDay(di)}
            />
          ))}

          {form.formState.errors.days?.root && (
            <p className="font-data text-xs text-destructive">
              {form.formState.errors.days.root.message}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => appendDay({ ...defaultDay, dayOfWeek: Math.min(dayFields.length + 1, 7) })}
            className="w-full rounded-none border-dashed border-border font-data text-xs font-bold uppercase tracking-widest hover:border-[#e53e00]/40"
          >
            <Plus className="mr-2 h-4 w-4" />
            ADD TRAINING DAY
          </Button>
        </div>

        {/* ── Submit ── */}
        <Button
          type="submit"
          disabled={saving}
          className="w-full rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              SAVING...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              SAVE PROGRAM
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
