import { safeStorage } from "./safeStorage";
import { XPSystem } from "./xpSystem";

export type DeepWorkMode = "focus" | "shortBreak" | "longBreak";
export type DeepWorkStatus = "idle" | "running" | "paused";

export interface DeepWorkSession {
    id: string;
    startedAt: number;
    endedAt: number;
    durationSec: number;
    targetSec: number;
    completed: boolean;
    mode: "focus";
    label: string;
    pagesVisited: string[];
}

export interface DeepWorkTimerState {
    mode: DeepWorkMode;
    status: DeepWorkStatus;
    focusMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
    remainingSec: number;
    endTimeMs: number | null;
    accumulatedActiveSec: number;
    segmentStartedAtMs: number | null;
    sessionStartedAtMs: number | null;
    pagesVisited: string[];
    completedCycles: number;
    label: string;
}

export interface DeepWorkDailyPoint {
    dateKey: string;
    label: string;
    minutes: number;
    sessions: number;
}

export interface DeepWorkStats {
    totalSessions: number;
    completedSessions: number;
    totalSeconds: number;
    todaySeconds: number;
    averageMinutes: number;
    longestMinutes: number;
    dailySeries: DeepWorkDailyPoint[];
}

const SESSIONS_KEY = "reflextry_deep_work_sessions";
const TIMER_STATE_KEY = "reflextry_deep_work_timer_state";
const MAX_SESSIONS = 200;

export const DEEP_WORK_EVENT = "deep_work_updated";

export const FOCUS_PRESETS = [15, 25, 50] as const;

export function getModeDurationSec(
    mode: DeepWorkMode,
    focusMinutes = 25,
    shortBreakMinutes = 5,
    longBreakMinutes = 15
): number {
    if (mode === "shortBreak") return shortBreakMinutes * 60;
    if (mode === "longBreak") return longBreakMinutes * 60;
    return focusMinutes * 60;
}

export function createDefaultTimerState(): DeepWorkTimerState {
    return {
        mode: "focus",
        status: "idle",
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        remainingSec: 25 * 60,
        endTimeMs: null,
        accumulatedActiveSec: 0,
        segmentStartedAtMs: null,
        sessionStartedAtMs: null,
        pagesVisited: [],
        completedCycles: 0,
        label: "Deep Work",
    };
}

