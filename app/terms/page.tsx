import { Metadata } from 'next';
import TermsClient from './TermsClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('terms');
}

export default function Terms() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Terms", url: "/terms" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "Terms",
        "Learn more about Reflextry and our brain training tools.",
        "/terms"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <TermsClient />
        </>
    );
}
