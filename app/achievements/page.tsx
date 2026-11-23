import { Metadata } from 'next';
import { headers } from 'next/headers';
import AchievementsClient from './AchievementsClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return generateSEOMetadata({
        title: "Achievements & Badges",
        description: "View all your unlocked achievements and badges. Track your progress and unlock new challenges.",
        keywords: ["achievements", "badges", "gamification", "rewards", "challenges"],
        url: `/achievements`,
        type: "website",
        locale,
        robots: { index: false, follow: true },
    });
}

export default function AchievementsPage() {
    return <AchievementsClient />;
}

