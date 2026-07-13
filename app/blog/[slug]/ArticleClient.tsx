"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, BookOpen, Star } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  date: string;
}

interface ArticleClientProps {
  article: Article;
  children: React.ReactNode;
}

export default function ArticleClient({ article, children }: ArticleClientProps) {
  // Estimated word count approximation
  const wordCount = 1250; 

  const FLOATING_SHAPES = [
    { value: "⛶", x: "8%", y: "15%", size: "text-7xl", delay: 0, duration: 11, opacity: 0.12, rotate: 15 },
    { value: "▲", x: "88%", y: "12%", size: "text-6xl", delay: 1, duration: 13, opacity: 0.08, rotate: -25 },
    { value: "◆", x: "6%", y: "65%", size: "text-8xl", delay: 2, duration: 10, opacity: 0.08, rotate: 35 },
    { value: "●", x: "85%", y: "70%", size: "text-7xl", delay: 0.5, duration: 9, opacity: 0.10, rotate: -15 },
    { value: "■", x: "45%", y: "82%", size: "text-6xl", delay: 3, duration: 14, opacity: 0.09, rotate: 20 }
  ];

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Floating Parallax Shapes */}
      {FLOATING_SHAPES.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute pointer-events-none select-none z-0"
          style={{
            left: item.x,
            top: item.y,
            opacity: item.opacity,
          }}
          animate={{
            y: [0, -25, 0]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay
          }}
        >
          <div 
            className={`${item.size} font-mono font-black text-cyan-600`}
            style={{
              transform: `perspective(800px) rotateX(25deg) rotateY(-20deg) rotateZ(${item.rotate}deg)`,
              filter: "drop-shadow(2px 4px 6px rgba(15,23,42,0.06)) drop-shadow(4px 10px 15px rgba(6,182,212,0.08))"
            }}
          >
            {item.value}
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col pt-8 space-y-8">
        
        {/* Back navigation */}
        <div className="flex justify-start">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-cyan-600 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-500" />
            Back to Journal Hub
          </Link>
        </div>

        {/* Article Header Card */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.02)]"
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {article.category && (
              <span className="px-3 py-1 text-[10px] font-mono font-bold bg-cyan-50 border border-cyan-200 text-cyan-600 rounded-full uppercase tracking-wider">
                {article.category}
              </span>
            )}
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-mono font-black text-slate-800 leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed font-sans">
            {article.description}
          </p>
        </motion.header>

        {/* Article content block */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(15,23,42,0.03)] overflow-hidden"
        >
          {/* Decal Corner Borders */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

          <div
            className="prose prose-slate max-w-none
              prose-headings:font-mono prose-headings:font-black prose-headings:text-slate-850 prose-headings:uppercase
              prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-cyan-655 prose-a:underline hover:prose-a:text-cyan-500
              prose-strong:text-slate-800 prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:text-slate-600
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:text-slate-600
              prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-500 prose-blockquote:my-6
              prose-code:text-rose-600 prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm"
          >
            {children}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 border-t border-slate-100 pt-6 mt-10">
            <BookOpen className="w-4 h-4 text-slate-300" />
            <span>{wordCount.toLocaleString()} WORDS ESTIMATED</span>
          </div>
        </motion.article>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white border border-slate-200 rounded-[2rem] p-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.04)]"
        >
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

          <div className="relative z-10 flex flex-col items-center space-y-5 max-w-lg mx-auto">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-cyan-600" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-mono font-black text-slate-800 uppercase tracking-wider">
                Put Strategies Into Action
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translate science into cognitive resilience. Train with our interactive micro-tools to track and benchmark progress.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-1 w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative h-11 flex-1 max-w-[200px]">
                <div className="absolute inset-0 rounded-xl bg-cyan-700 translate-y-1" />
                <Link
                  href="/tools"
                  className="absolute inset-0 px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-mono font-bold tracking-widest text-xs border border-cyan-400 shadow-sm flex items-center justify-center"
                >
                  Explore All Tools
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative h-11 flex-1 max-w-[200px]">
                <div className="absolute inset-0 rounded-xl bg-slate-400 translate-y-1" />
                <Link
                  href="/blog"
                  className="absolute inset-0 px-6 py-2.5 rounded-xl bg-white text-slate-700 font-mono font-bold tracking-widest text-xs border border-slate-200 shadow-sm flex items-center justify-center"
                >
                  Other Articles
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
