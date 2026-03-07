import { Metadata } from 'next';
import ClickGame from './ClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('cps-test', '/speed/click');
}

export default function Page() {
    const config = SEO_CONFIGS['cps-test'];
    const structuredData = generateToolStructuredData(
        'cps-test',
        config.title,
        config.description,
        `/speed/click`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ClickGame />
        </>
    );
}
