import { Metadata } from 'next';
import RPGReactionClient from './RPGReactionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('rpg-reaction', '/gaming/reaction');
}

export default function Page() {
    const config = SEO_CONFIGS['rpg-reaction'];
    const structuredData = generateToolStructuredData(
        'rpg-reaction',
        config.title,
        config.description,
        `/gaming/reaction`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/reaction` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/reaction`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <RPGReactionClient />
        </>
    );
}
