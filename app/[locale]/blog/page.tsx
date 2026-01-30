import { Metadata } from 'next';
import BlogHubClient from './BlogHubClient';
import { getBaseUrl } from '@/lib/base-url';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = getBaseUrl();
    
    return {
        title: 'Brain Training Articles & Guides | Reflextry Blog',
        description: 'Discover expert insights on brain training, memory improvement, reaction time, and cognitive enhancement. In-depth articles, research-backed guides, and practical tips for improving your mental performance.',
        keywords: ['brain training', 'memory improvement', 'cognitive enhancement', 'reaction time', 'mental performance', 'brain health', 'cognitive training'],
        alternates: {
            canonical: `${baseUrl}/${locale}/blog`,
        },
        openGraph: {
            title: 'Brain Training Articles & Guides | Reflextry Blog',
            description: 'Expert insights on brain training, memory improvement, and cognitive enhancement.',
            url: `${baseUrl}/${locale}/blog`,
            type: 'website',
        },
    };
}

export default function Blog() {
    return <BlogHubClient />;
}
