import { Metadata } from 'next';
import DataEntryClient from './DataEntryClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getToolMetadata('data-entry', locale, '/accuracy/data');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const config = SEO_CONFIGS['data-entry'];
    const structuredData = generateToolStructuredData(
        'data-entry',
        config.title,
        config.description,
        `/${locale}/accuracy/data`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <DataEntryClient />
        </>
    );
}








