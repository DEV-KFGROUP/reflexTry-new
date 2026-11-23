import type { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";

export interface FlagshipMetaEntry {
    title: string;
    shortTitle: string;
    description: string;
    category: "productivity" | "classics";
    path: string;
    keywords: string[];
    guidePoints: string[];
    faqs: { question: string; answer: string }[];
}

export const FLAGSHIP_TOOLS_META: Record<string, FlagshipMetaEntry> = {
    "graphing-calculator": {
        title: "Scientific & Graphing Calculator Online | Reflextry",
        shortTitle: "Scientific & Graphing Calculator",
        description:
            "Plot multiple mathematical functions simultaneously with interactive cursor tracing, zoom controls, and a built-in scientific calculator with history tape.",
        category: "productivity",
        path: "/productivity/graphing-calculator",
        keywords: ["graphing calculator online", "scientific calculator", "plot y = f(x)", "math function grapher"],
        guidePoints: [
            "Enter up to 5 simultaneous functions using sin, cos, tan, sqrt, log, ln, exp, pi, and powers (^).",
            "Hover directly over the coordinate grid to inspect exact f(x) values along every plotted curve.",
            "Switch to Scientific Keypad mode for rapid arithmetic, trigonometry (DEG/RAD), and reusable history tape.",
        ],
        faqs: [
            {
                question: "How many equations can I plot at once?",
                answer:
                    "You can graph up to 5 functions simultaneously in distinct high-contrast colors, compare intersections visually, and trace exact (x, y) coordinates with your cursor.",
            },
            {
                question: "Does the calculator support both degrees and radians?",
                answer:
                    "Yes. Switch between DEG and RAD modes inside the Scientific Keypad for trigonometric functions including sin, cos, tan, and inverse trig expressions.",
            },
            {
                question: "Is this online graphing calculator free for students?",
                answer:
                    "Yes. It runs 100% locally in your browser with zero ads, zero login, and instant history tape recall.",
            },
        ],
    },
    "unit-converter": {
        title: "Unit Converter & Physics Formula Solver | Reflextry",
        shortTitle: "Unit Converter & Formula Solver",
        description:
            "Convert length, mass, temperature, speed, energy, pressure, and data instantly alongside built-in solvers for Kinetic Energy, Ohm's Law, and Kinematics.",
        category: "productivity",
        path: "/productivity/unit-converter",
        keywords: ["scientific unit converter", "physics formula solver", "energy converter", "metric imperial converter"],
        guidePoints: [
            "Bidirectional real-time conversion across 7 scientific and everyday unit systems.",
            "Automatic reference table displays your input across all units in the selected category simultaneously.",
            "Built-in calculators for Kinetic Energy, Ohm's Law & Power, Kinematics displacement, and Compound Growth.",
        ],
        faqs: [
            {
                question: "Which measurement categories are supported?",
                answer:
                    "The converter handles Length, Mass, Temperature, Speed, Energy, Pressure, and Digital Data with bidirectional real-time conversion and a full reference table.",
            },
            {
                question: "What physics and STEM formulas are built in?",
                answer:
                    "Built-in solvers compute Kinetic Energy (½mv²), Ohm's Law (V=IR and electrical power), Kinematics displacement, and exponential compound growth.",
            },
            {
                question: "Are conversions calculated with scientific precision?",
                answer:
                    "Yes. All metric, imperial, and SI conversions use exact NIST conversion factors and display clean floating-point outputs without rounding drift.",
            },
        ],
    },
    "gpa-calculator": {
        title: "GPA & Final Exam Grade Calculator Online | Reflextry",
        shortTitle: "GPA & Final Exam Calculator",
        description:
            "Calculate semester and cumulative GPA on a 4.0 scale, save courses locally, and solve the exact final exam score needed to hit your target course grade.",
        category: "productivity",
        path: "/productivity/gpa-calculator",
        keywords: ["gpa calculator", "college gpa calculator", "final exam grade calculator", "weighted grade solver"],
        guidePoints: [
            "Add unlimited courses with custom credit weights and standard 4.0 letter grades — automatically saved in your browser.",
            "Combine your current semester with prior cumulative GPA and earned credits for accurate degree tracking.",
            "Use the Final Exam Target Grade Solver to find the exact percentage required on your final exam.",
        ],
        faqs: [
            {
                question: "How is cumulative GPA calculated with prior credits?",
                answer:
                    "Total grade points equal (Prior GPA × Prior Credits) plus the sum of (Course Grade Points × Course Credits), divided by total combined credits.",
            },
            {
                question: "How does the Final Exam Grade Solver work?",
                answer:
                    "Enter your current course percentage, desired target grade, and final exam weight to calculate the exact minimum score needed on your final exam.",
            },
            {
                question: "Is my course list saved privately?",
                answer:
                    "Yes. Your courses and credit hours are stored solely in your browser's local storage and never sent to any external server.",
            },
        ],
    },
    flashcards: {
        title: "Spaced-Repetition Flashcard Study Studio | Reflextry",
        shortTitle: "Study Flashcards Studio",
        description:
            "Study pre-built Physics, Algorithms, and Biology flashcard decks or create your own custom study cards with keyboard shortcuts and mastery tracking.",
        category: "productivity",
        path: "/productivity/flashcards",
        keywords: ["online flashcards", "study deck maker", "spaced repetition flashcards", "physics formulas flashcards"],
        guidePoints: [
            "Use Space to flip cards and press 1 (Needs Review), 2 (Getting It), or 3 (Mastered) for rapid keyboard studying.",
            "Switch to Manage Cards to add custom questions and formulas saved directly to your browser.",
            "Shuffle any deck anytime to avoid memorizing card order instead of true concepts.",
        ],
        faqs: [
            {
                question: "Can I create my own custom flashcard decks?",
                answer:
                    "Yes. Switch to Manage Cards to add, edit, or remove custom study questions and answers—everything persists automatically in your browser.",
            },
            {
                question: "What keyboard shortcuts speed up flashcard review?",
                answer:
                    "Press Space to flip the active card, and tap 1 (Needs Review), 2 (Getting It), or 3 (Mastered) to rate recall speed without touching your mouse.",
            },
            {
                question: "Which pre-built study decks are included?",
                answer:
                    "Reflextry includes ready-to-study decks covering Physics Formulas, Algorithms & Big-O Complexity, and Cellular Biology.",
            },
        ],
    },
    wordle: {
        title: "Classic Wordle — Daily & Unlimited Game | Reflextry",
        shortTitle: "Wordle",
        description:
            "Play the authentic 6-guess, 5-letter word puzzle in Daily mode or Unlimited practice with full keyboard support, streak tracking, and shareable results.",
        category: "classics",
        path: "/classics/wordle",
        keywords: ["wordle online", "unlimited wordle", "daily 5 letter word game", "word puzzle"],
        guidePoints: [
            "Green tiles mean the letter is in the word and in the exact spot; amber means it is in the word in a different spot.",
            "Switch seamlessly between today's shared Daily Wordle and Unlimited Practice mode.",
            "Copy your spoiler-free emoji pattern to share with friends after solving.",
        ],
        faqs: [
            {
                question: "Can I play Unlimited Wordle after finishing today's word?",
                answer:
                    "Yes. Toggle between Daily mode (one shared word per day) and Unlimited Practice mode to solve as many 5-letter puzzles as you want.",
            },
            {
                question: "What do green, amber, and gray tiles mean?",
                answer:
                    "Green means the letter is in the secret word in the exact position. Amber means the letter is in the word in a different spot. Gray means the letter is not in the word.",
            },
            {
                question: "Does this Wordle track my win streak and shareable grid?",
                answer:
                    "Yes. Your games played, win rate, and current streak are saved locally, and you can copy a spoiler-free emoji grid with one click.",
            },
        ],
    },
    tetris: {
        title: "Classic Tetris — Falling Block Puzzle | Reflextry",
        shortTitle: "Tetris",
        description:
            "Play smooth 60fps Classic Tetris with all 7 Tetrominoes, SRS wall kicks, ghost landing preview, Hold slot, 3-piece Next queue, and touch/keyboard controls.",
        category: "classics",
        path: "/classics/tetris",
        keywords: ["tetris online free", "classic tetris browser", "block stacker puzzle", "falling blocks game"],
        guidePoints: [
            "Use Arrow keys or WASD to move and rotate, Space for instant Hard Drop, and C or Shift to Hold a piece.",
            "Clear 4 lines at once (a Tetris) for maximum level-multiplied points.",
            "Watch the translucent ghost piece at the bottom to guarantee fast, accurate hard drops.",
        ],
        faqs: [
            {
                question: "Does this browser Tetris support Hold and Ghost Piece?",
                answer:
                    "Yes. It includes the standard 7-bag randomizer, SRS wall kicks, a Hold queue (C or Shift), a 3-piece Next preview, and a real-time ghost landing guide.",
            },
            {
                question: "What are the keyboard controls for Classic Tetris?",
                answer:
                    "Move left/right with Arrow keys or A/D, rotate with Up/W/X, soft drop with Down/S, hard drop with Space, and hold a piece with C or Shift.",
            },
            {
                question: "Can I play Tetris on mobile or tablet screens?",
                answer:
                    "Yes. Responsive on-screen touch controls let you slide, rotate, hold, and hard-drop smoothly on phones and tablets at 60fps.",
            },
        ],
    },
    chess: {
        title: "Classic Chess vs AI & 2-Player Board | Reflextry",
        shortTitle: "Chess vs AI",
        description:
            "Play full-rules 8×8 Chess against an Alpha-Beta AI (Casual, Club, Master) or a friend locally with castling, en passant, promotion, and algebraic history.",
        category: "classics",
        path: "/classics/chess",
        keywords: ["chess vs ai online", "play chess free browser", "2 player chess", "chess engine"],
        guidePoints: [
            "Full official chess rules including Kingside/Queenside castling, en passant captures, pawn promotion, and checkmate detection.",
            "Choose between Casual, Club, and Master AI difficulty levels or switch to 2-Player Pass & Play.",
            "Track every move in standard algebraic notation with Undo Move and Flip Board support.",
        ],
        faqs: [
            {
                question: "How strong is the built-in Chess AI engine?",
                answer:
                    "The browser Alpha-Beta minimax engine offers three calibrated tiers—Casual, Club, and Master—using piece-square positional tables and tactical lookahead.",
            },
            {
                question: "Are special chess rules like en passant and castling supported?",
                answer:
                    "Yes. Both kingside and queenside castling, en passant pawn captures, pawn promotion, check highlights, stalemate, and checkmate are fully enforced.",
            },
            {
                question: "Can two players play Chess on the same device?",
                answer:
                    "Yes. Switch the opponent toggle to 2-Player Pass & Play and use Flip Board anytime for face-to-face matches with full algebraic move notation.",
            },
        ],
    },
};

export const FLAGSHIP_SEO_MAP = Object.fromEntries(
    Object.entries(FLAGSHIP_TOOLS_META).map(([key, item]) => [
        key,
        {
            title: item.title,
            description: item.description,
            keywords: item.keywords,
        },
    ])
);

export const FLAGSHIP_TOOL_PATHS: Record<string, string> = Object.fromEntries(
    Object.entries(FLAGSHIP_TOOLS_META).map(([key, item]) => [key, item.path])
);

export function buildFlagshipMetadata(
    id: keyof typeof FLAGSHIP_TOOLS_META,
    locale?: string
): Metadata {
    const item = FLAGSHIP_TOOLS_META[id];
    return generateSEOMetadata({
        title: item.title,
        description: item.description,
        keywords: item.keywords,
        url: item.path,
        type: "website",
        locale,
    });
}
