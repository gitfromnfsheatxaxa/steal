"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { OnboardingFormData } from "./types";

interface LimitationsStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function LimitationsStep({ form }: LimitationsStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "limitations",
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2
          className="text-2xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          INJURIES &amp; LIMITS
        </h2>
        <p className="font-data text-xs text-muted-foreground">
          Report your damage. We&apos;ll train around it, not through it.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative space-y-3 border border-border bg-card p-4"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Remove injury"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`limitations.${index}.area`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                      Area
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Lower back, Left knee"
                        className="rounded-none border-border bg-input font-data text-sm"
                        {...f}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`limitations.${index}.severity`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                      Severity
                    </FormLabel>
                    <Select onValueChange={f.onChange} value={f.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none border-border bg-input font-data text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none border-border bg-card">
                        <SelectItem value="mild" className="font-data text-sm">Minor</SelectItem>
                        <SelectItem value="moderate" className="font-data text-sm">Moderate</SelectItem>
                        <SelectItem value="severe" className="font-data text-sm">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`limitations.${index}.notes`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                    Notes
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What movement triggers it? Any surgery history?"
                      className="rounded-none border-border bg-input font-data text-sm"
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ area: "", severity: "mild", notes: "" })}
          className="rounded-none border-border font-data text-xs font-bold uppercase tracking-widest hover:border-[#e53e00]/40"
        >
          <Plus className="mr-2 h-4 w-4" />
          ADD INJURY
        </Button>
      </div>

      <FormField
        control={form.control}
        name="injuryHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
              Injury History (optional)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Other notes..."
                rows={3}
                className="rounded-none border-border bg-input font-data text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
