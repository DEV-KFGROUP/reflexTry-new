"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useGameEngine } from "@/lib/gaming/engine";
import { SoundManager } from "@/utils/soundManager";
import { Button } from "@/components/ui/Button";
import { GameBackground } from "@/components/GameBackground";
import { Play, RotateCcw, Trophy, Crosshair } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";
import { Progress } from "@/components/ui/progress";

export default function TargetTrackingClient() {
    const engine = useGameEngine();
    const isPlaying = engine.gameState === 'PLAYING';
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const controls = useAnimation();

    // Player State
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const targetRef = useRef<{ x: number, y: number, r: number }>({ x: 0, y: 0, r: 30 }); // r is radius

    // Game Physics State
    const [health, setHealth] = useState(100);
    const healthRef = useRef(100);
    const [isHovering, setIsHovering] = useState(false);
    const isHoveringRef = useRef(false);
    const totalTrackedTimeRef = useRef(0);
    const difficultyRef = useRef(1);

    const gameOver = useCallback(() => {
        SoundManager.play("miss");
        controls.stop();
        engine.endGame();
    }, [engine, controls]);

    // Check collision precisely inside RAF
    const updateLogic = useCallback((time: number) => {
        if (engine.gameState !== 'PLAYING') return;

        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTimeMillis = time - lastTimeRef.current;
        const deltaTime = deltaTimeMillis / 1000;
        lastTimeRef.current = time;

        const container = containerRef.current;
        if (!container) {
            requestRef.current = requestAnimationFrame(updateLogic);
            return;
        }

        // Difficulty slowly increases over time
        difficultyRef.current += deltaTime * 0.05;

        // Check if cursor is over target exactly
        // Target's position is updated by Framer Motion, but we need exact screen/container coordinates.
        // Reading it dynamically is too slow if querying DOM. 
        // We will manually move the target using JS to be perfectly accurate, bypassing framer motion for physics,
        // or we check the element bounds. Given framer motion controls, reading bounds is safer.
        const targetEl = container.querySelector('.tracking-target');
        if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Mouse is relative to container, target rect is absolute.
            const absMouseX = mousePos.x + containerRect.left;
            const absMouseY = mousePos.y + containerRect.top;

            const targetCenterX = rect.left + rect.width / 2;
            const targetCenterY = rect.top + rect.height / 2;
            const radius = rect.width / 2;

            const dist = Math.hypot(absMouseX - targetCenterX, absMouseY - targetCenterY);
            isHoveringRef.current = dist <= radius;
        }

        if (isHoveringRef.current) {
            totalTrackedTimeRef.current += deltaTimeMillis;
            engine.updateTime(totalTrackedTimeRef.current);
            engine.addScore(1); // Keep score ticking

            // Heal slowly if hovered
            healthRef.current += 10 * deltaTime;
            if (healthRef.current > 100) healthRef.current = 100;
        } else {
            // Drain health based on difficulty
            // Start draining at 15% per sec, scaling up.
            healthRef.current -= (15 * difficultyRef.current) * deltaTime;
        }

        setHealth(healthRef.current);
        setIsHovering(isHoveringRef.current);

        if (healthRef.current <= 0) {
            gameOver();
            return;
        }

        requestRef.current = requestAnimationFrame(updateLogic);
    }, [engine, mousePos, gameOver]);

    // Erratic Movement Loop
    const moveTarget = useCallback(async () => {
        if (engine.gameState !== 'PLAYING') return;
        if (!containerRef.current) return;

        const w = containerRef.current.offsetWidth - 60;
        const h = containerRef.current.offsetHeight - 60;

        // Random destination
        const nextX = Math.random() * w;
        const nextY = Math.random() * h;

        // Speed depends on difficulty
        const baseDuration = (0.5 + Math.random() * 0.5);
        const duration = baseDuration / difficultyRef.current;

        await controls.start({
            x: nextX,
            y: nextY,
            transition: {
                duration: duration,
                ease: "easeInOut"
            }
        });

        // Loop
        if (engine.gameState === 'PLAYING') {
            moveTarget();
        }
    }, [engine.gameState, controls]);

    useEffect(() => {
        if (isPlaying) {
            moveTarget();
            requestRef.current = requestAnimationFrame(updateLogic);
        } else {
            controls.stop();
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            controls.stop();
            cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, moveTarget, updateLogic, controls]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const startGame = () => {
        healthRef.current = 100;
        setHealth(100);
        isHoveringRef.current = false;
        setIsHovering(false);
        totalTrackedTimeRef.current = 0;
        difficultyRef.current = 1;
        lastTimeRef.current = 0;
        engine.startGame({ duration: 0, mode: 'zen' });

        // Setup initial target position center
        if (containerRef.current) {
            controls.set({
                x: (containerRef.current.offsetWidth - 60) / 2,
                y: (containerRef.current.offsetHeight - 60) / 2
            });
        }
    };

    return (
        <GameBackground variant="speed" showParticles={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
                            Target Tracking
                        </h1>
                        <p className="text-xl text-cyan-400/80 font-medium tracking-wide mt-2 uppercase">Continuous Accuracy Trainer</p>
                    </div>

                    <div className="flex justify-center gap-6 mt-8">
                        <div className="text-center p-4 glass rounded-xl border-cyan-500/30 min-w-[200px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Tracked Time</div>
                            <div className="text-4xl font-mono font-bold text-white">
                                {(engine.stats.timeElapsed / 1000).toFixed(2)}s
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl space-y-6">
                    <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col items-center">
                        <div className="flex justify-between w-full text-sm font-bold text-cyan-400 mb-2 font-mono">
                            <span>TRACKING HEALTH</span>
                            <span>{Math.max(0, health).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
                            <motion.div
                                className={`absolute left-0 top-0 h-full ${health > 30 ? 'bg-cyan-500' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`}
                                style={{ width: `${Math.max(0, health)}%` }}
                                transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                            />
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        className={`w-full aspect-video relative rounded-[2rem] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl bg-black/60 ${isPlaying ? 'cursor-crosshair' : ''}`}
                    >
                        <AnimatePresence mode="wait">
                            {!isPlaying && engine.gameState !== 'COMPLETED' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                                >
                                    <Crosshair className="w-20 h-20 text-cyan-500 mb-6 animate-pulse" />
                                    <h2 className="text-3xl font-bold text-white mb-4">Keep the Crosshair on Target</h2>
                                    <p className="text-gray-400 mb-8 max-w-sm text-center">Track the erratic ball with your mouse. Generating points fills your health bar. Losing the target drains it.</p>
                                    <Button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-white text-xl px-12 py-8 rounded-2xl">
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        COMMENCE TRACKING
                                    </Button>
                                </motion.div>
                            )}

                            {engine.gameState === 'COMPLETED' && (
                                <motion.div
                                    key="completed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm"
                                >
                                    <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                                    <div className="text-4xl font-bold text-white mb-2">TARGET LOST</div>
                                    <div className="my-8 text-center text-gray-300 text-lg">
                                        Total precision tracking time: <span className="font-mono text-3xl font-bold text-cyan-400 mx-2">{(engine.stats.timeElapsed / 1000).toFixed(2)}</span> seconds.
                                    </div>
                                    <Button onClick={startGame} className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg px-8 py-6 rounded-xl">
                                        <RotateCcw className="w-5 h-5 mr-2" />
                                        TRY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Rendering Target */}
                        {isPlaying && (
                            <motion.div
                                animate={controls}
                                className={`tracking-target absolute w-[60px] h-[60px] rounded-full border-4 shadow-2xl transition-colors duration-100 ${isHovering ? 'scale-110 bg-cyan-400/80 border-cyan-300 shadow-cyan-400/50' : 'bg-red-500/80 border-red-400 shadow-red-500/50'}`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                    <Crosshair className="w-8 h-8 text-white" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Continuous Target Tracking"
                    description="Test your smooth pursuit eye movements and mouse tracking accuracy."
                    howToUse={[
                        { title: "Press Start." },
                        { title: "The target will begin moving erratically around the box." },
                        { title: "Keep your mouse cursor hovering directly over the target." },
                        { title: "If you lose the target, the Tracking Health bar drains." },
                        { title: "Game over when Tracking Health hits 0." }
                    ]}
                    howToImprove={[
                        { title: "Relax the Grip", description: "Do not try to predict erratic movements; maintain a loose grip to react quickly to direction changes." },
                        { title: "Disable Mouse Acceleration", description: "Ensure mouse acceleration (enhance pointer precision) is turned OFF in Windows." },
                        { title: "Desktop Practice", description: "Practice tracing invisible lines on your desktop background." }
                    ]}
                    howToPlay={[
                        "Hover target to heal.",
                        "Lose target, take damage.",
                        "Survive as long as possible."
                    ]}
                    benefits={[
                        "Improves smooth pursuit ocular tracking.",
                        "Fine-tunes mouse control and DPI comfort.",
                        "Aids in keeping on-target during extended engagements in FPS games."
                    ]}
                    faqs={[
                        { question: "Why does it get harder?", answer: "The tracking health depletion multiplier gradually accelerates the longer you play, forcing you to maintain almost 100% accuracy later on." }
                    ]}
                    relatedTools={[]}
                />
            </div>
        </GameBackground>
    );
}
