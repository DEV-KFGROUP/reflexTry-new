import { Metadata } from 'next';
import StroopDropClient from './StroopDropClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('stroop-drop', '/gaming/stroop-drop');
}

export default function Page() {
    const config = SEO_CONFIGS['stroop-drop'];
    const structuredData = generateToolStructuredData(
        'stroop-drop',
        config.title,
        config.description,
        `/gaming/stroop-drop`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/stroop-drop` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/stroop-drop`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <StroopDropClient />
        </>
    );
}
