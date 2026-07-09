import { Metadata } from 'next';
import GridShotPageClient from './GridShotPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('grid-shot', '/reflex/grid');
}

export default function Page() {
    const config = SEO_CONFIGS['grid-shot'];
    const structuredData = generateToolStructuredData(
        'grid-shot',
        config.title,
        config.description,
        `/reflex/grid`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/grid` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/grid`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <GridShotPageClient />
        </>
    );
}
