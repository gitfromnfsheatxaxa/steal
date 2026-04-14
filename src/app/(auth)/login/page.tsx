import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 space-y-1">
        <h1
          className="text-4xl font-extrabold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-heading, system-ui)" }}
        >
          BACK IN THE RACK
        </h1>
        <p className="font-data text-xs text-muted-foreground">Get back to work.</p>
      </div>
      <LoginForm />
      <p className="mt-4 text-center font-data text-xs text-muted-foreground">
        No account?{" "}
        <Link
          href="/register"
          className="font-semibold uppercase tracking-widest text-[#e53e00] underline-offset-4 hover:underline"
        >
          Register
        </Link>
      </p>
    </>
  );
}
