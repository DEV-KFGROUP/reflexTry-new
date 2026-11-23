import { Metadata } from 'next';
import { headers } from 'next/headers';
import AboutClient from './AboutClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getLegalPageMetadata('about', locale);
}

export default async function About() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        "About Us - Our Mission & Team | Reflextry",
        "Learn about Reflextry's mission to improve cognitive performance. Discover our evidence-based approach to memory, reaction time, and speed training.",
        "/about",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <AboutClient />
        </>
    );
}

