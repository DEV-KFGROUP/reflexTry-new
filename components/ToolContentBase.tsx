"use client";

import { motion } from "framer-motion";
import { HelpCircle, Info, Sparkles, TrendingUp, ArrowRight, CheckCircle2, Target, Trophy, Brain, List, Gamepad2, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

interface FAQItem {
    question: string;
    answer: string;
}

interface RelatedTool {
    id: string;
    title: string;
    href: string;
}

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

export interface ToolContentProps {
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
    const { t, getLocalizedHref } = useTranslation();

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
                    className="text-muted-foreground leading-relaxed text-base prose prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2 prose-p:mb-3 prose-ul:my-3 prose-li:my-1.5"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            );
        }

        return (
            <div className="space-y-4">
                {description?.map((section, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
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
                    className="text-muted-foreground leading-relaxed text-sm prose prose-invert max-w-none prose-headings:text-foreground prose-headings:text-base prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1 prose-p:text-sm prose-p:mb-2 prose-li:text-sm"
                    dangerouslySetInnerHTML={{ __html: howToUse }}
                />
            );
        }

        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {howToUse?.map((step, idx) => (
                    <div 
                        key={idx} 
                        className="p-5 rounded-2xl bg-muted/20 border border-black/10 dark:border-white/10 flex flex-col justify-between space-y-3 hover:border-cyan-500/30 transition-colors"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs border border-cyan-500/20">
                                    {idx + 1}
                                </span>
                                <h4 className="font-mono font-bold text-foreground text-sm">
                                    {step.title}
                                </h4>
                            </div>
                            {step.description && (
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    {step.description}
                                </p>
                            )}
                            {(step.subSteps || step.steps) && (
                                <ul className="mt-2 space-y-1.5 text-xs text-foreground/80">
                                    {(step.subSteps || step.steps)?.map((sub, sIdx) => (
                                        <li key={sIdx} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-cyan-500 flex-shrink-0" />
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
                {howToImprove?.map((tip, idx) => (
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
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-white dark:to-white/50 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm">
                        <Sparkles className="w-10 h-10 text-purple-400" />
                        {t("guide.howItWorks", "How It Works & Tips")}
                    </h2>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                    {t("guide.subtitle", "Master the game with our comprehensive guide and improvement strategies.")}
                </p>
            </motion.div>

            {/* All sections visible in the DOM for users and crawlers (no hidden tabs) */}
            <motion.div
                variants={itemVariants}
                className="relative z-10 space-y-10"
            >
                <nav
                    aria-label="Jump to guide sections"
                    className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-md p-3 sm:p-4"
                >
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground px-2">
                        {t("guide.jumpTo", "Jump to")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { href: "#guide-about", label: t("guide.about", "About"), icon: Info },
                            { href: "#guide-how-to-play", label: t("guide.howToPlay", "How to Play"), icon: Gamepad2 },
                            { href: "#guide-tips", label: t("guide.proTips", "Pro Tips"), icon: TrendingUp },
                            { href: "#guide-faq", label: t("guide.faq", "FAQ"), icon: HelpCircle },
                        ].map(({ href, label, icon: Icon }) => (
                            <a
                                key={href}
                                href={href}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 text-foreground hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-colors"
                            >
                                <Icon className="w-4 h-4 text-indigo-400" />
                                {label}
                            </a>
                        ))}
                    </div>
                </nav>

                <div className="space-y-12">
                    <section id="guide-about" className="scroll-mt-28">
                        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-background p-5 lg:p-7 shadow-sm">
                            <h3 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                <Info className="w-6 h-6 text-indigo-500" />
                                {t("guide.aboutTest", "About This Test")}
                            </h3>
                            <div className="max-w-none">
                                {renderDescription()}
                            </div>

                            {benefits && benefits.length > 0 ? (
                                <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10">
                                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                                        <Brain className="w-6 h-6 text-pink-500" />
                                        {t("guide.trains", "What This Test Trains")}
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {benefits.map((benefit, idx) => (
                                             <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-black/10 dark:border-white/10 bg-muted/30">
                                                <span className="mt-1.5 w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                                                <span className="text-foreground/90 text-base font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </section>

                    <section id="guide-how-to-play" className="scroll-mt-28">
                        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-background p-6 lg:p-8 shadow-sm space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-4">
                                <h3 className="text-xl font-mono font-bold text-foreground flex items-center gap-2.5">
                                    <Gamepad2 className="w-5 h-5 text-cyan-500" />
                                    {t("guide.instructions", "Instructions & Mechanics")}
                                </h3>
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                    {t("guide.quickSetup", "Quick Setup")}
                                </span>
                            </div>

                            {/* Step Cards Grid */}
                            {renderHowToUse()}

                            {/* Rules Bar if howToPlay is present */}
                            {howToPlay && howToPlay.length > 0 && (
                                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col md:flex-row md:items-center gap-3 text-xs">
                                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 flex-shrink-0">
                                        <Trophy className="w-4 h-4 text-cyan-500" />
                                        {t("guide.keyRules", "Key Rules:")}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-muted-foreground">
                                        {howToPlay.map((step, idx) => (
                                            <span key={idx} className="flex items-center gap-1.5">
                                                <span className="text-cyan-500 font-bold">✓</span>
                                                <span>{step}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section id="guide-tips" className="scroll-mt-28">
                        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-background p-6 lg:p-10 shadow-sm">
                            <h3 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-amber-500" />
                                {t("guide.strategies", "Expert Strategies")}
                            </h3>
                            <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                                {renderHowToImprove()}
                            </div>
                        </div>
                    </section>

                    <section id="guide-faq" className="scroll-mt-28" data-speakable="true">
                        <h3 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                            <HelpCircle className="w-6 h-6 text-pink-500" />
                            {t("guide.faqs", "Frequently Asked Questions")}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {faqs?.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-background p-8 shadow-sm"
                                    itemScope
                                    itemType="https://schema.org/Question"
                                >
                                    <h4 className="text-lg font-bold text-foreground pr-4 mb-4" itemProp="name">
                                        {faq.question}
                                    </h4>
                                    <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                                        <p className="aeo-answer text-muted-foreground text-base leading-relaxed border-t border-black/10 dark:border-white/10 pt-4" itemProp="text">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
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
                            <h2 className="text-2xl font-black text-foreground">{t("guide.continueTraining", "Continue Your Training")}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {relatedTools.map((tool) => (
                                <Link
                                    key={tool.id}
                                    href={getLocalizedHref(tool.href)}
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

        </motion.div>
    );
}
