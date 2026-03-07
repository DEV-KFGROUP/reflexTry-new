// Toast utility that works with or without sonner
// Automatically falls back to custom notifications if sonner is not installed

"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let toastInstance: any = null;

function getToast() {
    if (typeof window === "undefined") {
        // Server-side: return console logger
        return {
            success: (msg: string) => console.log("✅", msg),
            error: (msg: string) => console.error("❌", msg),
            info: (msg: string) => console.info("ℹ️", msg),
        };
    }

    if (toastInstance) {
        return toastInstance;
    }

    // Try to load sonner
    try {
        // Dynamic import for client-side only
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const sonner = require("sonner");
        toastInstance = sonner.toast;
        return toastInstance;
    } catch (_e) {
        // Fallback to custom toast
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { toast: fallbackToast } = require("./toast-fallback");
        toastInstance = fallbackToast;
        return toastInstance;
    }
}

export const toast = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success: (message: string, options?: any) => {
        getToast().success(message, options);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message: string, options?: any) => {
        getToast().error(message, options);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (message: string, options?: any) => {
        getToast().info(message, options);
    },
};








