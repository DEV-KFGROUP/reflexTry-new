import { Metadata } from 'next';
import { headers } from 'next/headers';
import ScienceClient from './ScienceClient';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getCategoryMetadata('science', locale);
}

export default async function Science() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Science", url: "/science" },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        "The Science of Brain Training | Neuroplasticity & Cognitive Research",
        "Explore the neuroscience behind brain training, neuroplasticity, and cognitive enhancement.",
        "/science",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <ScienceClient />
        </>
    );
}
