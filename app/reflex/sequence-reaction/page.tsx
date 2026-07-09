import { Metadata } from 'next';
import SequenceReactionGame from './SequenceReactionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('sequence-reaction', '/reflex/sequence-reaction');
}

export default function Page() {
    const config = SEO_CONFIGS['sequence-reaction'] || {
        title: 'Sequence Reaction Test',
        description: 'Test your memory and reaction speed by repeating color sequences'
    };
    const structuredData = generateToolStructuredData(
        'sequence-reaction',
        config.title,
        config.description,
        `/reflex/sequence-reaction`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/sequence-reaction` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/sequence-reaction`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <SequenceReactionGame />
        </>
    );
}
