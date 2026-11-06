import { TOOL_COUNT } from "@/config/tool-mapping";
import { Metadata } from "next";
import { generateSEOMetadata, fitTitle } from "@/components/SEO";
import { SEO_CONFIGS } from "@/config/seo-config";

export { fitTitle };

const seoTranslationsCache: Record<string, Record<string, any>> = {};

export function getToolSEOConfig(toolId: string, locale?: string): { title: string; description: string; keywords: string[] } {
    if (locale && locale !== 'en') {
        if (!seoTranslationsCache[locale]) {
            try {
                const fs = eval('require("fs")');
                const path = eval('require("path")');
                const transPath = path.join(process.cwd(), 'content', 'translations', locale, 'seo-config.json');
                if (fs.existsSync(transPath)) {
                    seoTranslationsCache[locale] = JSON.parse(fs.readFileSync(transPath, 'utf8'));
                }
            } catch (_) {}
            if (!seoTranslationsCache[locale]) seoTranslationsCache[locale] = {};
        }

        const localized = seoTranslationsCache[locale]?.[toolId];
        if (localized && localized.title && localized.description) {
            return {
                title: localized.title,
                description: localized.description,
                keywords: localized.keywords || (SEO_CONFIGS[toolId as keyof typeof SEO_CONFIGS]?.keywords ?? []),
            };
        }
    }

    const fallback = SEO_CONFIGS[toolId as keyof typeof SEO_CONFIGS];
    if (fallback) {
        return fallback;
    }

    return {
        title: "Brain Training Benchmark | Reflextry",
        description: "Free online cognitive test and reflex benchmark on Reflextry.",
        keywords: ["brain training", "reaction test"],
    };
}

export function getToolMetadata(toolId: string, url: string, locale?: string): Metadata {
    const config = getToolSEOConfig(toolId, locale);

    return generateSEOMetadata({
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        url: url,
        type: "website",
    });
}

export function getHomeMetadata(locale?: string): Metadata {
    const isEn = !locale || locale === 'en';
    let title = "Brain Training Games & Reaction Time Benchmark | Reflextry";
    let description = "Train cognitive skills with free brain training games. Test reaction time (ms), working memory, CPS click speed, typing WPM, and FPS aim precision online.";

    if (!isEn) {
        try {
            const fs = eval('require("fs")');
            const path = eval('require("path")');
            const dictPath = path.join(process.cwd(), 'lib', 'i18n', 'dictionaries', `${locale}.json`);
            if (fs.existsSync(dictPath)) {
                const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
                if (dict?.home?.heroTitle) {
                    title = `${dict.home.heroTitle} ${dict.home.heroTitleHighlight || ''} | Reflextry`.trim();
                }
                if (dict?.home?.heroSubtitle) {
                    description = dict.home.heroSubtitle;
                }
            }
        } catch (_) {}
    }

    return generateSEOMetadata({
        title,
        description,
        keywords: [
            "reaction time test",
            "cps test",
            "typing speed test",
            "aim trainer online",
            "brain training games free",
            "memory test online",
            "human benchmark alternative",
            "cognitive test suite",
            "reflex test online",
            "click speed test",
            "visual memory test",
            "number memory test",
            "sequence memory test",
            "wpm test",
            "schulte table online",
            "flick shot aim trainer",
            "esports reaction warmup",
            "working memory exercises",
            "mental math speed test",
            "stroop test online",
            "chimp test",
            "verbal memory test",
            "digit span test",
            "hand eye coordination test",
            "neuroplasticity brain exercises"
        ],
        url: "",
        type: "website",
    });
}

