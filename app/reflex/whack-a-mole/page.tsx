import { Metadata } from 'next';
import WhackAMoleGame from './WhackAMoleGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('whack-a-mole', '/reflex/whack-a-mole');
}

export default function Page() {
    const config = SEO_CONFIGS['whack-a-mole'];
    const structuredData = generateToolStructuredData(
        'whack-a-mole',
        config.title,
        config.description,
        `/reflex/whack-a-mole`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <WhackAMoleGame />
        </>
    );
}