export function formatClock(totalSeconds: number): string {
    const clamped = Math.max(0, Math.ceil(totalSeconds));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatDurationHuman(totalSeconds: number): string {
    const safe = Math.max(0, Math.round(totalSeconds));
    if (safe < 60) return `${safe}s`;
    const totalMinutes = Math.floor(safe / 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${totalMinutes}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

function toLocalDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export const DeepWorkLog = {
    loadTimerState(): DeepWorkTimerState {
        const fallback = createDefaultTimerState();
        const raw = safeStorage.getItem(TIMER_STATE_KEY);
        if (!raw) return fallback;
        try {
            const parsed = JSON.parse(raw) as Partial<DeepWorkTimerState>;
            if (!parsed || typeof parsed !== "object") return fallback;
            const mode: DeepWorkMode =
                parsed.mode === "shortBreak" || parsed.mode === "longBreak"
                    ? parsed.mode
                    : "focus";
            const status: DeepWorkStatus =
                parsed.status === "running" || parsed.status === "paused"
                    ? parsed.status
                    : "idle";
            const focusMinutes =
                typeof parsed.focusMinutes === "number" &&
                Number.isFinite(parsed.focusMinutes) &&
                parsed.focusMinutes >= 1 &&
                parsed.focusMinutes <= 120
                    ? Math.round(parsed.focusMinutes)
                    : 25;
            const shortBreakMinutes =
                typeof parsed.shortBreakMinutes === "number" && parsed.shortBreakMinutes >= 1
                    ? Math.round(parsed.shortBreakMinutes)
                    : 5;
            const longBreakMinutes =
                typeof parsed.longBreakMinutes === "number" && parsed.longBreakMinutes >= 1
                    ? Math.round(parsed.longBreakMinutes)
                    : 15;
            const defaultRemaining = getModeDurationSec(
                mode,
                focusMinutes,
                shortBreakMinutes,
                longBreakMinutes
            );
            const remainingSec =
                typeof parsed.remainingSec === "number" &&
                Number.isFinite(parsed.remainingSec) &&
                parsed.remainingSec >= 0
                    ? parsed.remainingSec
                    : defaultRemaining;

            return {
                mode,
                status,
                focusMinutes,
                shortBreakMinutes,
                longBreakMinutes,
                remainingSec,
                endTimeMs:
                    typeof parsed.endTimeMs === "number" && Number.isFinite(parsed.endTimeMs)
                        ? parsed.endTimeMs
                        : null,
                accumulatedActiveSec:
                    typeof parsed.accumulatedActiveSec === "number" &&
                    Number.isFinite(parsed.accumulatedActiveSec) &&
                    parsed.accumulatedActiveSec >= 0
                        ? parsed.accumulatedActiveSec
                        : 0,
                segmentStartedAtMs:
                    typeof parsed.segmentStartedAtMs === "number" &&
                    Number.isFinite(parsed.segmentStartedAtMs)
                        ? parsed.segmentStartedAtMs
                        : null,
                sessionStartedAtMs:
                    typeof parsed.sessionStartedAtMs === "number" &&
                    Number.isFinite(parsed.sessionStartedAtMs)
                        ? parsed.sessionStartedAtMs
                        : null,
                pagesVisited: Array.isArray(parsed.pagesVisited)
                    ? parsed.pagesVisited.filter((p): p is string => typeof p === "string").slice(0, 20)
                    : [],
                completedCycles:
                    typeof parsed.completedCycles === "number" &&
                    Number.isFinite(parsed.completedCycles) &&
                    parsed.completedCycles >= 0
                        ? Math.floor(parsed.completedCycles)
                        : 0,
                label:
                    typeof parsed.label === "string" && parsed.label.trim().length > 0
                        ? parsed.label.trim().slice(0, 48)
                        : "Deep Work",
            };
        } catch {
            return fallback;
        }
    },

    saveTimerState(state: DeepWorkTimerState): boolean {
        return safeStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
    },

    getSessions(): DeepWorkSession[] {
        const raw = safeStorage.getItem(SESSIONS_KEY);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(
                (item): item is DeepWorkSession =>
                    item !== null &&
                    typeof item === "object" &&
                    typeof item.id === "string" &&
                    typeof item.durationSec === "number" &&
                    Number.isFinite(item.durationSec) &&
                    item.durationSec > 0 &&
                    typeof item.endedAt === "number"
            );
        } catch {
            return [];
        }
    },

    logSession(input: Omit<DeepWorkSession, "id">): DeepWorkSession | null {
        const durationSec = Math.round(input.durationSec);
        if (!Number.isFinite(durationSec) || durationSec < 1) return null;

        const session: DeepWorkSession = {
            ...input,
            id: `dw_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            durationSec,
            targetSec: Math.max(durationSec, Math.round(input.targetSec)),
            label: (input.label || "Deep Work").trim().slice(0, 48) || "Deep Work",
            pagesVisited: Array.from(new Set(input.pagesVisited || [])).slice(0, 12),
        };

        const existing = DeepWorkLog.getSessions();
        const duplicate = existing.some(
            (s) => Math.abs(s.startedAt - session.startedAt) < 1000 && Math.abs(s.endedAt - session.endedAt) < 1000
        );
        if (duplicate) return null;

        const updated = [...existing, session].slice(-MAX_SESSIONS);
        safeStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));

        // Award XP proportional to logged deep work time (2 XP/min, minimum 5 XP if >= 60s)
        const minutes = Math.floor(durationSec / 60);
        const xpEarned = input.completed ? Math.max(10, minutes * 2) : minutes >= 1 ? minutes * 2 : 0;
        if (xpEarned > 0) {
            XPSystem.addXP(xpEarned);
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(DEEP_WORK_EVENT, { detail: session }));
            window.dispatchEvent(new Event("score_updated"));
        }

        return session;
    },

    getStats(now = new Date()): DeepWorkStats {
        const sessions = DeepWorkLog.getSessions();
        const todayKey = toLocalDateKey(now);

        let totalSeconds = 0;
        let todaySeconds = 0;
        let completedSessions = 0;
        let longestSeconds = 0;

        // Build map for last 7 days
        const dayMap = new Map<string, { label: string; seconds: number; sessions: number }>();
        for (let offset = 6; offset >= 0; offset--) {
            const d = new Date(now);
            d.setDate(now.getDate() - offset);
            const key = toLocalDateKey(d);
            const label = d.toLocaleDateString(undefined, { weekday: "short" });
            dayMap.set(key, { label, seconds: 0, sessions: 0 });
        }

        for (const s of sessions) {
            totalSeconds += s.durationSec;
            if (s.completed) completedSessions += 1;
            if (s.durationSec > longestSeconds) longestSeconds = s.durationSec;

            const key = toLocalDateKey(new Date(s.endedAt));
            if (key === todayKey) todaySeconds += s.durationSec;

            const bucket = dayMap.get(key);
            if (bucket) {
                bucket.seconds += s.durationSec;
                bucket.sessions += 1;
            }
        }

        const dailySeries: DeepWorkDailyPoint[] = Array.from(dayMap.entries()).map(
            ([dateKey, info]) => ({
                dateKey,
                label: info.label,
                minutes: Math.round((info.seconds / 60) * 10) / 10,
                sessions: info.sessions,
            })
        );

        const totalSessions = sessions.length;
        const averageMinutes =
            totalSessions > 0 ? Math.round((totalSeconds / totalSessions / 60) * 10) / 10 : 0;
        const longestMinutes = Math.round((longestSeconds / 60) * 10) / 10;

        return {
            totalSessions,
            completedSessions,
            totalSeconds,
            todaySeconds,
            averageMinutes,
            longestMinutes,
            dailySeries,
        };
    },

    clearSessions(): boolean {
        const removed = safeStorage.removeItem(SESSIONS_KEY);
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event(DEEP_WORK_EVENT));
            window.dispatchEvent(new Event("score_updated"));
        }
        return removed;
    },
};
