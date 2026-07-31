import dynamic from "next/dynamic";
import { ToolContentServer } from "./ToolContentServer";
import { ToolContentProps } from "./ToolContentBase";

export type { ContentSection, StepSection, ToolContentProps } from "./ToolContentBase";

const ToolContentClient = dynamic(
    () => import("./ToolContentBase").then((mod) => mod.ToolContent),
    { ssr: true }
);

export function ToolContent(props: ToolContentProps) {
    return (
        <>
            {/* The visually-hidden server component that provides full raw HTML for Googlebot */}
            <ToolContentServer {...props} />
            {/* The interactive client component that users see (with tabs, animations) */}
            <ToolContentClient {...props} />
        </>
    );
}
