import { Metadata } from 'next';
import SoundGame from './SoundGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('sound-reaction', locale, '/reflex/sound');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['sound-reaction'];
    const structuredData = generateToolStructuredData(
        'sound-reaction',
        config.title,
        config.description,
        `/${locale}/reflex/sound`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <SoundGame />
        </>
    );
}
