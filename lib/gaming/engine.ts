import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'COMPLETED';

export interface GameStats {
    score: number;
    accuracy: number;
    timeElapsed: number;
    mistakes: number;
    targetsHit: number;
    targetsTotal: number;
}

interface GameStore {
    // State
    gameState: GameState;
    stats: GameStats;
    config: {
        duration?: number; // In milliseconds, if time-limited
        targetCount?: number; // If target-limited
        mode: 'standard' | 'zen' | 'challenge';
    };

    // Actions
    startGame: (config?: Partial<GameStore['config']>) => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: () => void;
    resetGame: () => void;

    // Updates
    addScore: (points: number) => void;
    registerHit: () => void;
    registerMiss: () => void;
    updateTime: (ms: number) => void;
}

export const useGameEngine = create<GameStore>((set, get) => ({
    gameState: 'IDLE',
    stats: {
        score: 0,
        accuracy: 100,
        timeElapsed: 0,
        mistakes: 0,
        targetsHit: 0,
        targetsTotal: 0,
    },
    config: {
        mode: 'standard',
    },

    startGame: (config) => {
        set((state) => ({
            gameState: 'PLAYING',
            config: { ...state.config, ...config },
            stats: {
                score: 0,
                accuracy: 100,
                timeElapsed: 0,
                mistakes: 0,
                targetsHit: 0,
                targetsTotal: 0,
            },
        }));
    },

    pauseGame: () => set({ gameState: 'PAUSED' }),
    resumeGame: () => set({ gameState: 'PLAYING' }),

    endGame: () => set({ gameState: 'COMPLETED' }),

    resetGame: () => set({
        gameState: 'IDLE',
        stats: {
            score: 0,
            accuracy: 100,
            timeElapsed: 0,
            mistakes: 0,
            targetsHit: 0,
            targetsTotal: 0,
        }
    }),

    addScore: (points) => set((state) => ({
        stats: { ...state.stats, score: state.stats.score + points }
    })),

    registerHit: () => set((state) => {
        const targetsHit = state.stats.targetsHit + 1;
        const targetsTotal = state.stats.targetsTotal + 1;
        return {
            stats: {
                ...state.stats,
                targetsHit,
                targetsTotal,
                accuracy: (targetsHit / targetsTotal) * 100
            }
        };
    }),

    registerMiss: () => set((state) => {
        const mistakes = state.stats.mistakes + 1;
        const targetsTotal = state.stats.targetsTotal + 1;
        return {
            stats: {
                ...state.stats,
                mistakes,
                targetsTotal,
                accuracy: (state.stats.targetsHit / targetsTotal) * 100
            }
        };
    }),

    updateTime: (ms) => {
        const state = get();
        if (state.gameState !== 'PLAYING') return;

        // Check time limit
        if (state.config.duration && ms >= state.config.duration) {
            state.endGame();
            return;
        }

        set((s) => ({
            stats: { ...s.stats, timeElapsed: ms }
        }));
    },
}));
