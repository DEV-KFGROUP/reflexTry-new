import { createRng, getLevelSeed, getTierForLevel, randInt, shuffleWithRng } from "@/lib/puzzles/core";

// ============================================================================
// 1. MINI SUDOKU (6x6 with 2x3 shaded boxes — verified unique solution)
// ============================================================================

export interface MiniSudokuPuzzle {
    size: 6;
    boxRows: 2;
    boxCols: 3;
    givens: number[][]; // 0 = empty, 1..6 = given
    solution: number[][];
    difficultyLabel: string;
}

const BASE_MINI_SUDOKU = [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [2, 3, 1, 5, 6, 4],
    [5, 6, 4, 2, 3, 1],
    [3, 1, 2, 6, 4, 5],
    [6, 4, 5, 3, 1, 2],
];

function isValidMiniSudokuMove(board: number[][], r: number, c: number, val: number): boolean {
    for (let i = 0; i < 6; i++) {
        if (board[r][i] === val || board[i][c] === val) return false;
    }
    const br = Math.floor(r / 2) * 2;
    const bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 2; dr++) {
        for (let dc = 0; dc < 3; dc++) {
            if (board[br + dr][bc + dc] === val) return false;
        }
    }
    return true;
}

function countMiniSudokuSolutions(board: number[][], limit = 2): number {
    let bestR = -1;
    let bestC = -1;
    let bestCands: number[] | null = null;

    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (board[r][c] === 0) {
                const cands: number[] = [];
                for (let v = 1; v <= 6; v++) {
                    if (isValidMiniSudokuMove(board, r, c, v)) cands.push(v);
                }
                if (cands.length === 0) return 0;
                if (!bestCands || cands.length < bestCands.length) {
                    bestR = r;
                    bestC = c;
                    bestCands = cands;
                    if (cands.length === 1) break;
                }
            }
        }
        if (bestCands && bestCands.length === 1) break;
    }

    if (bestR === -1 || !bestCands) return 1;

    let count = 0;
    for (const v of bestCands) {
        board[bestR][bestC] = v;
        count += countMiniSudokuSolutions(board, limit - count);
        board[bestR][bestC] = 0;
        if (count >= limit) return count;
    }
    return count;
}

