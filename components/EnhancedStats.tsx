import dynamic from "next/dynamic";

export const EnhancedStats = dynamic(
    () => import("./EnhancedStatsBase").then((mod) => mod.EnhancedStats),
    { ssr: true }
);
