import { Metadata } from 'next';
import AccuracyPageClient from './AccuracyPageClient';
import { getCategoryMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData, generateFAQPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('accuracy');
}

export default function AccuracyHub() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tests", url: "/accuracy" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Accuracy Tests - Improve Your Precision | Reflextry",
        "Test your accuracy and precision with our free tools. Pattern matching, angle estimation, and precision clicking.",
        "/accuracy"
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Why is accuracy testing important?",
            answer: "While speed determines how fast you can act, accuracy determines how effectively you can perform a task without errors. In gaming, professional work, and everyday tasks, high accuracy reduces the time spent correcting mistakes."
        },
        {
            question: "What are the benefits of precision and accuracy training?",
            answer: "Engaging in precision tasks provides tangible benefits like better hand-eye coordination, improved aiming precision for gaming, enhanced visual-spatial intelligence, and fewer data entry errors in professional work."
        },
        {
            question: "How can I improve my hand-eye coordination?",
            answer: "Improving hand-eye coordination requires deliberate practice. Start with our Precision Click or Pattern Matching tools. Initially, focus entirely on hitting the exact target rather than speed. Once your accuracy consistently reaches 95-100%, you can gradually increase your speed."
        }
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <AccuracyPageClient />
        </>
    );
}
