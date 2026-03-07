import { Metadata } from 'next';
import TypingGame from './TypingGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('typing-speed', '/speed/typing');
}

export default function Page() {
    const config = SEO_CONFIGS['typing-speed'];
    const structuredData = generateToolStructuredData(
        'typing-speed',
        config.title,
        config.description,
        `/speed/typing`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <TypingGame />
        </>
    );
}
