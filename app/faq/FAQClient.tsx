"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

function categoryId(category: string) {
    return category
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function scrollToCategory(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 88; // fixed navbar (~72px) + breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
}

function FAQItemRow({ faq, defaultOpen = false }: { faq: FAQItem; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <details
            open={open}
            onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm open:border-cyan-200 open:shadow-[0_0_0_1px_rgba(6,182,212,0.12)] transition-colors duration-150"
        >
            <summary className="flex cursor-pointer list-none items-start gap-3 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-cyan-50 text-xs font-mono font-bold text-cyan-600 border border-cyan-100">
                    ?
                </span>
                <h3 className="flex-1 text-base sm:text-lg font-semibold text-slate-900 leading-snug pr-2">
                    {faq.question}
                </h3>
                <ChevronDown
                    className="mt-1 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-150 group-open:rotate-180 group-open:text-cyan-600"
                    aria-hidden
                />
            </summary>
            <div className="border-t border-slate-100 px-5 sm:px-6 pb-5 sm:pb-6 pt-4">
                <p className="pl-9 text-sm sm:text-base text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
        </details>
    );
}

export default function FAQClient() {
    const { t, getLocalizedHref } = useTranslation();

    const faqs: FAQItem[] = [
        {
            category: t("faqPage.catGettingStarted", "Getting Started"),
            question: t("faqPage.q1", "What exactly is Reflextry?"),
            answer: t("faqPage.a1", "It's a free platform built to measure and improve your raw mechanical skills—things like reaction time, working memory, and clicking accuracy. No downloads or sign-ups required. Just pick a tool and start testing your limits."),
        },
        {
            category: t("faqPage.catGettingStarted", "Getting Started"),
            question: t("faqPage.q2", "Do I have to create an account?"),
            answer: t("faqPage.a2", "Nope. Everything is completely free and accessible right now. We'll be adding optional accounts later if you want to save your progress across devices or compete on global leaderboards, but the core tools will always be open."),
        },
        {
            category: t("faqPage.catGettingStarted", "Getting Started"),
            question: t("faqPage.q3", "Where should I start?"),
            answer: t("faqPage.a3", "If you play shooters, hit the Aim Trainer or Reaction Time Test. If you're here for cognitive training, try Sequence Memory or Number Memory. We recommend just trying a few out to see where your baseline is at."),
        },
        {
            category: t("faqPage.catBrainTraining", "Brain Training"),
            question: t("faqPage.q4", "Does brain training actually do anything?"),
            answer: t("faqPage.a4", "Yes, it's called 'near transfer' in neuroscience. If you practice remembering number sequences daily, your brain physically adapts (neuroplasticity) and you get better at holding information in your short-term memory. It's like going to the gym, but for your central nervous system."),
        },
        {
            category: t("faqPage.catBrainTraining", "Brain Training"),
            question: t("faqPage.q5", "How long until I see results?"),
            answer: t("faqPage.a5", "If you grind for 10-20 minutes a day, you'll start seeing your scores go up within 2 to 3 weeks. Consistency matters way more than doing a massive 2-hour session once a week."),
        },
        {
            category: t("faqPage.catMemoryTraining", "Memory Training"),
            question: t("faqPage.q6", "How do I stop forgetting things immediately?"),
            answer: t("faqPage.a6", "The quickest hack is 'chunking'—grouping items together (like remembering a phone number in blocks rather than single digits). Also, your brain deletes things it thinks are useless, so you have to actively focus and force recall to make it stick."),
        },
        {
            category: t("faqPage.catMemoryTraining", "Memory Training"),
            question: t("faqPage.q7", "Working memory vs long-term memory?"),
            answer: t("faqPage.a7", "Working memory is your brain's RAM—it holds what you're thinking about right now. Long-term memory is the hard drive. Our tools strictly train your RAM, so you can process more things simultaneously without dropping the ball."),
        },
        {
            category: t("faqPage.catReactionTime", "Reaction Time"),
            question: t("faqPage.q8", "What is a 'good' reaction time?"),
            answer: t("faqPage.a8", "The human average is around 200-250ms. If you're consistently hitting under 200ms, you're solid. Under 170ms is elite. Note: this heavily depends on your hardware (monitor refresh rate, mouse polling rate, etc.)."),
        },
        {
            category: t("faqPage.catReactionTime", "Reaction Time"),
            question: t("faqPage.q9", "Does my monitor or mouse cause input lag?"),
            answer: t("faqPage.a9", "Yes. A 60Hz monitor adds ~16ms of frame delay compared to a 144Hz (~7ms) or 240Hz (~4ms) panel. Wireless mice with poor polling rates can also add latency. For pure test accuracy, use a gaming mouse and high-refresh display."),
        },
        {
            category: t("faqPage.catSpeedAim", "Speed & Aim"),
            question: t("faqPage.q10", "Can I train my CPS (Clicks Per Second)?"),
            answer: t("faqPage.a10", "Yes. Standard clicking usually caps around 6–8 CPS. Techniques like jitter clicking or butterfly clicking can push you past 12–16 CPS."),
        },
        {
            category: t("faqPage.catPrivacyScores", "Privacy & Scores"),
            question: t("faqPage.q11", "Is my score saved if I close the browser?"),
            answer: t("faqPage.a11", "Your scores and session records are stored locally in your browser's local storage. They persist across reloads on the same device and browser."),
        },
        {
            category: t("faqPage.catPrivacyScores", "Privacy & Scores"),
            question: t("faqPage.q12", "Do you sell or collect my personal data?"),
            answer: t("faqPage.a12", "No. We do not track or sell personal identifying data. All cognitive and reaction test metrics belong to you."),
        },
    ];

    const categories = Array.from(new Set(faqs.map((faq) => faq.category)));
    useEffect(() => {
        const hash = window.location.hash.replace(/^#/, "");
        if (!hash) return;
        // Wait a tick so layout/sticky header settle
        const t = window.setTimeout(() => scrollToCategory(hash), 50);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-x-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0" />
            <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] bg-violet-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-xs font-mono tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                        Support Knowledge Base
                    </div>

                    <div className="flex items-start gap-4">
                        <div
                            className="hidden sm:flex p-3 rounded-2xl bg-cyan-50 border border-cyan-200 flex-shrink-0"
                            style={{ boxShadow: "3px 6px 12px rgba(6,182,212,0.12)" }}
                        >
                            <HelpCircle className="w-7 h-7 text-cyan-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                                {t("faqPage.heroTitle", "Frequently Asked Questions")}
                            </h1>
                            <p className="mt-4 text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed">
                                {t("faqPage.heroSubtitle", "Everything you need to know about the tests, training benefits, and scoring.")}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.nav
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
                    aria-label="FAQ categories"
                    className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-md p-6 shadow-sm"
                >
                    <h2 className="text-xs font-mono font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {t("guide.jumpTo", "Jump to Category")}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const id = categoryId(category);
                            return (
                                <a
                                    key={category}
                                    href={`#${id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToCategory(id);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-colors duration-150"
                                >
                                    {category}
                                </a>
                            );
                        })}
                    </div>
                </motion.nav>

                {categories.map((category, categoryIndex) => {
                    const items = faqs.filter((faq) => faq.category === category);
                    const id = categoryId(category);
                    return (
                        <div key={category} id={id} className="scroll-mt-28 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 + categoryIndex * 0.04, duration: 0.35, ease: "easeOut" }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl sm:text-2xl font-mono font-bold text-slate-900 flex items-center gap-3">
                                    <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-cyan-500 to-violet-500" />
                                    {category}
                                </h2>
                                <div className="space-y-3">
                                    {items.map((faq, index) => (
                                        <FAQItemRow
                                            key={faq.question}
                                            faq={faq}
                                            defaultOpen={categoryIndex === 0 && index === 0}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                    className="relative rounded-3xl border border-cyan-200/70 bg-white p-8 text-center overflow-hidden shadow-sm"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-violet-500/[0.06] pointer-events-none" />
                    <div className="relative">
                        <HelpCircle className="w-10 h-10 text-cyan-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-mono font-bold text-slate-900 mb-3">Still Have Questions?</h2>
                        <p className="text-slate-600 mb-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                            Didn&apos;t find what you&apos;re looking for? Shoot us a message. We actually read them all.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href={getLocalizedHref("/contact")}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 text-white text-sm font-mono font-semibold hover:bg-cyan-500 active:translate-y-0.5 transition-colors duration-150 shadow-[0_4px_12px_rgba(6,182,212,0.28)]"
                            >
                                {t("footer.contact", "Contact Support")}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href={getLocalizedHref("/blog")}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-800 text-sm font-mono font-semibold border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors duration-150"
                            >
                                {t("nav.blog", "Read Our Blog")}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
