import { Metadata } from 'next';
import ChallengesClient from './ChallengesClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    return generateSEOMetadata({
        title: "Daily Challenges",
        description: "Complete daily challenges to earn rewards and maintain your streak. New challenges every day!",
        keywords: ["daily challenges", "streak", "rewards", "daily goals", "challenges"],
        url: `/challenges`,
        type: "website",
    });
}

export default function ChallengesPage() {
    return <ChallengesClient />;
}

