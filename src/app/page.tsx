"use client";

import Link from "next/link";
import { Zap, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/I18nProvider";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="container-app space-y-14 py-16">
        {/* Hero */}
        <div className="space-y-6 text-center fade-up">
          <div
            className="inline-block px-3 py-1"
            style={{
              border: "1px solid rgba(194,65,12,0.4)",
              background: "rgba(194,65,12,0.08)",
            }}
          >
            <span className="font-data text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
              {t("landing.TAGLINE")}
            </span>
          </div>
          <h1
            className="font-heading font-black uppercase leading-none tracking-tight text-[#f0f0f0]"
            style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)" }}
          >
            STEAL
            <br />
            <span style={{ color: "#C2410C", textShadow: "0 0 40px rgba(194,65,12,0.4)" }}>
              FORGES
            </span>
            <br />
            STEEL
          </h1>
          <p className="mx-auto max-w-md font-data text-[11px] uppercase tracking-widest text-[#444]">
            {t("landing.HERO_DESC")}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-3 sm:grid-cols-3 fade-up fade-up-1">
          {[
            { icon: TrendingUp, titleKey: "landing.FEATURE_1_TITLE", descKey: "landing.FEATURE_1_DESC" },
            { icon: Zap, titleKey: "landing.FEATURE_2_TITLE", descKey: "landing.FEATURE_2_DESC" },
            { icon: BarChart3, titleKey: "landing.FEATURE_3_TITLE", descKey: "landing.FEATURE_3_DESC" },
          ].map(({ icon: Icon, titleKey, descKey }, i) => (
            <div key={i} className="glass glass-hover p-6 space-y-3">
              <Icon className="h-5 w-5 text-[#C2410C]" />
              <h3 className="font-heading text-[13px] font-bold uppercase tracking-widest text-[#f0f0f0]">
                {t(titleKey)}
              </h3>
              <p className="font-data text-[10px] text-[#444] leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center fade-up fade-up-2">
          <Link href="/programs" className="btn-forge h-12 px-8 text-[12px] flex items-center gap-2">
            {t("landing.START_TRAINING")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="btn-ghost h-12 px-8 text-[11px] flex items-center gap-2">
            {t("landing.SIGN_IN")}
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center font-data text-[9px] text-[#222] uppercase tracking-widest fade-up fade-up-3">
          {t("landing.FOOTER")}
        </p>
      </div>
    </div>
  );
}
