import { Metadata } from 'next';
import QuickSortGame from './QuickSortGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('quick-sort', '/speed/quick-sort');
}

export default function Page() {
    const config = SEO_CONFIGS['quick-sort'];
    const structuredData = generateToolStructuredData(
        'quick-sort',
        config.title,
        config.description,
        `/speed/quick-sort`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <QuickSortGame />
        </>
    );
}
