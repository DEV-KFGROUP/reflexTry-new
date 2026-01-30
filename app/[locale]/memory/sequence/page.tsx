import { Metadata } from 'next';
import SequenceGame from './SequenceGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('sequence-memory', locale, '/memory/sequence');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['sequence-memory'];
    const structuredData = generateToolStructuredData(
        'sequence-memory',
        config.title,
        config.description,
        `/${locale}/memory/sequence`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SequenceGame />
        </>
    );
}
