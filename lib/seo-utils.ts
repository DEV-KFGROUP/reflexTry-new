import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";
import { SEO_CONFIGS } from "@/config/seo-config";

export function getToolMetadata(toolId: string, url: string): Metadata {
    const config = SEO_CONFIGS[toolId as keyof typeof SEO_CONFIGS];

    if (!config) {
        return {
            title: "Tool Not Found | Reflextry",
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
        title: "Reflextry - Test Your Accuracy & Reflexes | Free Brain Training Games",
        description: "Test your accuracy and reflexes with our Gen Z tools. Free online brain training games, reaction time tests, typing speed tests, memory games, and more. Improve your cognitive skills today!",
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
            title: "Memory Games - Train Your Brain | Reflextry",
            description: "Test and improve your memory with our free memory games. Sequence memory, number memory, visual memory, and more. Train your brain and boost cognitive function.",
            keywords: [
                "memory games", "memory test", "memory training", "brain memory games",
                "working memory", "short term memory", "visual memory", "sequence memory",
                "number memory", "memory improvement", "brain training memory", "memory exercises",
                "cognitive memory", "memory skills", "memory challenge", "memory game free",
                "online memory games", "memory training games", "brain memory training", "memory improvement games"
            ],
        },
        reflex: {
            title: "Reflex Tests - Measure Your Reaction Time | Reflextry",
            description: "Test your reflexes and reaction time with our free reflex tests. Visual reaction, audio reaction, grid shot, peripheral vision, and more. Improve your reaction speed.",
            keywords: [
                "reflex test", "reaction time test", "reflex training", "reaction speed test",
                "visual reflex", "audio reflex", "reflex games", "reaction time game",
                "reflex improvement", "reaction training", "reflex speed", "reaction test free",
                "online reflex test", "reflex training games", "reaction time training", "reflex improvement games"
            ],
        },
        speed: {
            title: "Speed Tests - CPS, Typing, Math | Reflextry",
            description: "Test your speed with our free speed tests. Click speed (CPS), typing speed (WPM), math speed, and more. Challenge yourself and improve your speed skills.",
            keywords: [
                "speed test", "cps test", "typing speed", "click speed", "typing test",
                "wpm test", "speed training", "click speed test", "typing speed test",
                "speed improvement", "speed training games", "click speed training", "typing speed training",
                "speed test free", "online speed test", "speed games", "speed challenge"
            ],
        },
        accuracy: {
            title: "Accuracy Tests - Precision Training | Reflextry",
            description: "Test your accuracy and precision with our free accuracy tests. Image recognition, data entry, typing accuracy, and more. Improve your attention to detail.",
            keywords: [
                "accuracy test", "precision test", "accuracy training", "precision training",
                "typing accuracy", "data entry accuracy", "image recognition", "accuracy improvement",
                "precision improvement", "accuracy games", "precision games", "accuracy test free",
                "online accuracy test", "accuracy training games", "precision training games", "accuracy challenge"
            ],
        },
        gaming: {
            title: "Gaming Training Tools - Aim Trainer & Reflex Games | Reflextry",
            description: "Warm up your hands and sharpen your senses for your next ranked match. Aim trainer, RPG reflex games, and more. Improve your gaming skills.",
            keywords: [
                "aim trainer", "gaming training", "FPS aim trainer", "gaming reflex test",
                "aim practice", "gaming warmup", "aim improvement", "gaming skills training",
                "RPG reflex", "gaming reaction test", "aim training free", "gaming tools",
                "online aim trainer", "gaming practice tools", "aim accuracy", "gaming performance"
            ],
        },
    };

    const config = categoryConfigs[category] || {
        title: `${category} Tools | Reflextry`,
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

