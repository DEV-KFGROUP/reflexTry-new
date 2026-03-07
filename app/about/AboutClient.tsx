"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Zap, Users, Heart, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutClient() {
    const values = [
        {
            icon: Target,
            title: "Accuracy",
            description: "We provide precise measurements and reliable testing methods to track your true performance capabilities.",
            color: "text-neon-teal"
        },
        {
            icon: Zap,
            title: "Innovation",
            description: "Constantly developing new ways to challenge both cognitive and physical response times.",
            color: "text-neon-yellow"
        },
        {
            icon: Users,
            title: "Accessibility",
            description: "Making professional-grade testing tools available to everyone globally, completely free of charge.",
            color: "text-electric-purple"
        },
        {
            icon: Heart,
            title: "User First",
            description: "Building community-driven features and listening carefully to player feedback.",
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
                        About Reflextry
                    </h1>
                    <p className="text-gray-400 text-lg">
                        The ultimate platform for testing and improving your physical reactions and cognitive speed.
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
                            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Our mission is to democratize reflex training by offering high-quality, scientifically sound performance-tracking challenges for gamers, athletes, and anyone wanting to stay sharp. We believe improvement starts with measurement.
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
                    <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>What started as a simple reaction time test rapidly grew into a comprehensive hub for cognitive evaluation.</p>
                        <p>We realized there was a lack of unified platforms allowing users to compare their raw mechanical skill against others globally.</p>
                        <p>Today, Reflextry serves thousands of players globally—helping them learn, compete, and improve.</p>
                    </div>
                </motion.div>

                {/* Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-bold text-white text-center">Core Values</h2>
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
                    <h2 className="text-2xl font-bold text-white mb-6">What We Offer</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">🧠 Brain Training Games</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">Stimulate cognitive function with visual memory mapping, pattern recognition, and number sequence recalls.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">⚡ Reaction & Speed Tests</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">Measure your raw physical limits down to the millisecond with our suite of aim, click, and reaction arenas.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">📊 Progress Tracking</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">Save your scores and watch your performance curve climb as you consistently train and test your limits over time.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">🏆 Achievements & Challenges</h3>
                            <p className="text-gray-300 leading-relaxed text-sm mb-4">Unlock ranks, overcome daily objectives, and compete against the world for the number one spot on the leaderboards.</p>
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
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Meet the Team</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Rabadiya Kaushik */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-neon-teal/20 group-hover:border-neon-teal/50 transition-colors duration-300">
                                <Image
                                    src="/images/team/rabadiya-kaushik.webp"
                                    alt="Rabadiya Kaushik"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-teal transition-colors">Rabadiya Kaushik</h3>
                            <p className="text-neon-teal font-medium tracking-wide">Founder & Developer</p>
                        </div>

                        {/* Harshil Miyani */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden border-4 border-electric-purple/20 group-hover:border-electric-purple/50 transition-colors duration-300">
                                <Image
                                    src="/images/team/harshil-miyani.webp"
                                    alt="Harshil Miyani"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-electric-purple transition-colors">Harshil Miyani</h3>
                            <p className="text-electric-purple font-medium tracking-wide">SEO Expert</p>
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        We are a passionate team dedicated to pushing the boundaries of web experiences. Combining technical expertise with a keen understanding of digital presence.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Together, we strive to deliver an exceptional platform that not only performs flawlessly but reaches the right audience effectively.
                    </p>
                </motion.div>

                {/* Community Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="bg-gradient-to-r from-neon-teal/20 to-electric-purple/20 border border-neon-teal/30 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Join the Community</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Ready to see where you stand? Explore the leaderboards, challenge your friends, and connect with other members of the Reflextry network.
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
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your Limits?</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                        Jump straight into the action and find out how fast you truly are.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-neon-teal to-electric-purple text-white rounded-lg font-semibold hover:from-neon-yellow hover:to-neon-teal transition-all"
                    >
                        Start Playing Now
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

