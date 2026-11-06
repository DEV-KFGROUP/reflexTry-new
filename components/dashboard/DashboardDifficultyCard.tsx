"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";

interface DashboardDifficultyCardProps {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

export function DashboardDifficultyCard({
  id, label, description, selected, onSelect, disabled = false, icon: Icon, iconColorClass, iconBgClass
}: DashboardDifficultyCardProps) {
  const { t } = useTranslation();
  const diffKey = `game.diff${id.charAt(0).toUpperCase() + id.slice(1)}`;
  const displayLabel = t(diffKey, label);

  return (
    <button
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      className={`relative w-full text-left rounded-2xl border p-3 transition-all focus:outline-none flex items-start gap-3 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        selected 
          ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-[0_4px_20px_rgba(99,102,241,0.1)]" 
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
      }`}
    >
      {/* Icon Box */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
        <Icon className={`w-4 h-4 ${iconColorClass}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs tracking-wide text-slate-800 dark:text-slate-200">
            {displayLabel}
          </span>
          {selected && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500 text-white leading-none">
              {t("game.active", "Active")}
            </span>
          )}
        </div>
        <p className="text-xs font-normal text-slate-600 dark:text-slate-300 mt-1 leading-tight pr-2">
          {description}
        </p>
      </div>
    </button>
  );
}
