"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Music
} from "lucide-react";
import { useGameSound } from "@/hooks/useGameSound";

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
  bpm: number;
  lanesCount: number;
  laneKeys: string[]; // key characters
  gameBeats: number; // length of song
  maxMisses: number;
  hasSpeedFluctuations: boolean;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "2 Lanes (F/J) · Slow 90 BPM tempo · 30 beats · Unlimited strikes allowed",
    bpm: 90, lanesCount: 2, laneKeys: ["F", "J"], gameBeats: 30, maxMisses: 999, hasSpeedFluctuations: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3 Lanes (D/F/J) · 105 BPM tempo · 40 beats · Unlimited strikes",
    bpm: 105, lanesCount: 3, laneKeys: ["D", "F", "J"], gameBeats: 40, maxMisses: 999, hasSpeedFluctuations: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4 Lanes (D/F/J/K) · 120 BPM tempo · 60 beats · 10 strikes limit",
    bpm: 120, lanesCount: 4, laneKeys: ["D", "F", "J", "K"], gameBeats: 60, maxMisses: 10, hasSpeedFluctuations: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "4 Lanes · High 145 BPM tempo · Dynamic speed changes · 5 strikes limit",
    bpm: 145, lanesCount: 4, laneKeys: ["D", "F", "J", "K"], gameBeats: 80, maxMisses: 5, hasSpeedFluctuations: true,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "5 Lanes (adds Spacebar!) · Hyper 170 BPM tempo · Speed variations · 3 strikes limit",
    bpm: 170, lanesCount: 5, laneKeys: ["D", "F", "Space", "J", "K"], gameBeats: 100, maxMisses: 3, hasSpeedFluctuations: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface Note {
  id: number;
  lane: number;
  y: number; // percentage down
  speed: number; // drop speed factor
  hit: boolean;
  judged: boolean;
  judgment?: "perfect" | "good" | "miss";
}

