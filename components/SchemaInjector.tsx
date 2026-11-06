import React from "react";
import { safeJsonLdStringify } from "@/lib/structured-data";

interface SchemaInjectorProps {
    schemas: any[];
}

export function SchemaInjector({ schemas }: SchemaInjectorProps) {
    if (!schemas || schemas.length === 0) return null;

    return (
        <>
            {schemas.filter(Boolean).map((schema, index) => {
                const schemaType = (schema && schema["@type"]) ? String(schema["@type"]).toLowerCase() : `item-${index}`;
                return (
                    <script
                        id={`schema-injector-${schemaType}-${index}`}
                        key={`schema-${index}`}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
                        suppressHydrationWarning
                    />
                );
            })}
        </>
    );
}
