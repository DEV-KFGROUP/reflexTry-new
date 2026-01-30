import { Metadata } from 'next';
import StatisticsClient from './StatisticsClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return generateSEOMetadata({
        title: "Statistics & Progress | Reflextry",
        description: "View your detailed statistics, progress charts, and performance trends across all Reflextry tools.",
        keywords: ["statistics", "progress tracking", "performance analytics", "score history", "improvement tracking"],
        url: `/statistics`, // Path without locale prefix
        locale,
        type: "website",
    });
}

export default function StatisticsPage() {
    return <StatisticsClient />;
}

