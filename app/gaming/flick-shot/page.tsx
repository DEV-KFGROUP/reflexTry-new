import { Metadata } from 'next';
import FlickShotGame from './FlickShotGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('flick-shot', '/gaming/flick-shot');
}

export default function Page() {
    const config = SEO_CONFIGS['flick-shot'];
    const structuredData = generateToolStructuredData(
        'flick-shot',
        config.title,
        config.description,
        `/gaming/flick-shot`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/flick-shot` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/flick-shot`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <FlickShotGame />
        </>
    );
}
