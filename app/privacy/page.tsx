import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('privacy');
}

export default function PrivacyPolicy() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Privacy", url: "/privacy" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "Privacy",
        "Learn more about Reflextry and our brain training tools.",
        "/privacy"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <PrivacyPolicyClient />
        </>
    );
}
