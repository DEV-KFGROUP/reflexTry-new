import { Metadata } from 'next';
import WordGame from './WordGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('word-accuracy', locale, '/speed/words');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['word-accuracy'];
    const structuredData = generateToolStructuredData(
        'word-accuracy',
        config.title,
        config.description,
        `/${locale}/speed/words`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <WordGame />
        </>
    );
}
