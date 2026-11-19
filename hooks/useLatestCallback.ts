"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

/** A stable event/timer callback that reads the latest committed game state. */
export function useLatestCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
) {
  const latest = useRef(callback);
  useLayoutEffect(() => { latest.current = callback; });
  return useCallback((...args: Args) => latest.current(...args), []);
}
