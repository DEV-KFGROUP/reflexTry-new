import { Metadata } from 'next';
import AimTrainerClient from './AimTrainerClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('aim-trainer', '/gaming/aim');
}

export default function Page() {
    const config = SEO_CONFIGS['aim-trainer'];
    const structuredData = generateToolStructuredData(
        'aim-trainer',
        config.title,
        config.description,
        `/gaming/aim`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/aim` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/aim`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <AimTrainerClient />
        </>
    );
}
