import { Metadata } from 'next';
import GridShotPageClient from './GridShotPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('grid-shot', locale, '/reflex/grid');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['grid-shot'];
    const structuredData = generateToolStructuredData(
        'grid-shot',
        config.title,
        config.description,
        `/${locale}/reflex/grid`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <GridShotPageClient />
        </>
    );
}
