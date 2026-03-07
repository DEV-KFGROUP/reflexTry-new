import { Metadata } from 'next';
import SequenceGame from './SequenceGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('sequence-memory', '/memory/sequence');
}

export default function Page() {
    const config = SEO_CONFIGS['sequence-memory'];
    const structuredData = generateToolStructuredData(
        'sequence-memory',
        config.title,
        config.description,
        `/memory/sequence`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SequenceGame />
        </>
    );
}
