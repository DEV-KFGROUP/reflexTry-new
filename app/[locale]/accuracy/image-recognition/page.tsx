import { Metadata } from 'next';
import ImageRecognitionClient from './ImageRecognitionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('image-recognition', locale, '/accuracy/image-recognition');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['image-recognition'];
    const structuredData = generateToolStructuredData(
        'image-recognition',
        config.title,
        config.description,
        `/${locale}/accuracy/image-recognition`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ImageRecognitionClient />
        </>
    );
}








