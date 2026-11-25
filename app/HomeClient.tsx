"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Target,
    Keyboard,
    Zap,
    Activity,
    Brain,
    Gauge,
    Gamepad2,
    BookOpen,
    Layers,
    Eye,
    Grid3X3,
    Atom,
    Orbit,
    Swords,
    BookOpenCheck,
    Sparkles,
    Crosshair,
    Scale,
    Calculator,
    Clock,
    Crown,
    Sun,
    Route,
    LayoutGrid,
    Compass,
    ArrowUpDown,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ToolIcon } from "@/components/ToolIcon";

interface ToolItem {
    id: string;
    titleFallback: string;
    href: string;
    icon: React.ElementType;
    difficulty: "Easy" | "Medium" | "Hard" | "Expert";
    desc: string;
}

interface ArenaDirectorySection {
    id: string;
    number: string;
    shortLabel: string;
    arenaName: string;
    summary: string;
    tools: ToolItem[];
}

const ARENA_DIRECTORY: ArenaDirectorySection[] = [
    {
        id: "puzzles",
        number: "01",
        shortLabel: "Logic Puzzles",
        arenaName: "Mensa Logic & Word Puzzles",
        summary: "Nine daily logic and word games with 1,200+ uniquely verified levels each, from Warmup to Mensa.",
        tools: [
            { id: "queens", titleFallback: "Queens", href: "/puzzles/queens", icon: Crown, difficulty: "Hard", desc: "Place one queen per row, column, and colored region with zero touching diagonals." },
            { id: "tango", titleFallback: "Tango", href: "/puzzles/tango", icon: Sun, difficulty: "Medium", desc: "Fill every row and column with equal Suns and Moons while obeying = and × clues." },
            { id: "zip", titleFallback: "Zip", href: "/puzzles/zip", icon: Route, difficulty: "Medium", desc: "Draw one unbroken path connecting numbered checkpoints in order and filling every cell." },
            { id: "mini-sudoku", titleFallback: "Mini Sudoku", href: "/puzzles/mini-sudoku", icon: Grid3X3, difficulty: "Medium", desc: "Solve uniquely verified 6×6 Sudoku boards with 2×3 shaded regions and pencil notes." },
            { id: "patches", titleFallback: "Patches", href: "/puzzles/patches", icon: LayoutGrid, difficulty: "Hard", desc: "Partition the grid into exact non-overlapping shapes matching every area clue." },
            { id: "sumbreak", titleFallback: "Sumbreak", href: "/puzzles/sumbreak", icon: Layers, difficulty: "Medium", desc: "Slide and merge identical numbers around stone blockers to hit each level target." },
            { id: "wend", titleFallback: "Wend", href: "/puzzles/wend", icon: Compass, difficulty: "Medium", desc: "Weave through connected letters so every tile in the grid is used exactly once." },
            { id: "pinpoint", titleFallback: "Pinpoint", href: "/puzzles/pinpoint", icon: Target, difficulty: "Hard", desc: "Deduce the shared category behind up to five progressive clue words." },
            { id: "crossclimb", titleFallback: "Crossclimb", href: "/puzzles/crossclimb", icon: ArrowUpDown, difficulty: "Hard", desc: "Solve and order one-letter-different ladder words to unlock top and bottom clues." },
        ],
    },
    {
        id: "classics",
        number: "02",
        shortLabel: "Classics",
        arenaName: "Flagship Classics",
        summary: "Three enduring board and word games built with authentic rules, clean boards, and responsive keyboard controls.",
        tools: [
            { id: "wordle", titleFallback: "Wordle", href: "/classics/wordle", icon: BookOpen, difficulty: "Medium", desc: "Daily and unlimited 5-letter word deduction with strict letter feedback." },
            { id: "tetris", titleFallback: "Classic Tetris", href: "/classics/tetris", icon: LayoutGrid, difficulty: "Medium", desc: "60fps SRS rotation, ghost piece preview, hold slot, and progressive gravity." },
            { id: "chess", titleFallback: "Chess vs AI", href: "/classics/chess", icon: Crown, difficulty: "Hard", desc: "Full-rules 8×8 chess with castling, en passant, promotion, and an Alpha-Beta engine." },
        ],
    },
    {
        id: "reflex",
        number: "03",
        shortLabel: "Reflex",
        arenaName: "Reflex Arena",
        summary: "Simple reaction latency, auditory cues, choice timing, and inhibitory control measured in milliseconds.",
        tools: [
            { id: "reaction", titleFallback: "Reaction Time", href: "/reflex/reaction", icon: Zap, difficulty: "Easy", desc: "Click the exact millisecond the screen changes color." },
            { id: "time-perception", titleFallback: "Time Perception", href: "/reflex/time-perception", icon: Activity, difficulty: "Medium", desc: "Estimate the exact duration of a hidden timer." },
            { id: "go-no-go", titleFallback: "Go / No-Go", href: "/reflex/go-no-go", icon: Target, difficulty: "Medium", desc: "Respond on green Go trials and withhold on red No-Go signals." },
            { id: "flanker", titleFallback: "Flanker Task", href: "/reflex/flanker", icon: ArrowRight, difficulty: "Hard", desc: "Respond to the center arrow while filtering flanking distractors." },
            { id: "choice-reaction", titleFallback: "Choice Reaction", href: "/reflex/choice-reaction", icon: Zap, difficulty: "Medium", desc: "Select the lit option rapidly across multiple choices." },
            { id: "sound", titleFallback: "Sound Reaction", href: "/reflex/sound", icon: Activity, difficulty: "Medium", desc: "React as quickly as possible to a sudden audio tone." },
            { id: "grid", titleFallback: "Grid Shot", href: "/reflex/grid", icon: Grid3X3, difficulty: "Medium", desc: "Clear randomly appearing targets across a clean grid." },
            { id: "peripheral", titleFallback: "Peripheral Vision", href: "/reflex/peripheral", icon: Eye, difficulty: "Hard", desc: "Detect targets outside your direct focal point." },
            { id: "direction", titleFallback: "Directional Reflex", href: "/reflex/direction", icon: ArrowRight, difficulty: "Medium", desc: "Press or swipe the arrow matching the visual prompt." },
            { id: "multi-stimulus", titleFallback: "Multi-Stimulus", href: "/reflex/multi-stimulus", icon: Zap, difficulty: "Expert", desc: "Process overlapping visual cues and select the matching action." },
            { id: "sequence-reaction", titleFallback: "Sequence Reaction", href: "/reflex/sequence-reaction", icon: Activity, difficulty: "Hard", desc: "Click appearing targets in their numbered order." },
            { id: "whack-a-mole", titleFallback: "Target Pop", href: "/reflex/whack-a-mole", icon: Target, difficulty: "Easy", desc: "Tap brief targets before they vanish." },
            { id: "color-switch", titleFallback: "Color Switch", href: "/reflex/color-switch", icon: Brain, difficulty: "Medium", desc: "React immediately when the focus tile shifts hue." },
        ],
    },
    {
        id: "memory",
        number: "04",
        shortLabel: "Memory",
        arenaName: "Memory Arena",
        summary: "Working memory span, sequence recall, Chimp Test, N-Back, and spatial tracking benchmarks.",
        tools: [
            { id: "sequence", titleFallback: "Sequence Memory", href: "/memory/sequence", icon: Zap, difficulty: "Medium", desc: "Memorize and repeat an expanding pattern of lit tiles." },
            { id: "chimp-test", titleFallback: "Chimp Test", href: "/memory/chimp-test", icon: Brain, difficulty: "Hard", desc: "Recall numbered squares in order after they are masked." },
            { id: "verbal-memory", titleFallback: "Verbal Memory", href: "/memory/verbal-memory", icon: BookOpen, difficulty: "Medium", desc: "Decide whether each word is new or already seen." },
            { id: "n-back", titleFallback: "N-Back", href: "/memory/n-back", icon: Layers, difficulty: "Hard", desc: "Match stimuli that appeared N steps earlier in the stream." },
            { id: "object-tracking", titleFallback: "Object Tracking", href: "/memory/object-tracking", icon: Target, difficulty: "Hard", desc: "Track designated moving discs among identical distractors." },
            { id: "number", titleFallback: "Number Memory", href: "/memory/number", icon: Keyboard, difficulty: "Hard", desc: "Hold increasingly long digit strings in short-term memory." },
            { id: "visual", titleFallback: "Visual Memory", href: "/memory/visual", icon: Grid3X3, difficulty: "Medium", desc: "Reconstruct the exact grid positions of flashed tiles." },
            { id: "color", titleFallback: "Color Memory", href: "/memory/color", icon: Activity, difficulty: "Easy", desc: "Reproduce a growing sequence of distinct hues." },
            { id: "shape", titleFallback: "Shape Memory", href: "/memory/shape", icon: Layers, difficulty: "Medium", desc: "Differentiate and recall geometric silhouettes." },
            { id: "symbol", titleFallback: "Symbol Memory", href: "/memory/symbol", icon: Target, difficulty: "Hard", desc: "Recall a progressive chain of abstract symbols." },
            { id: "word-recall", titleFallback: "Word Recall", href: "/memory/word-recall", icon: BookOpen, difficulty: "Hard", desc: "Study a word list and recall as many entries as possible." },
            { id: "card-match", titleFallback: "Card Match", href: "/memory/card-match", icon: Grid3X3, difficulty: "Easy", desc: "Uncover matching pairs in as few turns as possible." },
        ],
    },
    {
        id: "speed",
        number: "05",
        shortLabel: "Speed",
        arenaName: "Speed Arena",
        summary: "Typing WPM, Schulte scanning tables, click velocity, and rapid mental arithmetic.",
        tools: [
            { id: "cps", titleFallback: "Click Speed (CPS)", href: "/speed/click", icon: Activity, difficulty: "Easy", desc: "Measure steady clicks-per-second across fixed time windows." },
            { id: "schulte-table", titleFallback: "Schulte Table", href: "/speed/schulte-table", icon: Grid3X3, difficulty: "Medium", desc: "Scan and tap shuffled numbers in ascending order." },
            { id: "math", titleFallback: "Speed Math", href: "/speed/math", icon: Keyboard, difficulty: "Hard", desc: "Solve rapid arithmetic equations against the clock." },
            { id: "typing", titleFallback: "Typing Speed", href: "/speed/typing", icon: Keyboard, difficulty: "Medium", desc: "Measure clean WPM and accuracy on natural prose." },
            { id: "word", titleFallback: "Word Scramble", href: "/speed/words", icon: BookOpen, difficulty: "Medium", desc: "Unscramble words rapidly without losing accuracy." },
            { id: "grid", titleFallback: "Grid Clear", href: "/speed/grid", icon: Grid3X3, difficulty: "Hard", desc: "Clear all active cells across the board as quickly as possible." },
            { id: "number-rush", titleFallback: "Number Rush", href: "/speed/number-rush", icon: Target, difficulty: "Medium", desc: "Click scattered numbers in strict ascending sequence." },
            { id: "quick-sort", titleFallback: "Quick Sort", href: "/speed/quick-sort", icon: ArrowRight, difficulty: "Medium", desc: "Classify incoming items left or right under time pressure." },
        ],
    },
    {
        id: "accuracy",
        number: "06",
        shortLabel: "Accuracy",
        arenaName: "Accuracy Arena",
        summary: "Fine motor control, visual perception, angle estimation, mental rotation, and exact data entry.",
        tools: [
            { id: "image", titleFallback: "Image Recognition", href: "/accuracy/image-recognition", icon: Eye, difficulty: "Hard", desc: "Spot subtle visual differences and target motifs quickly." },
            { id: "color-blindness", titleFallback: "Color Vision Plates", href: "/accuracy/color-blindness", icon: Eye, difficulty: "Medium", desc: "Identify numerals embedded inside Ishihara-style dot plates." },
            { id: "mental-rotation", titleFallback: "Mental Rotation", href: "/accuracy/mental-rotation", icon: Layers, difficulty: "Hard", desc: "Judge whether rotated 3D figures match or are mirrored." },
            { id: "data", titleFallback: "Data Entry Accuracy", href: "/accuracy/data", icon: Keyboard, difficulty: "Expert", desc: "Transcribe alphanumeric strings cleanly with minimal errors." },
            { id: "pattern-matching", titleFallback: "Pattern Matching", href: "/accuracy/pattern-matching", icon: Grid3X3, difficulty: "Medium", desc: "Identify the exact missing tile completing a visual matrix." },
            { id: "precision-click", titleFallback: "Precision Click", href: "/accuracy/precision-click", icon: Target, difficulty: "Medium", desc: "Strike shrinking micro-targets cleanly without misclicks." },
            { id: "angle-estimation", titleFallback: "Angle Estimation", href: "/accuracy/angle-estimation", icon: Target, difficulty: "Hard", desc: "Estimate visual angles to within a few degrees." },
            { id: "color-match", titleFallback: "RGB Color Match", href: "/accuracy/color-match", icon: Activity, difficulty: "Medium", desc: "Tune color sliders to match a target swatch accurately." },
        ],
    },
    {
        id: "gaming",
        number: "07",
        shortLabel: "Gaming",
        arenaName: "Gaming Arena",
        summary: "Browser warmup drills for crosshair tracking, flick speed, rhythm timing, and interference control.",
        tools: [
            { id: "aim", titleFallback: "Aim Trainer", href: "/gaming/aim", icon: Target, difficulty: "Medium", desc: "Click appearing targets cleanly to warm up mouse control." },
            { id: "rpg", titleFallback: "Directional Parry", href: "/gaming/reaction", icon: Zap, difficulty: "Hard", desc: "Block incoming directional strikes with tight timing." },
            { id: "target-tracking", titleFallback: "Target Tracking", href: "/gaming/target-tracking", icon: Target, difficulty: "Hard", desc: "Keep your cursor locked onto smooth, evasive paths." },
            { id: "endless-dodge", titleFallback: "Endless Dodge", href: "/gaming/endless-dodge", icon: Zap, difficulty: "Expert", desc: "Weave through accelerating obstacle patterns." },
            { id: "stroop-drop", titleFallback: "Stroop Drop", href: "/gaming/stroop-drop", icon: Brain, difficulty: "Hard", desc: "Resolve ink-versus-word interference before tiles fall." },
            { id: "flick-shot", titleFallback: "Flick Shot", href: "/gaming/flick-shot", icon: Target, difficulty: "Medium", desc: "Snap from center anchor to eccentric targets quickly." },
            { id: "rhythm-tap", titleFallback: "Rhythm Tap", href: "/gaming/rhythm-tap", icon: Activity, difficulty: "Hard", desc: "Strike falling markers right on the timing line." },
        ],
    },
    {
        id: "productivity",
        number: "08",
        shortLabel: "Study & Work",
        arenaName: "Student & Work Suite",
        summary: "Everyday browser utilities for math plotting, scientific units, GPA planning, flashcards, and focus sprints.",
        tools: [
            { id: "graphing-calculator", titleFallback: "Graphing Calculator", href: "/productivity/graphing-calculator", icon: Calculator, difficulty: "Easy", desc: "Plot multiple y = f(x) functions with live coordinate tracing." },
            { id: "unit-converter", titleFallback: "Unit & Formula Solver", href: "/productivity/unit-converter", icon: Scale, difficulty: "Easy", desc: "Convert scientific units and compute Kinetic Energy & Ohm's Law." },
            { id: "gpa-calculator", titleFallback: "GPA Calculator", href: "/productivity/gpa-calculator", icon: BookOpenCheck, difficulty: "Easy", desc: "Track semester GPA and calculate required final exam scores." },
            { id: "flashcards", titleFallback: "Spaced Flashcards", href: "/productivity/flashcards", icon: Layers, difficulty: "Easy", desc: "Review Physics, Algorithms, and Bio decks or build your own." },
            { id: "speed-reading", titleFallback: "Speed Reading", href: "/productivity/speed-reading", icon: BookOpen, difficulty: "Medium", desc: "Practice RSVP pacing and check comprehension for effective WPM." },
            { id: "ten-key", titleFallback: "10-Key Numeric Pad", href: "/productivity/ten-key", icon: Calculator, difficulty: "Medium", desc: "Measure numeric KPH across invoices, integers, and SKUs." },
            { id: "focus-sprint", titleFallback: "Focus Sprint", href: "/productivity/focus-sprint", icon: Clock, difficulty: "Easy", desc: "Pair Pomodoro study blocks with pre/post reaction fatigue checks." },
        ],
    },
    {
        id: "stem",
        number: "09",
        shortLabel: "STEM Lab",
        arenaName: "STEM & Physics Lab",
        summary: "Hands-on physics sandboxes for gravity, mirror optics, projectile trajectories, and rotational torque.",
        tools: [
            { id: "gravity-lab", titleFallback: "Gravity & Orbit Lab", href: "/stem/gravity-lab", icon: Orbit, difficulty: "Medium", desc: "Compare free-fall with drag across planets or launch stable orbits." },
            { id: "laser-reflection", titleFallback: "Laser Reflection", href: "/stem/laser-reflection", icon: Sparkles, difficulty: "Medium", desc: "Rotate mirrors to guide beams using the Law of Reflection." },
            { id: "projectile-cannon", titleFallback: "Projectile Motion", href: "/stem/projectile-cannon", icon: Crosshair, difficulty: "Medium", desc: "Dial angle, velocity, and wind to land parabolic trajectories." },
            { id: "torque-balance", titleFallback: "Torque Balance", href: "/stem/torque-balance", icon: Scale, difficulty: "Easy", desc: "Balance masses along a beam using rotational equilibrium." },
        ],
    },
    {
        id: "lab-3d",
        number: "10",
        shortLabel: "3D Lab",
        arenaName: "3D Interactive Lab",
        summary: "Real-time WebGL three-dimensional experiments for orbital mechanics and spatial depth calibration.",
        tools: [
            { id: "solar-gravity-3d", titleFallback: "Solar Gravity 3D", href: "/lab-3d/solar-gravity", icon: Orbit, difficulty: "Medium", desc: "Explore a 3D gravity well and launch custom orbital satellites." },
            { id: "spatial-aim-3d", titleFallback: "Spatial Aim 3D", href: "/lab-3d/spatial-aim", icon: Crosshair, difficulty: "Hard", desc: "Track and strike 3D drone targets across near, mid, and far depth planes." },
        ],
    },
    {
        id: "multiplayer",
        number: "11",
        shortLabel: "2-Player",
        arenaName: "2-Player Battle Arena",
        summary: "Local split-screen matches for two players sharing one keyboard or touchscreen.",
        tools: [
            { id: "reaction-duel-2p", titleFallback: "Reaction Duel 2P", href: "/multiplayer/reaction-duel", icon: Zap, difficulty: "Easy", desc: "Best-of-5 millisecond reflex duel on a single device." },
            { id: "math-tug-of-war", titleFallback: "Math Tug-of-War", href: "/multiplayer/math-tug-of-war", icon: Calculator, difficulty: "Medium", desc: "Out-solve your opponent to pull the rope across the line." },
            { id: "cannon-battle-2p", titleFallback: "Cannon Battle 2P", href: "/multiplayer/cannon-battle", icon: Crosshair, difficulty: "Medium", desc: "Turn-based artillery across mountain ridges, wind, and gravity." },
        ],
    },
];

