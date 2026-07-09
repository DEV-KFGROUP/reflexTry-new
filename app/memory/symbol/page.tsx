import { Metadata } from 'next';
import SymbolMemoryPageClient from './SymbolMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
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

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/symbol` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/symbol`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <SymbolMemoryPageClient />
        </>
    );
}
