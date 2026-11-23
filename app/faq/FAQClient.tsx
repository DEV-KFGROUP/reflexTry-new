"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
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
    const headerOffset = 88;
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
            className="group border-b border-[#E6E3DB] last:border-b-0 bg-white transition-colors"
        >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 sm:p-6 hover:bg-[#FAF9F6] transition-colors [&::-webkit-details-marker]:hidden">
                <h3 className="flex-1 text-base font-semibold text-[#161614] leading-snug">
                    {faq.question}
                </h3>
                <ChevronDown
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#78756C] transition-transform duration-150 group-open:rotate-180 group-open:text-[#161614]"
                    aria-hidden="true"
                />
            </summary>
            <div className="px-5 sm:px-6 pb-6 pt-0">
                <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed max-w-3xl">
                    {faq.answer}
                </p>
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
        const timer = window.setTimeout(() => scrollToCategory(hash), 50);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div className="w-full min-h-screen bg-[#FAF9F6] text-[#161614] font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="space-y-4 border-b border-[#D8D4C9] pb-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                        Support Knowledge Base
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
                        {t("faqPage.heroTitle", "Frequently Asked Questions")}
                    </h1>
                    <p className="text-base text-[#57554E] max-w-2xl leading-relaxed">
                        {t("faqPage.heroSubtitle", "Everything you need to know about the tests, training benefits, and scoring.")}
                    </p>
                </header>

                <nav aria-label="FAQ categories" className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                        {t("guide.jumpTo", "Jump to Category")}
                    </p>
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
                                    className="px-3.5 py-2 rounded-lg bg-white border border-[#E6E3DB] text-xs font-semibold text-[#3F3E39] hover:border-[#161614] hover:text-[#161614] transition-colors"
                                >
                                    {category}
                                </a>
                            );
                        })}
                    </div>
                </nav>

                <div className="space-y-10">
                    {categories.map((category, categoryIndex) => {
                        const items = faqs.filter((faq) => faq.category === category);
                        const id = categoryId(category);
                        return (
                            <section key={category} id={id} className="scroll-mt-28 space-y-4">
                                <h2 className="font-serif text-2xl font-medium text-[#161614]">
                                    {category}
                                </h2>
                                <div className="border border-[#E6E3DB] rounded-2xl overflow-hidden bg-white">
                                    {items.map((faq, index) => (
                                        <FAQItemRow
                                            key={faq.question}
                                            faq={faq}
                                            defaultOpen={categoryIndex === 0 && index === 0}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                <section className="rounded-2xl border border-[#E6E3DB] bg-white p-8 sm:p-10 text-center space-y-4">
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#161614]">
                        Still Have Questions?
                    </h2>
                    <p className="text-[#57554E] max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                        Didn&apos;t find what you&apos;re looking for? Send us a message and we will get back to you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <Link
                            href={getLocalizedHref("/contact")}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                        >
                            <span>{t("footer.contact", "Contact Support")}</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href={getLocalizedHref("/blog")}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#161614] text-sm font-semibold border border-[#E6E3DB] hover:bg-[#FAF9F6] hover:border-[#161614] transition-colors"
                        >
                            {t("nav.blog", "Read Our Blog")}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
