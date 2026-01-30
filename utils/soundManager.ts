"use client";

export class SoundManager {
    private static sounds: Map<string, HTMLAudioElement> = new Map();
    private static enabled: boolean = true;

    static init() {
        if (typeof window === "undefined") return;

        // Load preference
        const stored = localStorage.getItem("reflextry_preferences");
        if (stored) {
            try {
                const prefs = JSON.parse(stored);
                SoundManager.enabled = prefs.soundEnabled !== false;
            } catch (e) {
                // Ignore
            }
        }
    }

    static setEnabled(enabled: boolean) {
        SoundManager.enabled = enabled;
    }

    static play(soundName: string, volume: number = 0.5) {
        if (!SoundManager.enabled || typeof window === "undefined") return;

        try {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            if (!AudioContextClass) return;

            const audioContext = new AudioContextClass();
            const gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

            const oscillator = audioContext.createOscillator();
            oscillator.connect(gainNode);

            const now = audioContext.currentTime;

            switch (soundName) {
                case "click":
                case "beep":
                    oscillator.type = "sine";
                    oscillator.frequency.setValueAtTime(800, now);
                    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;

                case "hover":
                    oscillator.type = "sine";
                    oscillator.frequency.setValueAtTime(400, now);
                    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05);
                    gainNode.gain.setValueAtTime(volume * 0.5, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    oscillator.start(now);
                    oscillator.stop(now + 0.05);
                    break;

                case "success":
                case "hit":
                    oscillator.type = "sine";
                    oscillator.frequency.setValueAtTime(600, now);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);

                    // Add a second harmonic for "ding" effect
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    osc2.frequency.setValueAtTime(1200, now);
                    gain2.gain.setValueAtTime(volume * 0.5, now);
                    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc2.start(now);
                    osc2.stop(now + 0.3);
                    break;

                case "error":
                case "miss":
                    oscillator.type = "sawtooth";
                    oscillator.frequency.setValueAtTime(200, now);
                    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;

                case "levelup":
                case "high_score":
                    // Arpeggio
                    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
                    notes.forEach((freq, i) => {
                        const osc = audioContext.createOscillator();
                        const gn = audioContext.createGain();
                        osc.connect(gn);
                        gn.connect(audioContext.destination);

                        const start = now + (i * 0.1);
                        osc.frequency.value = freq;
                        gn.gain.setValueAtTime(0, start);
                        gn.gain.linearRampToValueAtTime(volume, start + 0.05);
                        gn.gain.exponentialRampToValueAtTime(0.01, start + 0.4);

                        osc.start(start);
                        osc.stop(start + 0.4);
                    });
                    break;

                default:
                    // Fallback simple beep
                    oscillator.type = "sine";
                    oscillator.frequency.setValueAtTime(440, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
            }
        } catch (error) {
            console.error("Sound error:", error);
        }
    }

    static stop(soundName: string) {
        const audio = SoundManager.sounds.get(soundName);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    static stopAll() {
        SoundManager.sounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
}

// Initialize on load
if (typeof window !== "undefined") {
    SoundManager.init();
}








