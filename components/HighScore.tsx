"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { Storage, Score } from "@/utils/storage";

interface HighScoreProps {
    toolId: string;
    unit?: string;
}

export function HighScore({ toolId }: HighScoreProps) {
    const [score, setScore] = useState<Score | null>(null);
    const [isNewRecord, setIsNewRecord] = useState(false);

    useEffect(() => {
        setScore(Storage.getScore(toolId));

        const handleStorage = () => {
            const newScore = Storage.getScore(toolId);
            setScore((prev) => {
                if (newScore && (!prev || newScore.value !== prev.value)) {
                    setIsNewRecord(true);
                    setTimeout(() => setIsNewRecord(false), 2500);
                }
                return newScore;
            });
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("score_updated", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("score_updated", handleStorage);
        };
    }, [toolId]);

    if (!score) return null;

    return (
        <div
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors ${
                isNewRecord
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : "bg-white border-[#E6E3DB] text-[#161614]"
            }`}
        >
            <Trophy className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                Best
            </span>
            <span className="font-mono tabular-nums font-bold text-[#161614] text-sm">
                {score.value.toLocaleString()}{" "}
                <span className="text-xs font-medium text-[#78756C]">{score.unit}</span>
            </span>
        </div>
    );
}
