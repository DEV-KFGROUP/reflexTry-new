"use client"

import * as React from "react"
import { useGameEngine, GameState } from "@/lib/gaming/engine"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/progress"
import { Play, RotateCcw, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface BaseTestProps {
    title: string;
    description: string;
    instructions: string[];
    testId: string;
    children: React.ReactNode;
    config?: {
        duration?: number;
        mode?: 'standard' | 'zen' | 'challenge';
        thumbnail?: string;
    };
}

export function BaseTest({
    title,
    description,
    instructions,
    config,
    children
}: BaseTestProps) {
    const engine = useGameEngine();
    const startTimeRef = React.useRef<number>(0);
    const requestRef = React.useRef<number>(0);

    // Timer Loop
    const animate = (time: number) => {
        if (engine.gameState === 'PLAYING') {
            const elapsed = time - startTimeRef.current;
            engine.updateTime(elapsed);
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    React.useEffect(() => {
        if (engine.gameState === 'PLAYING') {
            startTimeRef.current = performance.now() - engine.stats.timeElapsed;
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [engine.gameState]);

    // Clean up on unmount
    React.useEffect(() => {
        return () => engine.resetGame();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            {/* Header / HUD */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="font-bold text-xl">{title}</h2>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Score: <span className="text-primary font-mono font-bold">{engine.stats.score}</span></span>
                        <span>Accuracy: <span className="text-primary font-mono font-bold">{Math.round(engine.stats.accuracy)}%</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold tabular-nums">
                            {((engine.stats.timeElapsed) / 1000).toFixed(1)}s
                        </div>
                        {config?.duration && (
                            <Progress value={(engine.stats.timeElapsed / config.duration) * 100} className="w-24 h-2 mt-1" />
                        )}
                    </div>

                    {engine.gameState === 'PLAYING' ? (
                        <Button variant="outline" size="sm" onClick={engine.pauseGame} className="w-10 px-0">
                            <Pause className="h-4 w-4" />
                        </Button>
                    ) : engine.gameState === 'PAUSED' ? (
                        <Button variant="primary" size="sm" onClick={engine.resumeGame} className="w-10 px-0">
                            <Play className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" onClick={engine.resetGame} className="w-10 px-0">
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Game Area */}
            <div className="relative aspect-video bg-secondary/20 rounded-xl overflow-hidden border border-border/50">

                {/* Start Screen */}
                {engine.gameState === 'IDLE' && (
                    <div className="absolute inset-0 bg-background/95 z-20 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                        <h3 className="text-3xl font-bold mb-4">Ready to Start?</h3>
                        <p className="text-muted-foreground mb-8 max-w-md">{description}</p>
                        <div className="space-y-2 mb-8 text-left bg-secondary/50 p-4 rounded-lg">
                            <p className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">Instructions:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {instructions.map((inst, i) => (
                                    <li key={i}>{inst}</li>
                                ))}
                            </ul>
                        </div>
                        <Button size="lg" className="w-48 text-lg" onClick={() => engine.startGame(config)}>
                            Start Test
                        </Button>
                    </div>
                )}

                {/* Game Over Screen */}
                {engine.gameState === 'COMPLETED' && (
                    <div className="absolute inset-0 bg-background/95 z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 backdrop-blur-sm">
                        <h3 className="text-4xl font-bold mb-2 text-primary">Test Complete!</h3>
                        <div className="grid grid-cols-2 gap-8 my-8 w-full max-w-md">
                            <div className="bg-card p-4 rounded-lg border">
                                <p className="text-muted-foreground text-sm uppercase">Final Score</p>
                                <p className="text-4xl font-bold">{engine.stats.score}</p>
                            </div>
                            <div className="bg-card p-4 rounded-lg border">
                                <p className="text-muted-foreground text-sm uppercase">Accuracy</p>
                                <p className="text-4xl font-bold">{Math.round(engine.stats.accuracy)}%</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" size="lg" onClick={engine.resetGame}>Try Again</Button>
                            <Button size="lg">Save Score</Button>
                        </div>
                    </div>
                )}

                {/* Game Content */}
                <div className={cn(
                    "w-full h-full p-4 transition-opacity duration-200",
                    engine.gameState !== 'PLAYING' && engine.gameState !== 'PAUSED' ? "opacity-20 pointer-events-none" : "opacity-100"
                )}>
                    {children}
                </div>

            </div>
        </div>
    )
}