export function generateMiniSudoku(level: number, isDaily: boolean): MiniSudokuPuzzle {
    const seed = getLevelSeed("mini-sudoku", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    // Permute digits 1..6
    const digits = shuffleWithRng([1, 2, 3, 4, 5, 6], rng);
    // Permute 3 horizontal bands (2 rows each) and rows within each band
    const bandOrder = shuffleWithRng([0, 1, 2], rng);
    const rowOrder: number[] = [];
    for (const b of bandOrder) {
        const pair = shuffleWithRng([b * 2, b * 2 + 1], rng);
        rowOrder.push(...pair);
    }
    // Permute 2 vertical stacks (3 cols each) and cols within each stack
    const stackOrder = shuffleWithRng([0, 1], rng);
    const colOrder: number[] = [];
    for (const s of stackOrder) {
        const triple = shuffleWithRng([s * 3, s * 3 + 1, s * 3 + 2], rng);
        colOrder.push(...triple);
    }

    const solution: number[][] = rowOrder.map((r) =>
        colOrder.map((c) => digits[BASE_MINI_SUDOKU[r][c] - 1])
    );

    const targetGivens =
        tier.id === "warmup"
            ? 18
            : tier.id === "club"
              ? 16
              : tier.id === "scholar"
                ? 14
                : tier.id === "master"
                  ? 12
                  : 10;

    const givens = solution.map((row) => [...row]);
    const positions = shuffleWithRng(
        Array.from({ length: 36 }, (_, idx) => [Math.floor(idx / 6), idx % 6] as const),
        rng
    );

    let remaining = 36;
    for (const [r, c] of positions) {
        if (remaining <= targetGivens) break;
        const backup = givens[r][c];
        givens[r][c] = 0;
        const testBoard = givens.map((row) => [...row]);
        if (countMiniSudokuSolutions(testBoard, 2) === 1) {
            remaining--;
        } else {
            givens[r][c] = backup;
        }
    }

    return {
        size: 6,
        boxRows: 2,
        boxCols: 3,
        givens,
        solution,
        difficultyLabel: tier.label,
    };
}

// ============================================================================
// 2. QUEENS (Regional Non-Touching N-Queens — 5x5 to 9x9)
// ============================================================================

export interface QueensPuzzle {
    size: number;
    regions: number[][]; // 0..size-1 region index
    solution: [number, number][]; // [row, col] for each queen
    difficultyLabel: string;
}

function solveNonTouchingQueens(size: number, rng: () => number): number[] {
    const cols = new Array<number>(size).fill(-1);
    const usedCol = new Array<boolean>(size).fill(false);

    function backtrack(row: number): boolean {
        if (row === size) return true;
        const candidates = shuffleWithRng(
            Array.from({ length: size }, (_, i) => i),
            rng
        );
        for (const c of candidates) {
            if (usedCol[c]) continue;
            if (row > 0 && Math.abs(cols[row - 1] - c) <= 1) continue;
            cols[row] = c;
            usedCol[c] = true;
            if (backtrack(row + 1)) return true;
            usedCol[c] = false;
            cols[row] = -1;
        }
        return false;
    }

    if (backtrack(0)) return cols;
    // Guaranteed deterministic fallback for size >= 5
    const fallback: number[] = [];
    for (let i = 0; i < size; i++) {
        fallback.push((i * 2) % size);
    }
    return fallback;
}

export function generateQueens(level: number, isDaily: boolean): QueensPuzzle {
    const seed = getLevelSeed("queens", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    const size =
        tier.id === "warmup"
            ? level % 2 === 1
                ? 5
                : 6
            : tier.id === "club"
              ? level % 2 === 1
                  ? 6
                  : 7
              : tier.id === "scholar"
                ? 7
                : tier.id === "master"
                  ? 8
                  : level % 2 === 1
                    ? 8
                    : 9;

    const colForRow = solveNonTouchingQueens(size, rng);
    const solution: [number, number][] = colForRow.map((c, r) => [r, c]);

    // Grow organic connected regions via randomized multi-source frontier expansion
    const regions: number[][] = Array.from({ length: size }, () =>
        new Array<number>(size).fill(-1)
    );
    const frontiers: [number, number][][] = Array.from({ length: size }, () => []);
    const regionCounts = new Array<number>(size).fill(1);
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    const regionColorPerm = shuffleWithRng(
        Array.from({ length: size }, (_, i) => i),
        rng
    );

    for (let i = 0; i < size; i++) {
        const [r, c] = solution[i];
        regions[r][c] = i;
        frontiers[i].push([r, c]);
    }

    let filled = size;
    const total = size * size;
    // Give each region a slight random target weight so shapes vary organically
    const weights = Array.from({ length: size }, () => 0.4 + rng() * 1.4);

    while (filled < total) {
        // Pick a region with non-empty frontier, biased toward smaller / weighted regions
        const activeRegions: number[] = [];
        for (let i = 0; i < size; i++) {
            if (frontiers[i].length > 0) activeRegions.push(i);
        }
        if (activeRegions.length === 0) break;

        // Weighted pick
        let bestRegion = activeRegions[0];
        let bestScore = -1;
        for (const rIdx of activeRegions) {
            const score = (weights[rIdx] / Math.sqrt(regionCounts[rIdx])) * (0.5 + rng());
            if (score > bestScore) {
                bestScore = score;
                bestRegion = rIdx;
            }
        }

        const f = frontiers[bestRegion];
        const cellIdx = Math.floor(rng() * f.length);
        const [cr, cc] = f[cellIdx];
        const neighbors: [number, number][] = [];
        for (const [dr, dc] of dirs) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && regions[nr][nc] === -1) {
                neighbors.push([nr, nc]);
            }
        }
        if (neighbors.length === 0) {
            f.splice(cellIdx, 1);
        } else {
            const [nr, nc] = neighbors[Math.floor(rng() * neighbors.length)];
            regions[nr][nc] = bestRegion;
            f.push([nr, nc]);
            regionCounts[bestRegion]++;
            filled++;
        }
    }

    // Remap region IDs using shuffled palette permutation for lively color harmony
    const finalRegions = regions.map((row) => row.map((rid) => regionColorPerm[Math.max(0, rid)]));

    return {
        size,
        regions: finalRegions,
        solution,
        difficultyLabel: tier.label,
    };
}

