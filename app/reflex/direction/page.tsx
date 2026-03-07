import { Metadata } from 'next';
import DirectionGame from './DirectionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('directional-reflex', '/reflex/direction');
}

export default function Page() {
    const config = SEO_CONFIGS['directional-reflex'];
    const structuredData = generateToolStructuredData(
        'directional-reflex',
        config.title,
        config.description,
        `/reflex/direction`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <DirectionGame />
        </>
    );
}
