// Toast utility that works with or without sonner
// Automatically falls back to custom notifications if sonner is not installed

"use client";

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
        const sonner = require("sonner");
        toastInstance = sonner.toast;
        return toastInstance;
    } catch (e) {
        // Fallback to custom toast
        const { toast: fallbackToast } = require("./toast-fallback");
        toastInstance = fallbackToast;
        return toastInstance;
    }
}

export const toast = {
    success: (message: string, options?: any) => {
        getToast().success(message, options);
    },
    error: (message: string, options?: any) => {
        getToast().error(message, options);
    },
    info: (message: string, options?: any) => {
        getToast().info(message, options);
    },
};