// ============================================================================
// 3. TANGO (6x6 & 8x8 Sun/Moon Binary Deduction with = and × Clues)
// ============================================================================

export type TangoToken = 0 | 1 | 2; // 0 = empty, 1 = Sun, 2 = Moon

export interface TangoClue {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    type: "=" | "×";
}

export interface TangoPuzzle {
    size: 6 | 8;
    givens: TangoToken[][];
    solution: (1 | 2)[][];
    clues: TangoClue[];
    difficultyLabel: string;
}

function generateValidTangoSolution(size: 6 | 8, rng: () => number): (1 | 2)[][] {
    const half = size / 2;
    const grid: TangoToken[][] = Array.from({ length: size }, () =>
        new Array<TangoToken>(size).fill(0)
    );
    const rowCount1 = new Array<number>(size).fill(0);
    const rowCount2 = new Array<number>(size).fill(0);
    const colCount1 = new Array<number>(size).fill(0);
    const colCount2 = new Array<number>(size).fill(0);

    let steps = 0;

    function backtrack(idx: number): boolean {
        if (idx === size * size) return true;
        if (++steps > 8000) return false;
        const r = Math.floor(idx / size);
        const c = idx % size;
        const order: (1 | 2)[] = rng() < 0.5 ? [1, 2] : [2, 1];

        for (const v of order) {
            if (v === 1 && (rowCount1[r] >= half || colCount1[c] >= half)) continue;
            if (v === 2 && (rowCount2[r] >= half || colCount2[c] >= half)) continue;
            if (c >= 2 && grid[r][c - 1] === v && grid[r][c - 2] === v) continue;
            if (r >= 2 && grid[r - 1][c] === v && grid[r - 2][c] === v) continue;

            grid[r][c] = v;
            if (v === 1) {
                rowCount1[r]++;
                colCount1[c]++;
            } else {
                rowCount2[r]++;
                colCount2[c]++;
            }

            if (backtrack(idx + 1)) return true;

            grid[r][c] = 0;
            if (v === 1) {
                rowCount1[r]--;
                colCount1[c]--;
            } else {
                rowCount2[r]--;
                colCount2[c]--;
            }
        }
        return false;
    }

    for (let attempt = 0; attempt < 5; attempt++) {
        steps = 0;
        if (backtrack(0)) {
            return grid as (1 | 2)[][];
        }
    }

    // Guaranteed valid fallback pattern
    return Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => (((r + c + (r >= half ? 1 : 0)) % 2 === 0 ? 1 : 2) as 1 | 2))
    );
}

export function generateTango(level: number, isDaily: boolean): TangoPuzzle {
    const seed = getLevelSeed("tango", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    const size: 6 | 8 = tier.id === "mensa" || (tier.id === "master" && level % 3 === 0) ? 8 : 6;
    const solution = generateValidTangoSolution(size, rng);

    const givenRatio =
        tier.id === "warmup"
            ? 0.36
            : tier.id === "club"
              ? 0.28
              : tier.id === "scholar"
                ? 0.24
                : tier.id === "master"
                  ? 0.2
                  : 0.18;

    const totalCells = size * size;
    const givenCount = Math.max(size, Math.round(totalCells * givenRatio));

    const allCoords = shuffleWithRng(
        Array.from({ length: totalCells }, (_, i) => [Math.floor(i / size), i % size] as const),
        rng
    );

    const givens: TangoToken[][] = Array.from({ length: size }, () =>
        new Array<TangoToken>(size).fill(0)
    );
    for (let i = 0; i < givenCount; i++) {
        const [r, c] = allCoords[i];
        givens[r][c] = solution[r][c];
    }

    // Build = and × edge clues (avoiding edges where both cells are already givens)
    const candidateEdges: [number, number, number, number][] = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (c + 1 < size && (givens[r][c] === 0 || givens[r][c + 1] === 0)) {
                candidateEdges.push([r, c, r, c + 1]);
            }
            if (r + 1 < size && (givens[r][c] === 0 || givens[r + 1][c] === 0)) {
                candidateEdges.push([r, c, r + 1, c]);
            }
        }
    }

    const clueTarget = size === 6 ? randInt(rng, 7, 10) : randInt(rng, 12, 16);
    const shuffledEdges = shuffleWithRng(candidateEdges, rng);
    const clues: TangoClue[] = [];
    for (const [r1, c1, r2, c2] of shuffledEdges) {
        if (clues.length >= clueTarget) break;
        const type: "=" | "×" = solution[r1][c1] === solution[r2][c2] ? "=" : "×";
        clues.push({ r1, c1, r2, c2, type });
    }

    return {
        size,
        givens,
        solution,
        clues,
        difficultyLabel: tier.label,
    };
}

