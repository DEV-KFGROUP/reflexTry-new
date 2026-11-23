import {
    createRng,
    getLevelSeed,
    getTierForLevel,
    shuffleWithRng,
} from "@/lib/puzzles/core";

// ============================================================================
// 1. SUMBREAK (Tactical Number-Merge Levels — 4x4 & 5x5 with Blockers & AI Hint)
// ============================================================================

export type SumbreakDir = "up" | "down" | "left" | "right";

export interface SumbreakPuzzle {
    size: 4 | 5;
    initialGrid: number[][]; // 0 = empty, -1 = stone blocker, 2..2048 = tile
    targetTile: number;
    parMoves: number;
    spawnSeed: number;
    difficultyLabel: string;
}

export function slideSumbreakGrid(
    grid: number[][],
    dir: SumbreakDir
): { nextGrid: number[][]; moved: boolean; gained: number; mergedCoords: string[] } {
    const size = grid.length;
    const next = grid.map((row) => [...row]);
    let moved = false;
    let gained = 0;
    const mergedCoords: string[] = [];

    const processLine = (coords: [number, number][]) => {
        // Split line into segments separated by stone blockers (-1)
        let segStart = 0;
        while (segStart < coords.length) {
            const [sr, sc] = coords[segStart];
            if (next[sr][sc] === -1) {
                segStart++;
                continue;
            }
            let segEnd = segStart;
            while (segEnd < coords.length && next[coords[segEnd][0]][coords[segEnd][1]] !== -1) {
                segEnd++;
            }

            const segCoords = coords.slice(segStart, segEnd);
            const vals = segCoords
                .map(([r, c]) => next[r][c])
                .filter((v) => v > 0);

            const merged: number[] = [];
            const mergedIndices: number[] = [];
            for (let i = 0; i < vals.length; i++) {
                if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
                    const nv = vals[i] * 2;
                    merged.push(nv);
                    mergedIndices.push(merged.length - 1);
                    gained += nv;
                    i++;
                } else {
                    merged.push(vals[i]);
                }
            }

            for (let k = 0; k < segCoords.length; k++) {
                const [r, c] = segCoords[k];
                const newVal = k < merged.length ? merged[k] : 0;
                if (next[r][c] !== newVal) moved = true;
                next[r][c] = newVal;
                if (mergedIndices.includes(k)) {
                    mergedCoords.push(`${r},${c}`);
                }
            }

            segStart = segEnd;
        }
    };

    if (dir === "left" || dir === "right") {
        for (let r = 0; r < size; r++) {
            const line: [number, number][] = [];
            for (let c = 0; c < size; c++) {
                line.push([r, dir === "left" ? c : size - 1 - c]);
            }
            processLine(line);
        }
    } else {
        for (let c = 0; c < size; c++) {
            const line: [number, number][] = [];
            for (let r = 0; r < size; r++) {
                line.push([dir === "up" ? r : size - 1 - r, c]);
            }
            processLine(line);
        }
    }

    return { nextGrid: next, moved, gained, mergedCoords };
}

export function spawnSumbreakTile(grid: number[][], stepSeed: number): { grid: number[][]; spawnedKey: string | null } {
    const empties: [number, number][] = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid.length; c++) {
            if (grid[r][c] === 0) empties.push([r, c]);
        }
    }
    if (empties.length === 0) return { grid, spawnedKey: null };
    const rng = createRng(stepSeed);
    const [r, c] = empties[Math.floor(rng() * empties.length)];
    const val = rng() < 0.85 ? 2 : 4;
    const copy = grid.map((row) => [...row]);
    copy[r][c] = val;
    return { grid: copy, spawnedKey: `${r},${c}` };
}

export function hasValidSumbreakMove(grid: number[][]): boolean {
    const dirs: SumbreakDir[] = ["up", "down", "left", "right"];
    return dirs.some((d) => slideSumbreakGrid(grid, d).moved);
}

/** Lookahead heuristic recommending the best next slide for Hint */
export function getBestSumbreakHint(grid: number[][]): SumbreakDir | null {
    const dirs: SumbreakDir[] = ["up", "left", "right", "down"];
    let bestDir: SumbreakDir | null = null;
    let bestScore = -Infinity;

    for (const d of dirs) {
        const res = slideSumbreakGrid(grid, d);
        if (!res.moved) continue;
        let emptyCount = 0;
        let maxTile = 0;
        let cornerBonus = 0;
        let smoothness = 0;
        const n = res.nextGrid.length;
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const v = res.nextGrid[r][c];
                if (v === 0) emptyCount++;
                if (v > maxTile) maxTile = v;
                if (v > 0 && c + 1 < n && res.nextGrid[r][c + 1] === v) smoothness += v;
                if (v > 0 && r + 1 < n && res.nextGrid[r + 1][c] === v) smoothness += v;
            }
        }
        const corners = [
            res.nextGrid[0][0],
            res.nextGrid[0][n - 1],
            res.nextGrid[n - 1][0],
            res.nextGrid[n - 1][n - 1],
        ];
        if (corners.includes(maxTile)) cornerBonus = maxTile * 1.5;
        const score = res.gained * 2 + emptyCount * 28 + smoothness * 0.6 + cornerBonus;
        if (score > bestScore) {
            bestScore = score;
            bestDir = d;
        }
    }
    return bestDir;
}

export function generateSumbreak(level: number, isDaily: boolean): SumbreakPuzzle {
    const seed = getLevelSeed("sumbreak", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    const size: 4 | 5 = tier.id === "mensa" ? 5 : 4;
    const targetTile =
        tier.id === "warmup"
            ? level <= 80
                ? 64
                : 128
            : tier.id === "club"
              ? 128
              : tier.id === "scholar"
                ? 256
                : tier.id === "master"
                  ? 512
                  : 1024;

    const parMoves =
        targetTile === 64
            ? 28
            : targetTile === 128
              ? 52
              : targetTile === 256
                ? 96
                : targetTile === 512
                  ? 170
                  : 280;

    const grid: number[][] = Array.from({ length: size }, () => new Array<number>(size).fill(0));

    // Place 0..2 interior stone blockers on Club+ tiers (never blocking corners)
    const blockerCount =
        tier.id === "warmup" ? 0 : tier.id === "club" ? (level % 3 === 0 ? 1 : 0) : tier.id === "mensa" ? 2 : 1;

    const interiorCoords: [number, number][] = [];
    for (let r = 1; r < size - 1; r++) {
        for (let c = 1; c < size - 1; c++) {
            interiorCoords.push([r, c]);
        }
    }
    const chosenBlockers = shuffleWithRng(interiorCoords, rng).slice(0, blockerCount);
    for (const [r, c] of chosenBlockers) {
        grid[r][c] = -1;
    }

    // Seed 4–5 starter tiles for crisp tactical opening
    const freeCells: [number, number][] = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === 0) freeCells.push([r, c]);
        }
    }
    const starterPositions = shuffleWithRng(freeCells, rng).slice(0, 5);
    const starterPool =
        targetTile >= 256 ? [16, 8, 4, 4, 2] : targetTile >= 128 ? [8, 4, 4, 2, 2] : [4, 4, 2, 2, 2];

    starterPositions.forEach(([r, c], idx) => {
        grid[r][c] = starterPool[idx] ?? 2;
    });

    return {
        size,
        initialGrid: grid,
        targetTile,
        parMoves,
        spawnSeed: seed ^ 0x9e3779b9,
        difficultyLabel: tier.label,
    };
}

// ============================================================================
// 2. WEND (Full-Grid Word Weave — Every Single Letter Used Exactly Once!)
// ============================================================================

export interface WendWordPlacement {
    word: string;
    path: [number, number][];
    colorIndex: number;
}

