import { Metadata } from 'next';
import { headers } from 'next/headers';
import ChallengesClient from './ChallengesClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return generateSEOMetadata({
        title: "Daily Challenges",
        description: "Complete daily challenges to earn rewards and maintain your streak. New challenges every day!",
        keywords: ["daily challenges", "streak", "rewards", "daily goals", "challenges"],
        url: `/challenges`,
        type: "website",
        locale,
        robots: { index: false, follow: true },
    });
}

export default function ChallengesPage() {
    return <ChallengesClient />;
}

