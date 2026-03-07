import { Metadata } from 'next';
import FlickShotGame from './FlickShotGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('flick-shot', '/gaming/flick-shot');
}

export default function Page() {
    const config = SEO_CONFIGS['flick-shot'];
    const structuredData = generateToolStructuredData(
        'flick-shot',
        config.title,
        config.description,
        `/gaming/flick-shot`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <FlickShotGame />
        </>
    );
}
