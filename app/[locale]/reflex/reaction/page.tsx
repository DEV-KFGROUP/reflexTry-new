import { Metadata } from 'next';
import ReactionGame from './ReactionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('reaction-time', locale, '/reflex/reaction');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['reaction-time'];
    const structuredData = generateToolStructuredData(
        'reaction-time',
        config.title,
        config.description,
        `/${locale}/reflex/reaction`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ReactionGame />
        </>
    );
}
