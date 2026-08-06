"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Target, Keyboard, Zap, Activity, MousePointer2,
  Calculator, Type, Grid3X3, Volume2, Eye, Move, Brain, Hash, HelpCircle, Palette, Sparkles, LayoutGrid
} from "lucide-react";

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
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  hoverBorder: string;
  glow: string;
  tools: ToolItem[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: "memory",
    label: "Memory Arena",
    icon: Brain,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    hoverBorder: "hover:border-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.06)]",
    tools: [
      { id: "chimp-test", href: "/memory/chimp-test", icon: Brain, title: "Chimp Test", desc: "Recall number positions after they vanish — classic working memory challenge." },
      { id: "verbal-memory", href: "/memory/verbal-memory", icon: Type, title: "Verbal Memory", desc: "Identify seen vs new words to measure linguistic retention." },
      { id: "n-back", href: "/memory/n-back", icon: Sparkles, title: "N-Back", desc: "Match letters that appeared N steps earlier in a continuous stream." },
      { id: "object-tracking", href: "/memory/object-tracking", icon: Eye, title: "Object Tracking", desc: "Track multiple moving targets among distractors." },
      { id: "sequence", href: "/memory/sequence", icon: Zap, title: "Sequence Memory", desc: "Memorize and repeat an increasingly complex flashing button pattern." },
      { id: "number", href: "/memory/number", icon: Hash, title: "Number Memory", desc: "Test working retention limits with incremental digit sequences." },
      { id: "visual", href: "/memory/visual", icon: Grid3X3, title: "Visual Memory", desc: "Retain spatial layouts of highlighted matrix grids." },
      { id: "color", href: "/memory/color", icon: Palette, title: "Color Match", desc: "Determine semantic congruence against ink colors under time constraints." },
      { id: "shape", href: "/memory/shape", icon: Target, title: "Shape Memory", desc: "Identify shapes and position mappings within grid layouts." },
      { id: "symbol", href: "/memory/symbol", icon: Eye, title: "Symbol Memory", desc: "Recall and select complex symbolic configurations." },
      { id: "word-recall", href: "/memory/word-recall", icon: Type, title: "Word Recall", desc: "Test linguistic retention by recalling lists of common nouns." },
      { id: "card-match", href: "/memory/card-match", icon: Activity, title: "Card Match", desc: "Classic pairs board match, testing spatial object recall." },
    ]
  },
  {
    id: "reflex",
    label: "Reflex Arena",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    hoverBorder: "hover:border-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.06)]",
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
    ]
  },
  {
    id: "speed",
    label: "Speed Arena",
    icon: Keyboard,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    hoverBorder: "hover:border-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.06)]",
    tools: [
      { id: "cps", href: "/speed/click", icon: MousePointer2, title: "Click Speed", desc: "Calibrate your clicks-per-second (CPS) efficiency limits." },
      { id: "schulte-table", href: "/speed/schulte-table", icon: Grid3X3, title: "Schulte Table", desc: "Click shuffled numbers in order to train visual scanning speed." },
      { id: "math", href: "/speed/math", icon: Calculator, title: "Math Speed", desc: "Solve modular arithmetic challenges before your time buffer expires." },
      { id: "typing", href: "/speed/typing", icon: Keyboard, title: "Typing Test", desc: "Test characters-per-minute (CPM) speed on paragraphs." },
      { id: "word", href: "/speed/words", icon: Type, title: "Word Reading", desc: "Test reading speeds (WPM) under high-speed display settings." },
      { id: "grid", href: "/speed/grid", icon: Grid3X3, title: "Grid Speed", desc: "Locate and click matrix targets as fast as possible." },
      { id: "number-rush", href: "/speed/number-rush", icon: Hash, title: "Number Rush", desc: "Visual scanning test to locate numbers in sequential order." },
      { id: "quick-sort", href: "/speed/quick-sort", icon: ArrowRight, title: "Quick Sort", desc: "Categorize falling items under high speed before they overflow." },
    ]
  },
  {
    id: "gaming",
    label: "Gaming Arena",
    icon: Target,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200/60",
    hoverBorder: "hover:border-rose-400",
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.06)]",
    tools: [
      { id: "aim", href: "/gaming/aim", icon: Target, title: "Aim Trainer", desc: "Test micro-flicks and visual scan timing on target points." },
      { id: "rpg", href: "/gaming/reaction", icon: Zap, title: "RPG Reaction", desc: "Block attacks from directions with dedicated combat buttons." },
      { id: "target-tracking", href: "/gaming/target-tracking", icon: Target, title: "Target Tracking", desc: "Test smooth tracking aiming stability on glitched elements." },
      { id: "endless-dodge", href: "/gaming/endless-dodge", icon: Zap, title: "Endless Dodge", desc: "Survive homing projectiles and expanding pulse bombs." },
      { id: "stroop-drop", href: "/gaming/stroop-drop", icon: Brain, title: "Stroop Drop", desc: "Click ink colors of falling words under rotating/blurred effects." },
      { id: "flick-shot", href: "/gaming/flick-shot", icon: Target, title: "Flick Shot", desc: "Snap-shoot tiny targets while avoiding black decoy bombs." },
      { id: "rhythm-tap", href: "/gaming/rhythm-tap", icon: Activity, title: "Rhythm Tap", desc: "Hit falling calibration bars on 2 to 5 keys (adds Spacebar!)." },
    ]
  },
  {
    id: "accuracy",
    label: "Accuracy Arena",
    icon: Target,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    hoverBorder: "hover:border-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.06)]",
    tools: [
      { id: "image", href: "/accuracy/image-recognition", icon: Eye, title: "Image Recognition", desc: "Identify distorted emojis under heavy blurs and rotations." },
      { id: "data", href: "/accuracy/data", icon: Keyboard, title: "Data Entry", desc: "Type complex code blocks and cryptographic keys accurately." },
      { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Brain, title: "Pattern Matching", desc: "Recall spatial symbols among highly similar wrong distractors." },
      { id: "precision-click", href: "/accuracy/precision-click", icon: MousePointer2, title: "Precision Click", desc: "Click tiny jittering targets that drift and bounce off walls." },
      { id: "angle-estimation", href: "/accuracy/angle-estimation", icon: Calculator, title: "Angle Estimation", desc: "Guess relative angles under tilted baseline setups." },
      { id: "color-match", href: "/accuracy/color-match", icon: Activity, title: "Color Match", desc: "Match target colors from memory after they fade grey." },
    ]
  }
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <LayoutGrid className="w-32 h-32 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Activity className="w-40 h-40 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function AllToolsClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <div className="bg-background py-8 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden relative">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-12 relative z-10"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
          <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-block relative mb-4"
              suppressHydrationWarning
          >
              <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
              <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(96,165,250,0.2)]">
                  <LayoutGrid className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              </div>
          </motion.div>
          
          <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
              <h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-blue-400 dark:via-purple-400 dark:to-purple-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                  suppressHydrationWarning
              >
                  <Sparkles className="w-10 h-10 text-blue-400" />
                  All Training Tools
              </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Explore our complete suite of cognitive and psychomotor tests.
          </p>
          <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
            From raw reflex timing to complex visual memory retention, our suite offers comprehensive baseline testing across every major performance metric.
          </p>
        </motion.div>

        {/* Main Glassmorphic Container */}
        <motion.div 
            variants={itemVariants}
            className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(96,165,250,0.1)] z-10 space-y-16"
        >
          <FloatingBackground />

          {CATEGORIES.map((category, catIdx) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="space-y-6 relative z-10"
            >
              <div className="flex items-center gap-4 pb-4 border-b border-black/10 dark:border-white/10">
                <div className={`p-3 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm shadow-md ${category.color} ${category.glow}`}>
                  <category.icon className="w-6 h-6 drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-wide flex-1">
                  {category.label}
                </h2>
                <Link
                  href={`/${category.id}`}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border border-black/10 dark:border-white/10 hover:bg-white/10 transition-all duration-300 ${category.color}`}
                >
                  View Category <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.tools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group relative p-5 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 ${category.hoverBorder} transition-all duration-300 hover:shadow-lg overflow-hidden h-full flex flex-col`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Link
                      href={tool.href}
                      className="absolute inset-0 z-10"
                      aria-label={`Play ${tool.title}`}
                    >
                      <span className="sr-only">Play {tool.title}</span>
                    </Link>

                    <div className="flex items-start gap-4 mb-3 relative z-10">
                      <div className={`p-2.5 rounded-xl bg-white/5 border border-black/10 dark:border-white/10 group-hover:scale-110 transition-transform duration-300 ${category.color}`}>
                        <tool.icon className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                      </div>
                      <h3 className="text-base font-bold text-foreground pt-1 flex-1 leading-tight group-hover:text-foreground/90 transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 relative z-10">
                      {tool.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Category Link */}
              <div className="sm:hidden mt-4">
                <Link
                  href={`/${category.id}`}
                  className={`flex items-center justify-center w-full gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-white/5 border border-black/10 dark:border-white/10 hover:bg-white/10 transition-all duration-300 ${category.color}`}
                >
                  View Category <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
