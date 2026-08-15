export interface RegionBenchmark {
    country: string;
    code: string;
    flag: string;
    avgReactionMs: number;
    avgTypingWpm: number;
    avgCps: number;
    topGamePreference: string;
}

export const GEO_STATS_DATA: RegionBenchmark[] = [
    { country: "United States", code: "US", flag: "🇺🇸", avgReactionMs: 242, avgTypingWpm: 52, avgCps: 6.8, topGamePreference: "Aim Trainer & Reflex" },
    { country: "United Kingdom", code: "GB", flag: "🇬🇧", avgReactionMs: 245, avgTypingWpm: 50, avgCps: 6.7, topGamePreference: "Reaction Time & Typing" },
    { country: "Germany", code: "DE", flag: "🇩🇪", avgReactionMs: 238, avgTypingWpm: 48, avgCps: 6.9, topGamePreference: "Schulte Table & Math" },
    { country: "India", code: "IN", flag: "🇮🇳", avgReactionMs: 254, avgTypingWpm: 44, avgCps: 6.6, topGamePreference: "Click Speed & Memory" },
    { country: "Brazil", code: "BR", flag: "🇧🇷", avgReactionMs: 241, avgTypingWpm: 43, avgCps: 7.1, topGamePreference: "CPS Test & Aim Trainer" },
    { country: "South Korea", code: "KR", flag: "🇰🇷", avgReactionMs: 212, avgTypingWpm: 56, avgCps: 7.4, topGamePreference: "Reflex & Chimp Test" },
    { country: "Japan", code: "JP", flag: "🇯🇵", avgReactionMs: 220, avgTypingWpm: 45, avgCps: 6.9, topGamePreference: "Sequence Memory & Aim" },
    { country: "France", code: "FR", flag: "🇫🇷", avgReactionMs: 243, avgTypingWpm: 47, avgCps: 6.7, topGamePreference: "Typing WPM & Memory" },
];

export const GLOBAL_SUMMARY = {
    totalTestsCompleted: "1,450,000+",
    globalAvgReactionTime: "244ms",
    globalAvgTypingSpeed: "47.5 WPM",
    globalAvgCps: "6.7 CPS",
    activeCountriesCount: "140+"
};
