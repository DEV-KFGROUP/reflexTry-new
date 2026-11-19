/** Local records are optional: blocked or full storage must not stop a game. */
export const safeStorage = {
  getItem(key: string): string | null {
    try { return typeof window === "undefined" ? null : window.localStorage.getItem(key); }
    catch { return null; }
  },
  setItem(key: string, value: string): boolean {
    try {
      if (typeof window === "undefined") return false;
      window.localStorage.setItem(key, value);
      return true;
    }
    catch { return false; }
  },
  removeItem(key: string): void {
    try { if (typeof window !== "undefined") window.localStorage.removeItem(key); }
    catch { /* Storage may be disabled. */ }
  },
};
