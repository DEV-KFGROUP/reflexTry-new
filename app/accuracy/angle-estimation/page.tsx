import { Metadata } from 'next';
import AngleEstimationGame from './AngleEstimationGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('angle-estimation', '/accuracy/angle-estimation');
}

export default function Page() {
    const config = SEO_CONFIGS['angle-estimation'];
    const structuredData = generateToolStructuredData(
        'angle-estimation',
        config.title,
        config.description,
        `/accuracy/angle-estimation`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <AngleEstimationGame />
        </>
    );
}
