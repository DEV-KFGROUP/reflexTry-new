import { Metadata } from 'next';
import ColorMatchGame from './ColorMatchGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('color-match', '/accuracy/color-match');
}

export default function Page() {
    const config = SEO_CONFIGS['color-match'];
    const structuredData = generateToolStructuredData(
        'color-match',
        config.title,
        config.description,
        `/accuracy/color-match`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ColorMatchGame />
        </>
    );
}
