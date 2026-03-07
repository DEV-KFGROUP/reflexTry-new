import { Metadata } from 'next';
import SymbolMemoryPageClient from './SymbolMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('symbol-memory', '/memory/symbol');
}

export default function Page() {
    const config = SEO_CONFIGS['symbol-memory'];
    const structuredData = generateToolStructuredData(
        'symbol-memory',
        config.title,
        config.description,
        `/memory/symbol`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SymbolMemoryPageClient />
        </>
    );
}
