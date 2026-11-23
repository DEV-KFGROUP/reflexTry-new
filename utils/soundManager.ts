"use client";

import { safeStorage } from "./safeStorage";

export type SoundEffect =
    | "click"
    | "hover"
    | "levelup"
    | "success"
    | "error"
    | "start"
    | "complete"
    | "tick";

const PREFERENCES_KEY = "reflextry_preferences";

class SoundManagerService {
    private audioContext: AudioContext | null = null;
    private enabled: boolean | null = null;
    private lastHoverTime = 0;

    private readPreference(): boolean {
        if (typeof window === "undefined") return false;
        try {
            const raw = safeStorage.getItem(PREFERENCES_KEY);
            if (!raw) return true;
            const parsed = JSON.parse(raw) as { soundEnabled?: unknown };
            if (typeof parsed.soundEnabled === "boolean") {
                return parsed.soundEnabled;
            }
        } catch {
            // Fall back to enabled by default
        }
        return true;
    }

    public isEnabled(): boolean {
        if (this.enabled === null) {
            this.enabled = this.readPreference();
        }
        return this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = Boolean(enabled);
    }

    public toggle(): boolean {
        const next = !this.isEnabled();
        this.setEnabled(next);
        return next;
    }

    private getContext(): AudioContext | null {
        if (typeof window === "undefined") return null;
        try {
            if (!this.audioContext) {
                const AudioCtx =
                    window.AudioContext ||
                    (window as unknown as { webkitAudioContext?: typeof AudioContext })
                        .webkitAudioContext;
                if (!AudioCtx) return null;
                this.audioContext = new AudioCtx();
            }
            if (this.audioContext.state === "suspended") {
                void this.audioContext.resume().catch(() => {});
            }
            return this.audioContext;
        } catch {
            return null;
        }
    }

    private playTone(
        ctx: AudioContext,
        frequency: number,
        durationSec: number,
        type: OscillatorType,
        volume: number,
        delaySec = 0,
        endFrequency?: number
    ): void {
        const now = ctx.currentTime + delaySec;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);
        if (endFrequency !== undefined) {
            osc.frequency.exponentialRampToValueAtTime(
                Math.max(1, endFrequency),
                now + durationSec
            );
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + durationSec + 0.01);
    }

    public play(effect: SoundEffect): void {
        if (typeof window === "undefined" || !this.isEnabled()) return;

        // Avoid noisy hover audio before any user gesture or during rapid pointer sweeps
        if (effect === "hover") {
            const now = Date.now();
            if (now - this.lastHoverTime < 80) return;
            this.lastHoverTime = now;
            if (!this.audioContext || this.audioContext.state !== "running") {
                return;
            }
        }

        const ctx = this.getContext();
        if (!ctx || ctx.state !== "running") return;

        try {
            switch (effect) {
                case "click":
                    this.playTone(ctx, 560, 0.045, "sine", 0.04, 0, 380);
                    break;
                case "hover":
                    this.playTone(ctx, 720, 0.025, "sine", 0.015, 0, 680);
                    break;
                case "tick":
                    this.playTone(ctx, 880, 0.03, "triangle", 0.03);
                    break;
                case "start":
                    this.playTone(ctx, 440, 0.08, "sine", 0.05, 0);
                    this.playTone(ctx, 660, 0.1, "sine", 0.05, 0.07);
                    break;
                case "success":
                case "complete":
                    this.playTone(ctx, 523.25, 0.09, "sine", 0.06, 0);
                    this.playTone(ctx, 659.25, 0.09, "sine", 0.06, 0.07);
                    this.playTone(ctx, 783.99, 0.14, "sine", 0.06, 0.14);
                    break;
                case "error":
                    this.playTone(ctx, 220, 0.12, "sawtooth", 0.04, 0, 150);
                    break;
                case "levelup":
                    this.playTone(ctx, 523.25, 0.1, "triangle", 0.07, 0);
                    this.playTone(ctx, 659.25, 0.1, "triangle", 0.07, 0.09);
                    this.playTone(ctx, 783.99, 0.12, "triangle", 0.07, 0.18);
                    this.playTone(ctx, 1046.5, 0.24, "triangle", 0.08, 0.28);
                    break;
            }
        } catch {
            // Silently ignore Web Audio playback errors
        }
    }
}

export const SoundManager = new SoundManagerService();