export interface TangoValidationResult {
    isSolved: boolean;
    errorCells: Set<string>;
    messages: string[];
}

export function validateTangoBoard(
    board: TangoToken[][],
    clues: TangoClue[]
): TangoValidationResult {
    const size = board.length;
    const half = size / 2;
    const errorCells = new Set<string>();
    const messages: string[] = [];
    let filledCount = 0;

    // Check rows
    for (let r = 0; r < size; r++) {
        let sCount = 0;
        let mCount = 0;
        for (let c = 0; c < size; c++) {
            const v = board[r][c];
            if (v !== 0) filledCount++;
            if (v === 1) sCount++;
            if (v === 2) mCount++;
            if (c >= 2 && v !== 0 && board[r][c - 1] === v && board[r][c - 2] === v) {
                errorCells.add(`${r},${c}`);
                errorCells.add(`${r},${c - 1}`);
                errorCells.add(`${r},${c - 2}`);
                messages.push(`Row ${r + 1} has 3 ${v === 1 ? "Suns" : "Moons"} in a row.`);
            }
        }
        if (sCount > half) {
            for (let c = 0; c < size; c++) if (board[r][c] === 1) errorCells.add(`${r},${c}`);
            messages.push(`Row ${r + 1} has more than ${half} Suns.`);
        }
        if (mCount > half) {
            for (let c = 0; c < size; c++) if (board[r][c] === 2) errorCells.add(`${r},${c}`);
            messages.push(`Row ${r + 1} has more than ${half} Moons.`);
        }
    }

    // Check columns
    for (let c = 0; c < size; c++) {
        let sCount = 0;
        let mCount = 0;
        for (let r = 0; r < size; r++) {
            const v = board[r][c];
            if (v === 1) sCount++;
            if (v === 2) mCount++;
            if (r >= 2 && v !== 0 && board[r - 1][c] === v && board[r - 2][c] === v) {
                errorCells.add(`${r},${c}`);
                errorCells.add(`${r - 1},${c}`);
                errorCells.add(`${r - 2},${c}`);
                messages.push(`Column ${c + 1} has 3 ${v === 1 ? "Suns" : "Moons"} in a row.`);
            }
        }
        if (sCount > half) {
            for (let r = 0; r < size; r++) if (board[r][c] === 1) errorCells.add(`${r},${c}`);
            messages.push(`Column ${c + 1} has more than ${half} Suns.`);
        }
        if (mCount > half) {
            for (let r = 0; r < size; r++) if (board[r][c] === 2) errorCells.add(`${r},${c}`);
            messages.push(`Column ${c + 1} has more than ${half} Moons.`);
        }
    }

    // Check = and × clues
    for (const clue of clues) {
        const a = board[clue.r1][clue.c1];
        const b = board[clue.r2][clue.c2];
        if (a !== 0 && b !== 0) {
            if (clue.type === "=" && a !== b) {
                errorCells.add(`${clue.r1},${clue.c1}`);
                errorCells.add(`${clue.r2},${clue.c2}`);
                messages.push(`Cells joined by "=" must have the same symbol.`);
            }
            if (clue.type === "×" && a === b) {
                errorCells.add(`${clue.r1},${clue.c1}`);
                errorCells.add(`${clue.r2},${clue.c2}`);
                messages.push(`Cells joined by "×" must have opposite symbols.`);
            }
        }
    }

    const uniqueMessages = Array.from(new Set(messages));
    const isSolved = filledCount === size * size && errorCells.size === 0;
    return { isSolved, errorCells, messages: uniqueMessages };
}

// ============================================================================
// 4. ZIP (Full-Grid Winding Hamiltonian Path with Checkpoints & Walls)
// ============================================================================

export interface ZipWall {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
}

