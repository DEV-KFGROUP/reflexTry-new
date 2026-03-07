import { Metadata } from 'next';
import RhythmTapGame from './RhythmTapGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('rhythm-tap', '/gaming/rhythm-tap');
}

export default function Page() {
    const config = SEO_CONFIGS['rhythm-tap'];
    const structuredData = generateToolStructuredData(
        'rhythm-tap',
        config.title,
        config.description,
        `/gaming/rhythm-tap`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <RhythmTapGame />
        </>
    );
}
