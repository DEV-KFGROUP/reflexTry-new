"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
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
  Trophy,
  Sparkles,
  Star
} from "lucide-react";
import { GameBackground } from "@/components/GameBackground";

export default function HomeClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };



  // Arena-themed tool categories with unique colors
  const toolCategories = [
    {
      id: "memory",
      icon: Brain,
      arenaName: "Memory Arena",
      color: "text-foreground",
      bgGlow: "from-slate-100 to-slate-50",
      borderColor: "border-border hover:border-slate-300",
      shadowColor: "hover:shadow-md",
      xpRange: "50-200",
      tools: [
        { id: "sequence", href: "/memory/sequence", icon: Zap, difficulty: "Medium" },
        { id: "number", href: "/memory/number", icon: Keyboard, difficulty: "Hard" },
        { id: "visual", href: "/memory/visual", icon: Target, difficulty: "Medium" },
        { id: "color", href: "/memory/color", icon: Activity, difficulty: "Easy" },
        { id: "shape", href: "/memory/shape", icon: Sparkles, difficulty: "Medium" },
        { id: "symbol", href: "/memory/symbol", icon: Target, difficulty: "Hard" },
        { id: "word-recall", href: "/memory/word-recall", icon: Target, difficulty: "Hard" },
        { id: "card-match", href: "/memory/card-match", icon: Sparkles, difficulty: "Easy" },
      ]
    },
    {
      id: "reflex",
      icon: Zap,
      arenaName: "Reflex Arena",
      color: "text-foreground",
      bgGlow: "from-slate-100 to-slate-50",
      borderColor: "border-border hover:border-slate-300",
      shadowColor: "hover:shadow-md",
      xpRange: "75-300",
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
      ]
    },
    {
      id: "speed",
      icon: Gauge,
      arenaName: "Speed Arena",
      color: "text-foreground",
      bgGlow: "from-slate-100 to-slate-50",
      borderColor: "border-border hover:border-slate-300",
      shadowColor: "hover:shadow-md",
      xpRange: "100-500",
      tools: [
        { id: "cps", href: "/speed/click", icon: Activity, difficulty: "Easy" },
        { id: "math", href: "/speed/math", icon: Keyboard, difficulty: "Hard" },
        { id: "typing", href: "/speed/typing", icon: Keyboard, difficulty: "Medium" },
        { id: "word", href: "/speed/words", icon: Target, difficulty: "Medium" },
        { id: "grid", href: "/speed/grid", icon: Target, difficulty: "Hard" },
        { id: "number-rush", href: "/speed/number-rush", icon: Target, difficulty: "Medium" },
        { id: "quick-sort", href: "/speed/quick-sort", icon: ArrowRight, difficulty: "Medium" },
      ]
    },
    {
      id: "gaming",
      icon: Gamepad2,
      arenaName: "Gaming Arena",
      color: "text-foreground",
      bgGlow: "from-slate-100 to-slate-50",
      borderColor: "border-border hover:border-slate-300",
      shadowColor: "hover:shadow-md",
      xpRange: "150-400",
      tools: [
        { id: "aim", href: "/gaming/aim", icon: Target, difficulty: "Medium" },
        { id: "rpg", href: "/gaming/reaction", icon: Zap, difficulty: "Hard" },
        { id: "target-tracking", href: "/gaming/target-tracking", icon: Target, difficulty: "Hard" },
        { id: "endless-dodge", href: "/gaming/endless-dodge", icon: Zap, difficulty: "Expert" },
        { id: "stroop-drop", href: "/gaming/stroop-drop", icon: Brain, difficulty: "Hard" },
        { id: "flick-shot", href: "/gaming/flick-shot", icon: Target, difficulty: "Medium" },
        { id: "rhythm-tap", href: "/gaming/rhythm-tap", icon: Activity, difficulty: "Hard" },
      ]
    },
    {
      id: "accuracy",
      icon: Target,
      arenaName: "Accuracy Arena",
      color: "text-foreground",
      bgGlow: "from-slate-100 to-slate-50",
      borderColor: "border-border hover:border-slate-300",
      shadowColor: "hover:shadow-md",
      xpRange: "80-350",
      tools: [
        { id: "image", href: "/accuracy/image-recognition", icon: Target, difficulty: "Hard" },
        { id: "data", href: "/accuracy/data", icon: Keyboard, difficulty: "Expert" },
        { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Target, difficulty: "Medium" },
        { id: "precision-click", href: "/accuracy/precision-click", icon: Target, difficulty: "Medium" },
        { id: "angle-estimation", href: "/accuracy/angle-estimation", icon: Target, difficulty: "Hard" },
        { id: "color-match", href: "/accuracy/color-match", icon: Target, difficulty: "Medium" },
      ]
    }
  ];

  const difficultyColors: Record<string, string> = {
    "Easy": "text-green-400 bg-green-400/10 border-green-400/30",
    "Medium": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    "Hard": "text-orange-400 bg-orange-400/10 border-orange-400/30",
    "Expert": "text-red-400 bg-red-400/10 border-red-400/30",
  };

  return (
    <GameBackground variant="default" showParticles={false} showGrid={false}>
      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-6"
        >
          {/* Feature Cards - Game Quest Style */}
          <h2 className="sr-only">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Brain, title: "Memory Games", desc: "Challenge your working memory with pattern recognition and sequence tests.", color: "text-foreground", glow: "hover:shadow-md" },
              { icon: Zap, title: "Reflex Tests", desc: "Measure and improve your reaction time with visual and audio challenges.", color: "text-foreground", glow: "hover:shadow-md" },
              { icon: Gauge, title: "Speed Challenges", desc: "Test your typing speed, clicking speed, and mental math abilities.", color: "text-foreground", glow: "hover:shadow-md" },
              { icon: Target, title: "Accuracy & Gaming", desc: "Improve precision with aim training and image recognition exercises.", color: "text-foreground", glow: "hover:shadow-md" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group relative space-y-2 p-5 rounded-2xl bg-white border border-border transition-all duration-200 ${feature.glow}`}
              >
                <h3 className={`text-lg font-bold ${feature.color} flex items-center gap-2 relative z-10`}>
                  <feature.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Game Progress Bar Style Info */}
          <motion.div variants={itemVariants} className="pt-3 border-t border-border">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[
                { icon: Trophy, text: "Track Progress" },
                { icon: Star, text: "Compete on Leaderboards" },
                { icon: Sparkles, text: "Unlock Achievements" },
                { icon: Zap, text: "Daily Challenges" },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.text}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons - Game Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto mt-8"
        >
          <motion.div variants={itemVariants}>
            <Link href="/tools">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" aria-label="Start Testing">
                <Gamepad2 className="w-5 h-5" />
                Start Testing
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200 cursor-pointer border border-border text-foreground bg-white hover:bg-slate-50 shadow-sm w-full sm:w-auto"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Game Arenas - Tool Categories */}
      <div className="w-full max-w-7xl mx-auto space-y-16 mt-16 mb-12 px-4 sm:px-6 lg:px-8">
        {toolCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Arena Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white border ${category.borderColor}`}>
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-semibold ${category.color}`}>
                    {category.arenaName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Brain Training Games • XP: {category.xpRange}
                  </p>
                </div>
              </div>
              {/* Quest count badge */}
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full ${category.borderColor} border bg-white`}>
                <span className="text-sm text-muted-foreground">{category.tools.length} Quests</span>
              </div>
            </div>

            {/* Quest Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`group relative p-5 rounded-2xl bg-white border ${category.borderColor} ${category.shadowColor} transition-all duration-200 cursor-pointer overflow-hidden`}
                >
                  <Link
                    href={tool.href}
                    className="absolute inset-0 z-10"
                    aria-label={`${tool.id} challenge`}
                  >
                    <span className="sr-only">Start {tool.id} challenge</span>
                  </Link>

                  <div className="relative z-0 space-y-3">
                    {/* Icon and difficulty */}
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg bg-secondary border ${category.borderColor}`}>
                        <tool.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[tool.difficulty]}`}>
                        {tool.difficulty}
                      </span>
                    </div>

                    {/* Title and description */}
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1 transition-colors capitalize">
                        {tool.id.replace('-', ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Challenge yourself in the {tool.id.replace('-', ' ')} arena and improve your skills.
                      </p>
                    </div>

                    {/* Play indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground/70">Start Quest</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </GameBackground>
  );
}


