"use client";

import { useEffect, useState } from "react";
import { getPocketBase } from "@/lib/pocketbase";

interface DebugResult {
  envUrl: string;
  healthOk: boolean;
  healthError: string | null;
  authTestOk: boolean;
  authTestError: string | null;
}

export function ConnectionDebug() {
  const [result, setResult] = useState<DebugResult | null>(null);

  useEffect(() => {
    async function runChecks() {
      const envUrl = process.env.NEXT_PUBLIC_API_URL ?? "(not set)";
      let healthOk = false;
      let healthError: string | null = null;
      let authTestOk = false;
      let authTestError: string | null = null;

      // 1. Health check via proxy (same-origin /pb path)
      try {
        const res = await fetch(`/pb/api/health`);
        const data = await res.json();
        healthOk = data.code === 200;
        if (!healthOk) healthError = JSON.stringify(data);
      } catch (e: unknown) {
        healthError = (e as Error).message ?? String(e);
      }

      // 2. PocketBase SDK auth test (should fail with 400, NOT network error)
      try {
        const pb = getPocketBase();
        await pb.collection("users").authWithPassword("__debug_test__@test.com", "debugtest123");
        // If this succeeds somehow, that's fine too
        authTestOk = true;
      } catch (e: unknown) {
        const err = e as { status?: number; message?: string; originalError?: { message?: string } };
        if (err.status === 400) {
          // 400 = server responded, auth just failed. Connection works!
          authTestOk = true;
          authTestError = "Auth rejected (expected) — connection OK";
        } else {
          authTestError = `status=${err.status ?? "?"}, msg=${err.originalError?.message ?? err.message ?? String(e)}`;
        }
      }

      setResult({ envUrl, healthOk, healthError, authTestOk, authTestError });
    }
    runChecks();
  }, []);

  if (!result) return <div className="font-data text-[10px] text-[#71717A] p-2">Running connection checks...</div>;

  return (
    <div className="mt-4 border border-[#2a2a2a] bg-[#0a0a0a] p-3 font-data text-[10px]">
      <p className="mb-1 font-bold uppercase tracking-widest text-[#71717A]">Connection Debug</p>
      <p className="text-[#71717A]">API URL: <span className="text-[#E5E5E5]">{result.envUrl}</span></p>
      <p className="text-[#71717A]">
        Health: <span className={result.healthOk ? "text-green-500" : "text-red-500"}>
          {result.healthOk ? "OK" : `FAIL — ${result.healthError}`}
        </span>
      </p>
      <p className="text-[#71717A]">
        SDK Auth: <span className={result.authTestOk ? "text-green-500" : "text-red-500"}>
          {result.authTestOk ? "OK" : "FAIL"} — {result.authTestError}
        </span>
      </p>
    </div>
  );
}
