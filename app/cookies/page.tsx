import { Metadata } from 'next';
import CookiesPolicyClient from './CookiesPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('cookies');
}

export default function CookiesPolicy() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Cookie Policy", url: "/cookies" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Cookies Policy - Cookie Usage & Management | Reflextry",
        "Learn about how Reflextry uses cookies, including Google AdSense cookies. Manage your cookie preferences and understand our cookie policy.",
        "/cookies"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <CookiesPolicyClient />
        </>
    );
}
