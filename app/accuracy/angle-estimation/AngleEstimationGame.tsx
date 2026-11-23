"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Brain, Crosshair, Flame, Play, RotateCcw, Shield, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   INLINE GRADIENT MAP (avoids Tailwind purging)
───────────────────────────────────────────── */
const DIFF_GRADIENT: Record<string, string> = {
  beginner:     "linear-gradient(135deg, #34d399, #14b8a6)",
  easy:         "linear-gradient(135deg, #38bdf8, #3b82f6)",
  normal:       "linear-gradient(135deg, #8b5cf6, #9333ea)",
  hard:         "linear-gradient(135deg, #fb923c, #ef4444)",
  professional: "linear-gradient(135deg, #f43f5e, #ec4899)",
};

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIG
───────────────────────────────────────────── */
type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  snaps: number[]; // pool of angles or multiples (e.g. multiples of 90)
  hasTilt: boolean; // base offset angle is randomly rotated
  hasDistractor: boolean; // draws a third grey line
  showGuides: "full" | "ticks" | "minimal" | "none";
  penaltyMultiplier: number; // points deducted per degree off
  minPointsThreshold: number; // score required to not get a strike
  maxMistakesAllowed: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "90° snap angles · Full circle guides · Horizontal base · Unlimited lives",
    snaps: [90, 180, 270, 360], hasTilt: false, hasDistractor: false, showGuides: "full",
    penaltyMultiplier: 1.0, minPointsThreshold: 0, maxMistakesAllowed: 999,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "45° snaps · Ticked background guides · Horizontal base · Unlimited lives",
    snaps: [45, 90, 135, 180, 225, 270, 315, 360], hasTilt: false, hasDistractor: false, showGuides: "ticks",
    penaltyMultiplier: 1.5, minPointsThreshold: 0, maxMistakesAllowed: 999,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "15° snaps · Minimal guides · Horizontal base · Strikes on scores < 60",
    snaps: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345, 360],
    hasTilt: false, hasDistractor: false, showGuides: "minimal",
    penaltyMultiplier: 2.0, minPointsThreshold: 60, maxMistakesAllowed: 3,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Any integer degree (1°-359°) · Tilted base baseline · No guides · Strikes on scores < 75",
    snaps: [], hasTilt: true, hasDistractor: false, showGuides: "none",
    penaltyMultiplier: 2.5, minPointsThreshold: 75, maxMistakesAllowed: 3,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Any degree · Tilted baseline + distractor line · Strikes on scores < 80",
    snaps: [], hasTilt: true, hasDistractor: true, showGuides: "none",
    penaltyMultiplier: 3.0, minPointsThreshold: 80, maxMistakesAllowed: 2,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];
const TOTAL_ROUNDS = 10;

