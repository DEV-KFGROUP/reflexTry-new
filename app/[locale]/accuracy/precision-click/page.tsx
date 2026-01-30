import { Metadata } from 'next';
import PrecisionClickGame from './PrecisionClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('precision-click', locale, '/accuracy/precision-click');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['precision-click'] || {
        title: 'Precision Clicking Test',
        description: 'Test your hand-eye coordination and precision clicking accuracy'
    };
    const structuredData = generateToolStructuredData(
        'precision-click',
        config.title,
        config.description,
        `/${locale}/accuracy/precision-click`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <PrecisionClickGame />
        </>
    );
}
