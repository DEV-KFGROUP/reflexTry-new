import { Metadata } from 'next';
import QuickSortGame from './QuickSortGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
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

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/quick-sort` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/quick-sort`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <QuickSortGame />
        </>
    );
}
