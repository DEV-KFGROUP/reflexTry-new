"use client";

import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastMessage = string;

function safeInvoke(fn: () => string | number): string | number | undefined {
    if (typeof window === "undefined") return undefined;
    try {
        return fn();
    } catch {
        return undefined;
    }
}

export const toast = {
    success(message: ToastMessage, options?: ExternalToast) {
        return safeInvoke(() => sonnerToast.success(message, options));
    },
    error(message: ToastMessage, options?: ExternalToast) {
        return safeInvoke(() => sonnerToast.error(message, options));
    },
    info(message: ToastMessage, options?: ExternalToast) {
        return safeInvoke(() => sonnerToast.info(message, options));
    },
    warning(message: ToastMessage, options?: ExternalToast) {
        return safeInvoke(() => sonnerToast.warning(message, options));
    },
    message(message: ToastMessage, options?: ExternalToast) {
        return safeInvoke(() => sonnerToast.message(message, options));
    },
    loading(message: ToastMessage, options?: ExternalToast) {
        return safeInvoke(() => sonnerToast.loading(message, options));
    },
    dismiss(id?: string | number) {
        if (typeof window === "undefined") return;
        try {
            sonnerToast.dismiss(id);
        } catch {
            // Ignore dismiss errors
        }
    },
};
