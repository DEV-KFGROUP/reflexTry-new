import { Metadata } from 'next';
import PrecisionClickGame from './PrecisionClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('precision-click', '/accuracy/precision-click');
}

export default function Page() {
    const config = SEO_CONFIGS['precision-click'] || {
        title: 'Precision Clicking Test',
        description: 'Test your hand-eye coordination and precision clicking accuracy'
    };
    const structuredData = generateToolStructuredData(
        'precision-click',
        config.title,
        config.description,
        `/accuracy/precision-click`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/precision-click` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/precision-click`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <PrecisionClickGame />
        </>
    );
}