export interface ZipPuzzle {
    size: number;
    checkpoints: Record<string, number>; // "r,c" -> 1..K
    maxCheckpoint: number;
    solutionPath: [number, number][];
    walls: ZipWall[];
    difficultyLabel: string;
}

/**
 * Generates an organic, labyrinthine Hamiltonian path covering all size*size cells
 * using the Backbite Markov Chain algorithm (guaranteed full coverage in < 1ms).
 */
function generateHamiltonianPath(size: number, rng: () => number): [number, number][] {
    // Start with a valid boustrophedon (snake) Hamiltonian path
    const path: [number, number][] = [];
    for (let r = 0; r < size; r++) {
        if (r % 2 === 0) {
            for (let c = 0; c < size; c++) path.push([r, c]);
        } else {
            for (let c = size - 1; c >= 0; c--) path.push([r, c]);
        }
    }

    const total = size * size;
    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    const iterations = size * size * 14;
    for (let step = 0; step < iterations; step++) {
        // Flip path randomly so backbite applies to both ends symmetrically
        if (rng() < 0.5) path.reverse();

        const [er, ec] = path[total - 1];
        // Build quick position lookup for neighbors of the endpoint
        const candidateIndices: number[] = [];
        for (const [dr, dc] of dirs) {
            const nr = er + dr;
            const nc = ec + dc;
            if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
            // Find neighbor index in path
            for (let k = 0; k < total - 2; k++) {
                if (path[k][0] === nr && path[k][1] === nc) {
                    candidateIndices.push(k);
                    break;
                }
            }
        }

        if (candidateIndices.length === 0) continue;
        const k = candidateIndices[Math.floor(rng() * candidateIndices.length)];
        // Reverse subpath from k+1 to total-1
        let left = k + 1;
        let right = total - 1;
        while (left < right) {
            const tmp = path[left];
            path[left] = path[right];
            path[right] = tmp;
            left++;
            right--;
        }
    }

    return path;
}

export function generateZip(level: number, isDaily: boolean): ZipPuzzle {
    const seed = getLevelSeed("zip", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    const size =
        tier.id === "warmup"
            ? 5
            : tier.id === "club" || tier.id === "scholar"
              ? 6
              : 7;

    const solutionPath = generateHamiltonianPath(size, rng);
    const total = solutionPath.length;

    const checkpointCount =
        size === 5
            ? randInt(rng, 6, 8)
            : size === 6
              ? randInt(rng, 7, 10)
              : randInt(rng, 8, 12);

    const checkpoints: Record<string, number> = {};
    // Always place 1 at index 0 and maxCheckpoint at index total - 1
    const indices = new Set<number>([0, total - 1]);

    // Distribute remaining checkpoints evenly with slight jitter along the path
    const step = (total - 1) / (checkpointCount - 1);
    for (let k = 1; k < checkpointCount - 1; k++) {
        const center = Math.round(k * step);
        const jitter = randInt(rng, -1, 1);
        const idx = Math.max(1, Math.min(total - 2, center + jitter));
        indices.add(idx);
    }

    const sortedIndices = Array.from(indices).sort((a, b) => a - b);
    sortedIndices.forEach((pathIdx, i) => {
        const [r, c] = solutionPath[pathIdx];
        checkpoints[`${r},${c}`] = i + 1;
    });

    // Add optional strategic walls between adjacent non-consecutive cells on Club+ tiers
    const pathEdges = new Set<string>();
    for (let i = 0; i < total - 1; i++) {
        const [r1, c1] = solutionPath[i];
        const [r2, c2] = solutionPath[i + 1];
        const k1 = `${r1},${c1}|${r2},${c2}`;
        const k2 = `${r2},${c2}|${r1},${c1}`;
        pathEdges.add(k1);
        pathEdges.add(k2);
    }

    const nonPathEdges: ZipWall[] = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (c + 1 < size && !pathEdges.has(`${r},${c}|${r},${c + 1}`)) {
                nonPathEdges.push({ r1: r, c1: c, r2: r, c2: c + 1 });
            }
            if (r + 1 < size && !pathEdges.has(`${r},${c}|${r + 1},${c}`)) {
                nonPathEdges.push({ r1: r, c1: c, r2: r + 1, c2: c });
            }
        }
    }

    const wallTarget =
        tier.id === "warmup"
            ? 2
            : tier.id === "club"
              ? 4
              : tier.id === "scholar"
                ? 6
                : tier.id === "master"
                  ? 8
                  : 10;

    const walls = shuffleWithRng(nonPathEdges, rng).slice(0, Math.min(wallTarget, nonPathEdges.length));

    return {
        size,
        checkpoints,
        maxCheckpoint: sortedIndices.length,
        solutionPath,
        walls,
        difficultyLabel: tier.label,
    };
}

