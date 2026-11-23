import { Metadata } from 'next';
import { headers } from 'next/headers';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getLegalPageMetadata('privacy', locale);
}

export default async function PrivacyPolicy() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        "Privacy Policy - Data Protection & Privacy | Reflextry",
        "Read our privacy policy to understand how Reflextry collects, uses, and protects your data. We use Google AdSense and respect your privacy.",
        "/privacy",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <PrivacyPolicyClient />
        </>
    );
}
