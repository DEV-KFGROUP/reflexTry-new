import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import { SEO_CONFIGS } from "@/config/seo-config";

export function getToolMetadata(toolId: string, url: string): Metadata {
    const config = SEO_CONFIGS[toolId as keyof typeof SEO_CONFIGS];

    if (!config) {
        return {
            title: "Tool Not Found",
            description: "Tool page on Reflextry",
        };
    }

    return generateSEOMetadata({
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        url: url,
        type: "website",
    });
}

export function getHomeMetadata(): Metadata {
    return generateSEOMetadata({
        title: "Brain Training Games to Sharpen Your Mind & Reflexes",
        description: "Improve your cognitive skills with free brain training games. Test your reaction time, memory, typing speed, and accuracy to track your progress.",
        keywords: [
            "reaction time test", "typing speed test", "brain training games", "memory games",
            "accuracy test", "reflex test", "cognitive training", "brain games free",
            "online brain training", "typing test", "memory test", "click speed test",
            "aim trainer", "visual memory test", "number memory test", "sequence memory",
            "cps test", "wpm test", "human benchmark", "brain training online",
            "free brain games", "cognitive games", "mental training", "brain exercise",
            "reaction speed test", "typing accuracy", "memory improvement", "brain fitness",
            "online reaction test", "typing practice", "memory training", "cognitive skills",
            "brain training app", "mental agility", "cognitive assessment", "brain health",
            "reaction time game", "typing speed game", "memory game", "brain training tool",
            "free cognitive training", "brain games online", "mental exercise games", "cognitive improvement"
        ],
        url: "",
        type: "website",
    });
}

export function getCategoryMetadata(category: string): Metadata {
    const categoryConfigs: Record<string, { title: string; description: string; keywords: string[] }> = {
        memory: {
            title: "Memory Games & Cognitive Training",
            description: "Improve your working memory with free brain training games. Test your visual, sequence, and short-term memory to boost your cognitive function.",
            keywords: [
                "memory games", "memory test", "memory training", "brain memory games",
                "working memory", "short term memory", "visual memory", "sequence memory",
                "number memory", "memory improvement", "brain training memory", "memory exercises",
                "cognitive memory", "memory skills", "memory challenge", "memory game free",
                "online memory games", "memory training games", "brain memory training", "memory improvement games"
            ],
        },
        reflex: {
            title: "Reflex Tests & Reaction Time Games",
            description: "Test your reflexes with free online reaction time games. Measure your visual and audio reaction speeds to improve your physical response times.",
            keywords: [
                "reflex test", "reaction time test", "reflex training", "reaction speed test",
                "visual reflex", "audio reflex", "reflex games", "reaction time game",
                "reflex improvement", "reaction training", "reflex speed", "reaction test free",
                "online reflex test", "reflex training games", "reaction time training", "reflex improvement games"
            ],
        },
        speed: {
            title: "Speed Tests: CPS & Typing Speed Games",
            description: "Test your physical speed with free click speed (CPS) and typing (WPM) tests. Challenge your limits and improve your fast-twitch muscle response.",
            keywords: [
                "speed test", "cps test", "typing speed", "click speed", "typing test",
                "wpm test", "speed training", "click speed test", "typing speed test",
                "speed improvement", "speed training games", "click speed training", "typing speed training",
                "speed test free", "online speed test", "speed games", "speed challenge"
            ],
        },
        accuracy: {
            title: "Accuracy Tests & Precision Training",
            description: "Improve your attention to detail with free accuracy training games. Test your visual precision, pattern matching, and spatial awareness skills.",
            keywords: [
                "accuracy test", "precision test", "accuracy training", "precision training",
                "typing accuracy", "data entry accuracy", "image recognition", "accuracy improvement",
                "precision improvement", "accuracy games", "precision games", "accuracy test free",
                "online accuracy test", "accuracy training games", "precision training games", "accuracy challenge"
            ],
        },
        gaming: {
            title: "Esports Training: Aim & Reflex Games",
            description: "Warm up your hands and sharpen your aim for competitive gaming. Improve your flick shots, tracking, and reaction times with free esports tools.",
            keywords: [
                "aim trainer", "gaming training", "FPS aim trainer", "gaming reflex test",
                "aim practice", "gaming warmup", "aim improvement", "gaming skills training",
                "RPG reflex", "gaming reaction test", "aim training free", "gaming tools",
                "online aim trainer", "gaming practice tools", "aim accuracy", "gaming performance"
            ],
        },
    };

    const config = categoryConfigs[category] || {
        title: `${category} Tools`,
        description: `Explore ${category} tools on Reflextry`,
        keywords: [`${category} tools`, `${category} games`, `${category} test`],
    };

    return generateSEOMetadata({
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        url: `/${category}`,
        type: "website",
    });
}

