"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FITNESS_LEVELS } from "@/lib/constants";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormData } from "./types";

interface ProfileStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function ProfileStep({ form }: ProfileStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2
          className="text-2xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          YOUR STATS
        </h2>
        <p className="font-data text-xs text-muted-foreground">
          Raw numbers only. No fluff.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                Age
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={13}
                  max={100}
                  placeholder="25"
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
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                Gender
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-none border-border bg-input font-data text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-none border-border bg-card">
                  <SelectItem value="male" className="font-data text-sm">Male</SelectItem>
                  <SelectItem value="female" className="font-data text-sm">Female</SelectItem>
                  <SelectItem value="other" className="font-data text-sm">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                Height (cm)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={100}
                  max={250}
                  placeholder="175"
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
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                Weight (kg)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={30}
                  max={300}
                  placeholder="75"
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

      <FormField
        control={form.control}
        name="fitnessLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
              Experience Level
            </FormLabel>
            <p className="font-data text-[10px] text-muted-foreground">
              Be straight with yourself.
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {FITNESS_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => field.onChange(level.value)}
                  className={`border p-4 text-left transition-colors ${
                    field.value === level.value
                      ? "border-[#e53e00] bg-[#e53e00]/10"
                      : "border-border hover:border-[#e53e00]/40"
                  }`}
                >
                  <div className="font-data text-xs font-bold uppercase tracking-widest">
                    {level.label}
                  </div>
                  <div className="mt-1 font-data text-[10px] text-muted-foreground">
                    {level.description}
                  </div>
                </button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
