import { Metadata } from 'next';
import PatternMatchingGame from './PatternMatchingGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('pattern-matching', '/accuracy/pattern-matching');
}

export default function Page() {
    const config = SEO_CONFIGS['pattern-matching'] || {
        title: 'Pattern Matching Accuracy Test',
        description: 'Test your visual accuracy by matching patterns with precision'
    };
    const structuredData = generateToolStructuredData(
        'pattern-matching',
        config.title,
        config.description,
        `/accuracy/pattern-matching`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <PatternMatchingGame />
        </>
    );
}
