"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, TrendingUp } from "lucide-react";

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    readTime: string;
    category: string;
    date: string;
}

export default function BlogHubClient({ posts }: { posts: BlogPost[] }) {
    return (
        <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white border border-border mb-6 shadow-sm"
                    >
                        <BookOpen className="w-12 h-12 text-foreground" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                        Brain Training Articles & Guides
                    </h1>
                    <p className="text-theme-secondary text-lg max-w-2xl mx-auto">
                        Expert insights, research-backed strategies, and practical tips to enhance your cognitive performance, memory, and mental abilities.
                    </p>
                </div>

                {/* Blog Posts Grid — only posts that exist under content/blog */}
                {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16 max-w-lg mx-auto leading-relaxed">
                        No articles are available yet. Check back soon for new guides.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white border border-border rounded-2xl p-6 hover:shadow-md transition text-foreground"
                            >
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="block no-underline text-foreground [-webkit-text-fill-color:currentColor] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 text-xs font-medium bg-secondary text-foreground rounded-full">
                                            {post.category}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 text-foreground [-webkit-text-fill-color:currentColor] group-hover:text-slate-800 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 [-webkit-text-fill-color:currentColor]">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>
                                            {new Date(post.date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <span className="text-foreground group-hover:translate-x-1 transition-transform inline-flex items-center">
                                            Read more →
                                        </span>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}

                {/* Featured Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm"
                >
                    <TrendingUp className="w-12 h-12 text-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Start Training Your Brain Today
                    </h2>
                    <p className="text-theme-secondary mb-6 max-w-2xl mx-auto">
                        Put theory into practice with our free brain training tools. Improve your memory, reaction time, and cognitive abilities with interactive exercises.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/memory"
                            className="px-6 py-3 bg-foreground text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                        >
                            Try Memory Games
                        </Link>
                        <Link
                            href="/tools"
                            className="px-6 py-3 bg-white text-foreground border border-border rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Explore All Tools
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
