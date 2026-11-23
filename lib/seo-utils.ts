import fs from "fs";
import path from "path";
import { TOOL_COUNT } from "@/config/tool-mapping";
import { Metadata } from "next";
import { generateSEOMetadata, fitTitle } from "@/components/SEO";
import { SEO_CONFIGS } from "@/config/seo-config";
import { isSupportedLocale } from "@/lib/i18n/config";

export { fitTitle };

const TRANSLATIONS_ROOT = path.resolve(process.cwd(), "content", "translations");
const DICTIONARIES_ROOT = path.resolve(process.cwd(), "lib", "i18n", "dictionaries");

function isConfinedPath(root: string, target: string): boolean {
    const resolved = path.resolve(target);
    return resolved.startsWith(`${root}${path.sep}`);
}

const seoTranslationsCache: Record<string, Record<string, any>> = {};
const homeDictCache: Record<string, { title?: string; description?: string }> = {};

export function getToolSEOConfig(toolId: string, locale?: string): { title: string; description: string; keywords: string[] } {
    if (locale && locale !== "en" && isSupportedLocale(locale)) {
        if (!seoTranslationsCache[locale]) {
            try {
                const transPath = path.resolve(TRANSLATIONS_ROOT, locale, "seo-config.json");
                if (isConfinedPath(TRANSLATIONS_ROOT, transPath) && fs.existsSync(transPath)) {
                    seoTranslationsCache[locale] = JSON.parse(fs.readFileSync(transPath, "utf8"));
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
        description: "Test your reaction time, working memory, typing speed, and aim precision with free browser-based cognitive training tools on Reflextry.",
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
        locale,
    });
}

export function getHomeMetadata(locale?: string): Metadata {
    const isEn = !locale || locale === "en";
    let title = "Brain Training Games & Reaction Time Test | Reflextry";
    let description = "Play 76 free cognitive benchmarks & 9 Mensa logic puzzles (10,800+ levels). Test reaction time (ms), memory, typing WPM, Queens, Tango, Zip, Wordle & Chess.";

    if (!isEn && locale && isSupportedLocale(locale)) {
        if (!homeDictCache[locale]) {
            const cached: { title?: string; description?: string } = {};
            try {
                const dictPath = path.resolve(DICTIONARIES_ROOT, `${locale}.json`);
                if (isConfinedPath(DICTIONARIES_ROOT, dictPath) && fs.existsSync(dictPath)) {
                    const dict = JSON.parse(fs.readFileSync(dictPath, "utf8"));
                    if (dict?.home?.heroTitle) {
                        cached.title = `${dict.home.heroTitle} ${dict.home.heroTitleHighlight || ""} | Reflextry`.trim();
                    }
                    if (dict?.home?.heroSubtitle) {
                        cached.description = dict.home.heroSubtitle;
                    }
                }
            } catch (_) {}
            homeDictCache[locale] = cached;
        }
        if (homeDictCache[locale].title) title = homeDictCache[locale].title!;
        if (homeDictCache[locale].description) description = homeDictCache[locale].description!;
    }

    return generateSEOMetadata({
        title,
        description,
        keywords: [
            "reaction time test",
            "brain training games free",
            "mensa logic puzzles online",
            "queens puzzle unlimited",
            "tango sun moon puzzle",
            "zip path puzzle",
            "mini sudoku 6x6",
            "crossclimb word ladder",
            "pinpoint word game",
            "wordle unlimited",
            "classic tetris browser",
            "chess vs ai online",
            "cps test",
            "typing speed test",
            "aim trainer online",
            "memory test online",
            "human benchmark alternative",
            "cognitive test suite",
            "reflex test online",
            "visual memory test",
            "number memory test",
            "sequence memory test",
            "schulte table online",
            "esports reaction warmup",
            "3d spatial aim trainer"
        ],
        url: "",
        type: "website",
        locale,
    });
}

export function getCategoryMetadata(category: string, locale?: string): Metadata {
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
        stem: {
            title: "STEM & Physics Lab — Interactive Science | Reflextry",
            description: "Explore interactive 2D physics visualizers for students. Experiment with gravity free-fall, laser reflection optics, projectile motion, and torque balance.",
            keywords: [
                "interactive physics lab online",
                "gravity simulator for students",
                "laser reflection optics game",
                "projectile motion calculator game",
                "seesaw torque balance simulator",
                "stem education games free",
                "visual physics experiments online"
            ],
        },
        "lab-3d": {
            title: "3D WebGL Lab — Solar Gravity & 3D Aim | Reflextry",
            description: "Experience real-time WebGL 3D simulations right in your browser. Explore 3D orbital mechanics with spacetime curvature and train 3D spatial depth reflexes.",
            keywords: [
                "3d solar system gravity simulator",
                "3d orbit simulator webgl",
                "3d aim trainer browser",
                "3d spatial reflex test",
                "interactive 3d physics games",
                "threejs education lab"
            ],
        },
        multiplayer: {
            title: "2-Player Arena — Split-Screen Battles | Reflextry",
            description: "Challenge a friend or classmate on one screen. Play 2-player millisecond reaction duels, rapid math tug-of-war, and wind-adjusted gravity cannon battles.",
            keywords: [
                "2 player reaction game",
                "2 player math game classroom",
                "2 player cannon physics game",
                "split screen browser games",
                "local multiplayer brain games",
                "two player educational games"
            ],
        },
        productivity: {
            title: "Student & Work Suite — Calc, GPA & 10-Key | Reflextry",
            description: "Boost study and office throughput with free browser tools: graphing calculator, GPA solver, flashcards, speed reading, 10-key KPH test, and focus tracker.",
            keywords: [
                "speed reading test with comprehension",
                "10 key typing test kph",
                "numpad data entry benchmark",
                "pomodoro focus reaction tracker",
                "student productivity tools free",
                "work performance training online",
                "graphing calculator online",
                "gpa calculator"
            ],
        },
        classics: {
            title: "Classic Browser Games — Wordle, Tetris & Chess | Reflextry",
            description: "Play hand-crafted browser classics with authentic rules: Daily & Unlimited Wordle, 60fps SRS Tetris, and full-rules Chess vs Alpha-Beta AI — free online.",
            keywords: [
                "classic browser games free",
                "wordle online unlimited",
                "classic tetris free browser",
                "play chess vs ai online",
                "flagship puzzle games"
            ],
        },
        puzzles: {
            title: "Logic & Word Puzzles — 9 Games, 10,800+ Levels | Reflextry",
            description: "Play Queens, Tango, Zip, Mini Sudoku, Patches, Sumbreak, Wend, Pinpoint & Crossclimb. 1,200+ Mensa-grade levels each plus daily challenges — free online.",
            keywords: [
                "mensa logic puzzles online",
                "queens puzzle unlimited",
                "tango sun moon logic game",
                "zip path puzzle online",
                "mini sudoku 6x6 free",
                "patches shikaku puzzle",
                "sumbreak merge puzzle",
                "wend word weave game",
                "pinpoint category game",
                "crossclimb word ladder",
                "daily logic games free"
            ],
        },
        tools: {
            title: "Cognitive Benchmark Tools Directory | Reflextry",
            description: `Explore ${TOOL_COUNT} free browser games for reaction time, memory, speed, accuracy, aim, STEM physics, 3D labs, 2-player battles, and study productivity.`,
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
        locale,
    });
}
