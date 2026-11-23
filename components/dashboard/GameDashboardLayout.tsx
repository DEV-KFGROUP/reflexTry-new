"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ToolIcon } from "@/components/ToolIcon";

interface GameDashboardLayoutProps {
  isIdle?: boolean;
  toolId?: string;
  title: string;
  subtitle: string;
  difficultySelector: ReactNode;
  stats: ReactNode;
  arenaHeaderLeft: ReactNode;
  arenaHeaderRight: ReactNode;
  children: ReactNode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  telemetryLogs?: string[];
}

export function GameDashboardLayout({
  isIdle = false,
  toolId,
  title,
  subtitle,
  difficultySelector,
  stats,
  arenaHeaderLeft,
  arenaHeaderRight,
  children,
  soundEnabled,
  onToggleSound,
  telemetryLogs,
}: GameDashboardLayoutProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const resolvedToolId = toolId || pathname || title;

  return (
    <div
      data-idle={isIdle}
      className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans py-6 sm:py-8 px-4 sm:px-6 lg:px-8 mb-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-6">
        {/* Clean Editorial Header with Interactive 3D Tool Emblem */}
        <header className="w-full flex flex-col items-center text-center space-y-2.5 pb-5 border-b border-[#E6E3DB]">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-3.5 max-w-full min-w-0">
            <ToolIcon
              toolId={resolvedToolId}
              variant="3d-pedestal"
              size="md"
              interactive
              title={title}
            />
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-medium tracking-[-0.02em] text-[#161614] leading-[1.1] [text-wrap:balance] min-w-0 max-w-full">
              {title}
            </h1>
          </div>
          <p className="text-sm sm:text-[15px] text-[#57554E] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Layout Grid — preserves verified mobile CSS hooks */}
        <div className="game-columns w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
          {/* Left Panel */}
          <div className="game-settings flex flex-col gap-4">
            {/* Difficulty Selector */}
            <div className="game-difficulty bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.12em] mb-3">
                {t("game.difficultyLevel", "Difficulty Level")}
              </div>
              <div className="flex flex-col gap-2">{difficultySelector}</div>
            </div>

            {/* Stats Panel */}
            <div className="game-stats bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.12em] mb-3">
                {t("game.sessionStats", "Session Stats")}
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-3.5">{stats}</div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={onToggleSound}
                className={`w-full min-h-[48px] px-4 py-3 rounded-xl border text-sm sm:text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2 ${
                  !soundEnabled
                    ? "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100/70"
                    : "bg-[#FAF9F6] border-[#E6E3DB] text-[#3F3E39] hover:bg-[#F3F1EB] hover:text-[#161614]"
                }`}
              >
                {!soundEnabled ? (
                  <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {!soundEnabled
                    ? t("game.unmute", "Sound Muted")
                    : t("game.soundOn", "Sound On")}
                </span>
              </button>
            </div>
          </div>

          {/* Right Panel: Interactive Game Console */}
          <div className="game-arena flex flex-col gap-4 w-full min-w-0 max-w-full h-full">
            <div className="relative bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden h-full min-h-[440px] sm:min-h-[500px] flex flex-col w-full min-w-0">
              {/* Top Status Strip */}
              {(arenaHeaderLeft || arenaHeaderRight) && (
                <div className="hidden sm:flex items-center justify-between gap-4 px-5 py-3 border-b border-[#F0EDE6] bg-[#FAF9F6] text-[11px] font-mono text-[#78756C] tabular-nums">
                  <div className="truncate">{arenaHeaderLeft}</div>
                  <div className="truncate text-right">{arenaHeaderRight}</div>
                </div>
              )}

              {/* Play Surface */}
              <div className="flex-1 p-3 sm:p-8 flex flex-col items-center justify-center relative z-10 w-full min-w-0 h-full">
                {children}
              </div>

              {/* Session Log (Optional) */}
              {telemetryLogs && telemetryLogs.length > 0 && (
                <div className="border-t border-[#E6E3DB] bg-[#FAF9F6] px-5 py-3 font-mono text-xs text-[#3F3E39]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-sans font-semibold text-[#78756C] uppercase tracking-[0.12em]">
                      {t("game.telemetryStream", "Session Log")}
                    </span>
                  </div>
                  <div className="h-20 overflow-y-auto flex flex-col gap-1 pr-2 tabular-nums">
                    {telemetryLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          idx === 0
                            ? "text-[#1E40AF] font-semibold"
                            : "text-[#78756C]"
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
