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
        { name: "Terms of Service", url: "/terms" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Terms and Conditions - User Agreement | Reflextry",
        "Read our terms and conditions to understand the rules and guidelines for using Reflextry. User agreement and terms of service.",
        "/terms"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <TermsClient />
        </>
    );
}
