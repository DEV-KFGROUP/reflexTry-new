import { Metadata } from 'next';
import ChallengesClient from './ChallengesClient';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return generateSEOMetadata({
        title: "Daily Challenges | Reflextry",
        description: "Complete daily challenges to earn rewards and maintain your streak. New challenges every day!",
        keywords: ["daily challenges", "streak", "rewards", "daily goals", "challenges"],
        url: `/challenges`, // Path without locale prefix
        locale,
        type: "website",
    });
}

export default function ChallengesPage() {
    return <ChallengesClient />;
}

