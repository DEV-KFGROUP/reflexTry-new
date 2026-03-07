import { Metadata } from 'next';
import GridShotPageClient from './GridShotPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('grid-shot', '/reflex/grid');
}

export default function Page() {
    const config = SEO_CONFIGS['grid-shot'];
    const structuredData = generateToolStructuredData(
        'grid-shot',
        config.title,
        config.description,
        `/reflex/grid`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <GridShotPageClient />
        </>
    );
}
