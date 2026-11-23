import { Metadata } from 'next';
import { headers } from 'next/headers';
import StatisticsClient from './StatisticsClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return generateSEOMetadata({
        title: "Statistics & Progress",
        description: "View your detailed statistics, progress charts, and performance trends across all Reflextry tools.",
        keywords: ["statistics", "progress tracking", "performance analytics", "score history", "improvement tracking"],
        url: `/statistics`,
        type: "website",
        locale,
        robots: { index: false, follow: true },
    });
}

export default function StatisticsPage() {
    return <StatisticsClient />;
}

