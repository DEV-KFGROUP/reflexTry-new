import { Metadata } from 'next';
import MultiStimulusGame from './MultiStimulusGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('multi-stimulus', locale, '/reflex/multi-stimulus');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['multi-stimulus'] || {
        title: 'Multi-Stimulus Reaction Test',
        description: 'Test your selective attention and decision-making speed with multiple stimuli'
    };
    const structuredData = generateToolStructuredData(
        'multi-stimulus',
        config.title,
        config.description,
        `/${locale}/reflex/multi-stimulus`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <MultiStimulusGame />
        </>
    );
}
