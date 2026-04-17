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

type LoginValues = { email: string; password: string };

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  const loginSchema = z.object({
    email: z.string().email(t("login.EMAIL_INVALID")),
    password: z.string().min(8, t("login.PASSWORD_MIN")),
  });

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      await login(values.email, values.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? String(err);
      setError(msg);
    }
  }

  return (
    <div className="border-l-4 border-[#8B0000] bg-[#0a0a0a] p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                  {t("login.EMAIL")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("login.EMAIL_PLACEHOLDER")}
                    autoComplete="email"
                    className="h-11 rounded-none border-[#2a2a2a] bg-[#050505] font-data text-sm text-[#E5E5E5] placeholder:text-[#71717A]/50 focus:border-[#8B0000] focus:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-data text-[10px] text-[#8B0000]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-data text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                  {t("login.PASSWORD")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("login.PASSWORD_PLACEHOLDER")}
                    autoComplete="current-password"
                    className="h-11 rounded-none border-[#2a2a2a] bg-[#050505] font-data text-sm text-[#E5E5E5] placeholder:text-[#71717A]/50 focus:border-[#8B0000] focus:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-data text-[10px] text-[#8B0000]" />
              </FormItem>
            )}
          />

          {error && (
            <div className="border-l-2 border-[#8B0000] bg-[#8B0000]/5 p-3">
              <p className="font-data text-xs text-[#8B0000]" role="alert">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="h-11 w-full rounded-none bg-[#8B0000] font-data text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#9F1239] active:scale-[0.98]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t("login.SUBMITTING") : t("login.SUBMIT")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
