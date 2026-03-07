import { Metadata } from 'next';
import PrecisionClickGame from './PrecisionClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('precision-click', '/accuracy/precision-click');
}

export default function Page() {
    const config = SEO_CONFIGS['precision-click'] || {
        title: 'Precision Clicking Test',
        description: 'Test your hand-eye coordination and precision clicking accuracy'
    };
    const structuredData = generateToolStructuredData(
        'precision-click',
        config.title,
        config.description,
        `/accuracy/precision-click`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <PrecisionClickGame />
        </>
    );
}
