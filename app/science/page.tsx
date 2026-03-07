import { Metadata } from 'next';
import ScienceClient from './ScienceClient';
import { getBaseUrl } from '@/lib/base-url';

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = getBaseUrl();

    return {
        title: 'The Science of Brain Training | Neuroplasticity, Research & Cognitive Enhancement - Reflextry',
        description: 'Explore the neuroscience behind brain training. Learn about neuroplasticity, cognitive reserve, research evidence, and how brain training improves memory, reaction time, and cognitive performance.',
        keywords: ['brain training science', 'neuroplasticity', 'cognitive neuroscience', 'brain research', 'cognitive reserve', 'memory science', 'brain plasticity'],
        alternates: {
            canonical: `${baseUrl}/science`,
        },
        openGraph: {
            title: 'The Science of Brain Training | Reflextry',
            description: 'Discover the neuroscience behind cognitive training and how your brain adapts and improves.',
            url: `${baseUrl}/science`,
            type: 'website',
        },
    };
}

export default function Science() {
    return <ScienceClient />;
}
