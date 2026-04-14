import type { Metadata } from "next";
import { ManualPlanForm } from "@/components/plans/ManualPlanForm";

export const metadata: Metadata = { title: "Build Program" };

export default function CreatePlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <div>
        <h1
          className="text-3xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          BUILD YOUR PROGRAM
        </h1>
        <div className="mt-1 h-0.5 w-12 bg-[#e53e00]" />
        <p className="mt-3 text-sm text-muted-foreground">
          Manual build. Your rules. Your exercises.
        </p>
      </div>
      <ManualPlanForm />
    </div>
  );
}
