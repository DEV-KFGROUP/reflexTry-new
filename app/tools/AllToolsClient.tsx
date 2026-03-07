"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Target, Keyboard, Zap, Activity, MousePointer2, Calculator, Type, Grid3X3, Volume2, Eye, Move, Brain } from "lucide-react";

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
            color: "text-neon-pink",
            bgColor: "bg-neon-pink/10",
            borderColor: "border-neon-pink/30",
            tools: [
                { id: "sequence", href: "/memory/sequence", icon: Zap, title: "Sequence Memory", desc: "Remember an increasingly long pattern of button presses." },
                { id: "number", href: "/memory/number", icon: Keyboard, title: "Number Memory", desc: "Remember the longest number you can." },
                { id: "visual", href: "/memory/visual", icon: Target, title: "Visual Memory", desc: "Remember an increasingly large board of squares." },
                { id: "color", href: "/memory/color", icon: Activity, title: "Color Match", desc: "Does the meaning of the top word match the text color of the bottom word?" },
                { id: "shape", href: "/memory/shape", icon: Zap, title: "Shape Memory", desc: "Remember shapes from the grid" },
                { id: "symbol", href: "/memory/symbol", icon: Target, title: "Symbol Memory", desc: "Remember and redraw the symbols" },
            ]
        },
        {
            id: "reflex",
            icon: Zap,
            color: "text-neon-yellow",
            bgColor: "bg-neon-yellow/10",
            borderColor: "border-neon-yellow/30",
            tools: [
                { id: "reaction", href: "/reflex/reaction", icon: Zap, title: "Reaction Time", desc: "Test your visual reflexes." },
                { id: "sound", href: "/reflex/sound", icon: Volume2, title: "Sound Reaction", desc: "Test your auditory reflexes" },
                { id: "grid", href: "/reflex/grid", icon: Target, title: "Grid Click", desc: "Click the highlighted squares in a grid" },
                { id: "peripheral", href: "/reflex/peripheral", icon: Eye, title: "Peripheral Vision", desc: "Test your peripheral reaction" },
                { id: "direction", href: "/reflex/direction", icon: Move, title: "Direction Match", desc: "React to directional cues" },
                { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Zap, title: "Multi Stimulus", desc: "React to multiple sensory cues" },
                { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Activity, title: "Sequence Reaction", desc: "Follow reaction sequences" },
            ]
        },
        {
            id: "speed",
            icon: Keyboard,
            color: "text-neon-teal",
            bgColor: "bg-neon-teal/10",
            borderColor: "border-neon-teal/30",
            tools: [
                { id: "cps", href: "/speed/click", icon: MousePointer2, title: "Click Speed", desc: "Test how fast you can click." },
                { id: "math", href: "/speed/math", icon: Calculator, title: "Math Speed", desc: "Test your mental math speed" },
                { id: "typing", href: "/speed/typing", icon: Keyboard, title: "Typing Test", desc: "How many words per minute can you type?" },
                { id: "word", href: "/speed/words", icon: Type, title: "Word Reading", desc: "Test your reading speed" },
                { id: "grid", href: "/speed/grid", icon: Grid3X3, title: "Grid Speed", desc: "Clear the grid as fast as possible" },
            ]
        },
        {
            id: "gaming",
            icon: Target,
            color: "text-neon-teal",
            bgColor: "bg-neon-teal/10",
            borderColor: "border-neon-teal/30",
            tools: [
                { id: "aim", href: "/gaming/aim", icon: Target, title: "Aim Trainer", desc: "How quickly can you hit all the targets?" },
                { id: "rpg", href: "/gaming/reaction", icon: Zap, title: "RPG Reaction", desc: "Test your situational gaming reaction" },
            ]
        },
        {
            id: "accuracy",
            icon: Target,
            color: "text-neon-yellow",
            bgColor: "bg-neon-yellow/10",
            borderColor: "border-neon-yellow/30",
            tools: [
                { id: "image", href: "/accuracy/image-recognition", icon: Target, title: "Image Recognition", desc: "Spot the differences or find the image" },
                { id: "data", href: "/accuracy/data", icon: Keyboard, title: "Data Entry", desc: "Type data accurately" },
                { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Brain, title: "Pattern Matching", desc: "Find the matching patterns" },
                { id: "precision-click", href: "/accuracy/precision-click", icon: Target, title: "Precision Click", desc: "Hit small moving targets" },
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
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-teal to-electric-purple bg-clip-text text-transparent">
                        All Tools
                    </h1>
                    <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
                        Explore our complete collection of reaction, memory, speed, and accuracy tools.
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
                                <h2 className="text-2xl font-bold text-white uppercase">{category.id} Arena</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.tools.map((tool, index) => (
                                    <motion.div
                                        key={tool.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        className={`group relative p-6 rounded-2xl bg-theme-surface border ${category.borderColor} hover:border-neon-teal/50 hover:bg-theme-surface-highlight transition-all cursor-pointer shadow-lg`}
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
                                            <ArrowRight className="w-5 h-5 text-theme-muted group-hover:text-neon-teal transition-colors relative z-0" />
                                        </div>
                                        <h3 className="text-lg font-bold text-theme-primary mb-2 relative z-0">{tool.title}</h3>
                                        <p className="text-sm text-theme-secondary relative z-0">{tool.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}





