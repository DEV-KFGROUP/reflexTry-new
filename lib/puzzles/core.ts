"use client";

export const TOTAL_LEVELS = 1200;

export interface LevelTier {
    id: "warmup" | "club" | "scholar" | "master" | "mensa";
    label: string;
    start: number;
    end: number;
    accentClass: string;
}

export const LEVEL_TIERS: LevelTier[] = [
    { id: "warmup", label: "Warmup", start: 1, end: 200, accentClass: "text-emerald-700" },
    { id: "club", label: "Club", start: 201, end: 450, accentClass: "text-sky-700" },
    { id: "scholar", label: "Scholar", start: 451, end: 750, accentClass: "text-indigo-700" },
    { id: "master", label: "Master", start: 751, end: 1000, accentClass: "text-amber-700" },
    { id: "mensa", label: "Mensa", start: 1001, end: 1200, accentClass: "text-rose-700" },
];

export function getTierForLevel(level: number): LevelTier {
    const clamped = Math.max(1, Math.min(TOTAL_LEVELS, Math.floor(level)));
    return (
        LEVEL_TIERS.find((t) => clamped >= t.start && clamped <= t.end) || LEVEL_TIERS[0]
    );
}

/** Deterministic fast 32-bit PRNG (Mulberry32) */
export function createRng(seed: number): () => number {
    let a = seed >>> 0;
    return function next(): number {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Stable FNV-1a 32-bit string hash */
export function hashString(input: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

export function getTodayKey(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function getLevelSeed(gameId: string, level: number, isDaily: boolean): number {
    const key = isDaily ? `${gameId}:daily:${getTodayKey()}` : `${gameId}:lvl:${level}`;
    return hashString(key);
}

export function shuffleWithRng<T>(items: readonly T[], rng: () => number): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function randInt(rng: () => number, min: number, max: number): number {
    return min + Math.floor(rng() * (max - min + 1));
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Scientifically balanced, high-legibility 10-color editorial palette for
 * Queens regions, Patches rectangles, and Wend word weaves.
 * Every surface maintains >= 7:1 contrast with #0F172A dark ink.
 */
export const REGION_PALETTE = [
    { bg: "#DBEAFE", active: "#BFDBFE", stroke: "#1D4ED8", name: "Cobalt Mist" },
    { bg: "#DCFCE7", active: "#BBF7D0", stroke: "#15803D", name: "Sage Mint" },
    { bg: "#FEF3C7", active: "#FDE68A", stroke: "#B45309", name: "Amber Silk" },
    { bg: "#FCE7F3", active: "#FBCFE8", stroke: "#BE185D", name: "Rose Quartz" },
    { bg: "#EDE9FE", active: "#DDD6FE", stroke: "#6D28D9", name: "Iris Veil" },
    { bg: "#CCFBF1", active: "#99F6E4", stroke: "#0F766E", name: "Seafoam" },
    { bg: "#FFEDD5", active: "#FED7AA", stroke: "#C2410C", name: "Apricot" },
    { bg: "#E0E7FF", active: "#C7D2FE", stroke: "#4338CA", name: "Periwinkle" },
    { bg: "#ECFCCB", active: "#D9F99D", stroke: "#4D7C0F", name: "Chartreuse" },
    { bg: "#F1F5F9", active: "#E2E8F0", stroke: "#475569", name: "Slate Mist" },
] as const;

export const SUMBREAK_TILE_STYLES: Record<
    number,
    { bg: string; text: string; border: string }
> = {
    2: { bg: "#F1F5F9", text: "#0F172A", border: "#CBD5E1" },
    4: { bg: "#E0F2FE", text: "#0C4A6E", border: "#7DD3FC" },
    8: { bg: "#CCFBF1", text: "#134E4A", border: "#5EEAD4" },
    16: { bg: "#DCFCE7", text: "#14532D", border: "#86EFAC" },
    32: { bg: "#FEF3C7", text: "#78350F", border: "#FCD34D" },
    64: { bg: "#FFEDD5", text: "#7C2D12", border: "#FDBA74" },
    128: { bg: "#FEE2E2", text: "#7F1D1D", border: "#FCA5A5" },
    256: { bg: "#FCE7F3", text: "#831843", border: "#F9A8D4" },
    512: { bg: "#EDE9FE", text: "#4C1D95", border: "#C4B5FD" },
    1024: { bg: "#4338CA", text: "#FFFFFF", border: "#312E81" },
    2048: { bg: "#0F172A", text: "#FDE047", border: "#1E293B" },
    4096: { bg: "#B45309", text: "#FFFFFF", border: "#78350F" },
};

// --- Local Progress Persistence ---

export interface GameProgressData {
    solvedLevels: number[];
    bestTimes: Record<string, number>;
    stars: Record<string, number>;
    dailySolvedDates: string[];
    lastLevel: number;
}

const DEFAULT_PROGRESS: GameProgressData = {
    solvedLevels: [],
    bestTimes: {},
    stars: {},
    dailySolvedDates: [],
    lastLevel: 1,
};

function storageKey(gameId: string): string {
    return `reflextry_puzzle_v1_${gameId}`;
}

export function loadPuzzleProgress(gameId: string): GameProgressData {
    if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
    try {
        const raw = window.localStorage.getItem(storageKey(gameId));
        if (!raw) return { ...DEFAULT_PROGRESS };
        const parsed = JSON.parse(raw) as Partial<GameProgressData>;
        return {
            solvedLevels: Array.isArray(parsed.solvedLevels) ? parsed.solvedLevels : [],
            bestTimes: parsed.bestTimes && typeof parsed.bestTimes === "object" ? parsed.bestTimes : {},
            stars: parsed.stars && typeof parsed.stars === "object" ? parsed.stars : {},
            dailySolvedDates: Array.isArray(parsed.dailySolvedDates) ? parsed.dailySolvedDates : [],
            lastLevel: typeof parsed.lastLevel === "number" && parsed.lastLevel >= 1 ? parsed.lastLevel : 1,
        };
    } catch {
        return { ...DEFAULT_PROGRESS };
    }
}

export function recordPuzzleSolve(
    gameId: string,
    level: number,
    isDaily: boolean,
    seconds: number,
    starCount: number
): GameProgressData {
    const current = loadPuzzleProgress(gameId);
    const key = isDaily ? `daily:${getTodayKey()}` : String(level);

    if (isDaily) {
        const today = getTodayKey();
        if (!current.dailySolvedDates.includes(today)) {
            current.dailySolvedDates = [...current.dailySolvedDates, today].slice(-90);
        }
    } else {
        if (!current.solvedLevels.includes(level)) {
            current.solvedLevels = [...current.solvedLevels, level].sort((a, b) => a - b);
        }
        current.lastLevel = Math.min(TOTAL_LEVELS, Math.max(current.lastLevel, level + 1));
    }

    const prevTime = current.bestTimes[key];
    if (prevTime === undefined || seconds < prevTime) {
        current.bestTimes[key] = seconds;
    }

    const prevStars = current.stars[key] ?? 0;
    if (starCount > prevStars) {
        current.stars[key] = starCount;
    }

    try {
        window.localStorage.setItem(storageKey(gameId), JSON.stringify(current));
    } catch {
        // Ignore storage quota errors
    }
    return current;
}

export function saveLastLevel(gameId: string, level: number): void {
    if (typeof window === "undefined") return;
    const current = loadPuzzleProgress(gameId);
    current.lastLevel = Math.max(1, Math.min(TOTAL_LEVELS, level));
    try {
        window.localStorage.setItem(storageKey(gameId), JSON.stringify(current));
    } catch {
        // Ignore
    }
}

// --- Subtle Web Audio Synthesized Tactile Feedback ---

let audioCtx: AudioContext | null = null;
const SOUND_PREF_KEY = "reflextry_puzzles_sound";

export function isPuzzleSoundEnabled(): boolean {
    if (typeof window === "undefined") return true;
    const val = window.localStorage.getItem(SOUND_PREF_KEY);
    return val !== "off";
}

export function setPuzzleSoundEnabled(enabled: boolean): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(SOUND_PREF_KEY, enabled ? "on" : "off");
    } catch {
        // Ignore
    }
}

function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!isPuzzleSoundEnabled()) return null;
    try {
        if (!audioCtx) {
            const Ctx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!Ctx) return null;
            audioCtx = new Ctx();
        }
        if (audioCtx.state === "suspended") {
            void audioCtx.resume();
        }
        return audioCtx;
    } catch {
        return null;
    }
}

