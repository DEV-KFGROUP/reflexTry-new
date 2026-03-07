import { Metadata } from 'next';
import ReactionGame from './ReactionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('reaction-time', '/reflex/reaction');
}

export default function Page() {
    const config = SEO_CONFIGS['reaction-time'];
    const structuredData = generateToolStructuredData(
        'reaction-time',
        config.title,
        config.description,
        `/reflex/reaction`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ReactionGame />
        </>
    );
}
