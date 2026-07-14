"use client";

import { motion } from "framer-motion";
import { HelpCircle, Brain, Zap, Target, TrendingUp, Clock, Award } from "lucide-react";
import Link from "next/link";

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: "Getting Started",
        question: "What exactly is Reflextry?",
        answer: "It's a free platform built to measure and improve your raw mechanical skills—things like reaction time, working memory, and clicking accuracy. No downloads or sign-ups required. Just pick a tool and start testing your limits."
    },
    {
        category: "Getting Started",
        question: "Do I have to create an account?",
        answer: "Nope. Everything is completely free and accessible right now. We'll be adding optional accounts later if you want to save your progress across devices or compete on global leaderboards, but the core tools will always be open."
    },
    {
        category: "Getting Started",
        question: "Where should I start?",
        answer: "If you play shooters, hit the Aim Trainer or Reaction Time Test. If you're here for cognitive training, try Sequence Memory or Number Memory. We recommend just trying a few out to see where your baseline is at."
    },
    {
        category: "Brain Training",
        question: "Does brain training actually do anything?",
        answer: "Yes, it's called 'near transfer' in neuroscience. If you practice remembering number sequences daily, your brain physically adapts (neuroplasticity) and you get better at holding information in your short-term memory. It's like going to the gym, but for your central nervous system."
    },
    {
        category: "Brain Training",
        question: "How long until I see results?",
        answer: "If you grind for 10-20 minutes a day, you'll start seeing your scores go up within 2 to 3 weeks. Consistency matters way more than doing a massive 2-hour session once a week."
    },
    {
        category: "Memory Training",
        question: "How do I stop forgetting things immediately?",
        answer: "The quickest hack is 'chunking'—grouping items together (like remembering a phone number in blocks rather than single digits). Also, your brain deletes things it thinks are useless, so you have to actively focus and force recall to make it stick."
    },
    {
        category: "Memory Training",
        question: "Working memory vs long-term memory?",
        answer: "Working memory is your brain's RAM—it holds what you're thinking about right now. Long-term memory is the hard drive. Our tools strictly train your RAM, so you can process more things simultaneously without dropping the ball."
    },
    {
        category: "Reaction Time",
        question: "What is a 'good' reaction time?",
        answer: "The human average is around 200-250ms. If you're consistently hitting under 200ms, you're solid. Under 170ms is elite. Note: this heavily depends on your hardware (monitor refresh rate, mouse polling rate, etc.)."
    },
    {
        category: "Reaction Time",
        question: "Why is my reaction time so slow today?",
        answer: "Usually it's sleep deprivation. Even losing 1-2 hours of sleep tanks your reaction speed. Other factors: caffeine crash, cold hands, or input lag from a wireless mouse dying."
    },
    {
        category: "Gaming Performance",
        question: "Will this actually make me better at games?",
        answer: "Yes. Pro players use tools exactly like this to warm up their fast-twitch muscle fibers before tournaments. It won't teach you game sense, but it will absolutely lower your physical latency when clicking heads."
    },
    {
        category: "Gaming Performance",
        question: "What clicking technique is best?",
        answer: "For pure speed (like our CPS test), players use jitter clicking or butterfly clicking. But for actual gaming where accuracy matters, stick to standard clicking. High CPS means nothing if you throw off your crosshair."
    },
    {
        category: "Progress & Results",
        question: "I'm stuck at a certain score. What now?",
        answer: "You hit a plateau. To break it, you either need to take a 2-day break to let your nervous system recover, or you need to radically change your training method. Don't just bash your head against the wall—focus on accuracy over speed for a few days."
    },
    {
        category: "Technical",
        question: "Why do my scores feel inconsistent?",
        answer: "Check your hardware. Are you playing on a 60Hz monitor? Is your browser eating up RAM? Are you using Bluetooth headphones? (Audio latency is huge). For the purest results, use a wired mouse, a high refresh rate monitor, and close your background apps."
    },
    {
        category: "Technical",
        question: "Do these work on mobile?",
        answer: "Yes, the site is fully responsive. But realistically, tools like the Aim Trainer or CPS test are designed for a mouse. Memory and cognitive tools work great on phones, though."
    },
    {
        category: "General",
        question: "Is this actually free?",
        answer: "100% free. No paywalls, no hidden subscriptions. We might add some premium cosmetic/tracking features way down the line, but the training tools themselves will always be free to use."
    },
    {
        category: "General",
        question: "How do I report a bug or give feedback?",
        answer: "Hit up our Contact page. We actually read all the messages. If a tool feels clunky or you have an idea for a new game mode, let us know and we'll probably build it."
    }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQClient() {
    return (
        <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <HelpCircle className="w-12 h-12 text-teal-500" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need to know about the science, the grind, and how to actually get faster.
                    </p>
                </div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12"
                >
                    <h2 className="text-xl font-bold text-black mb-4">Jump to Category</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <a
                                key={category}
                                href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="px-4 py-2 bg-white/10 hover:bg-teal-500/20 border border-white/20 hover:border-teal-500/50 rounded-lg text-sm text-gray-300 hover:text-teal-500 transition"
                            >
                                {category}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ Categories */}
                {categories.map((category, categoryIndex) => (
                    <motion.div
                        key={category}
                        id={category.toLowerCase().replace(/\s+/g, '-')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-purple-500 rounded-full"></span>
                            {category}
                        </h2>
                        <div className="space-y-4">
                            {faqs
                                .filter(faq => faq.category === category)
                                .map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-teal-500/30 transition"
                                    >
                                        <h3 className="text-lg font-semibold text-black mb-3 flex items-start gap-3">
                                            <span className="text-teal-500 mt-1 flex-shrink-0">Q:</span>
                                            <span>{faq.question}</span>
                                        </h3>
                                        <div className="flex items-start gap-3 ml-8">
                                            <span className="text-purple-500 mt-1 flex-shrink-0 font-semibold">A:</span>
                                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                ))}

                {/* Still Have Questions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 rounded-2xl p-8 text-center"
                >
                    <HelpCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Didn't find what you're looking for? Shoot us a message. We actually read them all.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="px-6 py-3 bg-teal-500 text-black rounded-lg font-semibold hover:bg-amber-500 transition-colors"
                        >
                            Contact Support
                        </Link>
                        <Link
                            href="/blog"
                            className="px-6 py-3 bg-white/10 text-black border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                        >
                            Read Our Blog
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
