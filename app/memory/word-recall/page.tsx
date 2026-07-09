import { Metadata } from 'next';
import WordRecallGame from './WordRecallGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('word-recall', '/memory/word-recall');
}

export default function Page() {
    const config = SEO_CONFIGS['word-recall'];
    const structuredData = generateToolStructuredData(
        'word-recall',
        config.title,
        config.description,
        `/memory/word-recall`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/word-recall` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/word-recall`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <WordRecallGame />
        </>
    );
}
