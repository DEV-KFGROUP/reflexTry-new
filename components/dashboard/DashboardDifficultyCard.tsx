"use client";

import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface DashboardDifficultyCardProps {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  icon: React.ElementType;
  iconColorClass?: string;
  iconBgClass?: string;
}

export function DashboardDifficultyCard({
  id,
  label,
  description,
  selected,
  onSelect,
  disabled = false,
  icon: Icon,
}: DashboardDifficultyCardProps) {
  const { t } = useTranslation();
  const diffKey = `game.diff${id.charAt(0).toUpperCase() + id.slice(1)}`;
  const displayLabel = t(diffKey, label);

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      aria-pressed={selected}
      disabled={disabled}
      className={`relative w-full min-h-[52px] text-left rounded-xl border p-3.5 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-1 flex items-start gap-3 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        selected
          ? "border-[#161614] bg-[#F3F1EB]"
          : "border-[#E6E3DB] bg-white hover:border-[#D8D4C9] hover:bg-[#FAF9F6]"
      }`}
    >
      {/* Icon Box — preserves .difficulty-icon mobile CSS hook */}
      <div
        className={`difficulty-icon w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
          selected
            ? "bg-[#161614] border-[#161614] text-[#FAF9F6]"
            : "bg-[#FAF9F6] border-[#E6E3DB] text-[#57554E]"
        }`}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-xs text-[#161614]">
            {displayLabel}
          </span>
          {selected && (
            <Check className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" aria-hidden="true" />
          )}
        </div>
        <p className="text-xs font-normal text-[#57554E] mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </button>
  );
}
