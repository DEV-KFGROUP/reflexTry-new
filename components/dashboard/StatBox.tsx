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
    <div className={`bg-slate-50 border border-slate-100 rounded-xl p-3 ${
      highlight ? "ring-1 ring-violet-200" : ""
    }`}>
      <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
        {displayLabel}
      </div>
      <div className={`text-2xl font-mono font-bold mt-0.5 ${
        highlight ? "text-violet-600" : "text-slate-800"
      }`}>
        {value}
      </div>
    </div>
  );
}

