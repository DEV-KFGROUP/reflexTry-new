import { Metadata } from 'next';
import AimTrainerClient from './AimTrainerClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('aim-trainer', locale, '/gaming/aim');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['aim-trainer'];
    const structuredData = generateToolStructuredData(
        'aim-trainer',
        config.title,
        config.description,
        `/${locale}/gaming/aim`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <AimTrainerClient />
        </>
    );
}
