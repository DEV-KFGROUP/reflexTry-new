import type { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";

export type PuzzleId =
    | "sumbreak"
    | "wend"
    | "patches"
    | "mini-sudoku"
    | "zip"
    | "tango"
    | "queens"
    | "pinpoint"
    | "crossclimb";

export type PuzzleGroup = "logic" | "word" | "spatial";

export interface PuzzleMetaEntry {
    id: PuzzleId;
    title: string;
    shortTitle: string;
    tagline: string;
    description: string;
    group: PuzzleGroup;
    groupLabel: string;
    path: string;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    accentText: string;
    keywords: string[];
    rules: string[];
    guidePoints: string[];
    faqs: { question: string; answer: string }[];
    levelCount: number;
}

export const PUZZLES_META: Record<PuzzleId, PuzzleMetaEntry> = {
    queens: {
        id: "queens",
        title: "Queens Logic Puzzle — 1,200+ Daily Levels | Reflextry",
        shortTitle: "Queens",
        tagline: "Place one queen per row, column, and colored region without conflicts.",
        description:
            "Solve 1,200+ Mensa-grade Queens puzzles from 5×5 Warmup to 9×9 Grandmaster. Place one queen per row, column, and color region with zero touching diagonals.",
        group: "logic",
        groupLabel: "Logic Grid",
        path: "/puzzles/queens",
        accentColor: "#4338CA",
        accentBg: "bg-indigo-50",
        accentBorder: "border-indigo-200",
        accentText: "text-indigo-700",
        keywords: [
            "queens puzzle online",
            "linkedin queens game free",
            "star battle logic puzzle",
            "daily queens puzzle unlimited",
            "mensa logic grid game",
        ],
        rules: [
            "Place exactly one Queen in every row, every column, and every colored region.",
            "No two Queens may touch horizontally, vertically, or diagonally.",
            "Tap once to mark X (ruled out), tap twice to place a Queen, or drag to paint X marks.",
        ],
        guidePoints: [
            "Start with single-row or single-column colored regions to eliminate entire lines immediately.",
            "Enable Auto-X to automatically rule out conflicting rows, columns, and adjacent diagonal squares when you place a Queen.",
            "Advance from 5×5 Warmup boards up to 9×9 Mensa Grandmaster layouts across 1,200 unique levels.",
        ],
        faqs: [
            {
                question: "How does Queens differ from classic N-Queens chess?",
                answer:
                    "In this Queens logic puzzle, queens cannot share a row, column, or colored region, and they cannot touch in any of the 8 surrounding adjacent squares (including immediate diagonals)—rather than attacking across entire long diagonals.",
            },
            {
                question: "How many Queens levels can I play for free?",
                answer:
                    "You can play 1,200+ deterministic Queens boards ranging from 5×5 Warmup up to 9×9 Grandmaster, plus a fresh Daily Queens challenge every day with zero sign-up required.",
            },
            {
                question: "Are all Queens puzzles solvable without guessing?",
                answer:
                    "Yes. Every generated board is verified to have a valid constraint-satisfying placement, and Auto-X plus live conflict highlights help you deduce placements cleanly.",
            },
        ],
        levelCount: 1200,
    },
    tango: {
        id: "tango",
        title: "Tango Binary Logic — 1,200+ Sun & Moon Grids | Reflextry",
        shortTitle: "Tango",
        tagline: "Balance Suns and Moons per row and column with no three adjacent.",
        description:
            "Play 1,200+ Tango binary deduction puzzles. Fill every row and column with equal Suns and Moons, no three in a row, while obeying every = and × clue.",
        group: "logic",
        groupLabel: "Logic Grid",
        path: "/puzzles/tango",
        accentColor: "#D97706",
        accentBg: "bg-amber-50",
        accentBorder: "border-amber-200",
        accentText: "text-amber-700",
        keywords: [
            "tango puzzle online",
            "sun moon logic game",
            "binairo takuzu puzzle",
            "daily tango game unlimited",
            "binary deduction puzzle",
        ],
        rules: [
            "Every row and column must contain an equal number of Suns and Moons.",
            "Never place more than two identical symbols directly next to each other.",
            "Cells joined by = must match; cells joined by × must be opposite symbols.",
        ],
        guidePoints: [
            "Look for two identical adjacent tokens or a sandwich pattern (Sun · empty · Sun) to deduce forced opposites.",
            "Use = and × boundary clues early—an = clue next to an existing token immediately forces both neighbors.",
            "Real-time rule diagnostics pinpoint the exact row, column, or clue if a contradiction appears.",
        ],
        faqs: [
            {
                question: "What do the = and × symbols mean in Tango?",
                answer:
                    "An = sign between two adjacent squares means both cells must hold the same symbol (both Suns or both Moons). An × sign means the two cells must hold opposite symbols.",
            },
            {
                question: "Is Tango the same as Binairo or Takuzu?",
                answer:
                    "Tango builds on Binairo/Takuzu binary logic—equal Suns and Moons per row and column with no three identical tokens in a row—and adds relational = and × edge clues for richer deduction.",
            },
            {
                question: "Can I play unlimited Tango puzzles after the daily board?",
                answer:
                    "Yes. Beyond today's shared Daily Tango puzzle, you have instant access to 1,200+ progressive 6×6 and 8×8 boards with progress and star ratings saved locally.",
            },
        ],
        levelCount: 1200,
    },
    zip: {
        id: "zip",
        title: "Zip Path Puzzle — 1,200+ Full-Grid Trails | Reflextry",
        shortTitle: "Zip",
        tagline: "Draw one continuous path through numbered checkpoints filling every cell.",
        description:
            "Connect numbered checkpoints in order with a single unbroken path that visits every cell on the board. 1,200+ daily and tiered Zip puzzles with wall obstacles.",
        group: "spatial",
        groupLabel: "Spatial Path",
        path: "/puzzles/zip",
        accentColor: "#059669",
        accentBg: "bg-emerald-50",
        accentBorder: "border-emerald-200",
        accentText: "text-emerald-700",
        keywords: [
            "zip puzzle game online",
            "hamiltonian path puzzle",
            "numberlink fill grid game",
            "daily zip game unlimited",
            "path logic puzzle",
        ],
        rules: [
            "Start at checkpoint 1 and draw one unbroken orthogonal path to the final number.",
            "Pass through every numbered checkpoint in strict ascending order.",
            "Visit every single cell on the grid without crossing walls or revisiting cells.",
        ],
        guidePoints: [
            "Drag smoothly across cells or click adjacent squares; drag backwards along your trail to backtrack cleanly.",
            "Dead-end corners and walled corridors have only one way in and out—route through them before moving on.",
            "Higher tiers introduce interior walls and larger 7×7 to 8×8 Mensa path layouts.",
        ],
        faqs: [
            {
                question: "Do I have to fill every cell on the board to win Zip?",
                answer:
                    "Yes. A winning Zip path must start at 1, pass through every numbered checkpoint in strict ascending order, finish on the highest number, and visit 100% of grid cells.",
            },
            {
                question: "How do walls work in higher Zip tiers?",
                answer:
                    "Thick wall dividers between two cells block orthogonal movement across that edge, forcing your Hamiltonian path to route around corridors and dead ends.",
            },
            {
                question: "Can I undo or backtrack my Zip trail easily?",
                answer:
                    "Yes. Simply drag backwards over your drawn path to rewind step-by-step, click an earlier cell on your trail to jump back, or tap Undo/Reset anytime.",
            },
        ],
        levelCount: 1200,
    },
    "mini-sudoku": {
        id: "mini-sudoku",
        title: "Mini Sudoku 6×6 — 1,200+ Unique Logic Grids | Reflextry",
        shortTitle: "Mini Sudoku",
        tagline: "Fill each row, column, and 2×3 shaded region with 1 through 6 once.",
        description:
            "Master 1,200+ uniquely solvable 6×6 Mini Sudoku puzzles with pencil notes, instant conflict checks, keyboard entry, and Mensa difficulty tiers.",
        group: "logic",
        groupLabel: "Logic Grid",
        path: "/puzzles/mini-sudoku",
        accentColor: "#7C3AED",
        accentBg: "bg-violet-50",
        accentBorder: "border-violet-200",
        accentText: "text-violet-700",
        keywords: [
            "mini sudoku 6x6 online",
            "fast daily sudoku",
            "6x6 sudoku unlimited",
            "shaded region sudoku",
            "mensa mini sudoku",
        ],
        rules: [
            "Fill every empty square with a digit from 1 to 6.",
            "Each row, each column, and each shaded 2×3 box must contain 1–6 with no repeats.",
            "Use Notes mode to mark candidate digits before locking in your deduction.",
        ],
        guidePoints: [
            "Every puzzle is verified for a single unique solution before play—never requires blind guessing.",
            "Use keys 1–6, Backspace, N (Notes), and Arrow keys for rapid desktop solving.",
            "Scan rows and 2×3 boxes with 4 or 5 filled cells first to unlock quick naked singles.",
        ],
        faqs: [
            {
                question: "Why play 6×6 Mini Sudoku instead of standard 9×9 Sudoku?",
                answer:
                    "Mini Sudoku uses the exact same pure deductive logic—rows, columns, and 2×3 shaded regions—in a brisk 1 to 3 minute format ideal for daily warmups and speed solving.",
            },
            {
                question: "Does every Mini Sudoku board have a unique solution?",
                answer:
                    "Yes. Every one of our 1,200+ grids is generated and verified to guarantee exactly one valid solution so you never face ambiguous guesswork.",
            },
            {
                question: "Are keyboard shortcuts and pencil notes supported?",
                answer:
                    "Yes. Navigate cells with Arrow keys, type 1–6 to place numbers, press N to toggle pencil candidate notes, and press Backspace to clear a square.",
            },
        ],
        levelCount: 1200,
    },
    patches: {
        id: "patches",
        title: "Patches Spatial Logic — 1,200+ Shikaku Grids | Reflextry",
        shortTitle: "Patches",
        tagline: "Partition the grid into exact shapes matching every area clue.",
        description:
            "Divide the board into non-overlapping rectangles so every patch contains one clue matching its exact cell area. 1,200+ spatial logic levels from 5×5 to 8×8.",
        group: "spatial",
        groupLabel: "Spatial Path",
        path: "/puzzles/patches",
        accentColor: "#0D9488",
        accentBg: "bg-teal-50",
        accentBorder: "border-teal-200",
        accentText: "text-teal-700",
        keywords: [
            "patches puzzle game",
            "shikaku logic puzzle online",
            "spatial area grid game",
            "rectangle partition puzzle",
            "mensa spatial puzzle",
        ],
        rules: [
            "Drag across the grid to draw a rectangle for each numbered clue.",
            "Every patch must contain exactly one clue cell and have an area equal to that clue's number.",
            "Patches cannot overlap, and every square in the grid must belong to a completed patch.",
        ],
        guidePoints: [
            "Prime clues like 5 or 7 can only form 1×5 or 1×7 strips—spot their forced orientation first.",
            "Click any completed patch to remove and redraw it, or use Undo to step back.",
            "Edge and corner clues drastically restrict valid rectangle dimensions.",
        ],
        faqs: [
            {
                question: "What are the rules of the Patches (Shikaku) logic game?",
                answer:
                    "You divide the entire grid into non-overlapping rectangles or squares so that each shape contains exactly one numbered clue and covers that exact number of grid cells.",
            },
            {
                question: "What is the best starting strategy for Patches?",
                answer:
                    "Start with prime numbers (3, 5, 7) and large corner clues. Prime areas can only be 1-cell-wide strips, which quickly lock in neighboring rectangles.",
            },
            {
                question: "How many Patches grid sizes and levels are included?",
                answer:
                    "Reflextry includes 1,200+ structured levels scaling from 5×5 introductory layouts up to dense 8×8 Mensa spatial boards, plus a shared Daily puzzle.",
            },
        ],
        levelCount: 1200,
    },
    sumbreak: {
        id: "sumbreak",
        title: "Sumbreak Merge Puzzle — 1,200+ Number Levels | Reflextry",
        shortTitle: "Sumbreak",
        tagline: "Slide and merge identical numbers to shatter each level's target tile.",
        description:
            "Merge matching numbers across 1,200+ structured Sumbreak levels with par moves, stone obstacles, optimal-move hints, and smooth keyboard or swipe play.",
        group: "spatial",
        groupLabel: "Number Strategy",
        path: "/puzzles/sumbreak",
        accentColor: "#E11D48",
        accentBg: "bg-rose-50",
        accentBorder: "border-rose-200",
        accentText: "text-rose-700",
        keywords: [
            "sumbreak merge game",
            "number merge puzzle online",
            "2048 level puzzle",
            "math tile merge game",
            "strategy number puzzle",
        ],
        rules: [
            "Slide all tiles up, down, left, or right using Arrow keys, WASD, or touch swipe.",
            "Identical colliding numbers merge into their double (2+2=4, 4+4=8, and so on).",
            "Reach the level's target tile within the par move count to earn 3 stars.",
        ],
        guidePoints: [
            "Anchor your highest tile in a corner and build a monotonic chain along one edge.",
            "Higher tiers introduce fixed stone blockers that split lanes and demand tactical planning.",
            "Use Hint anytime to run a live lookahead evaluation of the strongest next slide.",
        ],
        faqs: [
            {
                question: "How is Sumbreak different from standard endless 2048?",
                answer:
                    "Sumbreak transforms number merging into 1,200+ structured levels with specific target tiles, par move goals for 3-star mastery, stone blocker obstacles, and a Daily challenge.",
            },
            {
                question: "How do stone obstacles affect sliding in Sumbreak?",
                answer:
                    "Stone cells are fixed barriers that never move or merge. Tiles stop flush against stones, letting you trap and merge values in mid-board pockets.",
            },
            {
                question: "How does the Sumbreak optimal-move Hint work?",
                answer:
                    "Clicking Hint runs a real-time lookahead evaluation across all four directions—scoring monotonicity, empty spaces, and merge chains—to suggest your highest-value slide.",
            },
        ],
        levelCount: 1200,
    },
    wend: {
        id: "wend",
        title: "Wend Word Weave — 1,200+ Full-Grid Puzzles | Reflextry",
        shortTitle: "Wend",
        tagline: "Weave through connected letters so every letter in the grid is used once.",
        description:
            "Trace adjacent letters to uncover hidden words and consume every single tile on the board once. 1,200+ guaranteed-solvable Wend word-weave levels.",
        group: "word",
        groupLabel: "Word & Trivia",
        path: "/puzzles/wend",
        accentColor: "#2563EB",
        accentBg: "bg-blue-50",
        accentBorder: "border-blue-200",
        accentText: "text-blue-700",
        keywords: [
            "wend word game online",
            "word weave grid puzzle",
            "connect letters once game",
            "strands style word puzzle",
            "daily word grid game",
        ],
        rules: [
            "Connect horizontally, vertically, or diagonally adjacent letters to trace hidden words.",
            "Every single letter in the grid belongs to exactly one target word—no leftover tiles.",
            "Drag across letters or click tile-by-tile and press Submit Word to lock in a match.",
        ],
        guidePoints: [
            "Check the theme clue at the top of the board to spot domain vocabulary right away.",
            "Found words stay highlighted in their own editorial color so remaining letter islands stand out.",
            "Use Hint to spotlight the starting letter or full path of an unfound word.",
        ],
        faqs: [
            {
                question: "Can letter paths move diagonally in Wend?",
                answer:
                    "Yes. You can connect any horizontally, vertically, or diagonally adjacent letter tile, and paths can twist in any direction without reusing the same square twice.",
            },
            {
                question: "Are there any unused decoy letters on a Wend board?",
                answer:
                    "No. Every single tile in the grid is part of one of the hidden theme words—using every remaining letter cleanly is a core deduction clue.",
            },
            {
                question: "How many Wend word-weave themes and levels exist?",
                answer:
                    "You can play 1,200+ deterministic, guaranteed-partitioned Wend puzzles spanning dozens of curated themes, plus a fresh Daily board every 24 hours.",
            },
        ],
        levelCount: 1200,
    },
    pinpoint: {
        id: "pinpoint",
        title: "Pinpoint Word Association — 1,200+ Clue Rounds | Reflextry",
        shortTitle: "Pinpoint",
        tagline: "Deduce the shared category behind up to five clues in minimal reveals.",
        description:
            "Test lateral thinking across 1,200+ Mensa Pinpoint word association puzzles. Deduce the hidden category behind 5 progressive clues in minimal reveals.",
        group: "word",
        groupLabel: "Word & Trivia",
        path: "/puzzles/pinpoint",
        accentColor: "#9333EA",
        accentBg: "bg-purple-50",
        accentBorder: "border-purple-200",
        accentText: "text-purple-700",
        keywords: [
            "pinpoint word game online",
            "guess the category puzzle",
            "5 clues word association",
            "daily pinpoint unlimited",
            "mensa lateral thinking game",
        ],
        rules: [
            "Start with 1 revealed clue word and guess the shared theme connecting all five clues.",
            "Each incorrect guess—or tapping Reveal Next Clue—uncovers the next clue word (up to 5).",
            "Solve in fewer clues to earn higher stars (Clue 1–2 = 3 stars, Clue 3–4 = 2 stars).",
        ],
        guidePoints: [
            "Think broadly on Clue 1: consider phrases, wordplay ('Words before ...'), science, geography, and pop culture.",
            "Smart answer matching accepts close phrasing and common synonyms automatically.",
            "Advance through 1,200+ curated and lateral-association puzzles spanning Warmup to Mensa tiers.",
        ],
        faqs: [
            {
                question: "How is scoring calculated in Pinpoint?",
                answer:
                    "Solving on Clue 1 or Clue 2 awards 3 stars, solving on Clue 3 or Clue 4 awards 2 stars, and solving on the 5th clue awards 1 star.",
            },
            {
                question: "Do I have to type the exact wording of the category?",
                answer:
                    "No. Pinpoint uses tolerant phrase matching that accepts common synonyms, plural forms, and close natural phrasing automatically.",
            },
            {
                question: "How many Pinpoint rounds can I play in one day?",
                answer:
                    "In addition to today's Daily Pinpoint round, you can play through 1,200+ unlocked lateral-thinking rounds anytime with zero paywall.",
            },
        ],
        levelCount: 1200,
    },
    crossclimb: {
        id: "crossclimb",
        title: "Crossclimb Word Ladder — 1,200+ Trivia Rungs | Reflextry",
        shortTitle: "Crossclimb",
        tagline: "Solve clues and order 1-letter-different rungs to unlock top & bottom.",
        description:
            "Play 1,200+ Crossclimb word ladders. Solve 5 middle clues, order rungs so adjacent words differ by one letter, then crack the top and bottom words.",
        group: "word",
        groupLabel: "Word & Trivia",
        path: "/puzzles/crossclimb",
        accentColor: "#B45309",
        accentBg: "bg-orange-50",
        accentBorder: "border-orange-200",
        accentText: "text-orange-700",
        keywords: [
            "crossclimb game online",
            "trivia word ladder puzzle",
            "one letter different word game",
            "daily crossclimb unlimited",
            "mensa word ladder",
        ],
        rules: [
            "Phase 1: Solve all 5 middle word clues (each word is the same length).",
            "Phase 2: Reorder the 5 solved words so each consecutive rung changes by exactly one letter.",
            "Phase 3: Once locked in ladder order, solve the unlocked Top and Bottom clues to win.",
        ],
        guidePoints: [
            "Use the up/down arrows or drag handles during Phase 2 to align adjacent 1-letter transitions.",
            "Green connectors light up between rungs whenever two adjacent words differ by exactly one letter.",
            "Every one of the 1,200+ ladders is graph-verified against real English vocabulary.",
        ],
        faqs: [
            {
                question: "How do the three phases of Crossclimb work?",
                answer:
                    "First, answer 5 trivia clues to uncover the middle words. Second, reorder those 5 words so each adjacent pair differs by exactly one letter. Third, unlock and solve the Top and Bottom bookend words.",
            },
            {
                question: "Can I reorder the ladder in reverse order?",
                answer:
                    "Yes. Both forward and reversed valid 1-letter chains lock the ladder cleanly, and the top and bottom clues automatically align to the endpoints you built.",
            },
            {
                question: "Are all 1,200+ Crossclimb ladders verified real words?",
                answer:
                    "Yes. Every ladder is deterministically graph-verified so each rung is a valid English word with an exact single-letter step to its neighbors.",
            },
        ],
        levelCount: 1200,
    },
};

export const PUZZLES_HUB_FAQS: { question: string; answer: string }[] = [
    {
        question: "Are all 9 Mensa logic and word puzzles completely free to play?",
        answer:
            "Yes. Queens, Tango, Zip, Mini Sudoku, Patches, Sumbreak, Wend, Pinpoint, and Crossclimb are 100% free in your browser with zero account sign-up, zero paywalls, and 1,200+ levels per game.",
    },
    {
        question: "Do these puzzles include both Daily mode and unlimited levels?",
        answer:
            "Every game features a synchronized Daily Challenge that refreshes at midnight alongside 1,200+ deterministic campaign levels spanning Warmup, Club, Expert, Master, and Mensa Grandmaster tiers.",
    },
    {
        question: "How is my puzzle progress and streak saved?",
        answer:
            "Your completed levels, 3-star ratings, best solve times, and daily streaks are stored privately in your browser's local storage with instant offline-friendly resume.",
    },
];

export const PUZZLE_LIST: PuzzleMetaEntry[] = [
    PUZZLES_META.queens,
    PUZZLES_META.tango,
    PUZZLES_META.zip,
    PUZZLES_META["mini-sudoku"],
    PUZZLES_META.patches,
    PUZZLES_META.sumbreak,
    PUZZLES_META.wend,
    PUZZLES_META.pinpoint,
    PUZZLES_META.crossclimb,
];

export const PUZZLE_SEO_MAP = Object.fromEntries(
    PUZZLE_LIST.map((p) => [
        `puzzle-${p.id}`,
        {
            title: p.title,
            description: p.description,
            keywords: p.keywords,
        },
    ])
);

export const PUZZLE_TOOL_PATHS: Record<string, string> = Object.fromEntries(
    PUZZLE_LIST.map((p) => [`puzzle-${p.id}`, p.path])
);

export function buildPuzzleMetadata(id: PuzzleId, locale?: string): Metadata {
    const item = PUZZLES_META[id];
    return generateSEOMetadata({
        title: item.title,
        description: item.description,
        keywords: item.keywords,
        url: item.path,
        type: "website",
        locale,
    });
}
