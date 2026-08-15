import React from "react";

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
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        suppressHydrationWarning
                    />
                );
            })}
        </>
    );
}
