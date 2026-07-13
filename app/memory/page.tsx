import { Metadata } from 'next';
import MemoryHubClient from './MemoryHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData, generateFAQPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('memory');
}

export default function MemoryHub() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Games", url: "/memory" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Memory Games - Test Your Working Memory",
        "Challenge your short-term and working memory with our collection of free cognitive tests. Sequence memory, visual recall, and more.",
        "/memory"
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Why is memory training important?",
            answer: "Memory training is essential for maintaining cognitive health and neuroplasticity. Our brain games are designed to challenge and strengthen your working memory, pattern recognition, and active recall abilities."
        },
        {
            question: "What are the benefits of playing memory games?",
            answer: "Engaging in daily cognitive exercises provides several scientifically-backed benefits including improved short-term memory capacity, enhanced concentration, better visual-spatial memory, and faster information processing."
        },
        {
            question: "How often should I practice memory exercises?",
            answer: "For the best results, consistency is more important than duration. We recommend starting with 10-15 minutes of daily practice using games like Sequence Memory or Number Memory."
        }
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <MemoryHubClient />
        </>
    );
}
