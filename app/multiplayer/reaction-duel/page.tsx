import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import ReactionDuelGame from "./ReactionDuelGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("reaction-duel-2p", "/multiplayer/reaction-duel", locale);
}

export default async function ReactionDuelPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="reaction-duel-2p"
            path="/multiplayer/reaction-duel"
            categoryName="2-Player Battle Arena"
            categoryHref="/multiplayer"
            locale={locale}
        >
            <ReactionDuelGame />
        </NewToolPageShell>
    );
}
