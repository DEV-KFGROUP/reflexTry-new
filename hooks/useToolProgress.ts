"use client";

import { readConsent } from "@/lib/cookie-consent";
import { Achievements } from "@/utils/achievements";
import { DailyChallenge } from "@/utils/dailyChallenge";
import { safeStorage } from "@/utils/safeStorage";
import { ScoreHistory } from "@/utils/scoreHistory";
import { XPSystem } from "@/utils/xpSystem";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useLatestCallback } from "./useLatestCallback";

export interface ProgressFeedback {
  saved: boolean;
  value: number;
  unit: string;
  previous: number | null;
  higherIsBetter: boolean;
  newBest: boolean;
  challenge: boolean;
}

interface Options<Level extends string> {
  toolId: string;
  phase: string;
  difficulty: Level;
  value: number | ((elapsedSeconds: number) => number);
  unit: string;
  higherIsBetter?: boolean;
  terminal: readonly string[];
  idle: readonly string[];
  recordKey: string;
  setHighScores: Dispatch<SetStateAction<Record<Level, number>>>;
  reset: () => void;
  cancelTimers: () => void;
  eligible?: boolean;
  accuracy?: number;
}

function track(name: string, detail: Record<string, unknown>) {
  if (!readConsent()?.analytics) return;
  const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
  analytics.gtag?.("event", name, detail);
}

/** Save once per attempt, after React has committed the final counters. Never publishes. */
export function useToolProgress<Level extends string>(options: Options<Level>) {
  const [feedback, setFeedback] = useState<ProgressFeedback | null>(null);
  const session = useRef<{ start: number; input: string; aborted: boolean; width: number; geometry: string } | null>(null);
  const latest = useLatestCallback(() => options);

  useEffect(() => {
    const pointer = (e: PointerEvent) => {
      if (session.current) {
        const arena = document.querySelector(".game-arena")?.getBoundingClientRect();
        if (arena) session.current.geometry = `${Math.round(arena.width)}x${Math.round(arena.height)}`;
        session.current.input = e.pointerType || "mouse";
      }
    };
    const key = () => {
      if (session.current) {
        const arena = document.querySelector(".game-arena")?.getBoundingClientRect();
        if (arena) session.current.geometry = `${Math.round(arena.width)}x${Math.round(arena.height)}`;
        session.current.input = "keyboard";
      }
    };
    const aborted = () => {
      if (session.current) session.current.aborted = true;
      track("game_aborted", { tool_id: latest().toolId, reason: "player" });
    };
    const hidden = () => {
      const current = latest();
      if (!document.hidden || !session.current || current.terminal.includes(current.phase)) return;
      session.current.aborted = true;
      track("game_aborted", { tool_id: current.toolId, reason: "hidden" });
      current.cancelTimers();
      current.reset();
      window.dispatchEvent(new CustomEvent("game_interrupted"));
    };
    const resized = () => {
      const attempt = session.current;
      if (!attempt || attempt.width === window.innerWidth) return;
      const current = latest();
      if (current.terminal.includes(current.phase)) return;
      attempt.aborted = true;
      current.cancelTimers();
      current.reset();
      window.dispatchEvent(new CustomEvent("game_interrupted"));
    };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", key, true);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("resize", resized);
    window.addEventListener("game_abort_requested", aborted);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("resize", resized);
      window.removeEventListener("game_abort_requested", aborted);
    };
  }, [latest]);

  useEffect(() => {
    const o = latest();
    if (o.idle.includes(o.phase)) {
      session.current = null;
      setFeedback(null);
      return;
    }
    if (!o.terminal.includes(o.phase)) {
      if (!session.current) {
        const arena = document.querySelector(".game-arena")?.getBoundingClientRect();
        session.current = {
          start: performance.now(), input: "unknown", aborted: false, width: window.innerWidth,
          geometry: arena ? `${Math.round(arena.width)}x${Math.round(arena.height)}` : "default",
        };
        setFeedback(null);
        window.dispatchEvent(new Event("game_started"));
        track("game_start", { tool_id: o.toolId, difficulty: o.difficulty });
      }
      return;
    }
    const attempt = session.current;
    if (!attempt) return;
    session.current = null;
    o.cancelTimers();
    if (attempt.aborted) return;
    const seconds = Math.max(0.001, (performance.now() - attempt.start) / 1000);
    const value = typeof o.value === "function" ? o.value(seconds) : o.value;
    if (!Number.isFinite(value) || value < 0) return;
    const higherIsBetter = o.higherIsBetter ?? true;
    const eligible = o.eligible !== false && (higherIsBetter || value > 0 || o.toolId === "time-perception");
    const configuration = `${o.difficulty}:${attempt.input}:${attempt.geometry}:v2`;
    const previousEntry = ScoreHistory.get(o.toolId).filter(e => e.configuration === configuration && e.eligible !== false).at(-1);
    // Versioned keys keep measurements with different rules/input methods separate.
    const key = `reflextry_best_v2_${o.toolId}_${configuration}`;
    const raw = safeStorage.getItem(key);
    const previousBest = raw === null ? null : Number(raw);
    const newBest = eligible && (previousBest === null || !Number.isFinite(previousBest) ||
      (higherIsBetter ? value > previousBest : value < previousBest));
    if (newBest) {
      safeStorage.setItem(key, String(value));
    }
    // Existing difficulty widgets use the current configuration's record.
    if (eligible) {
      const best = newBest ? value : previousBest ?? value;
      safeStorage.setItem(`${o.recordKey}${o.difficulty}`, String(best));
      o.setHighScores(scores => ({ ...scores, [o.difficulty]: best }));
    }
    const saved = ScoreHistory.save(o.toolId, value, o.unit, o.difficulty, {
      higherIsBetter, inputMethod: attempt.input, configuration, duration: seconds,
      accuracy: o.accuracy,
      eligible, outcome: o.eligible === false ? "failed" : "completed", version: 2,
    });
    const unlocked = eligible ? Achievements.check(o.toolId, value, o.unit) : [];
    if (unlocked.length) window.dispatchEvent(new CustomEvent("achievement_unlocked", { detail: unlocked }));
    const challenge = eligible && DailyChallenge.checkCompletion(o.toolId, value, o.unit);
    if (eligible) {
      XPSystem.awardGameComplete();
      if (newBest) XPSystem.awardNewHighScore();
      if (challenge) XPSystem.awardDailyChallenge();
      if (unlocked.length) XPSystem.awardAchievement(0);
    }
    setFeedback({ saved, value, unit: o.unit, previous: previousEntry?.value ?? null, higherIsBetter, newBest, challenge });
    window.dispatchEvent(new Event("score_updated"));
    track("game_complete", { tool_id: o.toolId, difficulty: o.difficulty, value, unit: o.unit, input_method: attempt.input });
  }, [options.phase, latest]);

  return feedback;
}
