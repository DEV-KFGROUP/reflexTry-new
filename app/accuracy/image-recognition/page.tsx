import { Metadata } from 'next';
import ImageRecognitionClient from './ImageRecognitionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('image-recognition', '/accuracy/image-recognition');
}

export default function Page() {
    const config = SEO_CONFIGS['image-recognition'];
    const structuredData = generateToolStructuredData(
        'image-recognition',
        config.title,
        config.description,
        `/accuracy/image-recognition`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/image-recognition` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/image-recognition`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <ImageRecognitionClient />
        </>
    );
}








