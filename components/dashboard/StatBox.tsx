"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";

interface StatBoxProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function StatBox({ label, value, highlight = false }: StatBoxProps) {
  const { t } = useTranslation();
  const cleanKey = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  const displayLabel = t(`stats.${cleanKey}`, t(`common.${cleanKey}`, label));

  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight
          ? "bg-[#F3F1EB] border-[#D8D4C9]"
          : "bg-[#FAF9F6] border-[#E6E3DB]"
      }`}
    >
      <div className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.08em] truncate">
        {displayLabel}
      </div>
      <div
        className={`text-xl font-mono font-bold tabular-nums mt-0.5 truncate ${
          highlight ? "text-[#1E40AF]" : "text-[#161614]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
