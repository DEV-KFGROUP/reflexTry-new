import { Metadata } from 'next';
import StroopDropClient from './StroopDropClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('stroop-drop', '/gaming/stroop-drop');
}

export default function Page() {
    const config = SEO_CONFIGS['stroop-drop'];
    const structuredData = generateToolStructuredData(
        'stroop-drop',
        config.title,
        config.description,
        `/gaming/stroop-drop`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <StroopDropClient />
        </>
    );
}
