"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, TrendingUp } from "lucide-react";

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    readTime: string;
    category: string;
    date: string;
}

const blogPosts: BlogPost[] = [
    {
        slug: "how-to-improve-memory-techniques",
        title: "How to Improve Memory: Science-Backed Techniques That Actually Work",
        description: "Discover proven memory improvement techniques based on neuroscience research. Learn about spaced repetition, memory palaces, and other effective methods to enhance your recall abilities.",
        readTime: "12 min read",
        category: "Memory",
        date: "2025-01-15"
    },
    {
        slug: "reaction-time-training-guide",
        title: "Reaction Time Training: Complete Guide to Faster Response Times",
        description: "Learn how to improve your reaction time with evidence-based training methods. Understand the science behind reaction speed and practical exercises to enhance your reflexes.",
        readTime: "10 min read",
        category: "Reflex",
        date: "2025-01-10"
    },
    {
        slug: "brain-training-benefits",
        title: "The Science of Brain Training: Benefits and Evidence",
        description: "Explore the scientific evidence behind brain training. Learn about neuroplasticity, cognitive reserve, and how regular mental exercises can improve your brain health and performance.",
        readTime: "15 min read",
        category: "Science",
        date: "2025-01-05"
    },
    {
        slug: "working-memory-exercises",
        title: "Working Memory Exercises: Improve Your Focus and Cognitive Control",
        description: "Master your working memory with practical exercises and strategies. Learn how to boost concentration, reduce distractions, and improve your ability to process information efficiently.",
        readTime: "11 min read",
        category: "Memory",
        date: "2024-12-28"
    },
    {
        slug: "typing-speed-improvement",
        title: "How to Type Faster: Advanced Techniques for Speed and Accuracy",
        description: "Transform your typing skills with expert techniques. Discover keyboard layouts, practice methods, and ergonomic tips to significantly increase your words per minute.",
        readTime: "9 min read",
        category: "Speed",
        date: "2024-12-20"
    },
    {
        slug: "cognitive-aging-prevention",
        title: "Cognitive Aging: How Brain Training Can Help Maintain Mental Sharpness",
        description: "Learn how brain training can help prevent cognitive decline as you age. Understand the latest research on maintaining mental acuity and protecting your brain health long-term.",
        readTime: "13 min read",
        category: "Health",
        date: "2024-12-15"
    },
    {
        slug: "complete-guide-memory-speed-gaming-tools",
        title: "Complete Guide to Memory, Speed, and Gaming Training Tools",
        description: "Explore all memory games, speed tests, and gaming tools available on Reflextry. Learn how each tool works, when to use them, and how to maximize your training results.",
        readTime: "18 min read",
        category: "Tools",
        date: "2025-01-20"
    },
    {
        slug: "complete-guide-reflex-accuracy-tools",
        title: "Complete Guide to Reflex and Accuracy Training Tools",
        description: "Master all reflex tests and accuracy tools on Reflextry. Learn how each tool measures and improves your reaction time, precision, and cognitive performance.",
        readTime: "16 min read",
        category: "Tools",
        date: "2025-01-18"
    }
];

export default function BlogHubClient() {
    return (
        <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <BookOpen className="w-12 h-12 text-neon-teal" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Brain Training Articles & Guides
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Expert insights, research-backed strategies, and practical tips to enhance your cognitive performance, memory, and mental abilities.
                    </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-neon-teal/50 transition-all group"
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 text-xs font-medium bg-neon-teal/20 text-neon-teal rounded-full">
                                        {post.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {post.readTime}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-neon-teal transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {post.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    <span className="text-neon-teal group-hover:translate-x-1 transition-transform inline-flex items-center">
                                        Read more →
                                    </span>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Featured Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-neon-teal/20 to-electric-purple/20 border border-neon-teal/30 rounded-2xl p-8 text-center"
                >
                    <TrendingUp className="w-12 h-12 text-neon-teal mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Start Training Your Brain Today
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Put theory into practice with our free brain training tools. Improve your memory, reaction time, and cognitive abilities with interactive exercises.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/memory"
                            className="px-6 py-3 bg-neon-teal text-black rounded-lg font-semibold hover:bg-neon-yellow transition-colors"
                        >
                            Try Memory Games
                        </Link>
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Explore All Tools
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
