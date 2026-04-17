"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/components/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type RegisterValues = { name: string; email: string; password: string; confirmPassword: string };

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  const registerSchema = z
    .object({
      name: z.string().min(2, t("register.NAME_MIN")),
      email: z.string().email(t("register.EMAIL_INVALID")),
      password: z.string().min(8, t("register.PASSWORD_MIN")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("register.PASSWORDS_MISMATCH"),
      path: ["confirmPassword"],
    });

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setError(null);
    try {
      await register(values.email, values.password, values.name);
      router.push("/onboarding");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? String(err);
      setError(msg);
    }
  }

  return (
    <div className="border border-border bg-card p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                  {t("register.NAME")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("register.NAME_PLACEHOLDER")}
                    autoComplete="name"
                    className="border-border bg-input font-data text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                  {t("register.EMAIL")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("register.EMAIL_PLACEHOLDER")}
                    autoComplete="email"
                    className="border-border bg-input font-data text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                  {t("register.PASSWORD")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("register.PASSWORD_PLACEHOLDER")}
                    autoComplete="new-password"
                    className="border-border bg-input font-data text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-xs uppercase tracking-widest text-muted-foreground">
                  {t("register.CONFIRM_PASSWORD")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("register.CONFIRM_PLACEHOLDER")}
                    autoComplete="new-password"
                    className="border-border bg-input font-data text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-none bg-[#e53e00] font-data text-xs font-bold uppercase tracking-widest text-white hover:bg-[#ff4500]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t("register.SUBMITTING") : t("register.SUBMIT")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
