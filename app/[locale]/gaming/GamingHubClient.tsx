"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Crosshair, Zap, Gamepad2 } from "lucide-react";

const GAMING_TOOLS = [
    {
        title: "Aim Trainer",
        desc: "Track moving targets to improve your FPS tracking.",
        icon: Crosshair,
        color: "text-red-500",
        href: "/gaming/aim",
    },
    {
        title: "RPG Reflex",
        desc: "Block enemy attacks in this gamified reaction test.",
        icon: Zap,
        color: "text-yellow-400",
        href: "/gaming/reaction",
    },
];

export default function GamingHubClient() {
    return (
        <div className="bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4"
                        suppressHydrationWarning
                    >
                        <Gamepad2 className="w-12 h-12 text-electric-purple" />
                    </motion.div>
                    <h1 
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #9d00ff, #ec4899)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#9d00ff'
                        }}
                        suppressHydrationWarning
                    >
                        Pro Gaming Lab
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Warm up your hands and sharpen your senses for your next ranked match.
                    </p>
                </div>

                {/* Quick benefits - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Better Aim</h3>
                        <p className="text-xs text-theme-secondary">Improve precision</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Faster Reactions</h3>
                        <p className="text-xs text-theme-secondary">Quick responses</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🏆</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Win More</h3>
                        <p className="text-xs text-theme-secondary">Better performance</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMING_TOOLS.map((tool, index) => (
                        <motion.div
                            key={tool.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <Link 
                                href={tool.href} 
                                className="absolute inset-0 z-10"
                                aria-label={`${tool.title} - ${tool.desc}`}
                            >
                                <span className="sr-only">{tool.title} - {tool.desc}</span>
                            </Link>
                            <tool.icon className={`w-10 h-10 ${tool.color} mb-4 group-hover:scale-110 transition-transform`} />
                            <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                            <p className="text-gray-400">{tool.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Description for SEO */}
                <div className="max-w-4xl mx-auto bg-theme-surface/30 border border-theme/30 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-theme-primary mb-4">Level Up Your Gaming Skills</h2>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        Professional esports players don't just play—they train. Our gaming tools are designed to help you 
                        develop the core skills that separate casual players from competitive ones. From aim precision to 
                        reaction timing, these exercises target the fundamentals that matter in FPS, MOBA, and action games.
                    </p>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        The best time to warm up is 10-15 minutes before your gaming session. This activates your hand-eye 
                        coordination and gets your reflexes firing at peak performance. Many pro players use similar tools 
                        as part of their daily training routine.
                    </p>
                    <h3 className="text-xl font-semibold text-theme-primary mb-3">Why Gaming Training Works</h3>
                    <ul className="text-theme-secondary space-y-2 mb-4">
                        <li>• Improved aim accuracy for FPS games like Valorant, CS2, and Apex</li>
                        <li>• Faster reaction times for clutch moments</li>
                        <li>• Better tracking skills for moving targets</li>
                        <li>• Muscle memory development through repetition</li>
                        <li>• Consistent warm-up routine before ranked matches</li>
                    </ul>
                    <p className="text-theme-secondary leading-relaxed">
                        Whether you're preparing for a tournament or just want to climb the ranks, consistent practice 
                        with our gaming tools above can give you the competitive edge you need.
                    </p>
                </div>

                {/* Related Categories Section - Internal Linking */}
                <div className="mt-12 pt-8 border-t border-theme">
                    <h3 className="text-2xl font-bold text-theme-primary mb-6 text-center">Explore Other Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/memory" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-electric-purple text-2xl mb-2">🧠</div>
                            <div className="text-sm font-semibold text-theme-primary">Memory Games</div>
                        </Link>
                        <Link href="/reflex" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-neon-yellow text-2xl mb-2">⚡</div>
                            <div className="text-sm font-semibold text-theme-primary">Reflex Tests</div>
                        </Link>
                        <Link href="/speed" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-neon-teal text-2xl mb-2">⌨️</div>
                            <div className="text-sm font-semibold text-theme-primary">Speed Tests</div>
                        </Link>
                        <Link href="/accuracy" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-electric-purple text-2xl mb-2">🎯</div>
                            <div className="text-sm font-semibold text-theme-primary">Accuracy Tools</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

