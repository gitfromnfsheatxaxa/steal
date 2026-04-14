"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProfileStep } from "@/components/onboarding/ProfileStep";
import { LimitationsStep } from "@/components/onboarding/LimitationsStep";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import { EnvironmentStep } from "@/components/onboarding/EnvironmentStep";
import {
  onboardingSchema,
  type OnboardingFormData,
} from "@/components/onboarding/types";
import { getPocketBase } from "@/lib/pocketbase";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = [
  { label: "STATS", component: ProfileStep },
  { label: "INJURIES", component: LimitationsStep },
  { label: "MISSION", component: GoalsStep },
  { label: "ARENA", component: EnvironmentStep },
] as const;

const STEP_FIELDS: (keyof OnboardingFormData)[][] = [
  ["age", "height", "weight", "gender", "fitnessLevel"],
  ["limitations", "injuryHistory"],
  ["goalType", "daysPerWeek", "sessionMinutes"],
  ["environment", "equipment"],
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      age: 25,
      height: 175,
      weight: 75,
      gender: "male",
      fitnessLevel: "beginner",
      limitations: [],
      injuryHistory: "",
      goalType: "muscle_building",
      daysPerWeek: 4,
      sessionMinutes: 45,
      environment: "gym",
      equipment: ["bodyweight"],
    },
    mode: "onTouched",
  });

  const StepComponent = STEPS[step].component;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  async function handleNext() {
    const fields = STEP_FIELDS[step];
    const valid = await form.trigger(fields);
    if (!valid) return;

    if (isLast) {
      await handleSubmit(form.getValues());
    } else {
      setStep((s) => s + 1);
    }
  }

  async function handleSubmit(data: OnboardingFormData) {
    setSubmitting(true);
    try {
      const pb = getPocketBase();
      const userId = pb.authStore.record?.id;
      if (!userId) throw new Error("Not authenticated");

      // Upsert profile
      try {
        const existing = await pb
          .collection("profiles")
          .getList(1, 1, { filter: `user="${userId}"` });
        const profileData = {
          user: userId,
          age: data.age,
          height: data.height,
          weight: data.weight,
          gender: data.gender,
          fitnessLevel: data.fitnessLevel,
          limitations: data.limitations,
          injuryHistory: data.injuryHistory,
        };
        if (existing.items.length > 0) {
          await pb.collection("profiles").update(existing.items[0].id, profileData);
        } else {
          await pb.collection("profiles").create(profileData);
        }
      } catch (profileErr: unknown) {
        const status = (profileErr as { status?: number })?.status;
        if (status === 404) {
          toast.error(
            "Collections not found. Import pocketbase/pb_schema.json via the PocketBase Admin UI at 127.0.0.1:8090/_/"
          );
          return;
        }
        throw profileErr;
      }

      // Upsert goal (non-fatal)
      try {
        const existingGoals = await pb
          .collection("goals")
          .getList(1, 1, { filter: `user="${userId}"` });
        const goalData = {
          user: userId,
          type: data.goalType,
          environment: data.environment,
          equipment: data.equipment,
          daysPerWeek: data.daysPerWeek,
          sessionMinutes: data.sessionMinutes,
          priority: "primary",
        };
        if (existingGoals.items.length > 0) {
          await pb.collection("goals").update(existingGoals.items[0].id, goalData);
        } else {
          await pb.collection("goals").create(goalData);
        }
      } catch {
        // Goals are non-fatal — profile saved successfully
        toast.warning("Profile saved, but we couldn't save your goals. You can set them later.");
      }

      toast.success("Profile set. Time to build.");
      router.push("/dashboard");
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 401 || status === 403) {
        toast.error("Session expired. Log in again.");
        router.push("/login");
      } else {
        toast.error("Something went wrong. Make sure PocketBase is running.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 py-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-data text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            STEP {step + 1} / {STEPS.length}
          </span>
          <span className="font-data text-xs font-semibold uppercase tracking-widest text-[#e53e00]">
            {STEPS[step].label}
          </span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Step Content */}
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <StepComponent form={form} />

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="rounded-none border-border font-data text-xs font-bold uppercase tracking-widest hover:border-foreground/40"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
            >
              {isLast ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {submitting ? "SAVING..." : "FINISH SETUP"}
                </>
              ) : (
                <>
                  NEXT
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
