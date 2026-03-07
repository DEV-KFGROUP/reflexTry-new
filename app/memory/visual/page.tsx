import { Metadata } from 'next';
import VisualMemoryPageClient from './VisualMemoryPageClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('visual-memory', '/memory/visual');
}

export default function Page() {
    const config = SEO_CONFIGS['visual-memory'];
    const structuredData = generateToolStructuredData(
        'visual-memory',
        config.title,
        config.description,
        `/memory/visual`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <VisualMemoryPageClient />
        </>
    );
}
