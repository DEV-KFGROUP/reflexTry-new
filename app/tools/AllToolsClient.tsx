"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target, Keyboard, Zap, Activity, MousePointer2, Calculator, Type, Grid3X3, Volume2, Eye, Move, Brain, Hash } from "lucide-react";

export default function AllToolsClient() {

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

    const toolCategories = [
        {
            id: "memory",
            icon: Activity,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
            borderColor: "border-pink-500/30",
            tools: [
                { id: "sequence", href: "/memory/sequence", icon: Zap, title: "Sequence Memory", desc: "Remember an increasingly long pattern of button presses." },
                { id: "number", href: "/memory/number", icon: Keyboard, title: "Number Memory", desc: "Remember the longest number you can." },
                { id: "visual", href: "/memory/visual", icon: Target, title: "Visual Memory", desc: "Remember an increasingly large board of squares." },
                { id: "color", href: "/memory/color", icon: Activity, title: "Color Match", desc: "Does the meaning of the top word match the text color of the bottom word?" },
                { id: "shape", href: "/memory/shape", icon: Zap, title: "Shape Memory", desc: "Remember shapes from the grid" },
                { id: "symbol", href: "/memory/symbol", icon: Target, title: "Symbol Memory", desc: "Remember and redraw the symbols" },
                { id: "word-recall", href: "/memory/word-recall", icon: Target, title: "Word Recall", desc: "Memorize and recall lists of words." },
                { id: "card-match", href: "/memory/card-match", icon: Activity, title: "Card Match", desc: "Classic card-flipping pairs memory game." },
            ]
        },
        {
            id: "reflex",
            icon: Zap,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/30",
            tools: [
                { id: "reaction", href: "/reflex/reaction", icon: Zap, title: "Reaction Time", desc: "Test your visual reflexes." },
                { id: "sound", href: "/reflex/sound", icon: Volume2, title: "Sound Reaction", desc: "Test your auditory reflexes" },
                { id: "grid", href: "/reflex/grid", icon: Target, title: "Grid Click", desc: "Click the highlighted squares in a grid" },
                { id: "peripheral", href: "/reflex/peripheral", icon: Eye, title: "Peripheral Vision", desc: "Test your peripheral reaction" },
                { id: "direction", href: "/reflex/direction", icon: Move, title: "Direction Match", desc: "React to directional cues" },
                { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Zap, title: "Multi Stimulus", desc: "React to multiple sensory cues" },
                { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Activity, title: "Sequence Reaction", desc: "Follow reaction sequences" },
                { id: "whack-a-mole", href: "/reflex/whack-a-mole", icon: Zap, title: "Whack-a-Mole", desc: "Tap moles before they disappear!" },
                { id: "color-switch", href: "/reflex/color-switch", icon: Brain, title: "Color Switch", desc: "Identify ink colors, ignore the word." },
            ]
        },
        {
            id: "speed",
            icon: Keyboard,
            color: "text-teal-500",
            bgColor: "bg-teal-500/10",
            borderColor: "border-teal-500/30",
            tools: [
                { id: "cps", href: "/speed/click", icon: MousePointer2, title: "Click Speed", desc: "Test how fast you can click." },
                { id: "math", href: "/speed/math", icon: Calculator, title: "Math Speed", desc: "Test your mental math speed" },
                { id: "typing", href: "/speed/typing", icon: Keyboard, title: "Typing Test", desc: "How many words per minute can you type?" },
                { id: "word", href: "/speed/words", icon: Type, title: "Word Reading", desc: "Test your reading speed" },
                { id: "grid", href: "/speed/grid", icon: Grid3X3, title: "Grid Speed", desc: "Clear the grid as fast as possible" },
                { id: "number-rush", href: "/speed/number-rush", icon: Hash, title: "Number Rush", desc: "Find numbers 1→N in order, as fast as possible." },
                { id: "quick-sort", href: "/speed/quick-sort", icon: ArrowRight, title: "Quick Sort", desc: "Sort items into categories before time runs out." },
            ]
        },
        {
            id: "gaming",
            icon: Target,
            color: "text-teal-500",
            bgColor: "bg-teal-500/10",
            borderColor: "border-teal-500/30",
            tools: [
                { id: "aim", href: "/gaming/aim", icon: Target, title: "Aim Trainer", desc: "How quickly can you hit all the targets?" },
                { id: "rpg", href: "/gaming/reaction", icon: Zap, title: "RPG Reaction", desc: "Test your situational gaming reaction" },
                { id: "target-tracking", href: "/gaming/target-tracking", icon: Target, title: "Target Tracking", desc: "Infinite smooth tracking accuracy test." },
                { id: "endless-dodge", href: "/gaming/endless-dodge", icon: Zap, title: "Endless Dodge", desc: "Survive a bullet-hell reaction test." },
                { id: "stroop-drop", href: "/gaming/stroop-drop", icon: Brain, title: "Stroop Drop", desc: "Infinite falling words cognitive test." },
                { id: "flick-shot", href: "/gaming/flick-shot", icon: Target, title: "Flick Shot", desc: "Snap to targets before they vanish." },
                { id: "rhythm-tap", href: "/gaming/rhythm-tap", icon: Activity, title: "Rhythm Tap", desc: "Hit falling notes with perfect timing." },
            ]
        },
        {
            id: "accuracy",
            icon: Target,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/30",
            tools: [
                { id: "image", href: "/accuracy/image-recognition", icon: Target, title: "Image Recognition", desc: "Spot the differences or find the image" },
                { id: "data", href: "/accuracy/data", icon: Keyboard, title: "Data Entry", desc: "Type data accurately" },
                { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Brain, title: "Pattern Matching", desc: "Find the matching patterns" },
                { id: "precision-click", href: "/accuracy/precision-click", icon: Target, title: "Precision Click", desc: "Hit small moving targets" },
                { id: "angle-estimation", href: "/accuracy/angle-estimation", icon: Target, title: "Angle Estimation", desc: "Guess the angle and test your geometric intuition" },
                { id: "color-match", href: "/accuracy/color-match", icon: Activity, title: "Color Match", desc: "Match the target color using RGB sliders" },
            ]
        }
    ];

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                        All Tools
                    </h1>
                    <p className="text-lg text-theme-secondary max-w-2xl mx-auto mb-4">
                        Reflextry provides a comprehensive suite of free brain training games and cognitive tests. Whether you are a competitive gamer looking to improve reaction times, a student aiming to boost working memory, or just seeking to keep your mind sharp, these tools offer scientifically-inspired exercises to measure and enhance your mental agility.
                    </p>
                </motion.div>

                {/* Category Sections */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {toolCategories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <category.icon className={`w-6 h-6 ${category.color}`} />
                                <h2 className="text-2xl font-bold text-theme-primary uppercase">{category.id} Arena</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.tools.map((tool, index) => (
                                    <motion.div
                                        key={tool.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        className={`group relative p-6 rounded-2xl bg-theme-surface border ${category.borderColor} hover:border-teal-500/50 hover:bg-theme-surface-highlight transition cursor-pointer shadow-lg`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />
                                        <Link
                                            href={tool.href}
                                            className="absolute inset-0 z-10"
                                            aria-label={`${tool.title} - ${tool.desc}`}
                                        >
                                            <span className="sr-only">{tool.title} - {tool.desc}</span>
                                        </Link>
                                        <div className="flex items-start justify-between mb-4">
                                            <tool.icon className={`w-10 h-10 ${category.color} relative z-0`} />
                                            <ArrowRight className="w-5 h-5 text-theme-muted group-hover:text-teal-500 transition-colors relative z-0" />
                                        </div>
                                        <h3 className="text-lg font-bold text-theme-primary mb-2 relative z-0">{tool.title}</h3>
                                        <p className="text-sm text-theme-secondary relative z-0">{tool.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10 text-theme-primary">Frequently Asked Questions About Brain Training Tools</h2>
                    <div className="space-y-8 text-left">
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">What are the best tools for improving reaction time?</h3>
                            <p className="text-theme-secondary">For improving reaction time, we recommend starting with the classic Reaction Time test in our Reflex Arena, followed by the Sequence Reaction and Multi Stimulus tools. These train both your physical response speed and cognitive processing speed.</p>
                        </div>
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">How often should I use these cognitive training games?</h3>
                            <p className="text-theme-secondary">For optimal results, we suggest practicing for 10-15 minutes daily. Consistency is key in neuroplasticity. Use the Memory arena to improve retention, and the Speed arena to enhance quick decision-making.</p>
                        </div>
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">Are these tools useful for esports and competitive gamers?</h3>
                            <p className="text-theme-secondary">Yes. Professional gamers frequently use our Aim Trainer, Grid Click, and Flick Shot tools to warm up their physical mechanics, hand-eye coordination, and peripheral vision before competitive matches.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}





