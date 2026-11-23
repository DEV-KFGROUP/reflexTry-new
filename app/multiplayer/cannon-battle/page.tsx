import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import CannonBattleGame from "./CannonBattleGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("cannon-battle-2p", "/multiplayer/cannon-battle", locale);
}

export default async function CannonBattlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="cannon-battle-2p"
            path="/multiplayer/cannon-battle"
            categoryName="2-Player Battle Arena"
            categoryHref="/multiplayer"
            locale={locale}
        >
            <CannonBattleGame />
        </NewToolPageShell>
    );
}
