import { Metadata } from 'next';
import AchievementsClient from './AchievementsClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    return generateSEOMetadata({
        title: "Achievements & Badges | Reflextry",
        description: "View all your unlocked achievements and badges. Track your progress and unlock new challenges.",
        keywords: ["achievements", "badges", "gamification", "rewards", "challenges"],
        url: `/achievements`,
        type: "website",
    });
}

export default function AchievementsPage() {
    return <AchievementsClient />;
}

