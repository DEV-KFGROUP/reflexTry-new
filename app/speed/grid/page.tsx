import { Metadata } from 'next';
import GridGame from './GridGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('grid-selection', '/speed/grid');
}

export default function Page() {
    const config = SEO_CONFIGS['grid-selection'];
    const structuredData = generateToolStructuredData(
        'grid-selection',
        config.title,
        config.description,
        `/speed/grid`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <GridGame />
        </>
    );
}
