import { Metadata } from 'next';
import ColorMemoryPageClient from './ColorMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('color-memory', locale, '/memory/color');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['color-memory'];
    const structuredData = generateToolStructuredData(
        'color-memory',
        config.title,
        config.description,
        `/${locale}/memory/color`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ColorMemoryPageClient />
        </>
    );
}
