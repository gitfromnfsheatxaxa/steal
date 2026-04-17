"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
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
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
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
            {form.formState.isSubmitting ? "AUTHENTICATING..." : "ENTER"}
          </Button>
        </form>
      </Form>
    </div>
  );
}