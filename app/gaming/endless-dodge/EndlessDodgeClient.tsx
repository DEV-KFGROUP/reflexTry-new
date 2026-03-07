"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameEngine } from "@/lib/gaming/engine";
import { SoundManager } from "@/utils/soundManager";
import { Button } from "@/components/ui/Button";
import { GameBackground } from "@/components/GameBackground";
import { Play, RotateCcw, Trophy, ShieldAlert } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";

interface Projectile {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

export default function EndlessDodgeClient() {
    const engine = useGameEngine();
    const isPlaying = engine.gameState === 'PLAYING';
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    // Player State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cursorSize = 20;

    // Game State
    const projectilesRef = useRef<Projectile[]>([]);
    const [renderProjectiles, setRenderProjectiles] = useState<Projectile[]>([]);
    const difficultyMultiplierRef = useRef<number>(1);
    const nextSpawnTimeRef = useRef<number>(0);
    const projectileIdRef = useRef<number>(0);

    const checkCollision = useCallback((px: number, py: number) => {
        if (!containerRef.current) return false;

        // Offset mouse pos to container coordinates if needed. 
        // We will assume mousePos is already relative to the container.
        const hitRadius = cursorSize / 2;

        for (const p of projectilesRef.current) {
            const dx = px - p.x;
            const dy = py - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < hitRadius + (p.size / 2)) {
                return true;
            }
        }
        return false;
    }, [cursorSize]);

    const spawnProjectile = (width: number, height: number, currentTime: number) => {
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x = 0, y = 0, vx = 0, vy = 0;

        // Speed increases with multiplier
        const baseSpeed = 150 + (Math.random() * 100);
        const speed = baseSpeed * difficultyMultiplierRef.current;
        const size = 10 + (Math.random() * 20); // 10px to 30px

        switch (side) {
            case 0: // top
                x = Math.random() * width;
                y = -size;
                vx = (Math.random() - 0.5) * speed;
                vy = speed;
                break;
            case 1: // right
                x = width + size;
                y = Math.random() * height;
                vx = -speed;
                vy = (Math.random() - 0.5) * speed;
                break;
            case 2: // bottom
                x = Math.random() * width;
                y = height + size;
                vx = (Math.random() - 0.5) * speed;
                vy = -speed;
                break;
            case 3: // left
                x = -size;
                y = Math.random() * height;
                vx = speed;
                vy = (Math.random() - 0.5) * speed;
                break;
        }

        projectilesRef.current.push({
            id: projectileIdRef.current++,
            x, y, vx, vy, size
        });
    };

    const gameOver = () => {
        SoundManager.play("miss");
        engine.endGame();
    };

    const updateLoop = useCallback((time: number) => {
        if (engine.gameState !== 'PLAYING') return;

        if (!startTimeRef.current) {
            startTimeRef.current = time;
            lastTimeRef.current = time;
        }

        const deltaTimeMillis = time - lastTimeRef.current;
        const deltaTime = deltaTimeMillis / 1000; // seconds
        lastTimeRef.current = time;
        const elapsed = time - startTimeRef.current;

        // Update score (time survived)
        engine.updateTime(elapsed);
        const newScore = Math.floor(elapsed / 10); // 1 point per 10ms
        if (newScore > engine.stats.score) {
            // Can't set score directly in loop easily without causing re-renders if we use setState on engine,
            // but engine.addScore adds relative. Let's just update standard.
            // Since we need exact match, we do nothing and let time be the score at the end, 
            // or we dispatch an engine update. For simplicity, we'll keep score as time.
        }

        if (!containerRef.current) return;
        const { width, height } = containerRef.current.getBoundingClientRect();

        // Spawn logic
        if (time > nextSpawnTimeRef.current) {
            spawnProjectile(width, height, time);
            // Decrease time between spawns as difficulty goes up
            const spawnInterval = Math.max(100, 1000 / difficultyMultiplierRef.current);
            nextSpawnTimeRef.current = time + spawnInterval;
        }

        // Difficulty increases every 5 seconds
        difficultyMultiplierRef.current = 1 + (elapsed / 5000);

        // Move projectiles
        projectilesRef.current.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
        });

        // Remove off-screen
        projectilesRef.current = projectilesRef.current.filter(
            p => p.x > -100 && p.x < width + 100 && p.y > -100 && p.y < height + 100
        );

        // Render pass
        setRenderProjectiles([...projectilesRef.current]);

