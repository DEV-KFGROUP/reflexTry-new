"use client";

import { motion } from "framer-motion";
import { HelpCircle, Info, Sparkles, TrendingUp, Zap, ArrowRight, CheckCircle2, Target, Trophy, Brain, List } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                        <div className="relative flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border border-accuracy/30 bg-card shadow-lg shadow-accuracy/20 group-hover:border-accuracy group-hover:scale-110 transition-all duration-300 z-10">
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
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-card/50 border border-border p-5 hover:border-wisdom/50 transition-all duration-300 hover:shadow-lg hover:shadow-wisdom/10"
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
            className="w-full max-w-5xl mx-auto mt-12 space-y-8"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-info to-reflex bg-clip-text text-transparent inline-flex items-center gap-2">
                    <Info className="w-8 h-8 text-info is-gradient" />
                    How It Works & Tips
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Master the game with our comprehensive guide and improvement strategies.
                </p>
            </motion.div>

            {/* Tabbed Interface */}
            <motion.div variants={itemVariants}>
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto bg-card/50 border border-border rounded-xl p-1 mb-8">
                        <TabsTrigger value="about" className="flex-1 min-w-[100px] data-[state=active]:bg-info data-[state=active]:text-white data-[state=active]:shadow-lg transition-all rounded-lg py-2.5">About</TabsTrigger>
                        <TabsTrigger value="how-to-play" className="flex-1 min-w-[120px] data-[state=active]:bg-accuracy data-[state=active]:text-white data-[state=active]:shadow-lg transition-all rounded-lg py-2.5">How to Play</TabsTrigger>
                        <TabsTrigger value="tips" className="flex-1 min-w-[100px] data-[state=active]:bg-wisdom data-[state=active]:text-white data-[state=active]:shadow-lg transition-all rounded-lg py-2.5">Pro Tips</TabsTrigger>
                        <TabsTrigger value="faq" className="flex-1 min-w-[100px] data-[state=active]:bg-reflex data-[state=active]:text-white data-[state=active]:shadow-lg transition-all rounded-lg py-2.5">FAQ</TabsTrigger>
                    </TabsList>

                    {/* About Content */}
                    <TabsContent value="about" className="mt-0 focus-visible:outline-none">
                        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 lg:p-8">
                            {renderDescription()}

                            {/* Key Benefits */}
                            <div className="mt-8 pt-8 border-t border-border/50">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-info" />
                                    Cognitive Benefits
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-info shadow-[0_0_10px_rgba(59,130,246,0.5)] flex-shrink-0" />
                                            <span className="text-muted-foreground text-sm">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* How to Play Content */}
                    <TabsContent value="how-to-play" className="mt-0 focus-visible:outline-none">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 lg:p-8">
                                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                    <List className="w-5 h-5 text-accuracy" />
                                    Step-by-Step Guide
                                </h3>
                                {renderHowToUse()}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Trophy className="w-5 h-5 text-wisdom" />
                                        <h3 className="text-lg font-bold text-foreground">Rules</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {howToPlay.map((step, idx) => (
                                            <li key={idx} className="flex gap-3 items-start text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-wisdom flex-shrink-0" />
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
                        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 lg:p-8">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-wisdom" />
                                Expert Strategies
                            </h3>
                            {renderHowToImprove()}
                        </div>
                    </TabsContent>

                    {/* FAQ Content */}
                    <TabsContent value="faq" className="mt-0 focus-visible:outline-none">
                        <div className="grid md:grid-cols-2 gap-4">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-reflex/30 hover:bg-card transition-all duration-300 cursor-pointer"
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-base font-semibold text-foreground group-hover:text-reflex transition-colors pr-8">
                                            {faq.question}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex-shrink-0 absolute right-6 top-6"
                                        >
                                            <Zap className={`w-4 h-4 ${expandedFaq === idx ? 'text-reflex' : 'text-muted-foreground'}`} />
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: expandedFaq === idx ? "auto" : 0,
                                            opacity: expandedFaq === idx ? 1 : 0,
                                            marginTop: expandedFaq === idx ? 12 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-3">
                                            {faq.answer}
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
                    className="relative bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 mt-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-reflex" />
                        <h2 className="text-lg font-bold text-foreground">Continue Your Training</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {relatedTools.map((tool) => (
                            <Link
                                key={tool.id}
                                href={tool.href}
                                className="group flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-reflex/50 hover:shadow-lg hover:shadow-reflex/5 transition-all duration-300"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-reflex/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Target className="w-4 h-4 text-reflex" />
                                </div>
                                <span className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors flex-1">
                                    {tool.title}
                                </span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-reflex group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </motion.section>
            )}
        </motion.div>
    );
}
