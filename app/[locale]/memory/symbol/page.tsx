import { Metadata } from 'next';
import SymbolMemoryPageClient from './SymbolMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('symbol-memory', locale, '/memory/symbol');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['symbol-memory'];
    const structuredData = generateToolStructuredData(
        'symbol-memory',
        config.title,
        config.description,
        `/${locale}/memory/symbol`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SymbolMemoryPageClient />
        </>
    );
}
