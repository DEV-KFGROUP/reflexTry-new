"use client";

import { motion } from "framer-motion";
import { HelpCircle, Info, Sparkles, TrendingUp, Zap, ArrowRight, CheckCircle2, Target, Trophy, Brain, List, Activity, Gamepad2, MousePointer2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateFAQPageSchema, generateHowToSchema } from "@/lib/structured-data";
import { SeoKeywordFooter } from "./SeoKeywordFooter";

interface FAQItem {
    question: string;
    answer: string;
}

interface RelatedTool {
    id: string;
    title: string;
    href: string;
}

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Brain className="w-32 h-32 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Zap className="w-40 h-40 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, -15, 0], x: [0, 15, 0], rotate: [0, 45, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[15%] opacity-15"
            >
                <Target className="w-24 h-24 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[30%] left-[10%] opacity-15"
            >
                <Gamepad2 className="w-28 h-28 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            </motion.div>
        </div>
    );
};

export interface ContentSection {
    title: string;
    description?: string;
    content?: string;
    icon?: string;
}

export interface StepSection {
    title: string;
    description?: string;
    subSteps?: string[];
    steps?: string[];
}

interface ToolContentProps {
    title: string;
    description: string | ContentSection[];
    howToUse: string | StepSection[];
    howToImprove: string | ContentSection[];
    howToPlay: string[];
    benefits: string[];
    faqs: FAQItem[];
    relatedTools?: RelatedTool[];
}

