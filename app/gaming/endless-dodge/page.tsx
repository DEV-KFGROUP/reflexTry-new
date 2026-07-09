import { Metadata } from 'next';
import EndlessDodgeClient from './EndlessDodgeClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('endless-dodge', '/gaming/endless-dodge');
}

export default function Page() {
    const config = SEO_CONFIGS['endless-dodge'];
    const structuredData = generateToolStructuredData(
        'endless-dodge',
        config.title,
        config.description,
        `/gaming/endless-dodge`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/endless-dodge` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/endless-dodge`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <EndlessDodgeClient />
        </>
    );
}