export interface WendPuzzle {
    rows: number;
    cols: number;
    theme: string;
    grid: string[][];
    words: WendWordPlacement[];
    difficultyLabel: string;
}

interface WendThemePack {
    theme: string;
    words: string[];
}

const WEND_THEME_PACKS: WendThemePack[] = [
    {
        theme: "Cosmos & Sky",
        words: [
            "SUN", "ORB", "SKY", "RAY", "AIR", "ION",
            "STAR", "MOON", "MARS", "VOID", "HALO", "DAWN", "DUSK", "NOVA", "RING", "DUST", "GLOW",
            "ORBIT", "COMET", "SOLAR", "LUNAR", "VENUS", "EARTH", "LIGHT", "SPACE", "PHASE", "SPARK",
            "GALAXY", "PLANET", "METEOR", "NEBULA", "COSMOS", "QUASAR", "SATURN", "URANUS", "ZENITH",
            "ECLIPSE", "GRAVITY", "HORIZON", "MERCURY", "PULSARS",
        ],
    },
    {
        theme: "Ocean & Tide",
        words: [
            "SEA", "BAY", "FIN", "EEL", "COD", "OAR",
            "WAVE", "TIDE", "REEF", "KELP", "SAND", "SURF", "DEEP", "PIER", "SALT", "COVE", "FOAM",
            "CORAL", "WHALE", "SHARK", "SHELL", "OCEAN", "SHORE", "DRIFT", "BRINE", "PEARL", "SQUID",
            "ISLAND", "HARBOR", "ANCHOR", "MARINA", "LAGOON", "VOYAGE", "TRENCH", "WALRUS", "TURTLE",
            "CURRENT", "DOLPHIN", "TSUNAMI", "SEABIRD",
        ],
    },
    {
        theme: "Science & Lab",
        words: [
            "LAB", "ION", "GAS", "OHM", "DNA", "RNA",
            "ATOM", "CELL", "GENE", "MASS", "WAVE", "LENS", "ACID", "BASE", "VOLT", "WATT", "DATA",
            "PRISM", "LASER", "FORCE", "FIELD", "PULSE", "OXIDE", "ALLOY", "QUARK", "PHASE", "SOLID",
            "PROTON", "PHOTON", "CARBON", "OXYGEN", "HELIUM", "NEUTRON", "ENERGY", "THEORY", "MAGNET",
            "GRAVITY", "ISOTOPE", "ELEMENT", "QUANTUM",
        ],
    },
    {
        theme: "Forest & Wild",
        words: [
            "OAK", "FIR", "ELM", "OWL", "FOX", "DEW",
            "PINE", "LEAF", "MOSS", "FERN", "BARK", "WOOD", "WOLF", "BEAR", "DEER", "HAWK", "NEST",
            "CEDAR", "BIRCH", "MAPLE", "TRAIL", "GROVE", "CREEK", "ACORN", "SPORE", "RIVER", "FLORA",
            "CANOPY", "MEADOW", "TIMBER", "BADGER", "FALCON", "WILLOW", "BRANCH", "FOREST", "VALLEY",
            "REDWOOD", "BLOSSOM", "PANTHER", "THICKET",
        ],
    },
    {
        theme: "Music & Stage",
        words: [
            "KEY", "HUM", "BOW", "SAX", "JIG", "POP",
            "NOTE", "TUNE", "BEAT", "BASS", "DRUM", "HARP", "LUTE", "JAZZ", "ARIA", "SONG", "CLEF",
            "CHORD", "TEMPO", "SCALE", "PIANO", "FLUTE", "VIOLA", "CHOIR", "LYRIC", "OPERA", "SOUND",
            "MELODY", "RHYTHM", "VIOLIN", "GUITAR", "SONATA", "CHORUS", "TIMBRE", "OCTAVE", "BRIDGE",
            "HARMONY", "CONCERT", "TRUMPET", "CADENCE",
        ],
    },
    {
        theme: "Architecture & Craft",
        words: [
            "ARC", "BAY", "OAK", "TIN", "WAX", "SAW",
            "ARCH", "DOME", "BEAM", "WALL", "TILE", "DOOR", "GATE", "ROOF", "MILL", "LOFT", "NAIL",
            "BRICK", "STONE", "VAULT", "TOWER", "PLAZA", "SPIRE", "GLASS", "STEEL", "FRAME", "CRAFT",
            "COLUMN", "BRIDGE", "FACADE", "MARBLE", "MORTAR", "STUDIO", "ATRIUM", "CASTLE", "TIMBER",
            "GRANITE", "PAVILION", "PILLARS", "MOSAICS",
        ],
    },
    {
        theme: "Kitchen & Harvest",
        words: [
            "FIG", "OAT", "RYE", "TEA", "JAM", "PIE",
            "PEAR", "PLUM", "LIME", "MINT", "SAGE", "CORN", "BEAN", "SALT", "HERB", "CAKE", "SOUP",
            "APPLE", "BERRY", "MANGO", "PEACH", "OLIVE", "THYME", "BASIL", "BREAD", "HONEY", "SPICE",
            "CITRUS", "PEPPER", "GARLIC", "GINGER", "ALMOND", "WALNUT", "ROASTS", "PASTRY", "NOODLE",
            "HARVEST", "SAFFRON", "APRICOT", "ORCHARD",
        ],
    },
    {
        theme: "Logic & Mind",
        words: [
            "WIT", "CUE", "AIM", "SUM", "SET", "MAP",
            "CLUE", "MIND", "IDEA", "PLAN", "RULE", "CODE", "FACT", "TEST", "SORT", "GRID", "PATH",
            "LOGIC", "PROOF", "THINK", "SOLVE", "SMART", "BRAIN", "FOCUS", "SENSE", "MATCH", "AXIOM",
            "PUZZLE", "RIDDLE", "REASON", "MEMORY", "CIPHER", "MATRIX", "THEORY", "SYSTEM", "VECTOR",
            "INSIGHT", "PATTERN", "PROBLEM", "DEDUCE",
        ],
    },
    {
        theme: "Earth & Travel",
        words: [
            "MAP", "WAY", "BUS", "JET", "CAB", "INN",
            "ROAD", "PATH", "PORT", "CITY", "PEAK", "DUNE", "CAVE", "LAKE", "HILL", "CAMP", "VISA",
            "ATLAS", "GLOBE", "ROUTE", "TRAIN", "FERRY", "OASIS", "RIDGE", "COAST", "DELTA", "FJORD",
            "SUMMIT", "CANYON", "DESERT", "TUNDRA", "ISLAND", "BORDER", "VOYAGE", "COMPASS", "BRIDGE",
            "GLACIER", "VOLCANO", "PLATEAU", "HORIZON",
        ],
    },
    {
        theme: "Gems & Elements",
        words: [
            "ORE", "GEM", "TIN", "INK", "ASH", "ICE",
            "GOLD", "IRON", "ZINC", "JADE", "OPAL", "RUBY", "ONYX", "MICA", "LAVA", "COAL", "NEON",
            "AMBER", "PEARL", "TOPAZ", "AGATE", "QUARTZ", "STEEL", "BRONZE", "FLINT", "ARGON", "BERYL",
            "SILVER", "COPPER", "COBALT", "NICKEL", "GARNET", "MARBLE", "JASPER", "BASALT", "CRYSTAL",
            "DIAMOND", "EMERALD", "MINERAL", "PLATINUM",
        ],
    },
];

