"use client";

import { BrandNoiseOverlay } from "@/components/layout/BrandNoiseOverlay";
import { useI18n } from "@/components/providers/I18nProvider";

interface Props {
  count: number;
}

export function ExercisePageHeader({ count }: Props) {
  const { t } = useI18n();
  return (
    <div className="border-b border-[#2a2a2a] pb-4 relative overflow-hidden">
      <BrandNoiseOverlay />
      <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="stamp text-[9px] tracking-[0.3em] text-[#525252]"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {t("library.FIELD_MANUAL")}
            </span>
            <div className="h-px w-8 bg-[#2a2a2a]" />
            <span
              className="stamp text-[8px] text-[#e53e00] tracking-widest"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {count > 0 ? t("library.LOADED") : t("library.READY")}
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#e5e5e5]"
            style={{ fontFamily: "var(--font-heading, system-ui)" }}
          >
            {t("library.TITLE")}
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-[#e53e00]" />
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="stamp text-[9px] tracking-[0.15em] text-[#525252]"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            {t("library.ENTRIES")}
          </span>
          <span
            className="font-data text-xl font-bold tabular-nums text-[#e53e00]"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            {count.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
