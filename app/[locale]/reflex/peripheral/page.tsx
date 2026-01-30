import { Metadata } from 'next';
import PeripheralGame from './PeripheralGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('peripheral-vision', locale, '/reflex/peripheral');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['peripheral-vision'];
    const structuredData = generateToolStructuredData(
        'peripheral-vision',
        config.title,
        config.description,
        `/${locale}/reflex/peripheral`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <PeripheralGame />
        </>
    );
}
