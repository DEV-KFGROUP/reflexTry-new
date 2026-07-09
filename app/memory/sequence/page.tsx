import { Metadata } from 'next';
import SequenceGame from './SequenceGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('sequence-memory', '/memory/sequence');
}

export default function Page() {
    const config = SEO_CONFIGS['sequence-memory'];
    const structuredData = generateToolStructuredData(
        'sequence-memory',
        config.title,
        config.description,
        `/memory/sequence`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/sequence` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/sequence`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <SequenceGame />
        </>
    );
}
