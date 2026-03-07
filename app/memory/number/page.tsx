import { Metadata } from 'next';
import NumberMemoryPageClient from './NumberMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('number-memory', '/memory/number');
}

export default function Page() {
    const config = SEO_CONFIGS['number-memory'];
    const structuredData = generateToolStructuredData(
        'number-memory',
        config.title,
        config.description,
        `/memory/number`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <NumberMemoryPageClient />
        </>
    );
}
