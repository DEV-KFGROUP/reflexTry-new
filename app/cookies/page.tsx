import { Metadata } from 'next';
import { headers } from 'next/headers';
import CookiesPolicyClient from './CookiesPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getLegalPageMetadata('cookies', locale);
}

export default async function CookiesPolicy() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Cookie Policy", url: "/cookies" },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        "Cookies Policy - Cookie Usage & Management | Reflextry",
        "Learn about how Reflextry uses cookies, including Google AdSense cookies. Manage your cookie preferences and understand our cookie policy.",
        "/cookies",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <CookiesPolicyClient />
        </>
    );
}
