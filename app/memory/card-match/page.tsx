import { Metadata } from 'next';
import CardMatchGame from './CardMatchGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('card-match', '/memory/card-match');
}

export default function Page() {
    const config = SEO_CONFIGS['card-match'];
    const structuredData = generateToolStructuredData(
        'card-match',
        config.title,
        config.description,
        `/memory/card-match`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <CardMatchGame />
        </>
    );
}