        // Collision Check
        if (checkCollision(mousePos.x, mousePos.y)) {
            gameOver();
            return;
        }

        requestRef.current = requestAnimationFrame(updateLoop);
    }, [engine, mousePos, checkCollision]);

    // Handle Animation Loop Binding
    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(updateLoop);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, updateLoop]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const startGame = () => {
        projectilesRef.current = [];
        setRenderProjectiles([]);
        difficultyMultiplierRef.current = 1;
        projectileIdRef.current = 0;
        nextSpawnTimeRef.current = performance.now();
        startTimeRef.current = 0;
        lastTimeRef.current = 0;
        engine.startGame({ duration: 0, mode: 'zen' }); // 0 duration means infinite
    };

    return (
        <GameBackground variant="reflex" showParticles={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-400 via-white to-red-400 bg-clip-text text-transparent">
                            Endless Dodge
                        </h1>
                        <p className="text-xl text-red-400/80 font-medium tracking-wide mt-2 uppercase">Pure Reaction Survival</p>
                    </div>

                    <div className="flex justify-center gap-6 mt-8">
                        <div className="text-center p-4 glass rounded-xl border-red-500/30 min-w-[200px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Survival Time</div>
                            <div className="text-4xl font-mono relative font-bold text-white">
                                {isPlaying
                                    ? (engine.stats.timeElapsed / 1000).toFixed(2)
                                    : (engine.stats.timeElapsed / 1000).toFixed(2)
                                }s
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        className={`w-full aspect-video relative rounded-[2rem] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl bg-black/60 ${isPlaying ? 'cursor-none' : ''}`}
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
                                    <ShieldAlert className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
                                    <h2 className="text-3xl font-bold text-white mb-4">Evade Everything</h2>
                                    <p className="text-gray-400 mb-8 max-w-sm text-center">Move your mouse inside the box to dodge the red projectiles. Survive as long as you can.</p>
                                    <Button onClick={startGame} className="bg-red-500 hover:bg-red-600 text-white text-xl px-12 py-8 rounded-2xl">
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START SURVIVAL
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
                                    <div className="text-4xl font-bold text-white mb-2">YOU DIED</div>
                                    <div className="my-8 text-center text-gray-300 text-lg">
                                        You survived for <span className="font-mono text-3xl font-bold text-red-400 mx-2">{(engine.stats.timeElapsed / 1000).toFixed(2)}</span> seconds.
                                    </div>
                                    <Button onClick={startGame} className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-6 rounded-xl">
                                        <RotateCcw className="w-5 h-5 mr-2" />
                                        TRY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Rendering Projectiles */}
                        {isPlaying && renderProjectiles.map(p => (
                            <div
                                key={p.id}
                                className="absolute bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                                style={{
                                    left: p.x - p.size / 2,
                                    top: p.y - p.size / 2,
                                    width: p.size,
                                    height: p.size
                                }}
                            />
                        ))}

                        {/* Render Player Cursor */}
                        {isPlaying && (
                            <div
                                className="absolute pointer-events-none rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] border border-white"
                                style={{
                                    left: mousePos.x - cursorSize / 2,
                                    top: mousePos.y - cursorSize / 2,
                                    width: cursorSize,
                                    height: cursorSize,
                                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))'
                                }}
                            />
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Endless Dodge"
                    description="Test your pure reactive dodging skills. Survive the infinite barrage."
                    howToUse={[
                        { title: "Hover inside the game box and click Start." },
                        { title: "Your cursor turns into a white dot." },
                        { title: "Avoid all incoming red projectiles." },
                        { title: "The game continues forever until you are hit." }
                    ]}
                    howToImprove={[
                        { title: "Eye Positioning", description: "Keep your eyes focused near the center frame to spot movement from all edges." },
                        { title: "Micro-Adjustments", description: "Make minimal safe movements rather than sweeping strokes." },
                        { title: "Refresh Rate", description: "High refresh rate monitors give a competitive edge here." }
                    ]}
                    howToPlay={[
                        "Move the mouse to drift the white dot.",
                        "Dodge red projectiles.",
                        "Score is based on time survived."
                    ]}
                    benefits={[
                        "Enhances subconscious reflex tracking.",
                        "Trains peripheral vision.",
                        "Increases motor control precision in high-stress."
                    ]}
                    faqs={[
                        { question: "Is there a level cap?", answer: "No, the projectiles will keep spawning faster and faster until it is physically impossible." }
                    ]}
                    relatedTools={[]}
                />
            </div>
        </GameBackground>
    );
}
