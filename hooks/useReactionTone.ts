"use client";

import { useCallback, useEffect, useRef } from "react";

/** Unlock once from a gesture and reuse a single audio device for every trial. */
export function useReactionTone() {
  const context = useRef<AudioContext | null>(null);
  const prepare = useCallback(() => {
    if (!context.current && typeof window.AudioContext !== "undefined") context.current = new AudioContext();
    if (context.current?.state === "suspended") void context.current.resume();
  }, []);
  const beep = useCallback((frequency: number): number | null => {
    const ctx = context.current;
    if (!ctx || ctx.state !== "running") return null;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    const start = ctx.currentTime + 0.01;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
    oscillator.start(start);
    oscillator.stop(start + 0.13);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    const output = ctx.getOutputTimestamp?.();
    return output?.performanceTime && output.contextTime !== undefined
      ? output.performanceTime + (start - output.contextTime) * 1000
      : performance.now() + 10 + ctx.baseLatency * 1000;
  }, []);
  useEffect(() => () => { void context.current?.close(); context.current = null; }, []);
  return { prepare, beep };
}
