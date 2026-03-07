import { Metadata } from 'next';
import RPGReactionClient from './RPGReactionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('rpg-reaction', '/gaming/reaction');
}

export default function Page() {
    const config = SEO_CONFIGS['rpg-reaction'];
    const structuredData = generateToolStructuredData(
        'rpg-reaction',
        config.title,
        config.description,
        `/gaming/reaction`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <RPGReactionClient />
        </>
    );
}
