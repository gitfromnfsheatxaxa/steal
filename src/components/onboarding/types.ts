import { z } from "zod";

export const onboardingSchema = z.object({
  // Profile
  age: z.number().min(13, "Must be at least 13").max(100),
  height: z.number().min(100, "Enter height in cm").max(250),
  weight: z.number().min(30, "Enter weight in kg").max(300),
  gender: z.enum(["male", "female", "other"]),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),

  // Limitations
  limitations: z.array(
    z.object({
      area: z.string().min(1, "Required"),
      severity: z.enum(["mild", "moderate", "severe"]),
      notes: z.string(),
    }),
  ),
  injuryHistory: z.string(),

  // Goals
  goalType: z.enum([
    "muscle_building",
    "strength",
    "fat_loss",
    "endurance",
    "rehabilitation",
  ]),
  daysPerWeek: z.number().min(2).max(6),
  sessionMinutes: z.number().min(20).max(90),

  // Environment
  environment: z.enum(["gym", "home", "outdoor", "mixed"]),
  equipment: z.array(z.string()).min(1, "Select at least one"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
