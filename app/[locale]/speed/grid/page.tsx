import { Metadata } from 'next';
import GridGame from './GridGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('grid-selection', locale, '/speed/grid');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['grid-selection'];
    const structuredData = generateToolStructuredData(
        'grid-selection',
        config.title,
        config.description,
        `/${locale}/speed/grid`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <GridGame />
        </>
    );
}
