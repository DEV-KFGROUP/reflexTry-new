import { Metadata } from 'next';
import ShapeMemoryPageClient from './ShapeMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('shape-memory', '/memory/shape');
}

export default function Page() {
    const config = SEO_CONFIGS['shape-memory'];
    const structuredData = generateToolStructuredData(
        'shape-memory',
        config.title,
        config.description,
        `/memory/shape`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ShapeMemoryPageClient />
        </>
    );
}
