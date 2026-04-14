"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { getPocketBase } from "@/lib/pocketbase";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LogOut, Moon, Sun, UserCog } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2),
  weight: z.number().min(30).max(300),
  height: z.number().min(100).max(250),
});
type ProfileValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { theme, toggleTheme } = useTheme();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", weight: 75, height: 175 },
  });

  useEffect(() => {
    if (profile) {
      form.setValue("weight", profile.weight);
      form.setValue("height", profile.height);
    }
    if (user?.name) form.setValue("name", user.name as string);
  }, [profile, user, form]);

  async function onSave(values: ProfileValues) {
    try {
      const pb = getPocketBase();
      if (user?.id) {
        await pb.collection("users").update(user.id, { name: values.name });
      }
      if (profile?.id) {
        await pb.collection("profiles").update(profile.id, {
          weight: values.weight,
          height: values.height,
        });
      }
      toast.success("Saved.");
    } catch {
      toast.error("Failed to save.");
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-4">
      <div>
        <h1
          className="text-3xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          GEAR
        </h1>
        <p className="font-data mt-1 text-xs text-muted-foreground">{user?.email}</p>
      </div>

      {/* Profile */}
      <Card className="rounded-none border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-[#e53e00]" />
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              PROFILE
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-none border-border bg-input font-data text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
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
                            step={0.1}
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
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                          Height (cm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
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
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
                >
                  {form.formState.isSubmitting ? "SAVING..." : "SAVE"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="rounded-none border-border bg-card">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <p className="font-data text-xs font-semibold uppercase tracking-widest">
                Dark Mode
              </p>
              <p className="font-data text-[10px] text-muted-foreground">
                {theme === "dark" ? "Active" : "Off"}
              </p>
            </div>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
        </CardContent>
      </Card>

      <Separator className="bg-border" />

      <Button
        variant="outline"
        className="w-full rounded-none border-destructive/40 font-data text-xs font-bold uppercase tracking-widest text-destructive hover:border-destructive hover:bg-destructive/5 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        SIGN OUT
      </Button>
    </div>
  );
}
