import { Metadata } from 'next';
import NumberMemoryPageClient from './NumberMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('number-memory', '/memory/number');
}

export default function Page() {
    const config = SEO_CONFIGS['number-memory'];
    const structuredData = generateToolStructuredData(
        'number-memory',
        config.title,
        config.description,
        `/memory/number`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/number` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/number`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <NumberMemoryPageClient />
        </>
    );
}