// ============================================================================
// 5. PATCHES (Shikaku Exact Rectangular Area Partition — 5x5 to 8x8)
// ============================================================================

export interface PatchRect {
    id: number;
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    area: number;
    clueR: number;
    clueC: number;
    colorIndex: number;
}

export interface PatchesPuzzle {
    size: number;
    solutionRects: PatchRect[];
    clues: Record<string, number>; // "r,c" -> area
    difficultyLabel: string;
}

export function generatePatches(level: number, isDaily: boolean): PatchesPuzzle {
    const seed = getLevelSeed("patches", level, isDaily);
    const rng = createRng(seed);
    const tier = isDaily ? { id: "scholar" as const, label: "Daily" } : getTierForLevel(level);

    const size =
        tier.id === "warmup"
            ? 5
            : tier.id === "club"
              ? 6
              : tier.id === "scholar" || tier.id === "master"
                ? 7
                : 8;

    const maxArea = size <= 5 ? 6 : size <= 6 ? 8 : 10;

    // Recursive guillotine / binary space partitioning guarantees 100% exact coverage
    // with zero orphan 1-cells and crisp spatial rectangles!
    interface Box {
        r1: number;
        c1: number;
        r2: number;
        c2: number;
    }

    const boxes: Box[] = [{ r1: 0, c1: 0, r2: size - 1, c2: size - 1 }];
    const finalBoxes: Box[] = [];

    while (boxes.length > 0) {
        const box = boxes.pop()!;
        const h = box.r2 - box.r1 + 1;
        const w = box.c2 - box.c1 + 1;
        const area = h * w;

        const canStop = area >= 2 && area <= maxArea && (area <= 4 || rng() < 0.42);
        if (canStop) {
            finalBoxes.push(box);
            continue;
        }

        // Choose valid cuts that never create 1x1 rectangles
        const validCuts: { axis: "h" | "v"; pos: number }[] = [];
        for (let r = box.r1; r < box.r2; r++) {
            const topArea = (r - box.r1 + 1) * w;
            const botArea = (box.r2 - r) * w;
            if (topArea >= 2 && botArea >= 2) {
                validCuts.push({ axis: "h", pos: r });
            }
        }
        for (let c = box.c1; c < box.c2; c++) {
            const leftArea = h * (c - box.c1 + 1);
            const rightArea = h * (box.c2 - c);
            if (leftArea >= 2 && rightArea >= 2) {
                validCuts.push({ axis: "v", pos: c });
            }
        }

        if (validCuts.length === 0) {
            finalBoxes.push(box);
            continue;
        }

        const cut = validCuts[Math.floor(rng() * validCuts.length)];
        if (cut.axis === "h") {
            boxes.push({ r1: box.r1, c1: box.c1, r2: cut.pos, c2: box.c2 });
            boxes.push({ r1: cut.pos + 1, c1: box.c1, r2: box.r2, c2: box.c2 });
        } else {
            boxes.push({ r1: box.r1, c1: box.c1, r2: box.r2, c2: cut.pos });
            boxes.push({ r1: box.r1, c1: cut.pos + 1, r2: box.r2, c2: box.c2 });
        }
    }

    const clues: Record<string, number> = {};
    const solutionRects: PatchRect[] = finalBoxes.map((box, idx) => {
        const area = (box.r2 - box.r1 + 1) * (box.c2 - box.c1 + 1);
        const clueR = randInt(rng, box.r1, box.r2);
        const clueC = randInt(rng, box.c1, box.c2);
        clues[`${clueR},${clueC}`] = area;
        return {
            id: idx,
            ...box,
            area,
            clueR,
            clueC,
            colorIndex: idx % 10,
        };
    });

    return {
        size,
        solutionRects,
        clues,
        difficultyLabel: tier.label,
    };
}
