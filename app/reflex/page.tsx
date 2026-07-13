import { Metadata } from 'next';
import ReflexHubClient from './ReflexHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData, generateFAQPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('reflex');
}

export default function ReflexHub() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Reflex Tests - Measure Your Reaction Time",
        "Test your reflexes and reaction time with our free reflex tests. Visual reaction, audio reaction, grid shot, peripheral vision, and more.",
        "/reflex"
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Why is testing your reflexes important?",
            answer: "Reaction time is a crucial cognitive skill that affects everything from driving safety to competitive gaming performance. Our reflex tests measure how quickly your brain processes stimuli and sends signals to your muscles."
        },
        {
            question: "What are the benefits of reflex training?",
            answer: "Regular reflex training offers measurable benefits including faster reaction times in gaming and sports, improved alertness, better hand-eye coordination, and enhanced processing speed for quick decision-making under pressure."
        },
        {
            question: "How fast can I improve my reaction time?",
            answer: "If you practice consistently for 10-15 minutes a day across different tests, most people see noticeable gains within 2 to 4 weeks. Your baseline will improve as your neural pathways adapt to rapid processing."
        }
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <ReflexHubClient />
        </>
    );
}
