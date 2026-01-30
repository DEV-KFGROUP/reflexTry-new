import { Metadata } from 'next';
import TypingGame from './TypingGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('typing-speed', locale, '/speed/typing');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['typing-speed'];
    const structuredData = generateToolStructuredData(
        'typing-speed',
        config.title,
        config.description,
        `/${locale}/speed/typing`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <TypingGame />
        </>
    );
}
