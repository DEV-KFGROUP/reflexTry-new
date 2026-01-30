import { Metadata } from 'next';
import DirectionGame from './DirectionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('directional-reflex', locale, '/reflex/direction');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['directional-reflex'];
    const structuredData = generateToolStructuredData(
        'directional-reflex',
        config.title,
        config.description,
        `/${locale}/reflex/direction`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <DirectionGame />
        </>
    );
}
