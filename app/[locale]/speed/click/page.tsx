import { Metadata } from 'next';
import ClickGame from './ClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('cps-test', locale, '/speed/click');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['cps-test'];
    const structuredData = generateToolStructuredData(
        'cps-test',
        config.title,
        config.description,
        `/${locale}/speed/click`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ClickGame />
        </>
    );
}