/* ─────────────────────────────────────────────
   DIFFICULTY CARD
───────────────────────────────────────────── */
function DifficultyCard({
  diffKey, selected, onSelect, highScore, disabled,
}: {
  diffKey: DiffId; selected: boolean; onSelect: () => void; highScore: number; disabled: boolean;
}) {
  const d = DIFFICULTIES[diffKey];
  const Icon = d.icon;
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      aria-pressed={selected}
      onClick={disabled ? undefined : onSelect}
      className={`relative w-full min-h-[56px] text-left rounded-2xl border-2 p-3.5 transition-all focus:outline-none overflow-hidden touch-manipulation ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${selected ? `${d.borderColor} bg-white shadow-lg` : "border-[#E6E3DB] bg-white/70 hover:border-[#D8D4C9]"}`}
    >
      {selected && (
        <div className="absolute inset-0 opacity-5" style={{ background: DIFF_GRADIENT[diffKey] }} />
      )}
      <div className="relative z-10 flex items-start gap-3">
        <div className="difficulty-icon w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: DIFF_GRADIENT[diffKey] }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs text-[#161614]">{d.label}</span>
            {selected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#57554E] dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} pts</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function AngleEstimationGame() {
  const roundLocked = useRef(false);
  const { setTimeout, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result" | "failed">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [muted, setMuted] = useState(false);

  const [targetAngle, setTargetAngle] = useState(90);
  const [baseOffsetAngle, setBaseOffsetAngle] = useState(0);
  const [distractorAngle, setDistractorAngle] = useState(0);
  const [userAngle, setUserAngle] = useState(90);
  const [scores, setScores] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ diff: number; points: number; correct: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diff = DIFFICULTIES[diffId];

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const playSound = useLatestCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  });

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = safeStorage.getItem(`reflextry_v2_angle-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  const generateTargetAngle = useCallback(() => {
    roundLocked.current = false;
    const d = DIFFICULTIES[diffId];
    let angle = 90;
    if (d.snaps.length > 0) {
      angle = d.snaps[Math.floor(Math.random() * d.snaps.length)];
    } else {
      angle = Math.floor(Math.random() * 340) + 10; // 10° to 350°
    }

    const baseOffset = d.hasTilt ? Math.floor(Math.random() * 360) : 0;
    const distractor = d.hasDistractor 
      ? (baseOffset + angle + 60 + Math.floor(Math.random() * 120)) % 360
      : 0;

    setTargetAngle(angle);
    setBaseOffsetAngle(baseOffset);
    setDistractorAngle(distractor);
    setUserAngle(90);
  }, [diffId]);

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== "playing") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.42;

    ctx.clearRect(0, 0, size, size);

    // Draw background guides
    const d = DIFFICULTIES[diffId];
    if (d.showGuides === "full" || d.showGuides === "ticks") {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // draw ticks
      const divisions = d.showGuides === "full" ? 8 : 4;
      for (let i = 0; i < divisions; i++) {
        const rad = (i * (360 / divisions)) * (Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(cx + (radius - 8) * Math.cos(rad), cy + (radius - 8) * Math.sin(rad));
        ctx.lineTo(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad));
        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (d.showGuides === "minimal") {
      // Draw minimal 90-degree axis ticks
      for (let i = 0; i < 4; i++) {
        const rad = (i * 90) * (Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(cx + (radius - 5) * Math.cos(rad), cy + (radius - 5) * Math.sin(rad));
        ctx.lineTo(cx + radius * Math.cos(rad), cy + radius * Math.sin(rad));
        ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // 1. Draw baseline (rotated by baseOffsetAngle)
    const baseRad = baseOffsetAngle * (Math.PI / 180);
    const baseX = cx + radius * Math.cos(baseRad);
    const baseY = cy + radius * Math.sin(baseRad);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(baseX, baseY);
    ctx.strokeStyle = "#475569"; // dark baseline slate
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 2. Draw target line (baseOffset + targetAngle)
    const targetRad = (baseOffsetAngle + targetAngle) * (Math.PI / 180);
    const targetX = cx + radius * Math.cos(targetRad);
    const targetY = cy + radius * Math.sin(targetRad);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = "#06b6d4"; // Cyan target line
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 3. Draw arc inside baseline to target line
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.25, baseRad, targetRad);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Draw distractor line if active
    if (d.hasDistractor) {
      const distRad = distractorAngle * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * 0.95 * Math.cos(distRad), cy + radius * 0.95 * Math.sin(distRad));
      ctx.strokeStyle = "rgba(148, 163, 184, 0.22)"; // Faded grey distractor line
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }

    // Central core connector dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "#334155";
    ctx.fill();

  }, [targetAngle, baseOffsetAngle, distractorAngle, phase, diffId]);

  const startGame = useCallback(() => {
    cancelTimers();
    setRound(0);
    setMistakes(0);
    setScores([]);
    setFeedback(null);
    setPhase("playing");
    playSound("start");
    
    // Defer loading target angle to ensure reset
    setTimeout(() => generateTargetAngle(), 50);
  }, [playSound, generateTargetAngle]);

  const submitGuess = useLatestCallback(() => {
    if (phase !== "playing" || roundLocked.current) return;
    roundLocked.current = true;
    const error = Math.abs(userAngle - targetAngle);
    const points = Math.max(0, Math.round(100 - error * diff.penaltyMultiplier));
    setFeedback({ diff: error, points, correct: targetAngle });
    const nextMistakes = mistakes + (points < diff.minPointsThreshold ? 1 : 0);
    const nextRound = round + 1;
    setScores(values => [...values, points]);
    setMistakes(nextMistakes);
    setRound(nextRound);
    playSound(points >= diff.minPointsThreshold ? "success" : "error");
    setTimeout(() => {
      if (nextMistakes >= diff.maxMistakesAllowed) setPhase("failed");
      else if (nextRound >= TOTAL_ROUNDS) setPhase("result");
      else { setFeedback(null); generateTargetAngle(); }
    }, 900);
  });

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;


  const progress = useToolProgress({
    toolId: "angle-estimation", phase: phase, difficulty: diffId,
    value: avgScore, unit: "pts", higherIsBetter: true,
    terminal: ["result","failed"], idle: ["idle"], recordKey: "reflextry_v2_angle-hs-",
    setHighScores, cancelTimers, reset: () => setPhase("idle"),
    eligible: true,
  });

  return (
    <div data-idle={phase === "idle"} className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans relative overflow-hidden py-4 px-2 sm:px-4 lg:px-6 mb-4">
      <GameProgressFeedback result={progress} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center gap-4 mb-1">
            <ToolIcon toolId="/accuracy/angle-estimation" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Angle Estimation</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">VISUAL GEOMETRY CALIBRATION</p>
          </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="game-columns w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="game-settings flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="game-difficulty bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-xs font-mono font-semibold text-[#57554E] dark:text-slate-300 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase === "idle" || phase === "result" || phase === "failed") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="game-stats bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-xs font-mono font-semibold text-[#57554E] dark:text-slate-300 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Average Points</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">{avgScore} pts</div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Base Rotation</div>
                  <div className="text-xs font-mono font-bold text-slate-850 mt-1.5 uppercase">
                    {diff.hasTilt ? `${baseOffsetAngle}° Tilted` : "Horizontal"}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5 animate-pulse">
                    {diff.maxMistakesAllowed === 999 ? "∞" : `${diff.maxMistakesAllowed - mistakes} ❤️`}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Round Progress</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">
                    {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Average ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} pts</div>
                  </div>
                </div>
              )}

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full min-h-[48px] px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-[#FAF9F6] border-[#E6E3DB] text-[#57554E] hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-sm sm:text-xs font-mono font-medium uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL: Game Console ═══ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="game-arena flex flex-col gap-4">
            <div className="relative bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden">




              <div className="absolute top-4 left-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                {diff.label} Mode
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                GUIDES: {diff.showGuides.toUpperCase()}
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="game-start-icon relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Crosshair className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Angle Estimation</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Estimate geometric angles drawn relative to base lines. Pro presets tilt the base lines and draw distractor lines on guides.
                        </p>
                        <p className={`game-level-description text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none w-full sm:w-auto min-w-[200px] touch-manipulation">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative min-h-[52px] px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Play
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && (
                    <motion.div
                      key="playing"
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0 } }}
                      className="text-center w-full max-w-md flex flex-col items-center space-y-6"
                    >
                      {/* Canvas Deck */}
                      <div className="relative p-6 bg-[#FAF9F6] border border-[#E6E3DB] shadow-inner rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                        <canvas
                          ref={canvasRef}
                          width={280}
                          height={280}
                          className="mx-auto"
                        />
                      </div>

                      <AnimatePresence mode="wait">
                        {feedback ? (
                          <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="min-h-[188px] flex flex-col items-center justify-center space-y-1.5"
                          >
                            <p className={`text-2xl font-mono font-black uppercase tracking-wider ${
                              feedback.points >= diff.minPointsThreshold ? "text-cyan-600" : "text-red-500"
                            }`}>
                              {feedback.points >= 90 ? "🎯 EXCELLENT!" : feedback.points >= diff.minPointsThreshold ? "👍 ACCURATE!" : "😬 STRIKE OUT!"}
                            </p>
                            <p className="text-[#57554E] dark:text-slate-400 text-xs font-mono">
                              Correct Angle: <span className="text-[#161614] font-bold">{feedback.correct}°</span> | Guess: <span className="text-slate-850 font-bold">{userAngle}°</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">Off by {feedback.diff}° — Received {feedback.points} points</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="gauge"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col items-center space-y-4 min-h-[188px]"
                          >
                            <div className="text-center">
                              <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider mb-0.5">Estimated Guess</div>
                              <div className="text-4xl font-mono font-bold text-slate-850">{userAngle}°</div>
                            </div>

                            <div className="w-full max-w-xs mx-auto flex items-center py-2">
                              <input
                                type="range"
                                min={0}
                                max={360}
                                value={userAngle}
                                aria-label="Angle estimation slider"
                                onChange={e => setUserAngle(Number(e.target.value))}
                                className="w-full accent-cyan-500 cursor-ew-resize bg-[#E6E3DB] h-3 rounded-lg appearance-none touch-pan-y"
                              />
                            </div>

                            <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
                              {[-5, -1, 1, 5].map(delta => (
                                <button
                                  key={delta}
                                  type="button"
                                  onClick={() => setUserAngle(prev => Math.max(0, Math.min(360, prev + delta)))}
                                  className="min-h-[44px] min-w-[52px] px-3 py-2 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] active:scale-95 text-[#3F3E39] font-mono text-xs font-bold transition-all cursor-pointer touch-manipulation"
                                >
                                  {delta > 0 ? `+${delta}°` : `${delta}°`}
                                </button>
                              ))}
                            </div>

                            <div className="relative w-full max-w-xs h-[52px] min-h-[52px]">
                              <div className="absolute inset-0 rounded-xl bg-cyan-700 translate-y-1 border-b-2 border-black/25" />
                              <button
                                onClick={submitGuess}
                                className="absolute inset-0 w-full min-h-[52px] rounded-xl bg-cyan-500 border border-cyan-400 text-white font-mono font-bold tracking-widest text-xs sm:text-sm shadow-md flex items-center justify-center hover:brightness-105 active:translate-y-1 cursor-pointer py-3 touch-manipulation"
                              >
                                Submit Estimation
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_SUCCESS</div>
                        <p className="text-xs font-mono text-[#78756C]">{diff.label} average estimation calibration complete.</p>
                        {avgScore >= highScores[diffId] && avgScore > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {avgScore} avg!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Average Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{avgScore} pts</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Highest Average</div>
                          <div className="text-xl text-[#3F3E39] font-mono font-bold">{highScores[diffId]} pts</div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none w-full sm:flex-1 touch-manipulation">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative min-h-[52px] py-3.5 px-4 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs sm:text-sm border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Play again
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("idle"); }}
                          className="relative group cursor-pointer focus:outline-none select-none w-full sm:flex-1 touch-manipulation"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative min-h-[52px] py-3.5 px-4 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs sm:text-sm border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            Select Level
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 4. FAILED SCREEN ── */}
                  {phase === "failed" && (
                    <motion.div key="failed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIBRATION_FAILED</div>
                        <p className="text-xs font-mono text-[#78756C]">Too many inaccurate estimates below threshold.</p>
                      </div>

                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Rounds Finished</div>
                          <div className="text-2xl text-[#161614] font-mono font-bold">{round}/{TOTAL_ROUNDS}</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Average Points</div>
                          <div className="text-xl text-[#3F3E39] font-mono font-bold">{avgScore} pts</div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none w-full sm:flex-1 touch-manipulation">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative min-h-[52px] py-3.5 px-4 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs sm:text-sm border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Arena
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("idle"); }}
                          className="relative group cursor-pointer focus:outline-none select-none w-full sm:flex-1 touch-manipulation"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative min-h-[52px] py-3.5 px-4 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs sm:text-sm border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            Select Level
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* Abort */}
            {phase === "playing" && (
              <div className="flex justify-end">
                <button onClickCapture={() => window.dispatchEvent(new Event("game_abort_requested"))}
                  onClick={() => setPhase("idle")}
                  className="min-h-[44px] min-w-[128px] px-4 py-2.5 rounded-xl border border-[#E6E3DB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono font-semibold text-[#3F3E39] dark:text-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer touch-manipulation"
                >
                  End round ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
