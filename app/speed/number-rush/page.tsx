import { Metadata } from 'next';
import NumberRushGame from './NumberRushGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('number-rush', '/speed/number-rush');
}

export default function Page() {
    const config = SEO_CONFIGS['number-rush'];
    const structuredData = generateToolStructuredData(
        'number-rush',
        config.title,
        config.description,
        `/speed/number-rush`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <NumberRushGame />
        </>
    );
}
