import { Metadata } from 'next';
import PeripheralGame from './PeripheralGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('peripheral-vision', '/reflex/peripheral');
}

export default function Page() {
    const config = SEO_CONFIGS['peripheral-vision'];
    const structuredData = generateToolStructuredData(
        'peripheral-vision',
        config.title,
        config.description,
        `/reflex/peripheral`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/peripheral` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/peripheral`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <PeripheralGame />
        </>
    );
}
