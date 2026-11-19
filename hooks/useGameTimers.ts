"use client";

import { useCallback, useEffect, useRef } from "react";

type Timer = ReturnType<typeof globalThis.setTimeout>;

/** Own every delayed action so a previous attempt cannot change a new game. */
export function useGameTimers() {
  const timeouts = useRef(new Set<Timer>());
  const intervals = useRef(new Set<Timer>());
  const cancelTimers = useCallback(() => {
    timeouts.current.forEach(globalThis.clearTimeout);
    intervals.current.forEach(globalThis.clearInterval);
    timeouts.current.clear();
    intervals.current.clear();
  }, []);
  useEffect(() => cancelTimers, [cancelTimers]);
  const setTimeout = useCallback((callback: () => void, delay?: number): Timer => {
    const id = globalThis.setTimeout(() => {
      timeouts.current.delete(id);
      callback();
    }, delay);
    timeouts.current.add(id);
    return id;
  }, []);
  const setInterval = useCallback((callback: () => void, delay?: number): Timer => {
    const id = globalThis.setInterval(callback, delay);
    intervals.current.add(id);
    return id;
  }, []);
  const clearTimeout = useCallback((id: Timer | null | undefined) => {
    if (id == null) return;
    globalThis.clearTimeout(id);
    timeouts.current.delete(id);
  }, []);
  const clearInterval = useCallback((id: Timer | null | undefined) => {
    if (id == null) return;
    globalThis.clearInterval(id);
    intervals.current.delete(id);
  }, []);
  return { setTimeout, setInterval, clearTimeout, clearInterval, cancelTimers };
}
