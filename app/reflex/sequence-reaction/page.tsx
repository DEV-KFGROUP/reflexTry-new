import { Metadata } from 'next';
import SequenceReactionGame from './SequenceReactionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
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

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SequenceReactionGame />
        </>
    );
}
