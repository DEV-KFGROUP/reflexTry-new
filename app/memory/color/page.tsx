import { Metadata } from 'next';
import ColorMemoryPageClient from './ColorMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('color-memory', '/memory/color');
}

export default function Page() {
    const config = SEO_CONFIGS['color-memory'];
    const structuredData = generateToolStructuredData(
        'color-memory',
        config.title,
        config.description,
        `/memory/color`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ColorMemoryPageClient />
        </>
    );
}
