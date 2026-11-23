"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
    return (
        <SonnerToaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                style: {
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
                },
            }}
        />
    );
}
