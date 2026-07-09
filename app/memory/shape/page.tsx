import { Metadata } from 'next';
import ShapeMemoryPageClient from './ShapeMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('shape-memory', '/memory/shape');
}

export default function Page() {
    const config = SEO_CONFIGS['shape-memory'];
    const structuredData = generateToolStructuredData(
        'shape-memory',
        config.title,
        config.description,
        `/memory/shape`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/shape` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/shape`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <ShapeMemoryPageClient />
        </>
    );
}
