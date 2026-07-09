import { Metadata } from 'next';
import MultiStimulusGame from './MultiStimulusGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('multi-stimulus', '/reflex/multi-stimulus');
}

export default function Page() {
    const config = SEO_CONFIGS['multi-stimulus'] || {
        title: 'Multi-Stimulus Reaction Test',
        description: 'Test your selective attention and decision-making speed with multiple stimuli'
    };
    const structuredData = generateToolStructuredData(
        'multi-stimulus',
        config.title,
        config.description,
        `/reflex/multi-stimulus`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/multi-stimulus` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/multi-stimulus`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <MultiStimulusGame />
        </>
    );
}
