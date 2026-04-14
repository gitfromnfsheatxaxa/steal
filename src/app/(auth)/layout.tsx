export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-0">
        <div className="mb-8 border-b border-border pb-6">
          <span
            className="text-2xl font-extrabold uppercase tracking-[0.2em] text-[#e53e00]"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            STEAL
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
