"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, Activity, Hash, Grid, Palette, Shapes, Shuffle,
  BookOpen, Layers, Sparkles
} from "lucide-react";

interface ToolItem {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  glow: string;
  href: string;
}

const MEMORY_TOOLS: ToolItem[] = [
  {
    title: "Chimp Test",
    desc: "Test your working memory against a chimpanzee. Memorize the number sequence.",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/chimp-test",
  },
  {
    title: "Verbal Memory",
    desc: "Keep track of how many words you've seen and distinguish them from new ones.",
    icon: BookOpen,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/verbal-memory",
  },
  {
    title: "Sequence Memory",
    desc: "Memorize and repeat an increasingly complex flashing button pattern.",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/sequence",
  },
  {
    title: "Object Tracking",
    desc: "Track multiple moving targets among distractors and identify them when they stop.",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/object-tracking",
  },
  {
    title: "Number Memory",
    desc: "Remember and repeat the longest digit strings you can hold in active memory.",
    icon: Hash,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/number",
  },
  {
    title: "Visual Memory",
    desc: "Retain spatial coordinates of highlighted blocks in expanding matrices.",
    icon: Grid,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/visual",
  },
  {
    title: "Color Matching",
    desc: "Verify semantic colors against text indicators under high speeds.",
    icon: Palette,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/color",
  },
  {
    title: "Shape Recognition",
    desc: "Identify shape details and geometry configurations within custom grids.",
    icon: Shapes,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/shape",
  },
  {
    title: "Symbol Matching",
    desc: "Scan and recall symbol configurations inside coordinate boxes.",
    icon: Shuffle,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/symbol",
  },
  {
    title: "Word Recall",
    desc: "Memorize and recall random lists of words to test linguistic retention.",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/word-recall",
  },
  {
    title: "Card Match",
    desc: "Classic card-flipping pairs board match, testing visual-spatial memory.",
    icon: Layers,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/card-match",
  },
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Brain className="w-32 h-32 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Grid className="w-40 h-40 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function MemoryHubClient() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden relative">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto space-y-12 relative z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="inline-block relative mb-4"
                        suppressHydrationWarning
                    >
                        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Brain className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-blue-400 dark:via-indigo-400 dark:to-indigo-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-blue-400" />
                            Memory Training
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Expand your working memory capacity and cognitive retention.
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        Your working memory is the scratchpad of your brain. By actively challenging your ability to hold and process visual, spatial, and sequential information, you can physically strengthen the neural pathways responsible for focus and retention.
                    </p>
                </motion.div>

                {/* AI Summary / Bottom Line for SEO/AEO */}
                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" /> Key Takeaway
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Bottom Line:</strong> The Memory Arena provides a suite of cognitive tests designed for students, older adults, and lifelong learners. It offers interactive tools to measure and enhance your working memory, spatial recall, and visual recognition. Regular practice leverages neuroplasticity to improve your ability to hold and process information simultaneously.
                    </p>
                </motion.section>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Working Memory</h3>
                            <p className="text-sm text-muted-foreground">Hold more info</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Grid className="w-8 h-8 text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Spatial Recall</h3>
                            <p className="text-sm text-muted-foreground">Map your surroundings</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">💡</div>
                            <h3 className="text-base font-bold text-foreground mb-1">Sharper Focus</h3>
                            <p className="text-sm text-muted-foreground">Eliminate brain fog</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {MEMORY_TOOLS.map((tool, index) => (
                            <motion.div
                                key={tool.title}
                                variants={itemVariants}
                                className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Link
                                    href={tool.href}
                                    className="absolute inset-0 z-10"
                                    aria-label={`${tool.title} - ${tool.desc}`}
                                >
                                    <span className="sr-only">{tool.title} - {tool.desc}</span>
                                </Link>
                                <tool.icon className={`w-12 h-12 text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{tool.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{tool.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detailed SEO / AEO / GEO Section */}
                    <div className="max-w-4xl mx-auto mt-16 space-y-12 text-left pt-6 border-t border-black/10 dark:border-white/10 relative z-10">
                        
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground">What is Working Memory Training?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Working memory training involves engaging in structured cognitive exercises—like remembering digit sequences or spatial grids—to expand the "scratchpad" of your brain. By actively challenging your ability to hold and process visual, spatial, and sequential information, you can physically strengthen the neural pathways responsible for focus and retention.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">How to Improve Your Memory Score?</h2>
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                <li><strong>Use Chunking:</strong> Break long strings of numbers (e.g., 9-2-5-4) into smaller chunks (92-54).</li>
                                <li><strong>Visualize Patterns:</strong> In the Visual Memory test, try to see the highlighted squares as a cohesive shape rather than individual blocks.</li>
                                <li><strong>Minimize Distractions:</strong> Working memory requires total focus. Play in a quiet environment.</li>
                                <li><strong>Practice Consistently:</strong> Just 10 minutes a day yields better cognitive adaptations than long, infrequent sessions.</li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground">Should I Practice Daily?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Yes. Consistent daily stimulation is key to promoting neuroplasticity, which is the brain's ability to reorganize itself by forming new neural connections.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Memory Tools Comparison</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-black/10 dark:border-white/10">
                                            <th className="p-3 text-foreground font-bold">Tool Name</th>
                                            <th className="p-3 text-foreground font-bold">Best For (Use Case)</th>
                                            <th className="p-3 text-foreground font-bold">Core Benefit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <td className="p-3 font-semibold text-blue-500">Number Memory</td>
                                            <td className="p-3">Math students, programmers</td>
                                            <td className="p-3">Trains the brain's phonological loop to hold long numeric strings.</td>
                                        </tr>
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <td className="p-3 font-semibold text-blue-500">Visual Memory</td>
                                            <td className="p-3">Designers, architects</td>
                                            <td className="p-3">Improves the visuospatial sketchpad for spatial coordination.</td>
                                        </tr>
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <td className="p-3 font-semibold text-blue-500">Sequence Memory</td>
                                            <td className="p-3">Musicians, general cognition</td>
                                            <td className="p-3">Enhances sequential pattern recognition and focus endurance.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Benchmarks & Scientific Proof</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The average human can hold about 7 (plus or minus 2) items in their working memory at once, a concept famously described by cognitive psychologist George A. Miller. However, through techniques like chunking, this limit can be effectively bypassed. According to research cited by the <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2629068/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">National Institutes of Health (NIH)</a>, working memory training can lead to significant improvements in fluid intelligence. In our platform, the average user reaches a digit span of 9 after 2 weeks of training.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">Can you actually improve your memory?</h3>
                                <p className="text-muted-foreground mb-3">Yes. While you cannot easily change your long-term memory capacity, you can significantly enhance your working (short-term) memory. Consistent practice with tools like our Number Memory or Visual Memory tests trains your brain to chunk information more efficiently, making it easier to hold more data simultaneously.</p>
                            </div>
                            
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">What is the 'Chunking' technique?</h3>
                                <p className="text-muted-foreground mb-3">Chunking is a mnemonic strategy where you group smaller, individual pieces of data into larger, meaningful units (chunks). For example, rather than remembering the sequence 4-7-1-9-2-8 as six distinct digits, your brain can group them as 471 and 928, effectively reducing the cognitive load from six items to just two.</p>
                            </div>
                        </div>
                    </div>

                    {/* Related Categories */}
                    <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 relative z-10">
                        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Explore Other Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/gaming" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center">
                                <div className="text-purple-500 text-2xl mb-2 drop-shadow-sm">🎮</div>
                                <div className="text-sm font-bold text-foreground">Gaming Lab</div>
                            </Link>
                            <Link href="/reflex" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-center">
                                <div className="text-pink-500 text-2xl mb-2 drop-shadow-sm">⚡</div>
                                <div className="text-sm font-bold text-foreground">Reflex Tests</div>
                            </Link>
                            <Link href="/speed" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center">
                                <div className="text-purple-500 text-2xl mb-2 drop-shadow-sm">⌨️</div>
                                <div className="text-sm font-bold text-foreground">Speed Tests</div>
                            </Link>
                            <Link href="/accuracy" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-center">
                                <div className="text-pink-500 text-2xl mb-2 drop-shadow-sm">🎯</div>
                                <div className="text-sm font-bold text-foreground">Accuracy Tools</div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
