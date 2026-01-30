"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Target, Keyboard, Zap, Activity, MousePointer2, Calculator, Type, Grid3X3, Volume2, Eye, Move, Brain } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AllToolsClient() {
    const t = useTranslations('AllTools');
    const tHome = useTranslations('Home');

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
                { id: "sequence", href: "/memory/sequence", icon: Zap, title: tHome('tools.memory.sequence.title'), desc: tHome('tools.memory.sequence.desc') },
                { id: "number", href: "/memory/number", icon: Keyboard, title: tHome('tools.memory.number.title'), desc: tHome('tools.memory.number.desc') },
                { id: "visual", href: "/memory/visual", icon: Target, title: tHome('tools.memory.visual.title'), desc: tHome('tools.memory.visual.desc') },
                { id: "color", href: "/memory/color", icon: Activity, title: tHome('tools.memory.color.title'), desc: tHome('tools.memory.color.desc') },
                { id: "shape", href: "/memory/shape", icon: Zap, title: tHome('tools.memory.shape.title'), desc: tHome('tools.memory.shape.desc') },
                { id: "symbol", href: "/memory/symbol", icon: Target, title: tHome('tools.memory.symbol.title'), desc: tHome('tools.memory.symbol.desc') },
            ]
        },
        {
            id: "reflex",
            icon: Zap,
            color: "text-neon-yellow",
            bgColor: "bg-neon-yellow/10",
            borderColor: "border-neon-yellow/30",
            tools: [
                { id: "reaction", href: "/reflex/reaction", icon: Zap, title: tHome('tools.reflex.reaction.title'), desc: tHome('tools.reflex.reaction.desc') },
                { id: "sound", href: "/reflex/sound", icon: Volume2, title: tHome('tools.reflex.sound.title'), desc: tHome('tools.reflex.sound.desc') },
                { id: "grid", href: "/reflex/grid", icon: Target, title: tHome('tools.reflex.grid.title'), desc: tHome('tools.reflex.grid.desc') },
                { id: "peripheral", href: "/reflex/peripheral", icon: Eye, title: tHome('tools.reflex.peripheral.title'), desc: tHome('tools.reflex.peripheral.desc') },
                { id: "direction", href: "/reflex/direction", icon: Move, title: tHome('tools.reflex.direction.title'), desc: tHome('tools.reflex.direction.desc') },
                { id: "multi-stimulus", href: "/reflex/multi-stimulus", icon: Zap, title: tHome('tools.reflex.multi-stimulus.title'), desc: tHome('tools.reflex.multi-stimulus.desc') },
                { id: "sequence-reaction", href: "/reflex/sequence-reaction", icon: Activity, title: tHome('tools.reflex.sequence-reaction.title'), desc: tHome('tools.reflex.sequence-reaction.desc') },
            ]
        },
        {
            id: "speed",
            icon: Keyboard,
            color: "text-neon-teal",
            bgColor: "bg-neon-teal/10",
            borderColor: "border-neon-teal/30",
            tools: [
                { id: "cps", href: "/speed/click", icon: MousePointer2, title: tHome('tools.speed.cps.title'), desc: tHome('tools.speed.cps.desc') },
                { id: "math", href: "/speed/math", icon: Calculator, title: tHome('tools.speed.math.title'), desc: tHome('tools.speed.math.desc') },
                { id: "typing", href: "/speed/typing", icon: Keyboard, title: tHome('tools.speed.typing.title'), desc: tHome('tools.speed.typing.desc') },
                { id: "word", href: "/speed/words", icon: Type, title: tHome('tools.speed.word.title'), desc: tHome('tools.speed.word.desc') },
                { id: "grid", href: "/speed/grid", icon: Grid3X3, title: tHome('tools.speed.grid.title'), desc: tHome('tools.speed.grid.desc') },
            ]
        },
        {
            id: "gaming",
            icon: Target,
            color: "text-neon-teal",
            bgColor: "bg-neon-teal/10",
            borderColor: "border-neon-teal/30",
            tools: [
                { id: "aim", href: "/gaming/aim", icon: Target, title: tHome('tools.gaming.aim.title'), desc: tHome('tools.gaming.aim.desc') },
                { id: "rpg", href: "/gaming/reaction", icon: Zap, title: tHome('tools.gaming.rpg.title'), desc: tHome('tools.gaming.rpg.desc') },
            ]
        },
        {
            id: "accuracy",
            icon: Target,
            color: "text-neon-yellow",
            bgColor: "bg-neon-yellow/10",
            borderColor: "border-neon-yellow/30",
            tools: [
                { id: "image", href: "/accuracy/image-recognition", icon: Target, title: tHome('tools.accuracy.image.title'), desc: tHome('tools.accuracy.image.desc') },
                { id: "data", href: "/accuracy/data", icon: Keyboard, title: tHome('tools.accuracy.data.title'), desc: tHome('tools.accuracy.data.desc') },
                { id: "pattern-matching", href: "/accuracy/pattern-matching", icon: Brain, title: tHome('tools.accuracy.pattern-matching.title'), desc: tHome('tools.accuracy.pattern-matching.desc') },
                { id: "precision-click", href: "/accuracy/precision-click", icon: Target, title: tHome('tools.accuracy.precision-click.title'), desc: tHome('tools.accuracy.precision-click.desc') },
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
                        {t('title')}
                    </h1>
                    <p className="text-lg text-theme-secondary max-w-2xl mx-auto">
                        {t('subtitle')}
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
                                <h2 className="text-2xl font-bold text-white">{tHome(`tools.${category.id}.title`)}</h2>
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





