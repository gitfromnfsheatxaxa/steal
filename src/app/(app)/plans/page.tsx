"use client";

import Link from "next/link";
import { usePlans } from "@/hooks/usePlans";
import { PlanCard } from "@/components/plans/PlanCard";
import { TemplateGrid } from "@/components/plans/TemplateGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil } from "lucide-react";

export default function PlansPage() {
  const { data: plans, isLoading } = usePlans();

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-extrabold uppercase tracking-tight"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            PROGRAMS
          </h1>
          <div className="mt-1 h-0.5 w-12 bg-[#e53e00]" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
          >
            <Link href="/plans/create">
              <Pencil className="mr-2 h-3 w-3" />
              BUILD
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-plans">
        <TabsList className="rounded-none border border-border bg-card">
          <TabsTrigger
            value="my-plans"
            className="rounded-none font-data text-xs uppercase tracking-widest data-[state=active]:bg-[#e53e00] data-[state=active]:text-white"
          >
            MY PROGRAMS
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="rounded-none font-data text-xs uppercase tracking-widest data-[state=active]:bg-[#e53e00] data-[state=active]:text-white"
          >
            TEMPLATES
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-plans" className="mt-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          ) : plans && plans.length > 0 ? (
            plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
          ) : (
            <div className="border border-dashed border-border p-8 text-center">
              <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No programs yet. Build your own or pick a template.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  asChild
                  className="rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
                >
                  <Link href="/plans/create">
                    <Pencil className="mr-2 h-3 w-3" />
                    BUILD MANUALLY
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <TemplateGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
}
