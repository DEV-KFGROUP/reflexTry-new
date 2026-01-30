"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Clock, Calendar, ArrowLeft, BookOpen } from "lucide-react";

interface Article {
    slug: string;
    title: string;
    description: string;
    content: string;
    readTime: string;
    category: string;
    date: string;
    keywords?: string[];
}

interface ArticleClientProps {
    article: Article;
}

export default function ArticleClient({ article }: ArticleClientProps) {
    const wordCount = article.content.split(/\s+/).length;
    
    return (
        <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link 
                    href="/blog"
                    className="inline-flex items-center gap-2 text-neon-teal hover:text-neon-yellow transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Articles
                </Link>

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 text-sm font-medium bg-neon-teal/20 text-neon-teal rounded-full">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                            </div>
                        </div>
                    </div>
                    <h1 
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {article.title}
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        {article.description}
                    </p>
                </motion.header>

                {/* Article Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 mb-8"
                >
                    <div 
                        className="prose prose-invert prose-lg max-w-none
                            prose-headings:text-white prose-headings:font-bold
                            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                            prose-p:text-gray-300 prose-p:leading-relaxed
                            prose-a:text-neon-teal prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-strong:font-semibold
                            prose-ul:text-gray-300 prose-ol:text-gray-300
                            prose-li:marker:text-neon-teal
                            prose-blockquote:border-l-neon-teal prose-blockquote:text-gray-300
                            prose-code:text-neon-yellow prose-code:bg-white/10 prose-code:px-1 prose-code:rounded"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </motion.article>

                {/* Article Stats */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {wordCount.toLocaleString()} words
                    </div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-neon-teal/20 to-electric-purple/20 border border-neon-teal/30 rounded-2xl p-8 text-center"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ready to Put These Strategies Into Practice?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Start training your brain with our interactive tools and see real improvements in your cognitive abilities.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link 
                            href="/tools" 
                            className="px-6 py-3 bg-neon-teal text-black rounded-lg font-semibold hover:bg-neon-yellow transition-colors"
                        >
                            Explore All Tools
                        </Link>
                        <Link 
                            href="/blog" 
                            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Read More Articles
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
