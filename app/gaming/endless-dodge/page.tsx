import { Metadata } from 'next';
import EndlessDodgeClient from './EndlessDodgeClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('endless-dodge', '/gaming/endless-dodge');
}

export default function Page() {
    const config = SEO_CONFIGS['endless-dodge'];
    const structuredData = generateToolStructuredData(
        'endless-dodge',
        config.title,
        config.description,
        `/gaming/endless-dodge`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <EndlessDodgeClient />
        </>
    );
}
