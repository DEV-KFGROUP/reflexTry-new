import { Metadata } from 'next';
import ShapeMemoryPageClient from './ShapeMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('shape-memory', locale, '/memory/shape');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['shape-memory'];
    const structuredData = generateToolStructuredData(
        'shape-memory',
        config.title,
        config.description,
        `/${locale}/memory/shape`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ShapeMemoryPageClient />
        </>
    );
}
