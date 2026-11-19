"use client";

import { useLayoutEffect, useRef } from "react";

/** Timestamp committed stimuli, rather than the callback that requested a render. */
export function useStimulusClock(key: string | number, visible: boolean) {
  const clock = useRef(0);
  useLayoutEffect(() => {
    clock.current = visible ? performance.now() : 0;
  }, [key, visible]);
  return clock;
}