export function playPuzzleTone(
    kind: "tap" | "place" | "merge" | "error" | "hint" | "win"
): void {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const scheduleNote = (
        freq: number,
        startOffset: number,
        duration: number,
        volume: number,
        type: OscillatorType = "sine"
    ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + startOffset);
        gain.gain.setValueAtTime(0.0001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(volume, now + startOffset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration + 0.01);
    };

    switch (kind) {
        case "tap":
            scheduleNote(520, 0, 0.045, 0.05, "triangle");
            break;
        case "place":
            scheduleNote(640, 0, 0.065, 0.07, "sine");
            break;
        case "merge":
            scheduleNote(440, 0, 0.07, 0.07, "triangle");
            scheduleNote(660, 0.04, 0.09, 0.06, "sine");
            break;
        case "hint":
            scheduleNote(587.33, 0, 0.08, 0.06, "sine");
            scheduleNote(880, 0.06, 0.12, 0.06, "sine");
            break;
        case "error":
            scheduleNote(210, 0, 0.11, 0.07, "sawtooth");
            break;
        case "win":
            scheduleNote(523.25, 0, 0.12, 0.08, "sine");
            scheduleNote(659.25, 0.09, 0.12, 0.08, "sine");
            scheduleNote(783.99, 0.18, 0.14, 0.09, "sine");
            scheduleNote(1046.5, 0.28, 0.26, 0.1, "triangle");
            break;
    }
}
