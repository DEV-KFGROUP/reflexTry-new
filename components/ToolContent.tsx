import dynamic from "next/dynamic";

export type { ContentSection, StepSection } from "./ToolContentBase";

export const ToolContent = dynamic(
    () => import("./ToolContentBase").then((mod) => mod.ToolContent),
    { ssr: true }
);
