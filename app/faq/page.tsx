import { Metadata } from 'next';
import FAQClient from './FAQClient';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('faq');
}

export default function FAQ() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "FAQ", url: "/faq" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Frequently Asked Questions | Brain Training & Reaction FAQ",
        "Answers about Reflextry brain training tools, reaction time, memory practice, and technical tips.",
        "/faq"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <FAQClient />
        </>
    );
}
