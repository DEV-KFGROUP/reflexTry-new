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
        { id: "sequence", href: "/memory/sequence", icon: Zap, difficulty: "Medium" },
        { id: "number", href: "/memory/number", icon: Keyboard, difficulty: "Hard" },
        { id: "visual", href: "/memory/visual", icon: Target, difficulty: "Medium" },
        { id: "color", href: "/memory/color", icon: Activity, difficulty: "Easy" },
        { id: "shape", href: "/memory/shape", icon: Sparkles, difficulty: "Medium" },
        { id: "symbol", href: "/memory/symbol", icon: Target, difficulty: "Hard" },
        { id: "word-recall", href: "/memory/word-recall", icon: Target, difficulty: "Hard" },
        { id: "card-match", href: "/memory/card-match", icon: Sparkles, difficulty: "Easy" },
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
        { id: "reaction", href: "/reflex/reaction", icon: Zap, difficulty: "Easy" },
        { id: "sound", href: "/reflex/sound", icon: Activity, difficulty: "Medium" },
        { id: "grid", href: "/reflex/grid", icon: Target, difficulty: "Medium" },
        { id: "peripheral", href: "/reflex/peripheral", icon: Keyboard, difficulty: "Hard" },
        { id: "direction", href: "/reflex/direction", icon: ArrowRight, difficulty: "Medium" },
        { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Zap, difficulty: "Expert" },
        { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Activity, difficulty: "Hard" },
        { id: "whack-a-mole", href: "/reflex/whack-a-mole", icon: Target, difficulty: "Easy" },
        { id: "color-switch", href: "/reflex/color-switch", icon: Brain, difficulty: "Medium" },
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
        { id: "cps", href: "/speed/click", icon: Activity, difficulty: "Easy" },
        { id: "math", href: "/speed/math", icon: Keyboard, difficulty: "Hard" },
        { id: "typing", href: "/speed/typing", icon: Keyboard, difficulty: "Medium" },
        { id: "word", href: "/speed/words", icon: Target, difficulty: "Medium" },
        { id: "grid", href: "/speed/grid", icon: Target, difficulty: "Hard" },
        { id: "number-rush", href: "/speed/number-rush", icon: Target, difficulty: "Medium" },
        { id: "quick-sort", href: "/speed/quick-sort", icon: ArrowRight, difficulty: "Medium" },
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
        { id: "aim", href: "/gaming/aim", icon: Target, difficulty: "Medium" },
        { id: "rpg", href: "/gaming/reaction", icon: Zap, difficulty: "Hard" },
        { id: "target-tracking", href: "/gaming/target-tracking", icon: Target, difficulty: "Hard" },
        { id: "endless-dodge", href: "/gaming/endless-dodge", icon: Zap, difficulty: "Expert" },
        { id: "stroop-drop", href: "/gaming/stroop-drop", icon: Brain, difficulty: "Hard" },
        { id: "flick-shot", href: "/gaming/flick-shot", icon: Target, difficulty: "Medium" },
        { id: "rhythm-tap", href: "/gaming/rhythm-tap", icon: Activity, difficulty: "Hard" },
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
        { id: "image", href: "/accuracy/image-recognition", icon: Target, difficulty: "Hard" },
        { id: "data", href: "/accuracy/data", icon: Keyboard, difficulty: "Expert" },
        { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Target, difficulty: "Medium" },
        { id: "precision-click", href: "/accuracy/precision-click", icon: Target, difficulty: "Medium" },
        { id: "angle-estimation", href: "/accuracy/angle-estimation", icon: Target, difficulty: "Hard" },
        { id: "color-match", href: "/accuracy/color-match", icon: Target, difficulty: "Medium" },
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
      {/* ── Game Arenas ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-16 pt-12 pb-20 px-4 sm:px-6 lg:px-8">
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
                        Challenge yourself in the {tool.id.replace(/-/g, " ")} arena and improve your skills.
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
