import { Metadata } from 'next';
import ImageRecognitionClient from './ImageRecognitionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
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

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ImageRecognitionClient />
        </>
    );
}