const FLAGSHIP_PUZZLE_LINKS = [
    { name: "Queens", href: "/puzzles/queens", note: "Region logic" },
    { name: "Tango", href: "/puzzles/tango", note: "Sun & Moon balance" },
    { name: "Zip", href: "/puzzles/zip", note: "Hamiltonian path" },
    { name: "Mini Sudoku", href: "/puzzles/mini-sudoku", note: "6×6 deduction" },
    { name: "Patches", href: "/puzzles/patches", note: "Area partitioning" },
    { name: "Sumbreak", href: "/puzzles/sumbreak", note: "Number merge" },
    { name: "Wend", href: "/puzzles/wend", note: "Letter weave" },
    { name: "Pinpoint", href: "/puzzles/pinpoint", note: "5-clue category" },
    { name: "Crossclimb", href: "/puzzles/crossclimb", note: "Word ladder" },
];

export default function HomeClient() {
    const { t, getLocalizedHref } = useTranslation();
    const [activeArena, setActiveArena] = useState<string>("all");

    const visibleArenas =
        activeArena === "all"
            ? ARENA_DIRECTORY
            : ARENA_DIRECTORY.filter((a) => a.id === activeArena);

    return (
        <div className="bg-[#FAF9F6] min-h-screen text-[#161614]">
            <div className="w-full max-w-7xl mx-auto space-y-20 py-14 px-4 sm:px-6 lg:px-8">
                {/* 1. Editorial Front-Page Lead (Asymmetric 12-Col Feature Spread) */}
                <section aria-labelledby="front-page-editions" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E6E3DB]">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                Featured Collections
                            </p>
                            <h2
                                id="front-page-editions"
                                className="font-serif text-2xl sm:text-3xl font-medium text-[#161614] tracking-tight mt-1"
                            >
                                Daily Puzzles, Classics &amp; Study Tools
                            </h2>
                        </div>
                        <Link
                            href={getLocalizedHref("/tools")}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E40AF] hover:underline underline-offset-4 w-fit"
                        >
                            <span>View full 76-tool catalog</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Primary Lead Feature (7 cols): Mensa Logic & Word Puzzles */}
                        <div className="lg:col-span-7 bg-white border border-[#E6E3DB] rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-4 text-xs text-[#78756C]">
                                    <span className="font-semibold uppercase tracking-[0.12em] text-[#1E40AF]">
                                        Daily Logic Edition
                                    </span>
                                    <span className="font-mono tabular-nums">9 Games · 10,800+ Levels</span>
                                </div>
                                <h3 className="font-serif text-2xl sm:text-[1.75rem] font-medium text-[#161614] leading-snug">
                                    Nine handcrafted logic &amp; word puzzles built for daily focus
                                </h3>
                                <p className="text-sm sm:text-base text-[#57554E] leading-relaxed max-w-2xl">
                                    From Queens and Tango to Zip, Mini Sudoku, and Crossclimb—each puzzle runs 1,200+ deterministic levels with clean boards, conflict checks, and zero sign-up friction.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-l border-[#E6E3DB]">
                                {FLAGSHIP_PUZZLE_LINKS.map((puzzle) => (
                                    <Link
                                        key={puzzle.href}
                                        href={puzzle.href}
                                        className="group border-r border-b border-[#E6E3DB] p-3.5 hover:bg-[#FAF9F6] transition-colors flex items-center gap-2.5"
                                    >
                                        <ToolIcon toolId={puzzle.href} variant="3d" size="sm" title={puzzle.name} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors truncate">
                                                    {puzzle.name}
                                                </span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-[#78756C] group-hover:text-[#1E40AF] shrink-0" aria-hidden="true" />
                                            </div>
                                            <span className="text-xs text-[#78756C] block truncate">{puzzle.note}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <Link
                                    href="/puzzles"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#161614] hover:text-[#1E40AF] transition-colors"
                                >
                                    <span>Enter the Logic Puzzles Hub</span>
                                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>

                        {/* Secondary Stacked Column (5 cols): Classics + Study & Work Suite */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            {/* Flagship Classics */}
                            <div className="bg-white border border-[#E6E3DB] rounded-xl p-6 flex flex-col justify-between gap-5 flex-1">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-xs text-[#78756C]">
                                        <span className="font-semibold uppercase tracking-[0.12em]">
                                            Flagship Classics
                                        </span>
                                        <span className="font-mono">3 Full-Rules Games</span>
                                    </div>
                                    <h3 className="font-serif text-xl font-medium text-[#161614]">
                                        Wordle, Classic Tetris &amp; Chess vs AI
                                    </h3>
                                    <p className="text-sm text-[#57554E] leading-relaxed">
                                        Authentic rules, fast keyboard play, and distraction-free boards—daily Wordle, 60fps SRS Tetris with ghost drop, and 8×8 Chess against an Alpha-Beta engine.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-[#F0EDE6]">
                                    <Link href="/classics/wordle" className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        Wordle
                                    </Link>
                                    <Link href="/classics/tetris" className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        Tetris
                                    </Link>
                                    <Link href="/classics/chess" className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        Chess vs AI
                                    </Link>
                                    <Link href="/classics" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:underline">
                                        <span>All Classics</span>
                                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>

                            {/* Student & Work Utilities */}
                            <div className="bg-white border border-[#E6E3DB] rounded-xl p-6 flex flex-col justify-between gap-5 flex-1">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-xs text-[#78756C]">
                                        <span className="font-semibold uppercase tracking-[0.12em]">
                                            Student &amp; Work Suite
                                        </span>
                                        <span className="font-mono">7 Practical Utilities</span>
                                    </div>
                                    <h3 className="font-serif text-xl font-medium text-[#161614]">
                                        Graphing Calculator, Unit Solver, GPA &amp; Flashcards
                                    </h3>
                                    <p className="text-sm text-[#57554E] leading-relaxed">
                                        Everyday browser instruments for plotting functions, converting physics units, calculating exam grades, and reviewing spaced-repetition decks.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-[#F0EDE6]">
                                    <Link href={getLocalizedHref("/productivity/graphing-calculator")} className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        Graphing
                                    </Link>
                                    <Link href={getLocalizedHref("/productivity/unit-converter")} className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        Units
                                    </Link>
                                    <Link href={getLocalizedHref("/productivity/gpa-calculator")} className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        GPA
                                    </Link>
                                    <Link href={getLocalizedHref("/productivity/flashcards")} className="text-sm font-semibold text-[#161614] hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#1E40AF]">
                                        Flashcards
                                    </Link>
                                    <Link href={getLocalizedHref("/productivity")} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:underline">
                                        <span>Open Suite</span>
                                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Complete Filterable Arena Catalog (All 11 Disciplines) */}
                <section aria-labelledby="arena-catalog-heading" className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E6E3DB]">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                    Complete Directory · 11 Disciplines
                                </p>
                                <h2
                                    id="arena-catalog-heading"
                                    className="font-serif text-2xl sm:text-3xl font-medium text-[#161614] tracking-tight mt-1"
                                >
                                    Every Benchmark, Puzzle &amp; Interactive Lab
                                </h2>
                            </div>
                            <p className="text-sm text-[#57554E] max-w-md">
                                Filter by discipline below or jump directly into any tool. Every page is also accessible anytime from the{" "}
                                <strong className="font-semibold text-[#161614]">All Pages</strong> menu above.
                            </p>
                        </div>

                        {/* Clean Single-Row Architectural Filter Bar */}
                        <div
                            role="tablist"
                            aria-label="Filter arenas"
                            className="flex items-center gap-1.5 overflow-x-auto pb-1"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeArena === "all"}
                                onClick={() => setActiveArena("all")}
                                className={`cursor-pointer min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors touch-manipulation ${
                                    activeArena === "all"
                                        ? "bg-[#161614] text-[#FAF9F6]"
                                        : "bg-white border border-[#E6E3DB] text-[#57554E] hover:text-[#161614] hover:border-[#161614]"
                                }`}
                            >
                                All Arenas
                            </button>
                            {ARENA_DIRECTORY.map((arena) => {
                                const selected = activeArena === arena.id;
                                return (
                                    <button
                                        key={arena.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        onClick={() => setActiveArena(arena.id)}
                                        className={`cursor-pointer min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors touch-manipulation ${
                                            selected
                                                ? "bg-[#161614] text-[#FAF9F6] font-semibold"
                                                : "bg-white border border-[#E6E3DB] text-[#57554E] hover:text-[#161614] hover:border-[#161614]"
                                        }`}
                                    >
                                        <span>{arena.shortLabel}</span>
                                        <span
                                            className={`ml-1 font-mono text-[11px] tabular-nums ${
                                                selected ? "text-[#FAF9F6]/70" : "text-[#78756C]"
                                            }`}
                                        >
                                            {arena.tools.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ruled Editorial Arena Sections */}
                    <div className="space-y-14">
                        {visibleArenas.map((category, arenaIdx) => (
                            <div
                                key={category.id}
                                className={arenaIdx > 0 ? "space-y-5 cv-auto" : "space-y-5"}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#D8D4C9]">
                                    <div className="flex items-start gap-3.5">
                                        <ToolIcon
                                            toolId={category.id}
                                            variant="3d-pedestal"
                                            size="sm"
                                            title={t(`categories.${category.id}.title`, category.arenaName)}
                                            className="mt-0.5"
                                        />
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-medium text-[#78756C] tabular-nums">
                                                    {category.number}
                                                </span>
                                                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#161614] tracking-tight">
                                                    {t(`categories.${category.id}.title`, category.arenaName)}
                                                </h3>
                                                <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                                    ({category.tools.length})
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#57554E] max-w-2xl">
                                                {category.summary}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={getLocalizedHref(`/${category.id}`)}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#161614] hover:text-[#1E40AF] transition-colors shrink-0 w-fit"
                                    >
                                        <span>{t("home.enterArena", "Open arena")}</span>
                                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                    </Link>
                                </div>

                                {/* Hairline-Divided Catalog Grid (Zero Rainbow Boxes) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-[#E6E3DB] bg-white">
                                    {category.tools.map((tool) => {
                                        return (
                                            <Link
                                                key={tool.href}
                                                href={getLocalizedHref(tool.href)}
                                                prefetch={false}
                                                className="group border-r border-b border-[#E6E3DB] p-5 hover:bg-[#FAF9F6] transition-colors flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <ToolIcon
                                                            toolId={tool.href}
                                                            variant="3d"
                                                            size="md"
                                                            title={t(`tools.${tool.id}.title`, tool.titleFallback)}
                                                        />
                                                        <span className="text-[11px] font-mono text-[#78756C]">
                                                            {t(`common.${tool.difficulty.toLowerCase()}`, tool.difficulty)}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-[15px] font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors mb-1">
                                                            {t(`tools.${tool.id}.title`, tool.titleFallback)}
                                                        </h4>
                                                        <p className="text-xs sm:text-[13px] text-[#57554E] line-clamp-2 leading-relaxed">
                                                            {t(`tools.${tool.id}.desc`, tool.desc)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs font-medium text-[#78756C] group-hover:text-[#1E40AF] transition-colors pt-1">
                                                    <span>Open</span>
                                                    <ArrowUpRight
                                                        className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Cognitive Lab Journal (Asymmetric 2-Col Editorial Reading Band) */}
                <section
                    aria-labelledby="journal-heading"
                    className="cv-auto border-t border-[#D8D4C9] pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10"
                >
                    <div className="lg:col-span-4 space-y-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                            {t("homeContent.journalBadge", "Cognitive Lab Journal")}
                        </p>
                        <h2
                            id="journal-heading"
                            className="font-serif text-2xl sm:text-3xl font-medium text-[#161614] tracking-tight leading-snug"
                        >
                            {t("homeContent.journalTitle", "Measure first. Practice short. Read the method.")}
                        </h2>
                        <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                            {t(
                                "homeContent.journalDesc",
                                "Scores are reported plainly—milliseconds, spans, words per minute, and accuracy—never clinical diagnoses or fabricated percentiles. Start with a baseline, practice in focused 10–15 minute blocks, and inspect the methodology whenever you want the context behind a number."
                            )}
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 border-t border-[#E6E3DB]">
                        {[
                            {
                                href: "/blog/how-we-score-reflextry-tests",
                                title: t("homeContent.scoreGuideTitle", "How we score tests"),
                                desc: t("homeContent.scoreGuideDesc", "What milliseconds, spans, and accuracy mean—and what we refuse to claim."),
                            },
                            {
                                href: "/blog/what-is-a-good-reaction-time",
                                title: t("homeContent.reactionTimeGuideTitle", "What is a good reaction time?"),
                                desc: t("homeContent.reactionTimeGuideDesc", "Realistic ranges, hardware noise, and how to read your own scores."),
                            },
                            {
                                href: "/blog/choice-reaction-vs-simple-reaction",
                                title: t("homeContent.choiceReactionGuideTitle", "Choice vs simple reaction"),
                                desc: t("homeContent.choiceReactionGuideDesc", "Why more options slow you down, and how to train each separately."),
                            },
                            {
                                href: "/about",
                                title: t("homeContent.aboutTheLab", "About the lab"),
                                desc: t("homeContent.aboutTheLabDesc", "Who builds Reflextry, our methodology, and how to contact us."),
                            },
                            {
                                href: "/blog",
                                title: t("homeContent.allGuides", "All research guides"),
                                desc: t("homeContent.allGuidesDesc", "Memory, reflex, speed, and accuracy articles from the journal."),
                            },
                            {
                                href: "/faq",
                                title: t("homeContent.faqCardTitle", "Frequently asked questions"),
                                desc: t("homeContent.faqCardDesc", "Training frequency, privacy, scoring, and common product questions."),
                            },
                        ].map((item, idx) => (
                            <Link
                                key={item.href}
                                href={getLocalizedHref(item.href)}
                                prefetch={false}
                                className={`group py-5 border-b border-[#E6E3DB] flex flex-col justify-between gap-2 transition-colors hover:bg-white/60 ${
                                    idx % 2 === 0 ? "sm:pr-6" : "sm:pl-6 sm:border-l"
                                }`}
                            >
                                <div>
                                    <h3 className="text-base font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[#57554E] leading-relaxed">{item.desc}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] pt-1">
                                    <span>Read note</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
