import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import TorqueBalanceGame from "./TorqueBalanceGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("torque-balance", "/stem/torque-balance", locale);
}

export default async function TorqueBalancePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="torque-balance"
            path="/stem/torque-balance"
            categoryName="STEM & Physics Lab"
            categoryHref="/stem"
            locale={locale}
        >
            <TorqueBalanceGame />
        </NewToolPageShell>
    );
}
