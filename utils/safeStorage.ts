/**
 * Safe wrapper around window.localStorage that never throws during SSR,
 * private browsing modes, quota exhaustion, or blocked storage environments.
 */
function getStorage(): Storage | null {
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export const safeStorage = {
    getItem(key: string): string | null {
        const store = getStorage();
        if (!store) return null;
        try {
            return store.getItem(key);
        } catch {
            return null;
        }
    },

    setItem(key: string, value: string): boolean {
        const store = getStorage();
        if (!store) return false;
        try {
            store.setItem(key, value);
            return true;
        } catch {
            return false;
        }
    },

    removeItem(key: string): boolean {
        const store = getStorage();
        if (!store) return false;
        try {
            store.removeItem(key);
            return true;
        } catch {
            return false;
        }
    },

    keys(): string[] {
        const store = getStorage();
        if (!store) return [];
        try {
            const result: string[] = [];
            for (let i = 0; i < store.length; i++) {
                const k = store.key(i);
                if (k !== null) result.push(k);
            }
            return result;
        } catch {
            return [];
        }
    },
};
