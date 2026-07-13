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
        { id: "chimp-test", href: "/memory/chimp-test", icon: Brain, difficulty: "Hard" },
        { id: "verbal-memory", href: "/memory/verbal-memory", icon: Sparkles, difficulty: "Medium" },
        { id: "object-tracking", href: "/memory/object-tracking", icon: Target, difficulty: "Hard" },
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
        { id: "time-perception", href: "/reflex/time-perception", icon: Activity, difficulty: "Medium" },
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
        { id: "color-blindness", href: "/accuracy/color-blindness", icon: Brain, difficulty: "Medium" },
        { id: "mental-rotation", href: "/accuracy/mental-rotation", icon: Target, difficulty: "Hard" },
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
        {/* AI Summary / Bottom Line for SEO/AEO */}
        <section className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" /> Key Takeaway
            </h2>
            <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Bottom Line:</strong> Reflextry is a comprehensive suite of cognitive and physical training games designed for competitive gamers, students, and athletes. It provides structured tests to measure and improve your reaction time, working memory, typing speed, and cursor precision. By practicing daily, you can track performance benchmarks and enhance your neuroplasticity.
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

        {/* Detailed SEO / AEO / GEO Section */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 space-y-12 bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 rounded-3xl"
        >
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">What is Brain Training and Reflex Testing?</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Brain training involves engaging in structured mental and physical exercises to improve cognitive functions like memory, attention, and processing speed. Reflex testing measures your physical reaction time to visual or auditory stimuli. Regular engagement in these tasks leverages neuroplasticity—the brain's ability to form new neural connections.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">How to Improve Your Scores?</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li><strong>Warm up:</strong> Start with easy tasks like Click Speed Test or Color Match.</li>
                    <li><strong>Focus on accuracy:</strong> Speed comes naturally once you are consistently accurate. Don't rush.</li>
                    <li><strong>Practice daily:</strong> Aim for 10-15 minutes of varied exercises across different arenas.</li>
                    <li><strong>Track your progress:</strong> Use our Statistics page to identify areas where your reaction time or memory limits you.</li>
                </ol>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Should I Practice Daily?</h3>
                <p className="text-muted-foreground leading-relaxed">
                    Yes. Consistent, daily practice is more effective for building procedural memory and fast-twitch muscle response than infrequent, long sessions. Aim for at least 15 minutes a day for optimal results.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Arena Comparison & Use Cases</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-black/10 dark:border-white/10">
                                <th className="p-3 text-foreground font-bold">Arena Name</th>
                                <th className="p-3 text-foreground font-bold">Best For (Use Case)</th>
                                <th className="p-3 text-foreground font-bold">Core Benefit</th>
                            </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                            <tr className="border-b border-black/5 dark:border-white/5">
                                <td className="p-3 font-semibold text-blue-500">Memory Arena</td>
                                <td className="p-3">Students, lifelong learners</td>
                                <td className="p-3">Enhances working memory & recall capacity.</td>
                            </tr>
                            <tr className="border-b border-black/5 dark:border-white/5">
                                <td className="p-3 font-semibold text-amber-500">Reflex Arena</td>
                                <td className="p-3">FPS Gamers, Drivers, Athletes</td>
                                <td className="p-3">Decreases reaction time to sudden stimuli.</td>
                            </tr>
                            <tr className="border-b border-black/5 dark:border-white/5">
                                <td className="p-3 font-semibold text-orange-500">Speed Arena</td>
                                <td className="p-3">Typists, Data Entry, MOBA Gamers</td>
                                <td className="p-3">Increases raw physical speed (CPS, WPM).</td>
                            </tr>
                            <tr className="border-b border-black/5 dark:border-white/5">
                                <td className="p-3 font-semibold text-purple-500">Gaming Arena</td>
                                <td className="p-3">Competitive eSports Players</td>
                                <td className="p-3">Improves mouse tracking, flick accuracy, and multi-tasking.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Benchmarks & Scientific Evidence</h2>
                <p className="text-muted-foreground leading-relaxed">
                    The average human visual reaction time is approximately 250 milliseconds. However, elite esports professionals frequently average between 150ms and 180ms. According to the <a href="https://pubmed.ncbi.nlm.nih.gov/24718593/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">National Institutes of Health (NIH)</a>, repetitive cognitive and motor skill training can significantly reduce reaction times and improve working memory capacity.
                </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
