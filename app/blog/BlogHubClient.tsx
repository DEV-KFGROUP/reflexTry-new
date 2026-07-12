"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, TrendingUp, Calendar, ArrowRight } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  date: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  memory:   { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", glow: "shadow-[0_0_12px_rgba(168,85,247,0.15)]" },
  reaction: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", glow: "shadow-[0_0_12px_rgba(6,182,212,0.15)]" },
  speed:    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]" },
  accuracy: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", glow: "shadow-[0_0_12px_rgba(244,63,94,0.15)]" },
};

export default function BlogHubClient({ posts }: { posts: BlogPost[] }) {
  
  const FLOATING_SHAPES = [
    { value: "⛶", x: "8%", y: "15%", size: "text-7xl", delay: 0, duration: 11, opacity: 0.12, rotate: 15 },
    { value: "▲", x: "88%", y: "12%", size: "text-6xl", delay: 1, duration: 13, opacity: 0.08, rotate: -25 },
    { value: "◆", x: "6%", y: "65%", size: "text-8xl", delay: 2, duration: 10, opacity: 0.08, rotate: 35 },
    { value: "●", x: "85%", y: "70%", size: "text-7xl", delay: 0.5, duration: 9, opacity: 0.10, rotate: -15 },
    { value: "■", x: "45%", y: "82%", size: "text-6xl", delay: 3, duration: 14, opacity: 0.09, rotate: 20 },
    { value: "☵", x: "78%", y: "25%", size: "text-8xl", delay: 1.5, duration: 12, opacity: 0.07, rotate: -10 },
    { value: "❖", x: "24%", y: "42%", size: "text-7xl", delay: 2.5, duration: 15, opacity: 0.09, rotate: 8 }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Floating 3D parallax elements */}
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

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center space-y-12 pt-8">
        
        {/* Header HUD panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 w-full max-w-3xl relative"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-cyan-500/5 blur-2xl rounded-full" />
            
            {/* Glowing Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-center mx-auto mb-6 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <BookOpen className="w-7 h-7 text-slate-700 relative z-10 group-hover:text-violet-600 transition-colors" />
            </motion.div>

            <h1 className="relative text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800 drop-shadow-[0_0_15px_rgba(15,23,42,0.04)]">
              COGNITIVE JOURNAL
            </h1>
            <div className="flex items-center justify-center gap-3 mt-1.5">
              <span className="h-[1px] w-8 bg-slate-300" />
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">Expert insights & research articles</p>
              <span className="h-[1px] w-8 bg-slate-300" />
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm"
          >
            <p className="text-sm font-mono text-slate-400 leading-relaxed">
              NO ARTICLES PUBLISHED YET.<br />
              CHECK BACK SOON FOR NEW SCIENCE GUIDES.
            </p>
          </motion.div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => {
              const catKey = post.category?.toLowerCase() || "memory";
              const catStyle = CATEGORY_STYLES[catKey] || CATEGORY_STYLES.memory;
              
              return (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full p-6 justify-between select-none">
                    <div className="space-y-4">
                      {/* Meta information row */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${catStyle.bg} ${catStyle.text} ${catStyle.border} ${catStyle.glow}`}>
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h2 className="text-xl font-mono font-bold text-slate-800 leading-snug group-hover:text-cyan-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                          {post.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 group-hover:text-cyan-600 inline-flex items-center gap-1 transition-colors">
                        Read Article
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Start Training CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative w-full bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.04)]"
        >
          {/* Decal Corner Borders */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-mono font-black text-slate-800 uppercase tracking-wider">
                Begin Cognitive Training
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                Translate theory into concrete results. Re-deploy your mental limits, calibrate your memory, reaction time, and precision clicking skills.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative h-12">
                <div className="absolute inset-0 rounded-xl bg-cyan-700 translate-y-1.5" />
                <Link
                  href="/memory"
                  className="relative px-8 py-3.5 rounded-xl bg-cyan-500 text-white font-mono font-bold tracking-widest text-xs border border-cyan-400 shadow-md flex items-center justify-center"
                >
                  Calibrate Memory
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative h-12">
                <div className="absolute inset-0 rounded-xl bg-slate-400 translate-y-1.5" />
                <Link
                  href="/tools"
                  className="relative px-8 py-3.5 rounded-xl bg-white text-slate-700 font-mono font-bold tracking-widest text-xs border border-slate-200 shadow-md flex items-center justify-center"
                >
                  Explore All calibration tools
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
