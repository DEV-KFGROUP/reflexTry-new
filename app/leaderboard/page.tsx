import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";
import { getLeaderboardMetadata } from "@/lib/legal-seo";

export async function generateMetadata(): Promise<Metadata> {
    return getLeaderboardMetadata();
}

export default function LeaderboardPage() {
    return <LeaderboardClient />;
}