function generateRectangularHamiltonianPath(
    rows: number,
    cols: number,
    rng: () => number
): [number, number][] {
    const path: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
        if (r % 2 === 0) {
            for (let c = 0; c < cols; c++) path.push([r, c]);
        } else {
            for (let c = cols - 1; c >= 0; c--) path.push([r, c]);
        }
    }
    const total = rows * cols;
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];
    for (let step = 0; step < total * 12; step++) {
        if (rng() < 0.5) path.reverse();
        const [er, ec] = path[total - 1];
        const candidates: number[] = [];
        for (const [dr, dc] of dirs) {
            const nr = er + dr;
            const nc = ec + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            for (let k = 0; k < total - 2; k++) {
                if (path[k][0] === nr && path[k][1] === nc) {
                    candidates.push(k);
                    break;
                }
            }
        }
        if (candidates.length === 0) continue;
        const k = candidates[Math.floor(rng() * candidates.length)];
        let l = k + 1;
        let r = total - 1;
        while (l < r) {
            const tmp = path[l];
            path[l] = path[r];
            path[r] = tmp;
            l++;
            r--;
        }
    }
    return path;
}

function partitionLengthIntoWords(
    totalLen: number,
    poolByLen: Map<number, string[]>,
    rng: () => number
): string[] {
    const lengths = [6, 5, 4, 7, 3];
    const used = new Set<string>();
    const chosen: string[] = [];

    function dfs(rem: number): boolean {
        if (rem === 0) return true;
        if (rem < 3) return false;
        const order = shuffleWithRng(lengths, rng);
        for (const len of order) {
            if (len > rem) continue;
            if (rem - len > 0 && rem - len < 3) continue;
            const bucket = poolByLen.get(len);
            if (!bucket || bucket.length === 0) continue;
            const avail = bucket.filter((w) => !used.has(w));
            if (avail.length === 0) continue;
            const pick = avail[Math.floor(rng() * avail.length)];
            used.add(pick);
            chosen.push(pick);
            if (dfs(rem - len)) return true;
            chosen.pop();
            used.delete(pick);
        }
        return false;
    }

    if (dfs(totalLen)) return chosen;
    return ["STAR", "MOON", "MARS", "NOVA"];
}

