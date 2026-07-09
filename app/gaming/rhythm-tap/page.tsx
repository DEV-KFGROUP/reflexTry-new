import { Metadata } from 'next';
import RhythmTapGame from './RhythmTapGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('rhythm-tap', '/gaming/rhythm-tap');
}

export default function Page() {
    const config = SEO_CONFIGS['rhythm-tap'];
    const structuredData = generateToolStructuredData(
        'rhythm-tap',
        config.title,
        config.description,
        `/gaming/rhythm-tap`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/rhythm-tap` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/rhythm-tap`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <RhythmTapGame />
        </>
    );
}
