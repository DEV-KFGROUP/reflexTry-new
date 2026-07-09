import { Metadata } from 'next';
import AngleEstimationGame from './AngleEstimationGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('angle-estimation', '/accuracy/angle-estimation');
}

export default function Page() {
    const config = SEO_CONFIGS['angle-estimation'];
    const structuredData = generateToolStructuredData(
        'angle-estimation',
        config.title,
        config.description,
        `/accuracy/angle-estimation`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/angle-estimation` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/angle-estimation`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <AngleEstimationGame />
        </>
    );
}
