"use client";

import Link from "next/link";
import { Zap, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="container-app space-y-16 py-16">
        {/* Hero */}
        <div className="space-y-6 text-center">
          <div className="inline-block border border-[#e53e00]/40 bg-[#e53e00]/10 px-3 py-1">
            <span className="font-data text-xs font-semibold uppercase tracking-[0.2em] text-[#e53e00]">
              {t("landing.TAGLINE")}
            </span>
          </div>
          <h1
            className="font-heading text-6xl font-extrabold uppercase tracking-tight text-foreground sm:text-8xl"
            style={{ fontFamily: "var(--font-heading, system-ui)", lineHeight: 0.9 }}
          >
            STEAL
            <br />
            <span className="text-[#e53e00]">FORGES</span>
            <br />
            STEEL
          </h1>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            {t("landing.HERO_DESC")}
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          <div className="space-y-3 bg-background p-6">
            <TrendingUp className="h-5 w-5 text-[#e53e00]" />
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              {t("landing.FEATURE_1_TITLE")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("landing.FEATURE_1_DESC")}
            </p>
          </div>
          <div className="space-y-3 bg-background p-6">
            <Zap className="h-5 w-5 text-[#e53e00]" />
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              {t("landing.FEATURE_2_TITLE")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("landing.FEATURE_2_DESC")}
            </p>
          </div>
          <div className="space-y-3 bg-background p-6">
            <BarChart3 className="h-5 w-5 text-[#e53e00]" />
            <h3
              className="text-sm font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-heading, system-ui)" }}
            >
              {t("landing.FEATURE_3_TITLE")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("landing.FEATURE_3_DESC")}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/programs"
            className="inline-flex h-12 items-center gap-2 bg-[#e53e00] px-8 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#ff4500]"
          >
            {t("landing.START_TRAINING")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 border border-border px-8 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {t("landing.SIGN_IN")}
          </Link>
        </div>

        {/* Footer line */}
        <p className="text-center font-data text-xs text-muted-foreground/40 uppercase tracking-widest">
          {t("landing.FOOTER")}
        </p>
      </div>
    </div>
  );
}
