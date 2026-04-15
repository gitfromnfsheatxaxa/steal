import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-[#050505] px-4 py-12">
      {/* Ambient barbell plate rings — visible through the layout */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-140px] top-[10%] h-[480px] w-[480px] rounded-full opacity-50"
        style={{
          border: "72px solid rgba(139,0,0,0.045)",
          boxShadow:
            "0 0 0 22px rgba(139,0,0,0.025), 0 0 0 44px rgba(139,0,0,0.012)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[6%] left-[-110px] h-[320px] w-[320px] rounded-full opacity-40"
        style={{
          border: "50px solid rgba(139,0,0,0.035)",
          boxShadow: "0 0 0 18px rgba(139,0,0,0.018)",
        }}
      />

      {/* Tactical panel — max-w-md, has-corner notch */}
      <div className="panel has-corner relative w-full max-w-md overflow-hidden">
        {/* Diagonal rust stripe on left edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
          style={{
            background:
              "linear-gradient(180deg, var(--rust) 0%, rgba(185,28,28,0.3) 60%, transparent 100%)",
          }}
        />

        {/* Header block */}
        <div className="border-b border-[#1a1a1a] px-8 pb-6 pt-8">
          <p
            className="stamp mb-2"
            style={{ color: "var(--ink-dim)", letterSpacing: "0.3em" }}
          >
            OPERATOR ACCESS PORTAL
          </p>
          <h1
            className="font-heading text-6xl font-black uppercase leading-none tracking-tight text-[#E5E5E5]"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            STEAL
          </h1>
          <p className="stamp mt-2" style={{ color: "var(--rust)", letterSpacing: "0.25em" }}>
            STEAL FORGES STEEL
          </p>
        </div>

        {/* Page content */}
        <div className="px-8 py-6">{children}</div>

        {/* Footer stamp */}
        <div className="border-t border-[#1a1a1a] px-8 py-3">
          <p className="stamp" style={{ color: "var(--ink-dim)", fontSize: "9px", letterSpacing: "0.22em" }}>
            OPERATOR ACCESS&nbsp;&nbsp;/&nbsp;&nbsp;v1.0&nbsp;&nbsp;/&nbsp;&nbsp;CLEARANCE REQUIRED
          </p>
        </div>
      </div>
    </div>
  );
}