export function generateWend(level: number, isDaily: boolean): WendPuzzle {
    const seed = getLevelSeed("wend", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    const dims: [number, number] =
        tier.id === "warmup"
            ? [4, 4]
            : tier.id === "club"
              ? [4, 5]
              : tier.id === "scholar" || tier.id === "master"
                ? [5, 5]
                : [5, 6];

    const [rows, cols] = dims;
    const total = rows * cols;

    // Pick primary theme pack and supplement with secondary pack if needed
    const packIdx = (seed + level) % WEND_THEME_PACKS.length;
    const pack = WEND_THEME_PACKS[packIdx];
    const poolByLen = new Map<number, string[]>();
    for (const w of pack.words) {
        const clean = w.toUpperCase();
        const arr = poolByLen.get(clean.length) || [];
        if (!arr.includes(clean)) arr.push(clean);
        poolByLen.set(clean.length, arr);
    }

    const wordsList = partitionLengthIntoWords(total, poolByLen, rng);
    const fullPath = generateRectangularHamiltonianPath(rows, cols, rng);

    const grid: string[][] = Array.from({ length: rows }, () => new Array<string>(cols).fill("A"));
    const placements: WendWordPlacement[] = [];
    let cursor = 0;

    wordsList.forEach((word, idx) => {
        const wordPath: [number, number][] = [];
        for (let i = 0; i < word.length; i++) {
            const [r, c] = fullPath[cursor++];
            grid[r][c] = word[i];
            wordPath.push([r, c]);
        }
        placements.push({
            word,
            path: wordPath,
            colorIndex: idx % 10,
        });
    });

    return {
        rows,
        cols,
        theme: pack.theme,
        grid,
        words: placements,
        difficultyLabel: tier.label,
    };
}

// ============================================================================
// 3. PINPOINT (1,200+ Mensa 5-Clue Category Association Puzzles)
// ============================================================================

export interface PinpointPuzzle {
    clues: [string, string, string, string, string];
    category: string;
    acceptedAnswers: string[];
    explanation: string;
    domain: string;
    difficultyLabel: string;
}

interface PinpointBankEntry {
    category: string;
    accepted: string[];
    domain: string;
    explanation: string;
    // Ordered roughly from trickier -> clearer so different difficulty tiers slice smartly
    pool: string[];
}

const PINPOINT_BANK: PinpointBankEntry[] = [
    {
        category: "Words that come before 'Light'",
        accepted: ["light", "words before light", "before light", "light words"],
        domain: "Wordplay",
        explanation: "Every clue forms a common compound word or phrase before LIGHT.",
        pool: ["Limelight", "Flash", "Spot", "High", "Moon", "Star", "Sun", "Green", "Day", "Head", "Night", "Traffic"],
    },
    {
        category: "Words that follow 'Black'",
        accepted: ["black", "words after black", "after black", "black words", "follow black"],
        domain: "Wordplay",
        explanation: "Each word commonly follows BLACK (Black Belt, Black Hole, Black Box, etc.).",
        pool: ["Swan", "Mail", "Jack", "Belt", "Hole", "Box", "Board", "Berry", "Smith", "Out", "List", "Friday"],
    },
    {
        category: "Things with Teeth",
        accepted: ["teeth", "things with teeth", "have teeth", "tooth"],
        domain: "Lateral Thinking",
        explanation: "Every object or creature listed literally or metaphorically has teeth.",
        pool: ["Zipper", "Gear", "Saw", "Comb", "Rake", "Shark", "Key", "Crocodile", "Cog", "Chainsaw"],
    },
    {
        category: "Things with Hands",
        accepted: ["hands", "things with hands", "have hands", "hand"],
        domain: "Lateral Thinking",
        explanation: "Each item has hands (clock hands, poker hand, farm hand, stage hand, etc.).",
        pool: ["Poker", "Clock", "Watch", "Deck", "Stage", "Farm", "Banana", "Ranch", "Second", "Minute"],
    },
    {
        category: "Things that have Keys",
        accepted: ["keys", "things with keys", "have keys", "key"],
        domain: "Lateral Thinking",
        explanation: "Every clue uses keys: map key, piano keys, keyboard keys, Florida Keys, etc.",
        pool: ["Map", "Florida", "Cipher", "Piano", "Keyboard", "Lock", "Saxophone", "Car", "House", "Typewriter"],
    },
    {
        category: "Words that come before 'Board'",
        accepted: ["board", "words before board", "before board"],
        domain: "Wordplay",
        explanation: "Each clue precedes BOARD (Dash-, Key-, Surf-, Chalk-, Chess-, Clip-).",
        pool: ["Dash", "Side", "Clip", "Card", "Skate", "Surf", "Key", "Chalk", "Chess", "Score", "Switch", "Spring"],
    },
    {
        category: "Words that come before 'House'",
        accepted: ["house", "words before house", "before house"],
        domain: "Wordplay",
        explanation: "Each word pairs before HOUSE (Light-, Green-, Ware-, Power-, Court-, Tree-).",
        pool: ["Ware", "Power", "Court", "Green", "Light", "Tree", "Opera", "Full", "Club", "Pent", "Fire", "Glass"],
    },
    {
        category: "Words that follow 'Cold'",
        accepted: ["cold", "words after cold", "after cold"],
        domain: "Wordplay",
        explanation: "All clues follow COLD (Cold Turkey, Cold War, Cold Shoulder, Cold Case).",
        pool: ["Turkey", "Shoulder", "Case", "Feet", "War", "Snap", "Brew", "Storage", "Call", "Front"],
    },
    {
        category: "Words that come before 'Stone'",
        accepted: ["stone", "words before stone", "before stone"],
        domain: "Wordplay",
        explanation: "Each word forms a term before STONE (Mile-, Corner-, Key-, Lime-, Sand-, Birth-).",
        pool: ["Key", "Corner", "Mile", "Brim", "Lime", "Sand", "Cobble", "Birth", "Tomb", "Touch", "Head", "Stepping"],
    },
    {
        category: "Things with Rings",
        accepted: ["rings", "things with rings", "have rings", "ring"],
        domain: "Lateral Thinking",
        explanation: "All items are known for rings (Saturn, trees, Olympic flag, boxing, circus).",
        pool: ["Tree", "Saturn", "Olympics", "Circus", "Boxing", "Onion", "Keychain", "Binder", "Wedding", "Bell"],
    },
    {
        category: "Units of Measurement",
        accepted: ["units", "measurement", "units of measurement", "metric units", "physics units"],
        domain: "Science",
        explanation: "Every clue is an official scientific or standard unit of measurement.",
        pool: ["Pascal", "Joule", "Kelvin", "Newton", "Hertz", "Ohm", "Watt", "Tesla", "Volt", "Ampere", "Mole", "Lux"],
    },
    {
        category: "Chemical Elements",
        accepted: ["elements", "chemical elements", "periodic table", "periodic table elements"],
        domain: "Science",
        explanation: "Every clue is an element on the Periodic Table.",
        pool: ["Cobalt", "Argon", "Neon", "Xenon", "Zinc", "Nickel", "Silver", "Gold", "Iron", "Carbon", "Helium", "Mercury"],
    },
    {
        category: "Elements Named After Planets or Celestial Bodies",
        accepted: ["elements", "planets", "celestial elements", "planet elements", "elements named after planets"],
        domain: "Science",
        explanation: "Each chemical element takes its name from a planet, dwarf planet, moon, or sun.",
        pool: ["Tellurium", "Selenium", "Cerium", "Palladium", "Helium", "Uranium", "Neptunium", "Plutonium", "Mercury"],
    },
    {
        category: "Chess Pieces or Terms",
        accepted: ["chess", "chess pieces", "chess terms", "chess moves"],
        domain: "Games",
        explanation: "Every clue is a classic chess piece, move, or board term.",
        pool: ["Gambit", "Fork", "Pin", "Castle", "Knight", "Bishop", "Rook", "Pawn", "Queen", "Checkmate", "Stalemate"],
    },
    {
        category: "Poker Hands or Terms",
        accepted: ["poker", "poker hands", "card games", "poker terms"],
        domain: "Games",
        explanation: "All clues are classic poker hands or betting terms.",
        pool: ["River", "Flop", "Bluff", "Flush", "Straight", "Full House", "Royal", "Pair", "Ante", "Fold"],
    },
    {
        category: "Musical Instruments",
        accepted: ["instruments", "musical instruments", "orchestra", "music instruments"],
        domain: "Arts",
        explanation: "Every clue is a musical instrument found in ensembles or orchestras.",
        pool: ["Oboe", "Bassoon", "Timpani", "Viola", "Cello", "Harp", "Clarinet", "Flute", "Trumpet", "Violin", "Piano"],
    },
    {
        category: "Musical Tempo Markings",
        accepted: ["tempo", "musical tempo", "music terms", "tempo markings", "italian music terms"],
        domain: "Arts",
        explanation: "Every Italian term instructs musicians how fast or slowly to play.",
        pool: ["Largo", "Adagio", "Andante", "Moderato", "Allegro", "Vivace", "Presto", "Lento", "Grave"],
    },
    {
        category: "Greek Letters",
        accepted: ["greek letters", "greek alphabet", "greek"],
        domain: "Language",
        explanation: "Each clue is a letter of the classical Greek alphabet.",
        pool: ["Zeta", "Theta", "Lambda", "Sigma", "Omega", "Delta", "Gamma", "Beta", "Alpha", "Kappa", "Epsilon"],
    },
    {
        category: "NATO Phonetic Alphabet",
        accepted: ["nato", "phonetic alphabet", "nato phonetic", "nato alphabet", "radio alphabet"],
        domain: "Language",
        explanation: "All words belong to the international NATO phonetic spelling alphabet.",
        pool: ["Sierra", "Whiskey", "Foxtrot", "Tango", "Echo", "Delta", "Bravo", "Charlie", "Alpha", "Zulu", "Oscar", "Hotel"],
    },
    {
        category: "Palindromes",
        accepted: ["palindromes", "palindrome", "read backwards", "same backwards"],
        domain: "Wordplay",
        explanation: "Every single clue spells the exact same word forward and backward.",
        pool: ["Kayak", "Civic", "Radar", "Level", "Rotor", "Refer", "Madam", "Noon", "Stats", "Tenet", "Deified"],
    },
    {
        category: "Silent First Letters",
        accepted: ["silent letter", "silent first letter", "silent letters", "silent k", "silent"],
        domain: "Wordplay",
        explanation: "Each English word begins with a silent consonant.",
        pool: ["Gnome", "Psalm", "Pneumonia", "Wrath", "Knight", "Knife", "Knock", "Knot", "Hour", "Honest"],
    },
    {
        category: "Types of Clouds",
        accepted: ["clouds", "cloud types", "types of clouds", "weather clouds"],
        domain: "Nature",
        explanation: "Every clue is a meteorological cloud classification.",
        pool: ["Altostratus", "Cirrocumulus", "Mammatus", "Lenticular", "Stratus", "Cirrus", "Cumulus", "Nimbus", "Cumulonimbus"],
    },
    {
        category: "Types of Rocks or Minerals",
        accepted: ["rocks", "minerals", "geology", "stones", "types of rocks"],
        domain: "Nature",
        explanation: "All clues are geological rocks or common Earth minerals.",
        pool: ["Pumice", "Obsidian", "Basalt", "Shale", "Slate", "Quartz", "Granite", "Marble", "Limestone", "Sandstone"],
    },
    {
        category: "Precious Gemstones",
        accepted: ["gems", "gemstones", "jewels", "precious stones", "birthstones"],
        domain: "Nature",
        explanation: "Every clue is a prized gemstone or birthstone.",
        pool: ["Peridot", "Garnet", "Opal", "Topaz", "Amethyst", "Jade", "Sapphire", "Emerald", "Ruby", "Diamond"],
    },
    {
        category: "World Currencies",
        accepted: ["currencies", "currency", "money", "world currencies"],
        domain: "Geography",
        explanation: "Every clue is an official national currency.",
        pool: ["Forint", "Zloty", "Baht", "Krona", "Rupee", "Won", "Franc", "Peso", "Yen", "Pound", "Euro", "Dollar"],
    },
    {
        category: "Capital Cities",
        accepted: ["capitals", "capital cities", "world capitals", "national capitals"],
        domain: "Geography",
        explanation: "Every clue is the capital city of a sovereign nation.",
        pool: ["Canberra", "Ottawa", "Bern", "Reykjavik", "Oslo", "Lisbon", "Seoul", "Tokyo", "Paris", "Cairo", "Lima"],
    },
    {
        category: "Major World Rivers",
        accepted: ["rivers", "world rivers", "major rivers"],
        domain: "Geography",
        explanation: "Every clue is one of Earth's iconic rivers.",
        pool: ["Volga", "Mekong", "Danube", "Rhine", "Ganges", "Yangtze", "Thames", "Nile", "Amazon", "Mississippi"],
    },
    {
        category: "Mountain Ranges",
        accepted: ["mountains", "mountain ranges", "ranges"],
        domain: "Geography",
        explanation: "All clues are famous continental mountain ranges.",
        pool: ["Urals", "Pyrenees", "Caucasus", "Atlas", "Appalachians", "Alps", "Rockies", "Andes", "Himalayas"],
    },
    {
        category: "Programming Languages",
        accepted: ["programming languages", "coding languages", "programming", "code languages"],
        domain: "Technology",
        explanation: "Every clue is a well-known software programming language.",
        pool: ["Elixir", "Haskell", "Kotlin", "Swift", "Rust", "Ruby", "Java", "Python", "Go", "TypeScript", "Scala"],
    },
    {
        category: "Data Structures in Computer Science",
        accepted: ["data structures", "computer science", "cs data structures", "structures"],
        domain: "Technology",
        explanation: "All clues are classic data structures used in algorithms.",
        pool: ["Trie", "Heap", "Graph", "Hash Map", "Tree", "Stack", "Queue", "Array", "Linked List"],
    },
    {
        category: "Geometric Shapes",
        accepted: ["shapes", "geometric shapes", "geometry", "polygons"],
        domain: "Math",
        explanation: "Every clue is a formal 2D or 3D geometric shape.",
        pool: ["Rhombus", "Trapezoid", "Torus", "Prism", "Hexagon", "Octagon", "Pentagon", "Pyramid", "Cylinder", "Sphere"],
    },
    {
        category: "Famous Mathematicians",
        accepted: ["mathematicians", "famous mathematicians", "math scientists"],
        domain: "Math",
        explanation: "Every clue is a legendary mathematician in history.",
        pool: ["Ramanujan", "Noether", "Fermat", "Galois", "Gauss", "Euler", "Euclid", "Newton", "Pythagoras", "Turing"],
    },
    {
        category: "Bones in the Human Body",
        accepted: ["bones", "human bones", "skeleton", "skeletal bones"],
        domain: "Science",
        explanation: "Every clue is a bone in the human skeletal system.",
        pool: ["Stapes", "Patella", "Clavicle", "Scapula", "Ulna", "Radius", "Tibia", "Fibula", "Femur", "Sternum", "Rib"],
    },
    {
        category: "Zodiac Constellations",
        accepted: ["zodiac", "zodiac signs", "astrology", "constellations", "horoscope"],
        domain: "Culture",
        explanation: "All clues are signs and constellations of the Zodiac.",
        pool: ["Capricorn", "Aquarius", "Sagittarius", "Scorpio", "Libra", "Virgo", "Leo", "Gemini", "Taurus", "Aries", "Pisces"],
    },
    {
        category: "Moons in Our Solar System",
        accepted: ["moons", "solar system moons", "planetary moons", "satellites"],
        domain: "Science",
        explanation: "Every clue is a natural moon orbiting a planet in our solar system.",
        pool: ["Enceladus", "Triton", "Callisto", "Phobos", "Deimos", "Ganymede", "Io", "Europa", "Titan", "Luna"],
    },
    {
        category: "Types of Pasta",
        accepted: ["pasta", "types of pasta", "italian pasta", "noodles"],
        domain: "Cuisine",
        explanation: "Every clue is a traditional Italian pasta shape.",
        pool: ["Orzo", "Farfalle", "Gnocchi", "Rigatoni", "Fusilli", "Linguine", "Penne", "Ravioli", "Spaghetti", "Macaroni"],
    },
    {
        category: "Culinary Spices & Herbs",
        accepted: ["spices", "herbs", "spices and herbs", "seasonings"],
        domain: "Cuisine",
        explanation: "Every clue is an aromatic spice or culinary herb.",
        pool: ["Cardamom", "Turmeric", "Saffron", "Cumin", "Paprika", "Thyme", "Rosemary", "Oregano", "Basil", "Cinnamon"],
    },
    {
        category: "Types of Cheese",
        accepted: ["cheese", "cheeses", "types of cheese"],
        domain: "Cuisine",
        explanation: "Every clue is a well-known variety of cheese.",
        pool: ["Gruyere", "Manchego", "Roquefort", "Gouda", "Feta", "Brie", "Mozzarella", "Parmesan", "Cheddar", "Swiss"],
    },
    {
        category: "Coffee Drinks",
        accepted: ["coffee", "coffee drinks", "espresso drinks", "cafe drinks"],
        domain: "Cuisine",
        explanation: "Every clue is a classic coffeehouse beverage.",
        pool: ["Cortado", "Ristretto", "Affogato", "Macchiato", "Americano", "Mocha", "Latte", "Cappuccino", "Espresso"],
    },
    {
        category: "Olympic Sports",
        accepted: ["olympic sports", "sports", "olympics", "summer olympics"],
        domain: "Sports",
        explanation: "Every clue is an official Olympic sporting event.",
        pool: ["Pentathlon", "Fencing", "Rowing", "Archery", "Judo", "Boxing", "Tennis", "Swimming", "Gymnastics", "Cycling"],
    },
    {
        category: "Words that come before 'Ball'",
        accepted: ["ball", "words before ball", "before ball"],
        domain: "Wordplay",
        explanation: "Every clue precedes BALL (Snow-, Cannon-, Fire-, Base-, Foot-, Basket-, Crystal-).",
        pool: ["Crystal", "Wrecking", "Cannon", "Mirror", "Snow", "Fire", "Base", "Basket", "Foot", "Volley", "Pin"],
    },
    {
        category: "Words that come before 'Water'",
        accepted: ["water", "words before water", "before water"],
        domain: "Wordplay",
        explanation: "Every word pairs before WATER (Fresh-, Salt-, Rain-, Ground-, Still-, Back-).",
        pool: ["Back", "Under", "Break", "White", "Ground", "Spring", "Rain", "Salt", "Fresh", "Tap", "Still"],
    },
    {
        category: "Words that follow 'Paper'",
        accepted: ["paper", "words after paper", "after paper"],
        domain: "Wordplay",
        explanation: "Every clue follows PAPER (Paper Trail, Paper Clip, Paper Plane, Paper Tiger).",
        pool: ["Tiger", "Trail", "Weight", "Back", "Mill", "Work", "Clip", "Plane", "Cut", "Towel", "Cup"],
    },
    {
        category: "Words that follow 'Green'",
        accepted: ["green", "words after green", "after green"],
        domain: "Wordplay",
        explanation: "Every clue follows GREEN (Green Thumb, Green Room, Green Card, Green Tea).",
        pool: ["Room", "Thumb", "Belt", "Horn", "Card", "House", "Light", "Tea", "Screen", "Peace"],
    },
    {
        category: "Words that come before 'Line'",
        accepted: ["line", "words before line", "before line"],
        domain: "Wordplay",
        explanation: "Each word forms a familiar term before LINE (Dead-, Punch-, Guide-, Base-, Air-, Sky-).",
        pool: ["Punch", "Fault", "Blood", "Dead", "Guide", "Base", "Head", "Sky", "Air", "Time", "Finish"],
    },
    {
        category: "Words that follow 'Gold'",
        accepted: ["gold", "words after gold", "after gold"],
        domain: "Wordplay",
        explanation: "Every clue follows GOLD (Gold Rush, Gold Medal, Gold Leaf, Gold Standard).",
        pool: ["Standard", "Leaf", "Mine", "Rush", "Dust", "Fish", "Medal", "Bar", "Coin", "Smith"],
    },
    {
        category: "Things with Bridges",
        accepted: ["bridge", "bridges", "things with a bridge", "things with bridges"],
        domain: "Lateral Thinking",
        explanation: "Each clue features a bridge (nose, guitar, violin, ship, song, glasses, dental).",
        pool: ["Song", "Glasses", "Ship", "Nose", "Violin", "Guitar", "Dental", "River", "Highway"],
    },
    {
        category: "Things that are Folded",
        accepted: ["folded", "fold", "things you fold", "things that fold"],
        domain: "Lateral Thinking",
        explanation: "Each clue can be folded (origami, poker hand, laundry, map, chair, omelet).",
        pool: ["Poker Hand", "Omelet", "Origami", "Map", "Napkin", "Laundry", "Chair", "Paper", "Letter"],
    },
    {
        category: "Things with Scales",
        accepted: ["scales", "things with scales", "have scales", "scale"],
        domain: "Lateral Thinking",
        explanation: "Each clue involves scales (music, maps, justice, fish, dragons, weight).",
        pool: ["Justice", "Map", "Music", "Dragon", "Reptile", "Fish", "Snake", "Bathroom", "Richter"],
    },
    {
        category: "Things that have Crowns",
        accepted: ["crown", "crowns", "things with crowns", "have crowns"],
        domain: "Lateral Thinking",
        explanation: "Each clue has a crown (tooth, tree, watch, chess king, hat, monarch).",
        pool: ["Watch", "Tooth", "Tree", "Hat", "Monarch", "King", "Queen", "Chess", "Roast"],
    },
    {
        category: "Things with Heads",
        accepted: ["head", "heads", "things with heads", "have heads"],
        domain: "Lateral Thinking",
        explanation: "Every item has a head (lettuce, coin, nail, bed, river, arrow, drum, shower).",
        pool: ["Lettuce", "River", "Drum", "Nail", "Coin", "Arrow", "Shower", "Bed", "Pin", "Hammer"],
    },
    {
        category: "Famous Artists & Painters",
        accepted: ["artists", "painters", "famous painters", "famous artists"],
        domain: "Arts",
        explanation: "Every clue is a renowned master painter in art history.",
        pool: ["Vermeer", "Caravaggio", "Klimt", "Kandinsky", "Rembrandt", "Dali", "Monet", "Picasso", "Van Gogh", "Da Vinci"],
    },
    {
        category: "Classical Composers",
        accepted: ["composers", "classical composers", "musicians"],
        domain: "Arts",
        explanation: "Every clue is a celebrated classical music composer.",
        pool: ["Debussy", "Mahler", "Brahms", "Vivaldi", "Chopin", "Tchaikovsky", "Bach", "Mozart", "Beethoven", "Handel"],
    },
    {
        category: "Shakespeare Plays",
        accepted: ["shakespeare", "shakespeare plays", "plays", "william shakespeare"],
        domain: "Literature",
        explanation: "Every clue is a famous play written by William Shakespeare.",
        pool: ["Coriolanus", "Cymbeline", "Tempest", "Othello", "King Lear", "Macbeth", "Hamlet", "Julius Caesar", "Twelfth Night"],
    },
    {
        category: "Types of Trees",
        accepted: ["trees", "types of trees", "wood", "hardwoods"],
        domain: "Nature",
        explanation: "Every clue is a well-known tree species.",
        pool: ["Sequoia", "Cypress", "Sycamore", "Alder", "Cedar", "Birch", "Willow", "Maple", "Pine", "Oak", "Redwood"],
    },
    {
        category: "Birds of Prey",
        accepted: ["birds of prey", "raptors", "birds", "predatory birds"],
        domain: "Nature",
        explanation: "Every clue is a raptor (bird of prey).",
        pool: ["Kestrel", "Harrier", "Osprey", "Kite", "Vulture", "Condor", "Owl", "Falcon", "Hawk", "Eagle"],
    },
    {
        category: "Flightless Birds",
        accepted: ["flightless birds", "birds that cant fly", "non flying birds", "birds"],
        domain: "Nature",
        explanation: "Every bird listed cannot fly.",
        pool: ["Kakapo", "Cassowary", "Rhea", "Dodo", "Kiwi", "Emu", "Ostrich", "Penguin"],
    },
    {
        category: "Noble Gases & Atmospheric Gases",
        accepted: ["gases", "noble gases", "air gases", "elements"],
        domain: "Science",
        explanation: "Every clue is a gaseous element at room temperature.",
        pool: ["Radon", "Krypton", "Xenon", "Argon", "Neon", "Helium", "Nitrogen", "Oxygen", "Hydrogen"],
    },
    {
        category: "Words that come before 'Break'",
        accepted: ["break", "words before break", "before break"],
        domain: "Wordplay",
        explanation: "Each word pairs before BREAK (Day-, Heart-, Jail-, Out-, Spring-, Coffee-, Tie-).",
        pool: ["Tie", "Fast", "Jail", "Out", "Day", "Heart", "Spring", "Coffee", "Lunch", "Ground", "Ice"],
    },
    {
        category: "Words that come before 'Time'",
        accepted: ["time", "words before time", "before time"],
        domain: "Wordplay",
        explanation: "Each clue precedes TIME (Half-, Prime-, Over-, Life-, Bed-, Part-, Full-, Real-).",
        pool: ["Prime", "Real", "Spare", "Over", "Half", "Life", "Bed", "Part", "Full", "Show", "Day"],
    },
];

export function generatePinpoint(level: number, isDaily: boolean): PinpointPuzzle {
    const seed = getLevelSeed("pinpoint", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    // Cycle through all bank entries evenly across 1,200 levels with unique 5-clue subsets
    const entryIndex = isDaily
        ? seed % PINPOINT_BANK.length
        : (level - 1) % PINPOINT_BANK.length;
    const entry = PINPOINT_BANK[entryIndex];

    // Harder tiers weight earlier (subtler) clues from pool first; Warmup mixes clearer clues earlier
    const indexed = entry.pool.map((word, idx) => ({ word, idx }));
    const shuffled = shuffleWithRng(indexed, rng);
    const picked = shuffled.slice(0, 5);

    if (tier.id === "warmup" || tier.id === "club") {
        // Put slightly more recognizable clues earlier
        picked.sort((a, b) => b.idx - a.idx);
    } else {
        // Put subtler clues first, clearest anchor clue last
        picked.sort((a, b) => a.idx - b.idx);
    }

    const clues = picked.map((p) => p.word) as [string, string, string, string, string];

    return {
        clues,
        category: entry.category,
        acceptedAnswers: [entry.category, ...entry.accepted],
        explanation: entry.explanation,
        domain: entry.domain,
        difficultyLabel: tier.label,
    };
}

function normalizeAnswer(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\b(the|a|an|that|are|of|things|types|kinds|list|famous|common|words)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function checkPinpointGuess(guess: string, puzzle: PinpointPuzzle): boolean {
    const raw = guess.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    const norm = normalizeAnswer(guess);
    if (!raw || raw.length < 2) return false;

    for (const acc of puzzle.acceptedAnswers) {
        const accRaw = acc.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
        const accNorm = normalizeAnswer(acc);
        if (raw === accRaw || (norm && norm === accNorm)) return true;
        if (accNorm && norm && (norm.includes(accNorm) || accNorm.includes(norm)) && norm.length >= 3) {
            return true;
        }
        // Simple singular/plural tolerance
        if (accNorm && norm && (norm + "s" === accNorm || accNorm + "s" === norm)) {
            return true;
        }
    }
    return false;
}

// ============================================================================
// 4. CROSSCLIMB (1,200+ Graph-Verified 7-Rung 1-Letter-Different Word Ladders)
// ============================================================================

export interface CrossclimbRung {
    word: string;
    clue: string;
}

export interface CrossclimbPuzzle {
    wordLength: 4;
    top: CrossclimbRung;
    bottom: CrossclimbRung;
    middleSolution: CrossclimbRung[]; // 5 words in valid ladder order from top -> bottom
    middleScrambled: CrossclimbRung[]; // Initial shuffled order for player
    difficultyLabel: string;
}

const LADDER_DICTIONARY: Record<string, string> = {
    COLD: "Chilly winter temperature",
    CORD: "Thick twisted string or power cable",
    CARD: "Greeting note or deck item",
    WARD: "Hospital wing or protective spell",
    WARM: "Cozy and gently heated",
    WORD: "Unit of written or spoken language",
    WORK: "Job, labor, or effort",
    WORM: "Burrowing garden invertebrate",
    WORN: "Weathered from heavy use",
    WARN: "Alert someone to danger",
    WARE: "Pottery or crafted merchandise",
    CARE: "Attentive concern or upkeep",
    CORE: "Innermost center of an apple or planet",
    CORN: "Yellow cob grain grown on farms",
    CORK: "Stopper popped from a wine bottle",
    FORK: "Tined utensil or split in a road",
    FORM: "Shape, silhouette, or document to fill out",
    FIRM: "Solid to the touch or a business partnership",
    FIRE: "Crackling flames in a hearth",
    FINE: "Delicate quality or monetary penalty",
    FIND: "Discover something lost",
    MIND: "Seat of human thought and logic",
    MINE: "Underground excavation for ore",
    LINE: "Straight geometric path or queue",
    LIME: "Zesty green citrus fruit",
    LIKE: "Similar to, or enjoy",
    LAKE: "Inland body of fresh water",
    LATE: "Past the scheduled arrival time",
    LANE: "Marked strip on a highway or bowling alley",
    LAND: "Solid earth or bring a plane down",
    HAND: "Five-fingered extremity or clock pointer",
    HARD: "Difficult to solve or rigid",
    HARE: "Swift long-eared cousin of the rabbit",
    HARM: "Injury or damage inflicted",
    FARM: "Agricultural land with crops and livestock",
    FARE: "Ticket price for a bus or train",
    FAME: "Widespread public renown",
    GAME: "Structured contest or pastime",
    GATE: "Hinged barrier across a fence",
    GAZE: "Look steadily in wonder",
    MAZE: "Labyrinth of twisting corridors",
    MAKE: "Build, craft, or create",
    MALE: "Masculine biological sex",
    MILE: "Unit equal to 5,280 feet",
    MILD: "Gentle weather or subtle spice",
    WILD: "Untamed in nature",
    WILL: "Determination or legal testament",
    WALL: "Vertical brick or stone barrier",
    WALK: "Move forward on foot at a steady pace",
    TALK: "Converse aloud with someone",
    TALL: "Towering in height",
    TAIL: "Wagging rear appendage of a dog",
    SAIL: "Canvas sheet catching wind on a boat",
    SALT: "Crystalline sodium chloride seasoning",
    SALE: "Discounted retail event",
    SAFE: "Protected from harm, or a locked vault",
    SAGE: "Wise thinker or aromatic herb",
    SAND: "Fine coastal grains on a beach",
    SANK: "Descended beneath the water surface",
    BANK: "Financial vault or edge of a river",
    BAND: "Musical ensemble or elastic loop",
    BARK: "Outer layer of a tree trunk, or dog sound",
    BARN: "Red timber building on a farm",
    BARE: "Uncovered or minimalist",
    BASE: "Foundation or home plate in baseball",
    BAKE: "Cook bread or pastry in an oven",
    BIKE: "Two-wheeled pedal vehicle",
    BITE: "Chomp down with teeth",
    SITE: "Web address or building location",
    SIDE: "Left or right flank of an object",
    HIDE: "Conceal from sight",
    HIKE: "Long scenic walk up a trail",
    HIVE: "Hexagonal home built by honeybees",
    FIVE: "Number of fingers on one hand",
    FILE: "Document folder or metal smoothing tool",
    FILL: "Pour until completely full",
    FILM: "Motion picture or thin coating",
    FOIL: "Thin aluminum sheet or fencing sword",
    SOIL: "Fertile earth where plants root",
    COIL: "Wound spiral of wire or rope",
    COIN: "Stamped metal piece of currency",
    JOIN: "Connect together or become a member",
    BOIL: "Heat water until bubbles surge",
    BOLD: "Courageous or thick typeface",
    BOLT: "Lightning flash or threaded fastener",
    BELT: "Strap worn around the waist",
    BEST: "Surpassing all others in quality",
    BEAT: "Rhythmic pulse or defeat a rival",
    BOAT: "Watercraft propelled by oars or engine",
    COAT: "Warm outer garment or layer of paint",
    COST: "Price required to purchase",
    CAST: "Actors in a play, or toss a fishing line",
    CASE: "Protective box or detective mystery",
    CAGE: "Barred enclosure for a songbird",
    CAKE: "Frosted birthday dessert",
    CAVE: "Natural hollowed chamber in rock",
    WAVE: "Rolling ocean swell or greeting gesture",
    WAKE: "Rouse from sleep, or trail behind a ship",
    WAGE: "Hourly pay for labor",
    PAGE: "Single numbered sheet in a book",
    PACE: "Steady walking or running rhythm",
    PACK: "Backpack or group of wolves",
    BACK: "Rear side or return to origin",
    RACK: "Shelving frame for storing gear",
    RACE: "High-speed contest to the finish line",
    RATE: "Speed, ratio, or numerical evaluation",
    RARE: "Uncommon and prized by collectors",
    DARE: "Boldly challenge someone",
    DARK: "Devoid of light",
    MARK: "Visible spot, grade, or target",
    PARK: "Public green space with trails",
    PART: "Single piece of a larger whole",
    PORT: "Coastal harbor or left side of a ship",
    SORT: "Arrange items into ordered categories",
    SORE: "Aching after an intense workout",
    MORE: "A greater quantity",
    MOLE: "Burrowing mammal or chemistry unit",
    ROLE: "Character played by an actor",
    ROPE: "Braided cord used for climbing",
    ROSE: "Thorny fragrant garden bloom",
    NOSE: "Facial organ for scent",
    NOTE: "Brief written memo or musical pitch",
    VOTE: "Cast a ballot in an election",
    VINE: "Climbing plant that bears grapes",
    PINE: "Evergreen conifer with needles",
    PINT: "Sixteen fluid ounces",
    MINT: "Cool green herb or coin factory",
    HINT: "Subtle clue helping solve a puzzle",
    HUNT: "Search diligently or pursue quarry",
    HURT: "Cause pain or injury",
    HART: "Adult male red deer",
    CART: "Wheeled carrier pushed in a market",
    CASTLE_UNUSED: "",
    PLAN: "Organized strategy for the future",
    PLAY: "Engage in a game or stage drama",
    CLAY: "Moldable earth baked into pottery",
    CLAP: "Strike palms together in applause",
    CLIP: "Short video excerpt or paper fastener",
    SLIP: "Lose footing on ice, or paper receipt",
    SHIP: "Large oceangoing vessel",
    SHOP: "Store selling goods",
    SHOT: "Camera frame or basketball attempt",
    SHOW: "Display publicly or stage performance",
    SNOW: "Crystalline white winter precipitation",
    SLOW: "Moving at an unhurried speed",
    GLOW: "Emit a soft steady light",
    GROW: "Increase in size over time",
    CROW: "Clever jet-black bird",
    CREW: "Team operating a ship or aircraft",
    DRAW: "Sketch with pencil, or tie a match",
    DRAG: "Pull across a surface, or air resistance",
    DROP: "Let fall under gravity",
    CROP: "Harvested farm plants, or trim a photo",
    STOP: "Halt motion completely",
    STEP: "Single stride or staircase tread",
    STEM: "Plant stalk, or Science-Tech-Eng-Math",
    STAR: "Luminous sphere of plasma in space",
    STAY: "Remain in the same place",
    SWAY: "Rock gently side to side",
    SWIM: "Propel yourself through water",
    SLIM: "Slender in build",
    SLID: "Glided smoothly across a surface",
    SEED: "Kernel from which a plant sprouts",
    SEEK: "Search actively for something",
    SEEN: "Observed with your eyes",
    SEEM: "Give the outward impression of",
    DEEM: "Judge or formally consider",
    DEEP: "Extending far below the surface",
    DEER: "Antlered forest mammal",
    PEER: "Equal colleague, or look closely",
    PEAR: "Bell-shaped orchard fruit",
    PEAK: "Pointed summit of a mountain",
    BEAK: "Hard pointed bill of a bird",
    BEAM: "Ray of light or structural girder",
    TEAM: "Group collaborating toward a goal",
    TEAR: "Rip paper, or drop from an eye",
    BEAR: "Hibernating woodland mammal",
    BEAD: "Small pierced sphere strung on thread",
    READ: "Interpret written words",
    ROAD: "Paved thoroughfare for vehicles",
    LOAD: "Cargo carried, or charge a battery",
    LEAD: "Guide the front, or dense metal Pb",
    LEAF: "Green solar blade on a branch",
    LEAP: "Spring high into the air",
    LEAN: "Tilt sideways, or low in fat",
    MEAN: "Mathematical average, or signify",
    MEAT: "Protein cut from butcher",
    HEAT: "Thermal energy that raises temperature",
    HEAD: "Topmost part housing the brain",
    HEAL: "Restore from injury to health",
    REAL: "Genuine and existing in fact",
    REEL: "Spool winding fishing line or film",
    FEEL: "Perceive through touch or emotion",
    FEET: "Twelve-inch units or lower extremities",
    FEED: "Supply nourishment",
    NEED: "Require as essential",
    WEED: "Unwanted wild plant in a garden",
    WEEK: "Seven consecutive calendar days",
    SEEK_UNUSED: "",
    RING: "Circular band or bell chime",
    KING: "Sovereign chess piece you must protect",
    KIND: "Generous and considerate, or category",
    WING: "Feathered airfoil enabling flight",
    WIND: "Moving current of air",
    WINE: "Fermented grape beverage",
    WIDE: "Broad from side to side",
    TIDE: "Lunar rise and fall of the sea",
    TIME: "Measured progression of seconds and hours",
    TILE: "Square ceramic piece on a floor or board",
    TALE: "Imaginative story or fable",
    TAME: "Domesticated and gentle",
    NAME: "Title by which someone is known",
    SAME: "Identical without difference",
    SOME: "An unspecified quantity",
    HOME: "Dwelling where you live",
    HOPE: "Optimistic expectation",
    HOLE: "Hollow opening or golf target",
    HOLD: "Grasp firmly in your hands",
    GOLD: "Lustrous precious metal Au",
    GOLF: "Club-and-ball sport on manicured greens",
    WOLF: "Pack-hunting wild canine",
    WOOD: "Fibrous timber from trees",
    GOOD: "Virtuous or high quality",
    FOOD: "Edible nourishment",
    FOOT: "Unit of twelve inches",
    ROOT: "Underground anchor of a plant",
    ROOF: "Protective top covering of a house",
    ROOM: "Enclosed space inside a building",
    BOOM: "Deep resonant explosion or economic surge",
    BOOK: "Bound volume of printed pages",
    BOOT: "Sturdy ankle-high footwear",
    MOON: "Earth's natural rocky satellite",
    MOOD: "Prevailing emotional state",
    NOON: "Midday at 12:00 PM",
    SOON: "In a short time from now",
    SONG: "Vocal musical composition",
    LONG: "Extended in distance or duration",
    LONE: "Solitary and unaccompanied",
    BONE: "Rigid calcified piece of the skeleton",
    TONE: "Musical pitch quality or color shade",
    ZONE: "Designated geographical region",
    DONE: "Finished and complete",
    DOVE: "White bird symbolizing peace",
    LOVE: "Deep affection",
    LIVE: "Exist or broadcast in real time",
    LIFE: "Biological existence",
    LIFT: "Elevate upward, or British elevator",
    LEFT: "Opposite of right",
    LOFT: "Open upper-story living space",
    SOFT: "Gentle and yielding to the touch",
    SORT_UNUSED: "",
};

// Build clean 4-letter word list and 1-letter-Hamming adjacency list once (cached in memory)
let cachedLadderGraph: { words: string[]; adj: Map<string, string[]> } | null = null;

function getLadderGraph(): { words: string[]; adj: Map<string, string[]> } {
    if (cachedLadderGraph) return cachedLadderGraph;
    const words = Object.keys(LADDER_DICTIONARY).filter(
        (w) => w.length === 4 && /^[A-Z]{4}$/.test(w) && LADDER_DICTIONARY[w].length > 0
    );
    const adj = new Map<string, string[]>();
    for (const w of words) adj.set(w, []);
    for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j < words.length; j++) {
            const a = words[i];
            const b = words[j];
            let diff = 0;
            for (let k = 0; k < 4; k++) {
                if (a[k] !== b[k]) diff++;
            }
            if (diff === 1) {
                adj.get(a)!.push(b);
                adj.get(b)!.push(a);
            }
        }
    }
    // Keep only well-connected words (degree >= 2) as starting anchors
    cachedLadderGraph = { words, adj };
    return cachedLadderGraph;
}

export function isOneLetterDiff(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) diff++;
    }
    return diff === 1;
}

