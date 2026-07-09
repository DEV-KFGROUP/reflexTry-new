import { Metadata } from 'next';
import VisualMemoryPageClient from './VisualMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('visual-memory', '/memory/visual');
}

export default function Page() {
    const config = SEO_CONFIGS['visual-memory'];
    const structuredData = generateToolStructuredData(
        'visual-memory',
        config.title,
        config.description,
        `/memory/visual`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/visual` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/visual`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <VisualMemoryPageClient />
        </>
    );
}
