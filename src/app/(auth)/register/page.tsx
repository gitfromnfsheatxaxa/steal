import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6 space-y-1">
        <h1
          className="text-4xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          JOIN THE IRON
        </h1>
        <p className="font-data text-xs text-muted-foreground">
          Build your profile. Start your first program.
        </p>
      </div>
      <RegisterForm />
      <p className="mt-4 text-center font-data text-xs text-muted-foreground">
        Already in?{" "}
        <Link
          href="/login"
          className="font-semibold uppercase tracking-widest text-[#e53e00] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
