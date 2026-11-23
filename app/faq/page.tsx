import { Metadata } from 'next';
import { headers } from 'next/headers';
import FAQClient from './FAQClient';
import { SchemaInjector } from "@/components/SchemaInjector";
import {
    generateBreadcrumbStructuredData,
    generateFAQPageSchema,
    generateWebPageSchema,
} from "@/lib/structured-data";
import { getCategoryMetadata } from '@/lib/seo-utils';

const FAQ_SCHEMA_ITEMS = [
    {
        question: "What exactly is Reflextry?",
        answer: "It's a free platform built to measure and improve your raw mechanical skills—things like reaction time, working memory, and clicking accuracy. No downloads or sign-ups required. Just pick a tool and start testing your limits.",
    },
    {
        question: "Do I have to create an account?",
        answer: "Nope. Everything is completely free and accessible right now. We'll be adding optional accounts later if you want to save your progress across devices or compete on global leaderboards, but the core tools will always be open.",
    },
    {
        question: "Where should I start?",
        answer: "If you play shooters, hit the Aim Trainer or Reaction Time Test. If you're here for cognitive training, try Sequence Memory or Number Memory. We recommend just trying a few out to see where your baseline is at.",
    },
    {
        question: "Does brain training actually do anything?",
        answer: "Yes, it's called 'near transfer' in neuroscience. If you practice remembering number sequences daily, your brain physically adapts (neuroplasticity) and you get better at holding information in your short-term memory. It's like going to the gym, but for your central nervous system.",
    },
    {
        question: "What is a 'good' reaction time?",
        answer: "The human average is around 200-250ms. If you're consistently hitting under 200ms, you're solid. Under 170ms is elite. Note: this heavily depends on your hardware (monitor refresh rate, mouse polling rate, etc.).",
    },
    {
        question: "Does my monitor or mouse cause input lag?",
        answer: "Yes. A 60Hz monitor adds ~16ms of frame delay compared to a 144Hz (~7ms) or 240Hz (~4ms) panel. Wireless mice with poor polling rates can also add latency. For pure test accuracy, use a gaming mouse and high-refresh display.",
    },
    {
        question: "Can I train my CPS (Clicks Per Second)?",
        answer: "Yes. Standard clicking usually caps around 6–8 CPS. Techniques like jitter clicking or butterfly clicking can push you past 12–16 CPS.",
    },
    {
        question: "Is my score saved if I close the browser?",
        answer: "Your scores and session records are stored locally in your browser's local storage. They persist across reloads on the same device and browser.",
    },
];

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get('x-locale') || 'en';
    return getCategoryMetadata('faq', locale);
}

export default async function FAQ() {
    const h = await headers();
    const locale = h.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "Frequently Asked Questions | Brain Training & Reaction FAQ",
        "Answers about Reflextry brain training tools, reaction time, memory practice, and technical tips.",
        "/faq",
        locale
    );

    const faqSchema = generateFAQPageSchema(FAQ_SCHEMA_ITEMS);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <FAQClient />
        </>
    );
}
