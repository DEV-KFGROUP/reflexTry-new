"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
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
import { useTranslations } from "next-intl";
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

  const t = useTranslations('Home');
  const tNav = useTranslations('Navbar');

  // Arena-themed tool categories with unique colors
  const toolCategories = [
    {
      id: "memory",
      icon: Brain,
      arenaName: "Memory Arena",
      color: "text-memory",
      bgGlow: "from-memory/20 to-memory/5",
      borderColor: "border-memory/30 hover:border-memory/60",
      shadowColor: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
      xpRange: "50-200",
      tools: [
        { id: "sequence", href: "/memory/sequence", icon: Zap, difficulty: "Medium" },
        { id: "number", href: "/memory/number", icon: Keyboard, difficulty: "Hard" },
        { id: "visual", href: "/memory/visual", icon: Target, difficulty: "Medium" },
        { id: "color", href: "/memory/color", icon: Activity, difficulty: "Easy" },
        { id: "shape", href: "/memory/shape", icon: Sparkles, difficulty: "Medium" },
        { id: "symbol", href: "/memory/symbol", icon: Target, difficulty: "Hard" },
      ]
    },
    {
      id: "reflex",
      icon: Zap,
      arenaName: "Reflex Arena",
      color: "text-reflex",
      bgGlow: "from-reflex/20 to-reflex/5",
      borderColor: "border-reflex/30 hover:border-reflex/60",
      shadowColor: "hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
      xpRange: "75-300",
      tools: [
        { id: "reaction", href: "/reflex/reaction", icon: Zap, difficulty: "Easy" },
        { id: "sound", href: "/reflex/sound", icon: Activity, difficulty: "Medium" },
        { id: "grid", href: "/reflex/grid", icon: Target, difficulty: "Medium" },
        { id: "peripheral", href: "/reflex/peripheral", icon: Keyboard, difficulty: "Hard" },
        { id: "direction", href: "/reflex/direction", icon: ArrowRight, difficulty: "Medium" },
        { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Zap, difficulty: "Expert" },
        { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Activity, difficulty: "Hard" },
      ]
    },
    {
      id: "speed",
      icon: Gauge,
      arenaName: "Speed Arena",
      color: "text-speed",
      bgGlow: "from-speed/20 to-speed/5",
      borderColor: "border-speed/30 hover:border-speed/60",
      shadowColor: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
      xpRange: "100-500",
      tools: [
        { id: "cps", href: "/speed/click", icon: Activity, difficulty: "Easy" },
        { id: "math", href: "/speed/math", icon: Keyboard, difficulty: "Hard" },
        { id: "typing", href: "/speed/typing", icon: Keyboard, difficulty: "Medium" },
        { id: "word", href: "/speed/words", icon: Target, difficulty: "Medium" },
        { id: "grid", href: "/speed/grid", icon: Target, difficulty: "Hard" },
      ]
    },
    {
      id: "gaming",
      icon: Gamepad2,
      arenaName: "Gaming Arena",
      color: "text-wisdom",
      bgGlow: "from-wisdom/20 to-wisdom/5",
      borderColor: "border-wisdom/30 hover:border-wisdom/60",
      shadowColor: "hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      xpRange: "150-400",
      tools: [
        { id: "aim", href: "/gaming/aim", icon: Target, difficulty: "Medium" },
        { id: "rpg", href: "/gaming/reaction", icon: Zap, difficulty: "Hard" },
      ]
    },
    {
      id: "accuracy",
      icon: Target,
      arenaName: "Accuracy Arena",
      color: "text-accuracy",
      bgGlow: "from-accuracy/20 to-accuracy/5",
      borderColor: "border-accuracy/30 hover:border-accuracy/60",
      shadowColor: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
      xpRange: "80-350",
      tools: [
        { id: "image", href: "/accuracy/image-recognition", icon: Target, difficulty: "Hard" },
        { id: "data", href: "/accuracy/data", icon: Keyboard, difficulty: "Expert" },
        { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Target, difficulty: "Medium" },
        { id: "precision-click", href: "/accuracy/precision-click", icon: Target, difficulty: "Medium" },
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
    <GameBackground variant="default" showParticles={true} showGrid={true}>
      {/* Hero Section with Game Vibe */}
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
              { icon: Brain, title: "Memory Games", desc: "Challenge your working memory with pattern recognition and sequence tests.", color: "text-memory", glow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]" },
              { icon: Zap, title: "Reflex Tests", desc: "Measure and improve your reaction time with visual and audio challenges.", color: "text-reflex", glow: "group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
              { icon: Gauge, title: "Speed Challenges", desc: "Test your typing speed, clicking speed, and mental math abilities.", color: "text-speed", glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]" },
              { icon: Target, title: "Accuracy & Gaming", desc: "Improve precision with aim training and image recognition exercises.", color: "text-accuracy", glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group relative space-y-2 p-5 rounded-xl bg-card/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 ${feature.glow}`}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <h3 className={`text-lg font-bold ${feature.color} flex items-center gap-2 relative z-10`}>
                  <feature.icon className="w-5 h-5" aria-hidden="true" />
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Game Progress Bar Style Info */}
          <motion.div variants={itemVariants} className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[
                { icon: Trophy, text: "Track Progress" },
                { icon: Star, text: "Compete on Leaderboards" },
                { icon: Sparkles, text: "Unlock Achievements" },
                { icon: Zap, text: "Daily Challenges" },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-speed" />
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
            <Button variant="game" size="lg" className="w-full sm:w-auto shadow-[0_0_30px_rgba(6,182,212,0.3)]" aria-label={t('startTesting')}>
              <Gamepad2 className="w-5 h-5" />
              {t('startTesting')}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/leaderboard"
              style={{
                background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-full font-bold transition-all duration-300 cursor-pointer border-2 border-reflex/60 text-white hover:border-reflex hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 w-full sm:w-auto"
            >
              <Trophy className="w-5 h-5" />
              {t('viewLeaderboard')}
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
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.bgGlow} border ${category.borderColor}`}>
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                </div>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${category.color}`}>
                    {category.arenaName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t(`tools.${category.id}.title`)} • XP: {category.xpRange}
                  </p>
                </div>
              </div>
              {/* Quest count badge */}
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full ${category.borderColor} border bg-card/30 backdrop-blur-sm`}>
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
                  className={`group relative p-5 rounded-xl bg-card/50 backdrop-blur-xl border ${category.borderColor} ${category.shadowColor} transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl ${category.bgGlow} opacity-30`}
                    style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                  />

                  <Link
                    href={tool.href}
                    className="absolute inset-0 z-10"
                    aria-label={`${t(`tools.${category.id}.${tool.id}.title`)} - ${t(`tools.${category.id}.${tool.id}.desc`)}`}
                  >
                    <span className="sr-only">{t(`tools.${category.id}.${tool.id}.title`)} - {t(`tools.${category.id}.${tool.id}.desc`)}</span>
                  </Link>

                  <div className="relative z-0 space-y-3">
                    {/* Icon and difficulty */}
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${category.bgGlow} border ${category.borderColor}`}>
                        <tool.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[tool.difficulty]}`}>
                        {tool.difficulty}
                      </span>
                    </div>

                    {/* Title and description */}
                    <div>
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-speed transition-colors">
                        {t(`tools.${category.id}.${tool.id}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t(`tools.${category.id}.${tool.id}.desc`)}
                      </p>
                    </div>

                    {/* Play indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-muted-foreground/70">Start Quest</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-speed group-hover:translate-x-1 transition-all" />
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