const HIT_ZONE_Y = 82; // Hit zone alignment line % from top
const PERFECT_THRESHOLD = 4.5;
const GOOD_THRESHOLD = 11.5;

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
      onClick={disabled ? undefined : onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-3 transition-all focus:outline-none overflow-hidden ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${selected ? `${d.borderColor} bg-white shadow-lg` : "border-slate-200 bg-white/70 hover:border-slate-300"}`}
    >
      {selected && (
        <div className="absolute inset-0 opacity-5" style={{ background: DIFF_GRADIENT[diffKey] }} />
      )}
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: DIFF_GRADIENT[diffKey] }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs text-slate-800">{d.label}</span>
            {selected && (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} pts</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function RhythmTapGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [perfects, setPerfects] = useState(0);
  const [goods, setGoods] = useState(0);
  const [misses, setMisses] = useState(0);
  const [muted, setMuted] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [flashLane, setFlashLane] = useState<number | null>(null);

  const noteIdRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const beatIndexRef = useRef(0);
  const startTimeRef = useRef(0);

  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`rhythm-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const stopGame = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    playSound("success");
    setPhase("result");

    // Save high score
    setHighScores(hs => {
      if (score > hs[diffId]) {
        localStorage.setItem(`rhythm-hs-${diffId}`, score.toString());
        return { ...hs, [diffId]: score };
      }
      return hs;
    });
  }, [diffId, score, playSound]);

  const spawnNotes = useCallback(() => {
    const d = DIFFICULTIES[diffId];

    if (beatIndexRef.current >= d.gameBeats) {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      return;
    }

    beatIndexRef.current++;

    // Decide notes count on this beat
    let notesCount = 1;
    const rand = Math.random();
    if (d.id === "professional" && rand < 0.25) {
      notesCount = 3;
    } else if ((d.id === "hard" || d.id === "professional") && rand < 0.45) {
      notesCount = 2;
    } else if (d.id === "normal" && rand < 0.2) {
      notesCount = 2;
    }

    const lanes = new Set<number>();
    while (lanes.size < Math.min(notesCount, d.lanesCount)) {
      lanes.add(Math.floor(Math.random() * d.lanesCount));
    }

    const speedFactor = d.hasSpeedFluctuations 
      ? 0.72 + Math.random() * 0.25 
      : 0.85;

    const newNotes: Note[] = [];
    lanes.forEach(lane => {
      noteIdRef.current++;
      newNotes.push({
        id: noteIdRef.current,
        lane,
        y: -5,
        speed: speedFactor,
        hit: false,
        judged: false
      });
    });

    setNotes(prev => [...prev, ...newNotes]);
  }, [diffId]);

  const updateLoop = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    if (phase !== "playing") return;

    setNotes(prev => {
      const updated = prev.map(n => {
        if (n.hit || n.judged) return n;
        // speed falling rate
        return { ...n, y: n.y + n.speed };
      });

      // Check missed notes
      const judged = updated.map(n => {
        if (!n.judged && !n.hit && n.y > HIT_ZONE_Y + GOOD_THRESHOLD) {
          return { ...n, judged: true, judgment: "miss" as const };
        }
        return n;
      });

      // Handle new misses
      const newMisses = judged.filter(n => n.judgment === "miss" && !prev.find(p => p.id === n.id && p.judged));
      if (newMisses.length > 0) {
        playSound("error");
        setCombo(0);
        setMisses(m => {
          const nextM = m + newMisses.length;
          if (nextM >= d.maxMisses) {
            stopGame();
          }
          return nextM;
        });
      }

      const cleaned = judged.filter(n => n.y < 115);

      // Check completion
      if (beatIndexRef.current >= d.gameBeats && cleaned.filter(n => !n.judged && !n.hit).length === 0) {
        setTimeout(() => stopGame(), 600);
      }

      return cleaned;
    });

    animFrameRef.current = requestAnimationFrame(updateLoop);
  }, [phase, diffId, stopGame, playSound]);

  const hitLane = useCallback((laneIndex: number) => {
    if (phase !== "playing") return;

    setFlashLane(laneIndex);
    setTimeout(() => setFlashLane(null), 100);

    setNotes(prev => {
      const hittable = prev
        .filter(n => n.lane === laneIndex && !n.hit && !n.judged)
        .sort((a, b) => Math.abs(a.y - HIT_ZONE_Y) - Math.abs(b.y - HIT_ZONE_Y));

      if (hittable.length === 0) return prev;

      const closest = hittable[0];
      const dist = Math.abs(closest.y - HIT_ZONE_Y);

      if (dist <= PERFECT_THRESHOLD) {
        playSound("click");
        setScore(s => s + 100);
        setPerfects(p => p + 1);
        setCombo(c => {
          const nc = c + 1;
          setMaxCombo(mc => Math.max(mc, nc));
          return nc;
        });
        return prev.map(n => n.id === closest.id ? { ...n, hit: true, judged: true, judgment: "perfect" as const } : n);
      } else if (dist <= GOOD_THRESHOLD) {
        playSound("click");
        setScore(s => s + 50);
        setGoods(g => g + 1);
        setCombo(c => {
          const nc = c + 1;
          setMaxCombo(mc => Math.max(mc, nc));
          return nc;
        });
        return prev.map(n => n.id === closest.id ? { ...n, hit: true, judged: true, judgment: "good" as const } : n);
      }

      return prev;
    });
  }, [phase, playSound]);

  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfects(0);
    setGoods(0);
    setMisses(0);
    setNotes([]);
    noteIdRef.current = 0;
    beatIndexRef.current = 0;
    startTimeRef.current = Date.now();

    setPhase("playing");
    playSound("start");

    // Spawn notes periodically based on BPM
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    const intervalMs = 60000 / diff.bpm;
    spawnTimerRef.current = setInterval(() => {
      spawnNotes();
    }, intervalMs);

    setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(updateLoop);
    }, 50);

  }, [diff, playSound, spawnNotes, updateLoop]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      const key = e.key.toLowerCase();
      const d = DIFFICULTIES[diffId];

      let targetIndex = -1;
      if (d.lanesCount === 2) {
        // F and J keys
        if (key === "f") targetIndex = 0;
        if (key === "j") targetIndex = 1;
      } else if (d.lanesCount === 3) {
        // D, F, J keys
        if (key === "d") targetIndex = 0;
        if (key === "f") targetIndex = 1;
        if (key === "j") targetIndex = 2;
      } else if (d.lanesCount === 4) {
        // D, F, J, K keys
        if (key === "d") targetIndex = 0;
        if (key === "f") targetIndex = 1;
        if (key === "j") targetIndex = 2;
        if (key === "k") targetIndex = 3;
      } else if (d.lanesCount === 5) {
        // D, F, Spacebar, J, K keys
        if (key === "d") targetIndex = 0;
        if (key === "f") targetIndex = 1;
        if (key === " ") {
          e.preventDefault(); // prevent scroll down
          targetIndex = 2;
        }
        if (key === "j") targetIndex = 3;
        if (key === "k") targetIndex = 4;
      }

      if (targetIndex !== -1) {
        hitLane(targetIndex);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, diffId, hitLane]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">RHYTHM TAP</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">BEAT PRECISION ALIGNMENT</p>
            <span className="h-[1px] w-8 bg-slate-300" />
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase === "idle" || phase === "result") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Score</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Combo / Max</div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1.5">{combo}x / {maxCombo}x</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Remaining Strikes</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {diff.maxMisses === 999 ? "∞" : `${diff.maxMisses - misses} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Song Progress</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {beatIndexRef.current}/{diff.gameBeats}
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Score ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} pts</div>
                  </div>
                </div>
              )}

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[9px] font-mono uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL: Game Console ═══ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4">
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                ARENA // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                TEMPO: {diff.bpm} BPM
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Music className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Rhythm Tap</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Tap the scrolling calibration bars as they cross the neon threshold alignment line. Time clicks to earn Perfect ratings.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Rhythm Board
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full flex flex-col justify-between bg-slate-900 border border-slate-800 shadow-inner rounded-[2.5rem] overflow-hidden"
                    >
                      {/* Bounding fall viewport */}
                      <div className="flex-1 w-full relative">
                        {/* Vertical Lanes grid lines */}
                        <div className="absolute inset-0 flex">
                          {Array.from({ length: diff.lanesCount }).map((_, i) => (
                            <div
                              key={i}
                              onClick={() => hitLane(i)}
                              className={`flex-1 border-r border-slate-800/80 cursor-pointer last:border-none transition-colors duration-100 ${
                                flashLane === i ? "bg-cyan-500/10" : ""
                              }`}
                            />
                          ))}
                        </div>

                        {/* Neon hit zone threshold alignment line */}
                        <div
                          className="absolute left-0 right-0 h-1.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4] pointer-events-none"
                          style={{ top: `${HIT_ZONE_Y}%` }}
                        />
                        <div
                          className="absolute left-3 text-[7px] font-mono text-cyan-400 pointer-events-none uppercase tracking-widest"
                          style={{ top: `${HIT_ZONE_Y - 4}%` }}
                        >
                          HIT ZONE THRESHOLD
                        </div>

                        {/* Note Projectiles */}
                        <AnimatePresence>
                          {notes.filter(n => !n.hit).map(note => {
                            const widthPercent = 100 / diff.lanesCount;
                            const leftOffset = note.lane * widthPercent + 1.5;
                            const noteWidth = widthPercent - 3.0;

                            return (
                              <motion.div
                                key={note.id}
                                initial={{ opacity: 0, scaleY: 0.6 }}
                                animate={{ opacity: note.judged ? 0.2 : 1, scaleY: 1 }}
                                exit={{ scale: 1.3, opacity: 0 }}
                                className="absolute h-6 rounded-md bg-gradient-to-r from-cyan-400 to-cyan-500 border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                                style={{
                                  left: `${leftOffset}%`,
                                  width: `${noteWidth}%`,
                                  top: `${note.y}%`,
                                }}
                              />
                            );
                          })}
                        </AnimatePresence>

                        {/* Feedback judgments floaters */}
                        <AnimatePresence>
                          {notes.filter(n => n.hit && n.judgment).map(note => {
                            const widthPercent = 100 / diff.lanesCount;
                            const leftOffset = note.lane * widthPercent + 3;

                            return (
                              <motion.div
                                key={`j-${note.id}`}
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 0, y: -25 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.45 }}
                                className="absolute text-center select-none z-20 pointer-events-none"
                                style={{ left: `${leftOffset}%`, top: `${HIT_ZONE_Y - 8}%` }}
                              >
                                <span className={`text-[9px] font-mono font-black tracking-widest ${
                                  note.judgment === "perfect" ? "text-cyan-400" : "text-fuchsia-400"
                                }`}>
                                  {note.judgment === "perfect" ? "PERFECT" : "GOOD"}
                                </span>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>

                      {/* Physical keycaps panel */}
                      <div className="h-16 w-full bg-slate-950 border-t border-slate-800 flex items-center justify-between px-4 gap-2 z-10 p-2">
                        {diff.laneKeys.map((k, i) => (
                          <div key={i} className="relative flex-1 h-full">
                            <div className="absolute inset-0 rounded-lg bg-slate-800 translate-y-0.5 border-b border-black/25" />
                            <button
                              onClick={() => hitLane(i)}
                              className={`absolute inset-0 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all duration-100 select-none cursor-pointer ${
                                flashLane === i
                                  ? "translate-y-0.5 bg-cyan-500 text-white border-cyan-400 shadow-md"
                                  : "bg-slate-900 border-slate-700 text-slate-400 active:translate-y-0.5 hover:text-white"
                              }`}
                            >
                              {k.toUpperCase()}
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} rhythm trial complete.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div className="col-span-2 text-center border-b border-slate-200 pb-2">
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Final Performance Score</div>
                          <div className="text-3xl text-fuchsia-600 font-mono font-black">{score} pts</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Perfect Hits</div>
                          <div className="text-lg text-slate-700 font-mono font-bold">{perfects} / {perfects + goods}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Max Combo Peak</div>
                          <div className="text-lg text-slate-700 font-mono font-bold">{maxCombo}x combo</div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Arena
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("idle"); }}
                          className="relative group cursor-pointer focus:outline-none select-none flex-1"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
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
                <button
                  onClick={stopGame}
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Abort Session ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
