import { Metadata } from 'next';
import FAQClient from './FAQClient';
import { getBaseUrl } from '@/lib/base-url';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = getBaseUrl();

    return {
        title: 'Frequently Asked Questions | Brain Training, Memory & Reaction Time FAQ - Reflextry',
        description: 'Find answers to common questions about brain training, memory improvement, reaction time, gaming performance, and how to use Reflextry tools effectively. Comprehensive FAQ covering all aspects of cognitive training.',
        keywords: ['brain training FAQ', 'memory improvement questions', 'reaction time FAQ', 'cognitive training help', 'brain games questions', 'how brain training works'],
        alternates: {
            canonical: `${baseUrl}/faq`,
        },
        openGraph: {
            title: 'Frequently Asked Questions',
            description: 'Get answers to all your questions about brain training, memory improvement, and cognitive enhancement.',
            url: `${baseUrl}/faq`,
            type: 'website',
        },
    };
}

export default function FAQ() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Faq", url: "/faq" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "Faq",
        "Learn more about Reflextry and our brain training tools.",
        "/faq"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <FAQClient />
        </>
    );
}
