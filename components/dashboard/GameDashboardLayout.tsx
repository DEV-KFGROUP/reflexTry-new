import React, { ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface GameDashboardLayoutProps {
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
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Gradients and Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">
        
        {/* Header */}
        <div className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800 dark:text-white uppercase">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-600" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">
              {subtitle}
            </p>
            <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          
          {/* Left Panel */}
          <div className="flex flex-col gap-4">
            {/* Difficulty Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                Difficulty Level
              </div>
              <div className="flex flex-col gap-2">
                {difficultySelector}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                Session Stats
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {stats}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={onToggleSound}
                className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  !soundEnabled 
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400" 
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800"
                }`}
              >
                {!soundEnabled ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[9px] font-mono uppercase tracking-widest">
                  {!soundEnabled ? "Unmute" : "Sound On"}
                </span>
              </button>
            </div>
          </div>

          {/* Right Panel: Game Console */}
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)] dark:shadow-none h-full min-h-[480px] flex flex-col">
              
              {/* Corner decals */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200 dark:border-slate-700" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200 dark:border-slate-700" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200 dark:border-slate-700" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200 dark:border-slate-700" />
              
              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                {arenaHeaderLeft}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                {arenaHeaderRight}
              </div>
              
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(148,163,184,0)_50%,rgba(148,163,184,0.15)_50%)] bg-[size:100%_4px]" />

              <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center relative z-10 w-full h-full">
                {children}
              </div>

              {/* Telemetry Log (Optional) */}
              {telemetryLogs && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 px-6 py-3 font-mono text-[9px] text-slate-600 dark:text-slate-400 overflow-hidden relative">
                  <div className="absolute top-2 right-4 text-[8px] text-slate-400 tracking-wider">TELEMETRY_STREAM</div>
                  <div className="h-20 overflow-y-auto flex flex-col gap-1 pr-2">
                    {telemetryLogs.map((log, idx) => (
                      <div key={idx} className={`${idx === 0 ? "text-violet-700 dark:text-violet-400 font-bold" : "opacity-50"} transition-opacity duration-200`}>
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