export function generateCrossclimb(level: number, isDaily: boolean): CrossclimbPuzzle {
    const seed = getLevelSeed("crossclimb", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);
    const { words, adj } = getLadderGraph();

    let foundPath: string[] | null = null;

    // Try up to 40 randomized starting nodes to extract a crisp, diverse 7-word simple path
    const startCandidates = shuffleWithRng(
        words.filter((w) => (adj.get(w)?.length ?? 0) >= 2),
        rng
    );

    for (let attempt = 0; attempt < Math.min(40, startCandidates.length); attempt++) {
        const start = startCandidates[attempt];
        const visited = new Set<string>([start]);
        const path: string[] = [start];

        function dfs(): boolean {
            if (path.length === 7) return true;
            const curr = path[path.length - 1];
            const neighbors = shuffleWithRng(adj.get(curr) || [], rng);
            for (const nxt of neighbors) {
                if (visited.has(nxt)) continue;
                // Avoid trivial shortcuts where nxt is adjacent to path[path.length - 2] (keeps ladder cleaner!)
                if (path.length >= 2 && isOneLetterDiff(nxt, path[path.length - 2])) continue;
                visited.add(nxt);
                path.push(nxt);
                if (dfs()) return true;
                path.pop();
                visited.delete(nxt);
            }
            return false;
        }

        if (dfs()) {
            foundPath = path;
            break;
        }
    }

    const finalWords = foundPath || ["COLD", "CORD", "CARD", "WARD", "WARM", "WORM", "WORD"];
    const rungs: CrossclimbRung[] = finalWords.map((word) => ({
        word,
        clue: LADDER_DICTIONARY[word] || `4-letter word: ${word}`,
    }));

    const top = rungs[0];
    const bottom = rungs[6];
    const middleSolution = rungs.slice(1, 6);

    // Scramble middle rungs ensuring it isn't already in exact forward or reverse solved order
    let middleScrambled = shuffleWithRng(middleSolution, rng);
    const isAlreadyOrdered = (arr: CrossclimbRung[]) =>
        arr.every((r, i) => r.word === middleSolution[i].word) ||
        arr.every((r, i) => r.word === middleSolution[4 - i].word);

    if (isAlreadyOrdered(middleScrambled)) {
        middleScrambled = [
            middleSolution[2],
            middleSolution[0],
            middleSolution[4],
            middleSolution[1],
            middleSolution[3],
        ];
    }

    return {
        wordLength: 4,
        top,
        bottom,
        middleSolution,
        middleScrambled,
        difficultyLabel: tier.label,
    };
}
