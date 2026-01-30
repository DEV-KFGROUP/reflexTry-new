// Player name utilities

export const PlayerName = {
    get: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("reflextry_player_name");
    },

    set: (name: string): void => {
        if (typeof window === "undefined") return;
        localStorage.setItem("reflextry_player_name", name.trim());
    },

    clear: (): void => {
        if (typeof window === "undefined") return;
        localStorage.removeItem("reflextry_player_name");
    },

    exists: (): boolean => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("reflextry_player_name") !== null;
    },
};








