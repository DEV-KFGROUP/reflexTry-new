import { Metadata } from 'next';
import TargetTrackingClient from './TargetTrackingClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('target-tracking', '/gaming/target-tracking');
}

export default function Page() {
    const config = SEO_CONFIGS['target-tracking'];
    const structuredData = generateToolStructuredData(
        'target-tracking',
        config.title,
        config.description,
        `/gaming/target-tracking`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/target-tracking` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/target-tracking`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <TargetTrackingClient />
        </>
    );
}
