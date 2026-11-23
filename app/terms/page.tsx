import { Metadata } from 'next';
import { headers } from 'next/headers';
import TermsClient from './TermsClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getLegalPageMetadata('terms', locale);
}

export default async function Terms() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Terms of Service", url: "/terms" },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        "Terms and Conditions - User Agreement | Reflextry",
        "Read our terms and conditions to understand the rules and guidelines for using Reflextry. User agreement and terms of service.",
        "/terms",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <TermsClient />
        </>
    );
}
