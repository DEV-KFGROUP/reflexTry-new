import { Metadata } from 'next';
import SoundGame from './SoundGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('sound-reaction', '/reflex/sound');
}

export default function Page() {
    const config = SEO_CONFIGS['sound-reaction'];
    const structuredData = generateToolStructuredData(
        'sound-reaction',
        config.title,
        config.description,
        `/reflex/sound`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SoundGame />
        </>
    );
}