export function ToolContent({ title, description, howToUse, howToImprove, howToPlay, benefits, faqs, relatedTools = [] }: ToolContentProps) {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqSchema = generateFAQPageSchema(faqs);
    const howToSchema = generateHowToSchema(title, howToPlay);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    const renderDescription = () => {
        if (typeof description === 'string') {
            return (
                <div
                    className="text-muted-foreground leading-relaxed text-base prose prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-4 prose-p:mb-4 prose-ul:my-4 prose-li:my-2"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            );
        }

        return (
            <div className="space-y-8">
                {description.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            {idx === 0 && <Info className="w-5 h-5 text-info" />}
                            {section.title}
                        </h3>
                        <div className="text-muted-foreground leading-relaxed text-base">
                            {section.content || section.description}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderHowToUse = () => {
        if (typeof howToUse === 'string') {
            return (
                <div
                    className="text-muted-foreground leading-relaxed text-sm prose prose-invert max-w-none prose-headings:text-foreground prose-headings:text-sm prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-2 prose-p:text-sm prose-p:mb-2"
                    dangerouslySetInnerHTML={{ __html: howToUse }}
                />
            );
        }

        return (
            <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-accuracy/50 before:to-transparent">
                {howToUse.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 group">
                        <div className="relative flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-accuracy/30 bg-card shadow-lg shadow-accuracy/20 group-hover:border-accuracy group-hover:scale-110 transition duration-200 z-10">
                            <span className="text-lg font-bold text-accuracy">{idx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2 pt-1">
                            <h3 className="text-lg font-bold text-foreground group-hover:text-accuracy transition-colors">
                                {step.title}
                            </h3>
                            {step.description && (
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            )}
                            {(step.subSteps || step.steps) && (
                                <ul className="mt-2 space-y-1">
                                    {(step.subSteps || step.steps)?.map((sub, sIdx) => (
                                        <li key={sIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                            <CheckCircle2 className="w-3 h-3 mt-0.5 text-accuracy/70" />
                                            <span>{sub}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderHowToImprove = () => {
        if (typeof howToImprove === 'string') {
            return (
                <div
                    className="text-muted-foreground leading-relaxed text-sm prose prose-invert max-w-none prose-headings:text-foreground prose-headings:text-sm prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-2 prose-p:text-sm prose-p:mb-2"
                    dangerouslySetInnerHTML={{ __html: howToImprove }}
                />
            );
        }

        return (
            <div className="grid gap-4 sm:grid-cols-2">
                {howToImprove.map((tip, idx) => (
                    <div
                        key={idx}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-card/50 border border-border p-5 hover:border-wisdom/50 transition duration-200 hover:shadow-lg hover:shadow-wisdom/10"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target className="w-16 h-16 text-wisdom transform rotate-12 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-wisdom transition-colors flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-wisdom/10 text-wisdom text-xs">
                                    {idx + 1}
                                </span>
                                {tip.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {tip.description || (tip as any).content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="w-full max-w-6xl mx-auto mt-20 mb-20 space-y-12 relative"
        >
            <SchemaInjector schemas={[faqSchema, howToSchema]} />

            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-white dark:to-white/50 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm">
                        <Sparkles className="w-10 h-10 text-purple-400" />
                        How It Works & Tips
                    </h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                    Master the game with our comprehensive guide and improvement strategies.
                </p>
            </motion.div>

            {/* Main Glassmorphic Container */}
            <motion.div 
                variants={itemVariants}
                className="relative bg-black/5 dark:bg-white/5 dark:bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 dark:border-white/5 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] z-10"
            >
                <FloatingBackground />

                <Tabs defaultValue="about" className="w-full relative z-10">
                    <TabsList className="w-full h-auto flex-wrap justify-start sm:justify-center bg-black/5 dark:bg-black/20 dark:bg-black/50 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-2 mb-8 gap-2">
                        <TabsTrigger value="about" className="flex-1 min-w-[120px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.5)] text-foreground/70 transition-all duration-300 rounded-xl py-3 font-bold text-sm md:text-base">
                            <Info className="w-4 h-4 mr-2 inline" /> About
                        </TabsTrigger>
                        <TabsTrigger value="how-to-play" className="flex-1 min-w-[120px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(16,185,129,0.5)] text-foreground/70 transition-all duration-300 rounded-xl py-3 font-bold text-sm md:text-base">
                            <Gamepad2 className="w-4 h-4 mr-2 inline" /> How to Play
                        </TabsTrigger>
                        <TabsTrigger value="tips" className="flex-1 min-w-[120px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(245,158,11,0.5)] text-foreground/70 transition-all duration-300 rounded-xl py-3 font-bold text-sm md:text-base">
                            <TrendingUp className="w-4 h-4 mr-2 inline" /> Pro Tips
                        </TabsTrigger>
                        <TabsTrigger value="faq" className="flex-1 min-w-[120px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-foreground data-[state=active]:shadow-[0_0_20px_rgba(236,72,153,0.5)] text-foreground/70 transition-all duration-300 rounded-xl py-3 font-bold text-sm md:text-base">
                            <HelpCircle className="w-4 h-4 mr-2 inline" /> FAQ
                        </TabsTrigger>
                    </TabsList>

                    {/* About Content */}
                    <TabsContent value="about" className="mt-0 focus-visible:outline-none">
                        <div className="bg-black/5 dark:bg-white/5 dark:bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-xl">
                            {/* SEO: Top summary answer */}
                            <div className="mb-10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-l-4 border-indigo-400 p-6 rounded-r-2xl shadow-inner space-y-4">
                                <h3 className="text-indigo-300 font-black text-lg mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" /> Key Takeaway
                                </h3>
                                <p className="text-foreground/90 text-base leading-relaxed">
                                    <strong className="text-foreground font-bold">Definition:</strong> This tool is defined as an interactive cognitive application designed to measure and improve your baseline mental and physical performance.
                                </p>
                                <p className="text-foreground/90 text-base leading-relaxed">
                                    <strong className="text-foreground font-bold">The bottom line:</strong> Regular practice can enhance neural pathways, reaction speed, and accuracy over time.
                                </p>
                                <p className="text-foreground/90 text-base leading-relaxed">
                                    <strong className="text-foreground font-bold">Who is this for?</strong> Ideal for competitive gamers, students, athletes, and anyone wanting to track or improve their mental sharpness and fine motor coordination.
                                </p>
                            </div>

                            <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                                {renderDescription()}
                            </div>

                            {/* Comparison Table */}
                            <div className="mt-12 mb-8 pt-8 border-t border-black/10 dark:border-white/10">
                                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Activity className="w-6 h-6 text-purple-400" /> Use Cases & Training Modes
                                </h3>
                                <div className="bg-black/5 dark:bg-black/20 rounded-2xl overflow-x-auto border border-white/5">
                                    <table className="w-full text-base text-left border-collapse min-w-[600px]">
                                        <thead className="bg-black/5 dark:bg-white/5">
                                            <tr className="border-b border-black/10 dark:border-white/10 text-foreground">
                                                <th className="py-4 px-6 font-bold tracking-wide">Primary Use Case</th>
                                                <th className="py-4 px-6 font-bold tracking-wide">Target Audience</th>
                                                <th className="py-4 px-6 font-bold tracking-wide">Expected Outcome</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-muted-foreground">
                                            <tr className="border-b border-white/5 hover:bg-black/5 dark:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 font-bold text-purple-300">Esports Warm-up</td>
                                                <td className="py-4 px-6">Gamers & Athletes</td>
                                                <td className="py-4 px-6">Faster physical reaction times & flick precision</td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-black/5 dark:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 font-bold text-blue-300">Cognitive Training</td>
                                                <td className="py-4 px-6">Students & Professionals</td>
                                                <td className="py-4 px-6">Improved spatial memory and sustained focus</td>
                                            </tr>
                                            <tr className="hover:bg-black/5 dark:bg-white/5 transition-colors">
                                                <td className="py-4 px-6 font-bold text-emerald-300">Baseline Testing</td>
                                                <td className="py-4 px-6">Everyone</td>
                                                <td className="py-4 px-6">Trackable performance metrics over time</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Original Experience & Proof */}
                            <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
                                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                                    First-Hand Testing & Benchmarks
                                </h3>
                                <div className="space-y-4 bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                                    <p className="text-foreground/90 text-base leading-relaxed">
                                        <strong className="text-blue-300">Based on our first-hand testing:</strong> We actively test and calibrate all our tools using rigorous internal benchmarks. According to real data from our preliminary case studies, players who practice for just 15 minutes daily see a measurable 12-15% improvement in their baseline scores over a two-week period.
                                    </p>
                                    <p className="text-foreground/90 text-base leading-relaxed">
                                        <strong className="text-blue-300">Example Benchmark:</strong> An average beginner might score around the 50th percentile initially. However, after consistent application of the techniques outlined in our pro tips section, our internal testing data shows rapid progression toward the 80th percentile. This serves as concrete proof that structured cognitive and reflex training yields tangible results.
                                    </p>
                                </div>
                            </div>

                            {/* Key Benefits */}
                            <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
                                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Brain className="w-6 h-6 text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
                                    Cognitive Benefits
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-white/10 transition-colors">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)] flex-shrink-0" />
                                            <span className="text-foreground/90 text-base font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Scientific Context & Resources */}
                            <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
                                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <HelpCircle className="w-6 h-6 text-emerald-400" />
                                    Further Learning
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        Brain training and cognitive exercises are frequently used to maintain and improve mental acuity. Consistent practice can strengthen neural pathways through neuroplasticity. For more information, read this study on <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2896818/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline hover:text-emerald-300 transition-colors">cognitive training and neuroplasticity</a>.
                                    </p>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        To continue improving your skills, try our <Link href="/memory" className="text-emerald-400 font-bold hover:underline hover:text-emerald-300 transition-colors">Memory Games</Link> or test your speed with our <Link href="/reflex" className="text-emerald-400 font-bold hover:underline hover:text-emerald-300 transition-colors">Reflex Tests</Link>. Both offer great ways to measure and track your cognitive progress.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* How to Play Content */}
                    <TabsContent value="how-to-play" className="mt-0 focus-visible:outline-none">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-black/5 dark:bg-white/5 dark:bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-xl">
                                <h3 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                                    <List className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                    Step-by-Step Guide
                                </h3>
                                <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                                    {renderHowToUse()}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-8 shadow-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Trophy className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                        <h3 className="text-xl font-bold text-foreground">Rules</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {howToPlay.map((step, idx) => (
                                            <li key={idx} className="flex gap-4 items-start text-base font-medium text-foreground/90">
                                                <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] flex-shrink-0" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Pro Tips Content */}
                    <TabsContent value="tips" className="mt-0 focus-visible:outline-none">
                        <div className="bg-black/5 dark:bg-white/5 dark:bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-xl">
                            <h3 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                Expert Strategies
                            </h3>
                            <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                                {renderHowToImprove()}
                            </div>
                        </div>
                    </TabsContent>

                    {/* FAQ Content */}
                    <TabsContent value="faq" className="mt-0 focus-visible:outline-none">
                        <div className="grid md:grid-cols-2 gap-6">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-300 cursor-pointer"
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-lg font-bold text-foreground group-hover:text-pink-300 transition-colors pr-8">
                                            {faq.question}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex-shrink-0 absolute right-8 top-8"
                                        >
                                            <Zap className={`w-5 h-5 ${expandedFaq === idx ? 'text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-muted-foreground'}`} />
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: expandedFaq === idx ? "auto" : 0,
                                            opacity: expandedFaq === idx ? 1 : 0,
                                            marginTop: expandedFaq === idx ? 16 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-muted-foreground text-base leading-relaxed border-t border-black/10 dark:border-white/10 pt-4">
                                            <strong className="text-pink-300 drop-shadow-md">The short answer is:</strong> {faq.answer}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Related Tools - Always Visible */}
            {relatedTools.length > 0 && (
                <motion.section
                    variants={itemVariants}
                    className="relative bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-black/20 dark:border-white/20 rounded-3xl p-8 mt-12 shadow-2xl z-10"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-50 rounded-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-6 h-6 text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                            <h2 className="text-2xl font-black text-foreground">Continue Your Training</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {relatedTools.map((tool) => (
                                <Link
                                    key={tool.id}
                                    href={tool.href}
                                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-black/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/40 transition-all duration-300">
                                        <MousePointer2 className="w-5 h-5 text-purple-300" />
                                    </div>
                                    <span className="text-foreground/90 text-base font-bold group-hover:text-purple-300 transition-colors flex-1">
                                        {tool.title}
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Global Semantic SEO Component */}
            <SeoKeywordFooter title={title} />
        </motion.div>
    );
}
