import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";
import { getLeaderboardMetadata } from "@/lib/legal-seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getLeaderboardMetadata(locale);
}

export default function LeaderboardPage() {
    return <LeaderboardClient />;
}
