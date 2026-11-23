"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Keyboard,
  Zap,
  Activity,
  MousePointer2,
  Calculator,
  Type,
  Grid3X3,
  Volume2,
  Eye,
  Move,
  Brain,
  Hash,
  Palette,
  LayoutGrid,
  Search,
  X,
  Layers,
  Gamepad2,
  Atom,
  Orbit,
  Swords,
  BookOpenCheck,
  Sparkles,
  Crosshair,
  Scale,
  BookOpen,
  Clock,
  Crown,
  Sun,
  Route,
  Compass,
  ArrowUpDown,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ToolIcon, type ToolIconVariant } from "@/components/ToolIcon";

interface ToolItem {
  id: string;
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface CategoryConfig {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  hoverBorder: string;
  tools: ToolItem[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: "puzzles",
    label: "Mensa Logic & Word Puzzles",
    shortLabel: "Logic Puzzles",
    icon: Crown,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    hoverBorder: "hover:border-indigo-300",
    tools: [
      { id: "queens", href: "/puzzles/queens", icon: Crown, title: "Queens (1,200+ Levels)", desc: "Place one queen per row, column, and colored region with zero touching diagonals." },
      { id: "tango", href: "/puzzles/tango", icon: Sun, title: "Tango (1,200+ Levels)", desc: "Balance equal Suns and Moons per row and column with no three adjacent." },
      { id: "zip", href: "/puzzles/zip", icon: Route, title: "Zip Path (1,200+ Levels)", desc: "Draw a single unbroken path through numbered checkpoints filling every cell." },
      { id: "mini-sudoku", href: "/puzzles/mini-sudoku", icon: Grid3X3, title: "Mini Sudoku 6×6 (1,200+)", desc: "Fill each row, column, and shaded 2×3 region with digits 1–6 once." },
      { id: "patches", href: "/puzzles/patches", icon: LayoutGrid, title: "Patches Shikaku (1,200+)", desc: "Partition the grid into non-overlapping rectangles matching every area clue." },
      { id: "sumbreak", href: "/puzzles/sumbreak", icon: Layers, title: "Sumbreak Merge (1,200+)", desc: "Slide and merge identical numbers around stone blockers to shatter level targets." },
      { id: "wend", href: "/puzzles/wend", icon: Compass, title: "Wend Word Weave (1,200+)", desc: "Connect adjacent letters into themed words so every tile is used once." },
      { id: "pinpoint", href: "/puzzles/pinpoint", icon: Target, title: "Pinpoint Clues (1,200+)", desc: "Guess the shared category behind up to five clue words in minimal reveals." },
      { id: "crossclimb", href: "/puzzles/crossclimb", icon: ArrowUpDown, title: "Crossclimb Ladder (1,200+)", desc: "Order 1-letter-different trivia ladder words to unlock top and bottom clues." },
    ],
  },
  {
    id: "reflex",
    label: "Reflex Arena",
    shortLabel: "Reflex",
    icon: Zap,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-300",
    tools: [
      { id: "reaction", href: "/reflex/reaction", icon: Zap, title: "Reaction Time", desc: "Test visual reflex triggers and physical click response speeds." },
      { id: "time-perception", href: "/reflex/time-perception", icon: Activity, title: "Time Perception", desc: "Estimate target durations using only your internal clock." },
      { id: "go-no-go", href: "/reflex/go-no-go", icon: Target, title: "Go / No-Go", desc: "Press on green Go trials; withhold responses on red No-Go." },
      { id: "flanker", href: "/reflex/flanker", icon: Move, title: "Flanker Task", desc: "Respond to the center arrow while ignoring flanking distractors." },
      { id: "choice-reaction", href: "/reflex/choice-reaction", icon: LayoutGrid, title: "Choice Reaction", desc: "Click the lit colored box as fast as possible across choices." },
      { id: "sound", href: "/reflex/sound", icon: Volume2, title: "Sound Reaction", desc: "Measure auditory reflex triggers using sound cues." },
      { id: "grid", href: "/reflex/grid", icon: Grid3X3, title: "Grid Click", desc: "Click transient squares scattered in a rapid-fire matrix." },
      { id: "peripheral", href: "/reflex/peripheral", icon: Eye, title: "Peripheral Vision", desc: "React to visual shapes spawning on far screen edges." },
      { id: "direction", href: "/reflex/direction", icon: Move, title: "Direction Match", desc: "Calibrate choice reactions using arrow directional indicators." },
      { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Activity, title: "Multi Stimulus", desc: "Inhibitory test reacting only to target shapes, ignoring decoys." },
      { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Zap, title: "Sequence Reaction", desc: "Click sequence points in rapid succession." },
      { id: "whack-a-mole", href: "/reflex/whack-a-mole", icon: Target, title: "Whack-a-Mole", desc: "Test hand-eye latency by striking moles before they drop." },
      { id: "color-switch", href: "/reflex/color-switch", icon: Brain, title: "Color Switch", desc: "Identify ink colors of words while ignoring literal text." },
    ],
  },
  {
    id: "memory",
    label: "Memory Arena",
    shortLabel: "Memory",
    icon: Brain,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    hoverBorder: "hover:border-violet-300",
    tools: [
      { id: "chimp-test", href: "/memory/chimp-test", icon: Brain, title: "Chimp Test", desc: "Recall number positions after they vanish — classic working memory challenge." },
      { id: "verbal-memory", href: "/memory/verbal-memory", icon: Type, title: "Verbal Memory", desc: "Identify seen vs new words to measure linguistic retention." },
      { id: "n-back", href: "/memory/n-back", icon: Layers, title: "N-Back", desc: "Match letters that appeared N steps earlier in a continuous stream." },
      { id: "object-tracking", href: "/memory/object-tracking", icon: Eye, title: "Object Tracking", desc: "Track multiple moving targets among distractors." },
      { id: "sequence", href: "/memory/sequence", icon: Zap, title: "Sequence Memory", desc: "Memorize and repeat an increasingly complex flashing button pattern." },
      { id: "number", href: "/memory/number", icon: Hash, title: "Number Memory", desc: "Test working retention limits with incremental digit sequences." },
      { id: "visual", href: "/memory/visual", icon: Grid3X3, title: "Visual Memory", desc: "Retain spatial layouts of highlighted matrix grids." },
      { id: "color", href: "/memory/color", icon: Palette, title: "Color Match", desc: "Determine semantic congruence against ink colors under time constraints." },
      { id: "shape", href: "/memory/shape", icon: Target, title: "Shape Memory", desc: "Identify shapes and position mappings within grid layouts." },
      { id: "symbol", href: "/memory/symbol", icon: Eye, title: "Symbol Memory", desc: "Recall and select complex symbolic configurations." },
      { id: "word-recall", href: "/memory/word-recall", icon: Type, title: "Word Recall", desc: "Test linguistic retention by recalling lists of common nouns." },
      { id: "card-match", href: "/memory/card-match", icon: Activity, title: "Card Match", desc: "Classic pairs board match, testing spatial object recall." },
    ],
  },
  {
    id: "speed",
    label: "Speed Arena",
    shortLabel: "Speed",
    icon: Keyboard,
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    hoverBorder: "hover:border-cyan-300",
    tools: [
      { id: "cps", href: "/speed/click", icon: MousePointer2, title: "Click Speed", desc: "Calibrate your clicks-per-second (CPS) efficiency limits." },
      { id: "schulte-table", href: "/speed/schulte-table", icon: Grid3X3, title: "Schulte Table", desc: "Click shuffled numbers in order to train visual scanning speed." },
      { id: "math", href: "/speed/math", icon: Calculator, title: "Math Speed", desc: "Solve modular arithmetic challenges before your time buffer expires." },
      { id: "typing", href: "/speed/typing", icon: Keyboard, title: "Typing Test", desc: "Test words-per-minute (WPM) speed on real paragraphs." },
      { id: "word", href: "/speed/words", icon: Type, title: "Word Typing", desc: "Type prompted words quickly and accurately." },
      { id: "grid", href: "/speed/grid", icon: Grid3X3, title: "Grid Speed", desc: "Locate and click matrix targets as fast as possible." },
      { id: "number-rush", href: "/speed/number-rush", icon: Hash, title: "Number Rush", desc: "Visual scanning test to locate numbers in sequential order." },
      { id: "quick-sort", href: "/speed/quick-sort", icon: ArrowRight, title: "Quick Sort", desc: "Categorize falling items under high speed before they overflow." },
    ],
  },
  {
    id: "gaming",
    label: "Gaming Arena",
    shortLabel: "Gaming",
    icon: Gamepad2,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    hoverBorder: "hover:border-rose-300",
    tools: [
      { id: "aim", href: "/gaming/aim", icon: Target, title: "Aim Trainer", desc: "Test micro-flicks and visual scan timing on target points." },
      { id: "rpg", href: "/gaming/reaction", icon: Zap, title: "RPG Reaction", desc: "Block attacks from directions with dedicated combat buttons." },
      { id: "target-tracking", href: "/gaming/target-tracking", icon: Target, title: "Target Tracking", desc: "Test smooth tracking aiming stability on evasive elements." },
      { id: "endless-dodge", href: "/gaming/endless-dodge", icon: Zap, title: "Endless Dodge", desc: "Survive homing projectiles and expanding pulse bombs." },
      { id: "stroop-drop", href: "/gaming/stroop-drop", icon: Brain, title: "Stroop Drop", desc: "Click ink colors of falling words under interference." },
      { id: "flick-shot", href: "/gaming/flick-shot", icon: Target, title: "Flick Shot", desc: "Snap-shoot tiny targets while avoiding decoy bombs." },
      { id: "rhythm-tap", href: "/gaming/rhythm-tap", icon: Activity, title: "Rhythm Tap", desc: "Hit falling calibration bars across rhythm lanes." },
    ],
  },
  {
    id: "accuracy",
    label: "Accuracy Arena",
    shortLabel: "Accuracy",
    icon: Target,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-300",
    tools: [
      { id: "image", href: "/accuracy/image-recognition", icon: Eye, title: "Image Recognition", desc: "Identify distorted visuals under blurs and rotations." },
      { id: "data", href: "/accuracy/data", icon: Keyboard, title: "Data Entry", desc: "Type complex code blocks and alphanumeric strings accurately." },
      { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Brain, title: "Pattern Matching", desc: "Recall spatial symbols among highly similar distractors." },
      { id: "precision-click", href: "/accuracy/precision-click", icon: MousePointer2, title: "Precision Click", desc: "Click tiny jittering targets that drift across the field." },
      { id: "angle-estimation", href: "/accuracy/angle-estimation", icon: Calculator, title: "Angle Estimation", desc: "Estimate relative angles under tilted baseline setups." },
      { id: "color-match", href: "/accuracy/color-match", icon: Activity, title: "Color Match", desc: "Match target colors from memory after they fade." },
      { id: "color-blindness", href: "/accuracy/color-blindness", icon: Eye, title: "Color Vision", desc: "Practice identifying numbers in generated color-dot patterns." },
      { id: "mental-rotation", href: "/accuracy/mental-rotation", icon: Brain, title: "Mental Rotation", desc: "Compare rotated shapes and spot mirrored objects." },
    ],
  },
  {
    id: "stem",
    label: "STEM & Physics Lab",
    shortLabel: "STEM Lab",
    icon: Atom,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    hoverBorder: "hover:border-indigo-300",
    tools: [
      { id: "gravity-lab", href: "/stem/gravity-lab", icon: Orbit, title: "Gravity & Orbit Lab", desc: "Compare free-fall across planets with air drag or launch stable orbits." },
      { id: "laser-reflection", href: "/stem/laser-reflection", icon: Sparkles, title: "Laser Reflection Optics", desc: "Rotate mirrors to bounce lasers into sensors and verify θi = θr." },
      { id: "projectile-cannon", href: "/stem/projectile-cannon", icon: Crosshair, title: "Projectile Cannon Physics", desc: "Adjust angle, velocity, gravity, and wind to hit parabolic targets." },
      { id: "torque-balance", href: "/stem/torque-balance", icon: Scale, title: "Seesaw Torque Balance", desc: "Place weights along a lever arm to master rotational equilibrium." },
    ],
  },
  {
    id: "lab-3d",
    label: "3D Interactive Lab",
    shortLabel: "3D Lab",
    icon: Orbit,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    hoverBorder: "hover:border-sky-300",
    tools: [
      { id: "solar-gravity-3d", href: "/lab-3d/solar-gravity", icon: Orbit, title: "3D Solar Gravity Simulator", desc: "Explore a live 3D spacetime gravity well and launch orbital satellites." },
      { id: "spatial-aim-3d", href: "/lab-3d/spatial-aim", icon: Crosshair, title: "3D Spatial Aim Arena", desc: "Strike composite 3D drone targets across near, mid, and far depth planes." },
    ],
  },
  {
    id: "multiplayer",
    label: "2-Player Battle Arena",
    shortLabel: "2-Player",
    icon: Swords,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    hoverBorder: "hover:border-orange-300",
    tools: [
      { id: "reaction-duel-2p", href: "/multiplayer/reaction-duel", icon: Zap, title: "2-Player Reaction Duel", desc: "Best-of-5 millisecond reflex battle on one keyboard or touchscreen." },
      { id: "math-tug-of-war", href: "/multiplayer/math-tug-of-war", icon: Calculator, title: "Math Tug-of-War", desc: "Solve rapid arithmetic faster than your rival to pull the rope across." },
      { id: "cannon-battle-2p", href: "/multiplayer/cannon-battle", icon: Crosshair, title: "Gravity Cannon Battle", desc: "Turn-based 2D artillery across mountain terrain, wind, and gravity." },
    ],
  },
  {
    id: "productivity",
    label: "Student & Work Suite",
    shortLabel: "Study & Work",
    icon: BookOpenCheck,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    hoverBorder: "hover:border-teal-300",
    tools: [
      { id: "graphing-calculator", href: "/productivity/graphing-calculator", icon: Calculator, title: "Graphing & Scientific Calculator", desc: "Plot multiple y = f(x) curves with cursor inspection and scientific keypad." },
      { id: "unit-converter", href: "/productivity/unit-converter", icon: Scale, title: "Unit Converter & Formula Solver", desc: "Convert 7 scientific unit categories plus Kinetic Energy & Ohm's Law solvers." },
      { id: "gpa-calculator", href: "/productivity/gpa-calculator", icon: BookOpenCheck, title: "GPA & Final Exam Calculator", desc: "Calculate 4.0 semester/cumulative GPA and required final exam percentages." },
      { id: "flashcards", href: "/productivity/flashcards", icon: Layers, title: "Study Flashcards Studio", desc: "Review Physics, CS, and Bio decks or build custom spaced-repetition cards." },
      { id: "speed-reading", href: "/productivity/speed-reading", icon: BookOpen, title: "Speed Reading & Comprehension", desc: "Train reading pace with RSVP or highlight pacing plus comprehension quiz." },
      { id: "ten-key", href: "/productivity/ten-key", icon: Calculator, title: "10-Key Numpad Speed Test", desc: "Benchmark numeric entry KPH across invoices, integers, and SKUs." },
      { id: "focus-sprint", href: "/productivity/focus-sprint", icon: Clock, title: "Focus Sprint & Fatigue Tracker", desc: "Pair Pomodoro deep-work sprints with pre/post reaction fatigue checks." },
    ],
  },
  {
    id: "classics",
    label: "Flagship Classics",
    shortLabel: "Classics",
    icon: Gamepad2,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-300",
    tools: [
      { id: "wordle", href: "/classics/wordle", icon: Type, title: "Wordle (Daily & Unlimited)", desc: "Authentic 6-try, 5-letter word puzzle with streak stats and emoji sharing." },
      { id: "tetris", href: "/classics/tetris", icon: Grid3X3, title: "Classic Tetris", desc: "60fps falling blocks with SRS wall kicks, ghost landing preview, and Hold slot." },
      { id: "chess", href: "/classics/chess", icon: Target, title: "Chess vs AI & 2-Player", desc: "Full-rules 8×8 chess with castling, en passant, undo, and Alpha-Beta AI." },
    ],
  },
];

const TOTAL_TOOL_COUNT = CATEGORIES.reduce((sum, cat) => sum + cat.tools.length, 0);

export default function AllToolsClient() {
  const { t, getLocalizedHref } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [iconVariant, setIconVariant] = useState<ToolIconVariant>("3d");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return CATEGORIES.filter((cat) => activeCategory === "all" || cat.id === activeCategory)
      .map((cat) => {
        if (!query) return cat;
        const matchedTools = cat.tools.filter((tool) => {
          const localizedTitle = t(`tools.${tool.id}.title`, tool.title).toLowerCase();
          const localizedDesc = t(`tools.${tool.id}.desc`, tool.desc).toLowerCase();
          return (
            localizedTitle.includes(query) ||
            localizedDesc.includes(query) ||
            tool.title.toLowerCase().includes(query) ||
            tool.desc.toLowerCase().includes(query) ||
            cat.label.toLowerCase().includes(query)
          );
        });
        return { ...cat, tools: matchedTools };
      })
      .filter((cat) => cat.tools.length > 0);
  }, [activeCategory, searchQuery, t]);

  const visibleCount = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.tools.length, 0),
    [filteredCategories]
  );

  const hasFilters = activeCategory !== "all" || searchQuery.trim().length > 0;

  return (
    <div className="bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Clean Editorial Header */}
        <header className="space-y-3 max-w-3xl border-b border-[#D8D4C9] pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
            Directory · {TOTAL_TOOL_COUNT} Interactive Tools &amp; Benchmarks
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
            {t("allTools.title", "All Training Tools")}
          </h1>
          <p className="text-base sm:text-lg text-[#57554E] leading-relaxed">
            {t(
              "allTools.subtitle",
              "Real daily utilities for students and professionals, hand-crafted classic games (Wordle, Tetris, Chess), PhET-style STEM visualizers, and precision human benchmarks."
            )}
          </p>
        </header>

        {/* Quick Portals: Logic Puzzles, Study Utilities & Flagship Classics */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
          <Link
            href="/puzzles"
            className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-6 flex items-center justify-between gap-4 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <ToolIcon toolId="puzzles" variant={iconVariant === "flat" ? "flat" : "3d-pedestal"} size="md" title="Daily Logic & Word Puzzles" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78756C]">9 Mensa Puzzles · 10,800+ Levels</p>
                <h2 className="font-serif text-lg font-medium text-[#161614] group-hover:text-[#1E40AF] mt-0.5 transition-colors">
                  Daily Logic &amp; Word Puzzles
                </h2>
                <p className="text-xs text-[#57554E] mt-1 leading-relaxed">Queens, Tango, Zip, Mini Sudoku, Patches, Sumbreak, Wend, Pinpoint &amp; Crossclimb</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF] shrink-0" aria-hidden="true" />
          </Link>
          <Link
            href={getLocalizedHref("/productivity")}
            className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-6 flex items-center justify-between gap-4 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <ToolIcon toolId="productivity" variant={iconVariant === "flat" ? "flat" : "3d-pedestal"} size="md" title="Student & Work Productivity Suite" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78756C]">7 Daily Utilities</p>
                <h2 className="font-serif text-lg font-medium text-[#161614] group-hover:text-[#1E40AF] mt-0.5 transition-colors">
                  Student &amp; Work Productivity Suite
                </h2>
                <p className="text-xs text-[#57554E] mt-1 leading-relaxed">Graphing Calculator, Unit Solver, GPA, Flashcards, Speed Reading &amp; Focus</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF] shrink-0" aria-hidden="true" />
          </Link>
          <Link
            href="/classics"
            className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-6 flex items-center justify-between gap-4 transition-colors"
          >
            <div className="flex items-start gap-3.5">
              <ToolIcon toolId="classics" variant={iconVariant === "flat" ? "flat" : "3d-pedestal"} size="md" title="Flagship Classics" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78756C]">3 Hand-Crafted Classics</p>
                <h2 className="font-serif text-lg font-medium text-[#161614] group-hover:text-[#1E40AF] mt-0.5 transition-colors">
                  Wordle, Classic Tetris &amp; Chess vs AI
                </h2>
                <p className="text-xs text-[#57554E] mt-1 leading-relaxed">Full authentic rules, keyboard &amp; touch controls, zero filler</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF] shrink-0" aria-hidden="true" />
          </Link>
        </div>

        {/* Search & Segmented Category Filter Toolbar */}
        <div className="bg-white border border-[#E6E3DB] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-4 h-4 text-[#78756C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools by name or skill..."
                aria-label="Search tools"
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl text-[#161614] placeholder:text-[#78756C] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#78756C] hover:text-[#161614] hover:bg-[#F3F1EB] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Live Results Counter + 3D / Minimal Icon Style Switcher */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 text-xs font-mono text-[#78756C] tabular-nums">
              <div
                className="inline-flex items-center p-0.5 bg-[#F3F1EB] border border-[#E6E3DB] rounded-lg font-sans"
                role="group"
                aria-label="Icon display style"
              >
                <button
                  type="button"
                  onClick={() => setIconVariant("3d")}
                  aria-pressed={iconVariant === "3d"}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    iconVariant === "3d"
                      ? "bg-white text-[#161614] shadow-xs"
                      : "text-[#57554E] hover:text-[#161614]"
                  }`}
                >
                  3D Icons
                </button>
                <button
                  type="button"
                  onClick={() => setIconVariant("flat")}
                  aria-pressed={iconVariant === "flat"}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    iconVariant === "flat"
                      ? "bg-white text-[#161614] shadow-xs"
                      : "text-[#57554E] hover:text-[#161614]"
                  }`}
                >
                  Minimal
                </button>
              </div>
              <span>
                Showing <strong className="text-[#161614]">{visibleCount}</strong> of {TOTAL_TOOL_COUNT} tools
              </span>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="text-[#1E40AF] hover:text-[#161614] font-sans font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Segmented Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter tools by arena"
            className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0EDE6]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#161614] text-[#FAF9F6]"
                  : "bg-[#F3F1EB] text-[#57554E] hover:bg-[#E6E3DB] hover:text-[#161614]"
              }`}
            >
              All <span className="font-mono opacity-75 ml-1">{TOTAL_TOOL_COUNT}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#161614] text-[#FAF9F6]"
                      : "bg-[#F3F1EB] text-[#57554E] hover:bg-[#E6E3DB] hover:text-[#161614]"
                  }`}
                >
                  {cat.shortLabel}{" "}
                  <span className="font-mono opacity-75 ml-1">{cat.tools.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered Category Sections */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] flex items-center justify-center mx-auto">
              <Search className="w-5 h-5 text-[#78756C]" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-medium text-[#161614]">No matching tools</h2>
              <p className="text-sm text-[#57554E] max-w-md mx-auto">
                No tools matched &ldquo;{searchQuery}&rdquo;. Try another keyword or switch back to all arenas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {filteredCategories.map((category) => (
              <section key={category.id} className="space-y-5">
                <div className="flex items-end justify-between gap-4 pb-3 border-b border-[#D8D4C9]">
                  <div className="flex items-center gap-3.5">
                    <ToolIcon
                      toolId={category.id}
                      variant={iconVariant === "flat" ? "flat" : "3d-pedestal"}
                      size="sm"
                      title={t(`categories.${category.id}.title`, category.label)}
                    />
                    <div>
                      <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                        {t(`categories.${category.id}.title`, category.label)}
                      </h2>
                      <p className="text-xs font-mono text-[#78756C] tabular-nums">
                        {category.tools.length} {category.tools.length === 1 ? "tool" : "tools"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={getLocalizedHref(`/${category.id}`)}
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57554E] hover:text-[#1E40AF] transition-colors shrink-0"
                  >
                    <span>{t("home.enterArena", "View Arena")}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-[#E6E3DB] bg-white">
                  {category.tools.map((tool) => {
                    const localizedTitle = t(`tools.${tool.id}.title`, tool.title);
                    return (
                      <Link
                        key={tool.id}
                        href={getLocalizedHref(tool.href)}
                        prefetch={false}
                        className="group p-5 border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] transition-colors flex flex-col justify-between h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]"
                      >
                        <div className="space-y-3.5">
                          <ToolIcon
                            toolId={tool.href}
                            variant={iconVariant}
                            size="md"
                            interactive={iconVariant !== "flat"}
                            title={localizedTitle}
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors leading-snug mb-1">
                              {localizedTitle}
                            </h3>
                            <p className="text-xs text-[#57554E] leading-relaxed line-clamp-2">
                              {t(`tools.${tool.id}.desc`, tool.desc)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-[#F0EDE6]">
                          <span className="text-xs font-medium text-[#78756C] group-hover:text-[#1E40AF] transition-colors">
                            Open benchmark
                          </span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-[#78756C] group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-all"
                            aria-hidden="true"
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
