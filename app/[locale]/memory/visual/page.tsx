import { Metadata } from 'next';
import VisualMemoryPageClient from './VisualMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('visual-memory', locale, '/memory/visual');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['visual-memory'];
    const structuredData = generateToolStructuredData(
        'visual-memory',
        config.title,
        config.description,
        `/${locale}/memory/visual`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <VisualMemoryPageClient />
        </>
    );
}
