import { Metadata } from 'next';
import SpeedHubClient from './SpeedHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData, generateFAQPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('speed');
}

export default function SpeedHub() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tests", url: "/speed" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Speed Tests - Clicks Per Second & Typing Speed | Reflextry",
        "Test your raw speed with our click speed tests (CPS) and typing tests (WPM). Improve your finger dexterity and mental calculation speed.",
        "/speed"
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Why should I measure my clicking and typing speed?",
            answer: "Speed is essential in today's fast-paced digital world. Whether you're typing reports for work, playing competitive video games, or simply navigating your computer, faster execution means better productivity and performance."
        },
        {
            question: "What are the benefits of speed training?",
            answer: "Regular practice with speed tools offers several advantages including higher Words Per Minute (WPM) for faster data entry, increased Clicks Per Second (CPS) for competitive gaming, quicker mental calculation abilities, and enhanced finger dexterity."
        },
        {
            question: "How fast can I improve my CPS and WPM?",
            answer: "With 10-15 minutes of focused daily practice on our Jitter Click or Typing tests, you can see noticeable improvements within just 2 weeks. Technique is often more important than raw effort."
        }
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <SpeedHubClient />
        </>
    );
}
