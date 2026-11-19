"use client";

import type { ProgressFeedback } from "@/hooks/useToolProgress";
import { useTranslation } from "@/lib/i18n/context";
import Link from "next/link";
import { useEffect, useState } from "react";

export function GameProgressFeedback({ result }: { result: ProgressFeedback | null }) {
  const { getLocalizedHref } = useTranslation();
  const [interrupted, setInterrupted] = useState(false);
  useEffect(() => {
    const notify = () => setInterrupted(true);
    const clear = () => setInterrupted(false);
    window.addEventListener("game_interrupted", notify);
    window.addEventListener("game_started", clear);
    return () => {
      window.removeEventListener("game_interrupted", notify);
      window.removeEventListener("game_started", clear);
    };
  }, []);
  if (!result) return interrupted ? (
    <div className="game-progress-feedback flex items-center justify-between gap-3" role="status">
      <p className="text-sm">The round stopped after a screen change or leaving this tab. Press Play for a fresh attempt.</p>
      <button type="button" aria-label="Dismiss message" className="min-h-11 min-w-11" onClick={() => setInterrupted(false)}>×</button>
    </div>
  ) : null;
  const change = result.previous === null ? null : result.value - result.previous;
  const improved = change !== null && (result.higherIsBetter ? change > 0 : change < 0);
  return (
    <div className="game-progress-feedback" role="status">
      <p className="font-semibold">{!result.saved ? "Round finished · device storage is unavailable" : result.challenge ? "Daily challenge complete!" : result.newBest ? "Personal best for this setup!" : "Attempt saved on this device"}</p>
      <p className="mt-1 text-sm">
        {result.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} {result.unit}
        {change !== null && change !== 0 && <> · {Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 1 })} {result.unit} {improved ? "better" : "behind"} your previous attempt</>}
        {change === null && " · Play again to build your progress."}
      </p>
      <div className="mt-2 flex flex-wrap gap-4 text-sm underline underline-offset-4">
        <Link href={getLocalizedHref("/statistics")}>View progress</Link>
        <Link href={getLocalizedHref("/challenges")}>Daily challenge</Link>
      </div>
    </div>
  );
}
