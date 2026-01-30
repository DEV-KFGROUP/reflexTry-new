"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Target, Zap, Users, Heart, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutClient() {
    const t = useTranslations('About');

    const values = [
        {
            icon: Target,
            title: t('values.accuracy'),
            description: t('values.accuracyDesc'),
            color: "text-neon-teal"
        },
        {
            icon: Zap,
            title: t('values.innovation'),
            description: t('values.innovationDesc'),
            color: "text-neon-yellow"
        },
        {
            icon: Users,
            title: t('values.accessibility'),
            description: t('values.accessibilityDesc'),
            color: "text-electric-purple"
        },
        {
            icon: Heart,
            title: t('values.userFirst'),
            description: t('values.userFirstDesc'),
            color: "text-red-400"
        },
    ];

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4"
                    >
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#00f0ff'
                        }}
                    >
                        {t('title')}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <Sparkles className="w-8 h-8 text-neon-yellow flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">{t('mission.title')}</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {t('mission.description')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Story Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">{t('story.title')}</h2>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>{t('story.paragraph1')}</p>
                        <p>{t('story.paragraph2')}</p>
                        <p>{t('story.paragraph3')}</p>
                    </div>
                </motion.div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-bold text-white text-center">{t('values.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-white/5 ${value.color}`}>
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                        <p className="text-gray-300 leading-relaxed text-sm">{value.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* What We Offer Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">{t('offer.title')}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">🧠 Brain Training Games</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">{t('offer.brainTraining')}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">⚡ Reaction & Speed Tests</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">{t('offer.reactionTests')}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">📊 Progress Tracking</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">{t('offer.progressTracking')}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">🏆 Achievements & Challenges</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">{t('offer.achievements')}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">{t('team.title')}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Rabadiya Kaushik */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-neon-teal/20 group-hover:border-neon-teal/50 transition-colors duration-300">
                                <Image
                                    src="/images/team/rabadiya-kaushik.webp"
                                    alt={t('team.members.kaushik.name')}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-teal transition-colors">{t('team.members.kaushik.name')}</h3>
                            <p className="text-neon-teal font-medium tracking-wide">{t('team.members.kaushik.role')}</p>
                        </div>

                        {/* Harshil Miyani */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-electric-purple/20 group-hover:border-electric-purple/50 transition-colors duration-300">
                                <Image
                                    src="/images/team/harshil-miyani.webp"
                                    alt={t('team.members.harshil.name')}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-electric-purple transition-colors">{t('team.members.harshil.name')}</h3>
                            <p className="text-electric-purple font-medium tracking-wide">{t('team.members.harshil.role')}</p>
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        {t('team.description')}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        {t('team.expertise')}
                    </p>
                </motion.div>

                {/* Community Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-gradient-to-r from-neon-teal/20 to-electric-purple/20 border border-neon-teal/30 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">{t('community.title')}</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        {t('community.description')}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/leaderboard"
                            className="px-6 py-3 bg-neon-teal text-black rounded-lg font-semibold hover:bg-neon-yellow transition-colors"
                        >
                            View Leaderboard
                        </Link>
                        <Link
                            href="/contact"
                            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </motion.div>

                {/* Legal Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">📜 Legal Information</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        We are committed to transparency and protecting your rights. Please review our legal documents to understand how we operate and protect your data.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/privacy"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-neon-teal/50 transition-all"
                        >
                            🔒 Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-neon-teal/50 transition-all"
                        >
                            📋 Terms of Service
                        </Link>
                        <Link
                            href="/cookies"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 hover:border-neon-teal/50 transition-all"
                        >
                            🍪 Cookie Policy
                        </Link>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="text-center bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">{t('cta.title')}</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        {t('cta.description')}
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-neon-teal to-electric-purple text-white rounded-lg font-semibold hover:from-neon-yellow hover:to-neon-teal transition-all"
                    >
                        {t('cta.button')}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

