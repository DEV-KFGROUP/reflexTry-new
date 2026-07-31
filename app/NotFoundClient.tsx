"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Target, Zap, Keyboard, Brain, AlertCircle } from 'lucide-react';

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
    );
};

export default function NotFoundClient({ locale }: { locale: string }) {

  return (
    <div className="bg-background min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <FloatingBackground />
      
      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="text-3xl font-bold text-foreground mt-6 flex items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-500" />
            Page Not Found
          </div>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            The requested sector could not be found on this server. It might have been moved, deleted, or you took a wrong turn.
          </p>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 mt-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                <Home className="w-5 h-5" />
                Return to Base
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-foreground font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Popular Categories with Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-6 font-medium text-lg">Or deploy to a training arena:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/memory" className="group">
              <div className="p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-blue-500/5 hover:border-blue-500/30 transition-all backdrop-blur-md flex flex-col items-center justify-center gap-3 h-full">
                <Brain className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-foreground">Memory Arena</div>
              </div>
            </Link>
            <Link href="/reflex" className="group">
              <div className="p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-amber-500/5 hover:border-amber-500/30 transition-all backdrop-blur-md flex flex-col items-center justify-center gap-3 h-full">
                <Zap className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-foreground">Reflex Arena</div>
              </div>
            </Link>
            <Link href="/speed" className="group">
              <div className="p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-orange-500/5 hover:border-orange-500/30 transition-all backdrop-blur-md flex flex-col items-center justify-center gap-3 h-full">
                <Keyboard className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-foreground">Speed Arena</div>
              </div>
            </Link>
            <Link href="/accuracy" className="group">
              <div className="p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all backdrop-blur-md flex flex-col items-center justify-center gap-3 h-full">
                <Target className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-foreground">Accuracy Arena</div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