export function getCategoryMetadata(category: string): Metadata {
    const categoryConfigs: Record<string, { title: string; description: string; keywords: string[] }> = {
        memory: {
            title: "Working Memory Tests & Cognitive Games | Reflextry",
            description: "Boost working memory capacity with free online memory games. Test visual patterns, number span, spatial sequences, verbal recall, and the primate Chimp Test.",
            keywords: [
                "memory test online free",
                "working memory test",
                "short term memory test",
                "memory games for adults",
                "visual memory test",
                "number memory test",
                "digit span test online",
                "sequence memory test",
                "chimp test online",
                "verbal memory test",
                "card matching memory game",
                "memory improvement exercises",
                "brain memory training online",
                "cognitive retention tests"
            ],
        },
        reflex: {
            title: "Reflex Tests & Reaction Time Games | Reflextry",
            description: "Test and train your visual and auditory reflexes with millisecond precision. Benchmark reaction times for driving, esports, and sports agility.",
            keywords: [
                "reflex test online",
                "reaction time test ms",
                "audio reaction time test",
                "grid reaction test",
                "peripheral vision test",
                "directional arrow reflex",
                "choice reaction time test",
                "whack a mole online free",
                "color switch reaction test",
                "test my reflexes free",
                "fast reaction games",
                "reaction speed benchmark",
                "human benchmark reaction time"
            ],
        },
        speed: {
            title: "Speed Tests: CPS, Typing WPM & Math Speed | Reflextry",
            description: "Measure motor speed and mental processing efficiency. Test your clicks per second (CPS), 1-minute typing WPM, rapid mental math, and Schulte table grids.",
            keywords: [
                "speed test games online",
                "cps test clicks per second",
                "typing speed test wpm",
                "mental math speed test",
                "schulte table online",
                "click speed test free",
                "number rush game",
                "quick sort speed game",
                "1 minute typing test",
                "jitter click test",
                "butterfly click test",
                "fast calculation challenge",
                "speed reading test"
            ],
        },
        accuracy: {
            title: "Accuracy Tests: Mouse Precision & Vision | Reflextry",
            description: "Refine hand-eye coordination and attention to detail. Test micro-target precision clicking, matrix pattern matching, color discrimination, and angle estimation.",
            keywords: [
                "accuracy test online",
                "mouse precision test",
                "precision clicking test",
                "pattern matching test online",
                "data entry accuracy test",
                "color match test",
                "color blindness test online",
                "angle estimation test",
                "mental rotation test",
                "visual acuity test free",
                "hand eye coordination test",
                "fine motor control click test"
            ],
        },
        gaming: {
            title: "Esports FPS Aim Trainer & Warmup Tools | Reflextry",
            description: "Warm up your hands and calibrate aim mechanics before competitive matches. Practice 3D flick shots, target tracking, combat reaction time, and dodging.",
            keywords: [
                "aim trainer online free",
                "fps aim trainer in browser",
                "valorant warmup web game",
                "cs2 aim training online",
                "gamer reaction time test",
                "target tracking aim test",
                "flick shot aim trainer",
                "endless dodge game online",
                "rhythm tap game",
                "stroop drop game",
                "esports warmup tools free",
                "mouse accuracy benchmark"
            ],
        },
        tools: {
            title: "Cognitive Benchmark Tools Directory | Reflextry",
            description: `Explore ${TOOL_COUNT} free browser games for reaction time, memory, speed, accuracy, and aim. Read scoring instructions and compare your practice sessions.`,
            keywords: [
                "online cognitive benchmark tools",
                "free brain test suite",
                "human benchmark games list",
                "reflex test tools online",
                "memory assessment tools free",
                "mouse speed and aim testing tools",
                "interactive cognitive tests",
                "mental agility benchmark directory"
            ],
        },
        science: {
            title: "The Science of Cognitive Training | Reflextry",
            description: "Discover the neuroscience behind brain training, synaptic plasticity, reaction speed physiology, and working memory capacity enhancement.",
            keywords: [
                "science of brain training",
                "neuroplasticity exercises and tests",
                "reaction time neuroscience",
                "working memory capacity research",
                "cognitive psychology testing tools",
                "does brain training work research",
                "synaptic delay in human reaction time"
            ],
        },
        "training-programs": {
            title: "Daily Brain Training Programs & Routines | Reflextry",
            description: "Follow structured 10-15 minute daily cognitive routines designed to sharpen focus, memory retention, processing speed, and reflexes.",
            keywords: [
                "daily brain training routine",
                "cognitive training schedule",
                "gamer reaction training program",
                "daily memory workout plan",
                "mental focus training exercises",
                "15 minute brain training challenge"
            ],
        },
        leaderboard: {
            title: "Global Cognitive Leaderboard & Rankings | Reflextry",
            description: "Compare your reaction time, CPS, typing speed, and memory scores against global percentiles and top players worldwide.",
            keywords: [
                "human benchmark leaderboard",
                "reaction time world record",
                "average reaction time ranking",
                "cps world record leaderboard",
                "typing speed percentile rank",
                "memory test world records",
                "cognitive test score comparison"
            ],
        },
        faq: {
            title: "Brain & Reflex Training FAQ | Reflextry",
            description: "Get scientific answers to common questions about human reaction times, working memory improvement, CPS click techniques, and typing speed.",
            keywords: [
                "what is a good reaction time in ms",
                "how fast is average human reaction time",
                "can you improve working memory capacity",
                "what is average cps for clicking",
                "how to increase typing wpm fast",
                "why is my reaction time slow"
            ],
        },
        blog: {
            title: "Cognitive Science & Reflex Training Blog | Reflextry",
            description: "Read expert guides and scientific articles on improving memory, lowering reaction times, touch typing mastery, and esports performance.",
            keywords: [
                "cognitive science blog",
                "brain training articles",
                "how to improve reaction time guide",
                "memory improvement techniques",
                "typing speed improvement tips",
                "esports cognitive performance guide"
            ],
        },
    };

    const config = categoryConfigs[category] || {
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Tools & Tests | Reflextry`,
        description: `Explore free ${category} cognitive tests and reflex training tools on Reflextry.`,
        keywords: [`${category} tools`, `${category} games`, `${category} test`, "cognitive benchmark"],
    };

    return generateSEOMetadata({
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        url: `/${category}`,
        type: "website",
    });
}
