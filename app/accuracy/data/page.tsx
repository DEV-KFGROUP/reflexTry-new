import { Metadata } from 'next';
import DataEntryClient from './DataEntryClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('data-entry', '/accuracy/data');
}

export default function Page() {
    const config = SEO_CONFIGS['data-entry'];
    const structuredData = generateToolStructuredData(
        'data-entry',
        config.title,
        config.description,
        `/accuracy/data`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <DataEntryClient />
        </>
    );
}








