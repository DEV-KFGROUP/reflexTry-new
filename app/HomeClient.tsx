"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Keyboard,
  Zap,
  Activity,
  Brain,
  Gauge,
  Gamepad2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
    );
};

export default function HomeClient() {
  const toolCategories = [
    {
      id: "memory",
      icon: Brain,
      arenaName: "Memory Arena",
      accentColor: "#3b82f6",
      accentBg: "bg-blue-500/10",
      accentBorder: "border-blue-500/30",
      accentText: "text-blue-500",
      accentGlow: "hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]",
      topBorder: "via-blue-500/50",
      xpRange: "50–200",
      tag: "COGNITION",
      tools: [
        { id: "sequence", href: "/memory/sequence", icon: Zap, difficulty: "Medium" , desc: "Memorize and repeat the expanding pattern of flashes." },
        { id: "chimp-test", href: "/memory/chimp-test", icon: Brain, difficulty: "Hard" , desc: "Recall numbers in exact order after they are hidden." },
        { id: "verbal-memory", href: "/memory/verbal-memory", icon: Sparkles, difficulty: "Medium" , desc: "Identify if you've seen the current word before." },
        { id: "n-back", href: "/memory/n-back", icon: Brain, difficulty: "Hard" , desc: "Match letters that appeared N steps earlier in the stream." },
        { id: "object-tracking", href: "/memory/object-tracking", icon: Target, difficulty: "Hard" , desc: "Keep your eyes locked on the moving targets." },
        { id: "number", href: "/memory/number", icon: Keyboard, difficulty: "Hard" , desc: "How many digits can you hold before your memory drops them?" },
        { id: "visual", href: "/memory/visual", icon: Target, difficulty: "Medium" , desc: "Remember the exact layout of the highlighted tiles." },
        { id: "color", href: "/memory/color", icon: Activity, difficulty: "Easy" , desc: "Memorize and reproduce the exact sequence of colors." },
        { id: "shape", href: "/memory/shape", icon: Sparkles, difficulty: "Medium" , desc: "Differentiate and recall complex geometric shapes." },
        { id: "symbol", href: "/memory/symbol", icon: Target, difficulty: "Hard" , desc: "Remember a growing sequence of abstract symbols." },
        { id: "word-recall", href: "/memory/word-recall", icon: Target, difficulty: "Hard" , desc: "Memorize a list of words and recall them later." },
        { id: "card-match", href: "/memory/card-match", icon: Sparkles, difficulty: "Easy" , desc: "Find the matching pairs hidden behind the cards." },
      ],
    },
    {
      id: "reflex",
      icon: Zap,
      arenaName: "Reflex Arena",
      accentColor: "#f59e0b",
      accentBg: "bg-amber-500/10",
      accentBorder: "border-amber-500/30",
      accentText: "text-amber-500",
      accentGlow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]",
      topBorder: "via-amber-500/50",
      xpRange: "75–300",
      tag: "REACTION",
      tools: [
        { id: "reaction", href: "/reflex/reaction", icon: Zap, difficulty: "Easy" , desc: "Click the exact millisecond the screen turns green." },
        { id: "time-perception", href: "/reflex/time-perception", icon: Activity, difficulty: "Medium" , desc: "Estimate the exact duration of a hidden timer." },
        { id: "go-no-go", href: "/reflex/go-no-go", icon: Target, difficulty: "Medium" , desc: "Press on green Go trials — withhold on red No-Go." },
        { id: "flanker", href: "/reflex/flanker", icon: ArrowRight, difficulty: "Hard" , desc: "Respond to the center arrow; ignore flanking distractors." },
        { id: "choice-reaction", href: "/reflex/choice-reaction", icon: Zap, difficulty: "Medium" , desc: "Click the lit colored box as fast as you can." },
        { id: "sound", href: "/reflex/sound", icon: Activity, difficulty: "Medium" , desc: "React as fast as possible to a sudden audio cue." },
        { id: "grid", href: "/reflex/grid", icon: Target, difficulty: "Medium" , desc: "Click the randomly appearing targets instantly." },
        { id: "peripheral", href: "/reflex/peripheral", icon: Keyboard, difficulty: "Hard" , desc: "Spot and react to targets outside your direct focus." },
        { id: "direction", href: "/reflex/direction", icon: ArrowRight, difficulty: "Medium" , desc: "Swipe or press the arrow matching the visual cue." },
        { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Zap, difficulty: "Expert" , desc: "Process conflicting signals and react correctly." },
        { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Activity, difficulty: "Hard" , desc: "Quickly click targets in the specified order." },
        { id: "whack-a-mole", href: "/reflex/whack-a-mole", icon: Target, difficulty: "Easy" , desc: "Smash the targets before they disappear." },
        { id: "color-switch", href: "/reflex/color-switch", icon: Brain, difficulty: "Medium" , desc: "React instantly when the target changes color." },
      ],
    },
    {
      id: "speed",
      icon: Gauge,
      arenaName: "Speed Arena",
      accentColor: "#f97316",
      accentBg: "bg-orange-500/10",
      accentBorder: "border-orange-500/30",
      accentText: "text-orange-500",
      accentGlow: "hover:shadow-[0_0_24px_rgba(249,115,22,0.15)]",
      topBorder: "via-orange-500/50",
      xpRange: "100–500",
      tag: "VELOCITY",
      tools: [
        { id: "cps", href: "/speed/click", icon: Activity, difficulty: "Easy" , desc: "Test your raw clicks-per-second velocity." },
        { id: "schulte-table", href: "/speed/schulte-table", icon: Target, difficulty: "Medium" , desc: "Click shuffled numbers in order on a Schulte grid." },
        { id: "math", href: "/speed/math", icon: Keyboard, difficulty: "Hard" , desc: "Solve basic arithmetic equations rapidly." },
        { id: "typing", href: "/speed/typing", icon: Keyboard, difficulty: "Medium" , desc: "Type the provided text as fast as possible." },
        { id: "word", href: "/speed/words", icon: Target, difficulty: "Medium" , desc: "Unscramble words with extreme speed." },
        { id: "grid", href: "/speed/grid", icon: Target, difficulty: "Hard" , desc: "Clear the entire grid of targets quickly." },
        { id: "number-rush", href: "/speed/number-rush", icon: Target, difficulty: "Medium" , desc: "Click the numbers in ascending order fast." },
        { id: "quick-sort", href: "/speed/quick-sort", icon: ArrowRight, difficulty: "Medium" , desc: "Categorize items left or right with max speed." },
      ],
    },
    {
      id: "gaming",
      icon: Gamepad2,
      arenaName: "Gaming Arena",
      accentColor: "#a855f7",
      accentBg: "bg-purple-500/10",
      accentBorder: "border-purple-500/30",
      accentText: "text-purple-500",
      accentGlow: "hover:shadow-[0_0_24px_rgba(168,85,247,0.15)]",
      topBorder: "via-purple-500/50",
      xpRange: "150–400",
      tag: "PERFORMANCE",
      tools: [
        { id: "aim", href: "/gaming/aim", icon: Target, difficulty: "Medium" , desc: "Track and click moving targets to improve FPS aim." },
        { id: "rpg", href: "/gaming/reaction", icon: Zap, difficulty: "Hard" , desc: "Challenge yourself and improve your skills." },
        { id: "target-tracking", href: "/gaming/target-tracking", icon: Target, difficulty: "Hard" , desc: "Keep your crosshair locked onto evasive targets." },
        { id: "endless-dodge", href: "/gaming/endless-dodge", icon: Zap, difficulty: "Expert" , desc: "Avoid incoming obstacles for as long as possible." },
        { id: "stroop-drop", href: "/gaming/stroop-drop", icon: Brain, difficulty: "Hard" , desc: "Overcome cognitive interference under time pressure." },
        { id: "flick-shot", href: "/gaming/flick-shot", icon: Target, difficulty: "Medium" , desc: "Snap your crosshair to targets instantly." },
        { id: "rhythm-tap", href: "/gaming/rhythm-tap", icon: Activity, difficulty: "Hard" , desc: "Hit the notes precisely on the beat." },
      ],
    },
    {
      id: "accuracy",
      icon: Target,
      arenaName: "Accuracy Arena",
      accentColor: "#10b981",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-500",
      accentGlow: "hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]",
      topBorder: "via-emerald-500/50",
      xpRange: "80–350",
      tag: "PRECISION",
      tools: [
        { id: "image", href: "/accuracy/image-recognition", icon: Target, difficulty: "Hard" , desc: "Quickly spot the differences or hidden objects." },
        { id: "color-blindness", href: "/accuracy/color-blindness", icon: Brain, difficulty: "Medium" , desc: "Identify numbers hidden within Ishihara plates." },
        { id: "mental-rotation", href: "/accuracy/mental-rotation", icon: Target, difficulty: "Hard" , desc: "Determine if 3D shapes match when rotated." },
        { id: "data", href: "/accuracy/data", icon: Keyboard, difficulty: "Expert" , desc: "Enter complex alphanumeric sequences flawlessly." },
        { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Target, difficulty: "Medium" , desc: "Identify the correct missing piece of the pattern." },
        { id: "precision-click", href: "/accuracy/precision-click", icon: Target, difficulty: "Medium" , desc: "Click tiny targets with pixel-perfect accuracy." },
        { id: "angle-estimation", href: "/accuracy/angle-estimation", icon: Target, difficulty: "Hard" , desc: "Visually estimate the exact degree of an angle." },
        { id: "color-match", href: "/accuracy/color-match", icon: Target, difficulty: "Medium" , desc: "Adjust RGB sliders to recreate the target hue." },
      ],
    },
  ];

  const difficultyColors: Record<string, string> = {
    Easy: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    Medium: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    Hard: "text-orange-500 bg-orange-500/10 border-orange-500/30",
    Expert: "text-rose-500 bg-rose-500/10 border-rose-500/30",
  };

  return (
    <div className="bg-background min-h-screen overflow-hidden relative">
      <FloatingBackground />
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-16 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Editorial lead — value before the full tool directory */}
        <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-mono font-bold tracking-widest uppercase text-blue-500">
              Cognitive Lab Journal
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Measure first. Practice short. Read the method.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Reflextry is a free browser lab for reaction time, working memory, speed, and
              accuracy. Scores are transparent (milliseconds, spans, accuracy)—not clinical
              diagnoses or invented percentiles. Start with a baseline, train in 10–15 minute
              sessions, and use our guides when you want the science behind the number.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                href: "/blog/how-we-score-reflextry-tests",
                title: "How we score tests",
                desc: "What milliseconds, spans, and accuracy mean—and what we refuse to claim.",
              },
              {
                href: "/blog/what-is-a-good-reaction-time",
                title: "What is a good reaction time?",
                desc: "Realistic ranges, hardware noise, and how to read your own scores.",
              },
              {
                href: "/blog/choice-reaction-vs-simple-reaction",
                title: "Choice vs simple reaction",
                desc: "Why more options slow you down, and how to train each separately.",
              },
              {
                href: "/about",
                title: "About the lab",
                desc: "Who builds Reflextry, our methodology, and how to contact us.",
              },
              {
                href: "/blog",
                title: "All guides",
                desc: "Memory, reflex, speed, and accuracy articles from the Cognitive Journal.",
              },
              {
                href: "/faq",
                title: "FAQ",
                desc: "Training frequency, privacy, scoring, and common product questions.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-black/10 dark:border-white/10 bg-background/40 p-5 hover:border-blue-500/40 transition-colors"
              >
                <h3 className="font-bold text-foreground group-hover:text-blue-500 transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" /> What Reflextry Measures
            </h2>
            <p className="text-muted-foreground leading-relaxed">
                Free browser tests for reaction time, working memory, click speed, aim, and accuracy. Measure a baseline, practice in short sessions, and track progress on the statistics page—no account required for core tools.
            </p>
        </section>

        {toolCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.08 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Arena Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl ${category.accentBg} border ${category.accentBorder} shadow-sm backdrop-blur-sm`}
                >
                  <category.icon className={`w-8 h-8 ${category.accentText} drop-shadow-sm`} />
                </div>
                <div>
                  <div className={`text-[10px] font-bold tracking-widest uppercase mb-0.5 ${category.accentText} opacity-80`}>
                    {category.tag}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {category.arenaName}
                  </h2>
                </div>
              </div>
              <Link 
                  href={`/${category.id}`}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border ${category.accentBorder} ${category.accentBg} hover:bg-opacity-20 transition-all font-bold text-sm ${category.accentText}`}
              >
                  Enter Arena <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quest Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  viewport={{ once: true }}
                  className={`group relative p-5 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 ${category.accentGlow} hover:${category.accentBorder} transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <Link href={tool.href} className="absolute inset-0 z-10" aria-label={`${tool.id} challenge`}>
                    <span className="sr-only">Start {tool.id} challenge</span>
                  </Link>

                  <div className="relative z-0 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-2xl ${category.accentBg} border ${category.accentBorder} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <tool.icon className={`w-6 h-6 ${category.accentText} drop-shadow-sm`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${difficultyColors[tool.difficulty]}`}>
                        {tool.difficulty}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-bold text-foreground mb-1 capitalize group-hover:text-foreground/90 transition-colors">
                        {tool.id.replace(/-/g, " ")}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10 mt-auto">
                      <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                        Start Quest
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 ${category.accentText} transform group-hover:translate-x-1 transition-transform`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Mobile Link */}
            <Link 
                href={`/${category.id}`}
                className={`sm:hidden flex justify-center items-center gap-2 mt-4 px-4 py-3 rounded-xl border ${category.accentBorder} ${category.accentBg} font-bold text-sm ${category.accentText}`}
            >
                Enter {category.arenaName} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
