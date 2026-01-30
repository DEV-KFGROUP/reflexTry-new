"use client";

import { useCallback, useRef, useEffect } from "react";

type SoundType = "click" | "hover" | "success" | "error" | "start" | "levelUp" | "tick";

export const useGameSound = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);

    // Initialize Audio Context on user interaction (handled lazily)
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
                masterGainRef.current = audioContextRef.current.createGain();
                masterGainRef.current.gain.value = 0.3; // Default volume
                masterGainRef.current.connect(audioContextRef.current.destination);
            }
        }
        if (audioContextRef.current?.state === "suspended") {
            audioContextRef.current.resume();
        }
    }, []);

    const play = useCallback((type: SoundType) => {
        initAudio(); // Ensure context is ready
        if (!audioContextRef.current || !masterGainRef.current) return;

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        const now = ctx.currentTime;

        switch (type) {
            case "click":
                // Short high-pitch blip
                osc.type = "sine";
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case "hover":
                // Very subtle, futuristic tick
                osc.type = "sine";
                osc.frequency.setValueAtTime(400, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05); // quick fade
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case "tick":
                // Mechanical tick
                osc.type = "square";
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case "success":
                // Major chord arpeggio
                const successNotes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
                successNotes.forEach((freq, i) => {
                    const noteOsc = ctx.createOscillator();
                    const noteGain = ctx.createGain();
                    noteOsc.connect(noteGain);
                    noteGain.connect(masterGainRef.current!);

                    noteOsc.type = "triangle";
                    noteOsc.frequency.value = freq;

                    const startTime = now + (i * 0.05);
                    noteGain.gain.setValueAtTime(0, startTime);
                    noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
                    noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

                    noteOsc.start(startTime);
                    noteOsc.stop(startTime + 0.4);
                });
                break;

            case "start":
                // Power up sound
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(110, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.5);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.4, now + 0.4);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;

            case "error":
                // Dissonant buzz
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case "levelUp":
                // Magical shimmer
                const notes = [440, 554, 659, 880, 1108, 1318];
                notes.forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(masterGainRef.current!);
                    o.type = "sine";
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0, now + i * 0.05);
                    g.gain.linearRampToValueAtTime(0.2, now + i * 0.05 + 0.1);
                    g.gain.linearRampToValueAtTime(0, now + i * 0.05 + 0.6);
                    o.start(now + i * 0.05);
                    o.stop(now + i * 0.05 + 0.6);
                });
                break;
        }
    }, [initAudio]);

    return { play };
};
