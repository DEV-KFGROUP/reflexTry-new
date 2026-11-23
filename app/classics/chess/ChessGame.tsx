"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, Undo2, FlipVertical2, Cpu, Users } from "lucide-react";

type Color = "w" | "b";
type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
interface Piece {
    c: Color;
    t: PieceType;
}
type Board = (Piece | null)[][];

interface Move {
    fr: number;
    fc: number;
    tr: number;
    tc: number;
    castle?: "K" | "Q";
    enPassant?: boolean;
    promo?: PieceType;
    capture?: Piece | null;
}

interface GameSnapshot {
    board: Board;
    turn: Color;
    castleRights: { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
    epTarget: [number, number] | null;
    lastMove: Move | null;
    notation: string[];
}

const PIECE_UNICODE: Record<Color, Record<PieceType, string>> = {
    w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
    b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

const PIECE_VALUES: Record<PieceType, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const CENTER_BONUS = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [5, 10, 20, 25, 25, 20, 10, 5],
    [0, 10, 25, 35, 35, 25, 10, 0],
    [0, 10, 25, 35, 35, 25, 10, 0],
    [5, 10, 20, 25, 25, 20, 10, 5],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

function createInitialBoard(): Board {
    const back: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
    return Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => {
            if (r === 0) return { c: "b", t: back[c] };
            if (r === 1) return { c: "b", t: "p" };
            if (r === 6) return { c: "w", t: "p" };
            if (r === 7) return { c: "w", t: back[c] };
            return null;
        })
    );
}

function cloneBoard(b: Board): Board {
    return b.map((row) => row.map((p) => (p ? { ...p } : null)));
}

function inBounds(r: number, c: number) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function isSquareAttacked(board: Board, tr: number, tc: number, byColor: Color): boolean {
    // Pawn attacks
    const pawnDir = byColor === "w" ? 1 : -1;
    for (const dc of [-1, 1]) {
        const pr = tr + pawnDir;
        const pc = tc + dc;
        if (inBounds(pr, pc) && board[pr][pc]?.c === byColor && board[pr][pc]?.t === "p") return true;
    }
    // Knight attacks
    const kn = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [dr, dc] of kn) {
        const nr = tr + dr;
        const nc = tc + dc;
        if (inBounds(nr, nc) && board[nr][nc]?.c === byColor && board[nr][nc]?.t === "n") return true;
    }
    // King attacks
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (!dr && !dc) continue;
            const kr = tr + dr;
            const kc = tc + dc;
            if (inBounds(kr, kc) && board[kr][kc]?.c === byColor && board[kr][kc]?.t === "k") return true;
        }
    }
    // Sliding rays (Rook/Queen & Bishop/Queen)
    const rookDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of rookDirs) {
        let nr = tr + dr;
        let nc = tc + dc;
        while (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p) {
                if (p.c === byColor && (p.t === "r" || p.t === "q")) return true;
                break;
            }
            nr += dr;
            nc += dc;
        }
    }
    const bishDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const [dr, dc] of bishDirs) {
        let nr = tr + dr;
        let nc = tc + dc;
        while (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p) {
                if (p.c === byColor && (p.t === "b" || p.t === "q")) return true;
                break;
            }
            nr += dr;
            nc += dc;
        }
    }
    return false;
}

function isInCheck(board: Board, color: Color): boolean {
    const opp: Color = color === "w" ? "b" : "w";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c]?.c === color && board[r][c]?.t === "k") {
                return isSquareAttacked(board, r, c, opp);
            }
        }
    }
    return false;
}

function applyMoveToState(snap: GameSnapshot, m: Move): GameSnapshot {
    const nb = cloneBoard(snap.board);
    const piece = nb[m.fr][m.fc]!;
    nb[m.fr][m.fc] = null;

    if (m.enPassant) {
        nb[m.fr][m.tc] = null;
    }
    if (m.castle === "K") {
        nb[m.fr][5] = nb[m.fr][7];
        nb[m.fr][7] = null;
    } else if (m.castle === "Q") {
        nb[m.fr][3] = nb[m.fr][0];
        nb[m.fr][0] = null;
    }

    nb[m.tr][m.tc] = m.promo ? { c: piece.c, t: m.promo } : piece;

    const cr = { ...snap.castleRights };
    if (piece.t === "k") {
        if (piece.c === "w") {
            cr.wK = false;
            cr.wQ = false;
        } else {
            cr.bK = false;
            cr.bQ = false;
        }
    }
    if (m.fr === 7 && m.fc === 0) cr.wQ = false;
    if (m.fr === 7 && m.fc === 7) cr.wK = false;
    if (m.fr === 0 && m.fc === 0) cr.bQ = false;
    if (m.fr === 0 && m.fc === 7) cr.bK = false;
    if (m.tr === 7 && m.tc === 0) cr.wQ = false;
    if (m.tr === 7 && m.tc === 7) cr.wK = false;
    if (m.tr === 0 && m.tc === 0) cr.bQ = false;
    if (m.tr === 0 && m.tc === 7) cr.bK = false;

    const epTarget: [number, number] | null =
        piece.t === "p" && Math.abs(m.tr - m.fr) === 2 ? [(m.fr + m.tr) / 2, m.fc] : null;

    const files = "abcdefgh";
    const dest = `${files[m.tc]}${8 - m.tr}`;
    const note =
        m.castle === "K"
            ? "O-O"
            : m.castle === "Q"
              ? "O-O-O"
              : `${piece.t === "p" ? "" : piece.t.toUpperCase()}${m.capture || m.enPassant ? "x" : ""}${dest}${m.promo ? "=Q" : ""}`;

    return {
        board: nb,
        turn: snap.turn === "w" ? "b" : "w",
        castleRights: cr,
        epTarget,
        lastMove: m,
        notation: [...snap.notation, note],
    };
}

function generateLegalMoves(snap: GameSnapshot, color: Color): Move[] {
    const pseudo: Move[] = [];
    const b = snap.board;
    const opp: Color = color === "w" ? "b" : "w";

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = b[r][c];
            if (!p || p.c !== color) continue;

            if (p.t === "p") {
                const dir = color === "w" ? -1 : 1;
                const startRow = color === "w" ? 6 : 1;
                const promoRow = color === "w" ? 0 : 7;
                if (inBounds(r + dir, c) && !b[r + dir][c]) {
                    pseudo.push({ fr: r, fc: c, tr: r + dir, tc: c, promo: r + dir === promoRow ? "q" : undefined });
                    if (r === startRow && !b[r + dir * 2][c]) {
                        pseudo.push({ fr: r, fc: c, tr: r + dir * 2, tc: c });
                    }
                }
                for (const dc of [-1, 1]) {
                    const nr = r + dir;
                    const nc = c + dc;
                    if (!inBounds(nr, nc)) continue;
                    if (b[nr][nc]?.c === opp) {
                        pseudo.push({ fr: r, fc: c, tr: nr, tc: nc, capture: b[nr][nc], promo: nr === promoRow ? "q" : undefined });
                    } else if (snap.epTarget && snap.epTarget[0] === nr && snap.epTarget[1] === nc) {
                        pseudo.push({ fr: r, fc: c, tr: nr, tc: nc, enPassant: true, capture: b[r][nc] });
                    }
                }
            } else if (p.t === "n") {
                for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (inBounds(nr, nc) && b[nr][nc]?.c !== color) {
                        pseudo.push({ fr: r, fc: c, tr: nr, tc: nc, capture: b[nr][nc] });
                    }
                }
            } else if (p.t === "k") {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (!dr && !dc) continue;
                        const nr = r + dr;
                        const nc = c + dc;
                        if (inBounds(nr, nc) && b[nr][nc]?.c !== color) {
                            pseudo.push({ fr: r, fc: c, tr: nr, tc: nc, capture: b[nr][nc] });
                        }
                    }
                }
                // Castling
                const homeRow = color === "w" ? 7 : 0;
                if (r === homeRow && c === 4 && !isSquareAttacked(b, homeRow, 4, opp)) {
                    const canK = color === "w" ? snap.castleRights.wK : snap.castleRights.bK;
                    const canQ = color === "w" ? snap.castleRights.wQ : snap.castleRights.bQ;
                    if (
                        canK &&
                        !b[homeRow][5] &&
                        !b[homeRow][6] &&
                        !isSquareAttacked(b, homeRow, 5, opp) &&
                        !isSquareAttacked(b, homeRow, 6, opp)
                    ) {
                        pseudo.push({ fr: homeRow, fc: 4, tr: homeRow, tc: 6, castle: "K" });
                    }
                    if (
                        canQ &&
                        !b[homeRow][1] &&
                        !b[homeRow][2] &&
                        !b[homeRow][3] &&
                        !isSquareAttacked(b, homeRow, 3, opp) &&
                        !isSquareAttacked(b, homeRow, 2, opp)
                    ) {
                        pseudo.push({ fr: homeRow, fc: 4, tr: homeRow, tc: 2, castle: "Q" });
                    }
                }
            } else {
                const dirs =
                    p.t === "r"
                        ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
                        : p.t === "b"
                          ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
                          : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
                for (const [dr, dc] of dirs) {
                    let nr = r + dr;
                    let nc = c + dc;
                    while (inBounds(nr, nc)) {
                        if (b[nr][nc]) {
                            if (b[nr][nc]?.c === opp) pseudo.push({ fr: r, fc: c, tr: nr, tc: nc, capture: b[nr][nc] });
                            break;
                        }
                        pseudo.push({ fr: r, fc: c, tr: nr, tc: nc });
                        nr += dr;
                        nc += dc;
                    }
                }
            }
        }
    }

    return pseudo.filter((m) => {
        const next = applyMoveToState(snap, m);
        return !isInCheck(next.board, color);
    });
}

function evaluateBoard(board: Board): number {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (!p) continue;
            const posBonus = p.t === "p" || p.t === "n" || p.t === "b" ? CENTER_BONUS[r][c] : 0;
            const val = PIECE_VALUES[p.t] + posBonus;
            score += p.c === "w" ? val : -val;
        }
    }
    return score;
}

function minimax(snap: GameSnapshot, depth: number, alpha: number, beta: number, maximizingWhite: boolean): number {
    const color: Color = maximizingWhite ? "w" : "b";
    const moves = generateLegalMoves(snap, color);
    if (moves.length === 0) {
        if (isInCheck(snap.board, color)) return maximizingWhite ? -50000 - depth : 50000 + depth;
        return 0;
    }
    if (depth === 0) return evaluateBoard(snap.board);

    // Order captures first for faster pruning
    moves.sort((a, b) => (b.capture ? PIECE_VALUES[b.capture.t] : 0) - (a.capture ? PIECE_VALUES[a.capture.t] : 0));

    if (maximizingWhite) {
        let best = -Infinity;
        for (const m of moves) {
            const val = minimax(applyMoveToState(snap, m), depth - 1, alpha, beta, false);
            best = Math.max(best, val);
            alpha = Math.max(alpha, val);
            if (beta <= alpha) break;
        }
        return best;
    } else {
        let best = Infinity;
        for (const m of moves) {
            const val = minimax(applyMoveToState(snap, m), depth - 1, alpha, beta, true);
            best = Math.min(best, val);
            beta = Math.min(beta, val);
            if (beta <= alpha) break;
        }
        return best;
    }
}

function pickAiMove(snap: GameSnapshot, level: "casual" | "club" | "master"): Move | null {
    const moves = generateLegalMoves(snap, "b");
    if (moves.length === 0) return null;
    if (level === "casual" && Math.random() < 0.35) {
        return moves[Math.floor(Math.random() * moves.length)];
    }
    const depth = level === "casual" ? 1 : level === "club" ? 2 : 3;
    let bestMove = moves[0];
    let bestScore = Infinity;
    for (const m of moves) {
        const val = minimax(applyMoveToState(snap, m), depth - 1, -Infinity, Infinity, true);
        if (val < bestScore) {
            bestScore = val;
            bestMove = m;
        }
    }
    return bestMove;
}

const INITIAL_SNAP: GameSnapshot = {
    board: createInitialBoard(),
    turn: "w",
    castleRights: { wK: true, wQ: true, bK: true, bQ: true },
    epTarget: null,
    lastMove: null,
    notation: [],
};

export default function ChessGame() {
    const [history, setHistory] = useState<GameSnapshot[]>([INITIAL_SNAP]);
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [mode, setMode] = useState<"ai" | "2p">("ai");
    const [aiLevel, setAiLevel] = useState<"casual" | "club" | "master">("club");
    const [flipped, setFlipped] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);

    const snap = history[history.length - 1];
    const legalMoves = useMemo(() => generateLegalMoves(snap, snap.turn), [snap]);
    const inCheck = useMemo(() => isInCheck(snap.board, snap.turn), [snap]);
    const isGameOver = legalMoves.length === 0;

    const statusText = useMemo(() => {
        if (isGameOver) {
            if (inCheck) return snap.turn === "w" ? "Checkmate — Black Wins!" : "Checkmate — White Wins!";
            return "Stalemate — Draw";
        }
        if (aiThinking) return "AI is thinking...";
        const side = snap.turn === "w" ? "White" : "Black";
        return inCheck ? `${side} to move (CHECK!)` : `${side} to move`;
    }, [isGameOver, inCheck, snap.turn, aiThinking]);

    // Trigger AI move when it's Black's turn in AI mode
    useEffect(() => {
        if (mode !== "ai" || snap.turn !== "b" || isGameOver) return;
        setAiThinking(true);
        const timer = setTimeout(() => {
            const aiMove = pickAiMove(snap, aiLevel);
            if (aiMove) {
                setHistory((prev) => [...prev, applyMoveToState(prev[prev.length - 1], aiMove)]);
            }
            setAiThinking(false);
        }, 380);
        return () => clearTimeout(timer);
    }, [mode, snap, aiLevel, isGameOver]);

    const selectedMoves = useMemo(() => {
        if (!selected) return [];
        return legalMoves.filter((m) => m.fr === selected[0] && m.fc === selected[1]);
    }, [selected, legalMoves]);

    const handleSquareClick = (r: number, c: number) => {
        if (isGameOver || aiThinking) return;
        if (mode === "ai" && snap.turn === "b") return;

        // Try executing a legal move from selected square
        const move = selectedMoves.find((m) => m.tr === r && m.tc === c);
        if (move) {
            setHistory((prev) => [...prev, applyMoveToState(prev[prev.length - 1], move)]);
            setSelected(null);
            return;
        }

        // Otherwise select own piece
        const piece = snap.board[r][c];
        if (piece && piece.c === snap.turn) {
            setSelected([r, c]);
        } else {
            setSelected(null);
        }
    };

    const handleUndo = () => {
        if (aiThinking || history.length <= 1) return;
        const steps = mode === "ai" && snap.turn === "w" && history.length > 2 ? 2 : 1;
        setHistory((prev) => prev.slice(0, Math.max(1, prev.length - steps)));
        setSelected(null);
    };

    const handleReset = () => {
        setHistory([{ ...INITIAL_SNAP, board: createInitialBoard() }]);
        setSelected(null);
        setAiThinking(false);
    };

    const rows = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const cols = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 8x8 Board */}
                <div className="lg:col-span-8 flex flex-col items-center space-y-3">
                    <div className="w-full max-w-[520px] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className={`font-bold text-sm ${inCheck ? "text-rose-700" : "text-[#161614]"}`}>
                            {statusText}
                        </span>
                        <span className="font-mono text-[#78756C]">Move {Math.ceil((snap.notation.length + 1) / 2)}</span>
                    </div>

                    <div className="w-full max-w-[520px] aspect-square grid grid-cols-8 rounded-xl overflow-hidden border-2 border-slate-800 shadow-lg select-none">
                        {rows.map((r) =>
                            cols.map((c) => {
                                const piece = snap.board[r][c];
                                const isLight = (r + c) % 2 === 0;
                                const isSel = selected?.[0] === r && selected?.[1] === c;
                                const isTarget = selectedMoves.some((m) => m.tr === r && m.tc === c);
                                const isLast =
                                    (snap.lastMove?.fr === r && snap.lastMove?.fc === c) ||
                                    (snap.lastMove?.tr === r && snap.lastMove?.tc === c);
                                const isKingCheck = inCheck && piece?.c === snap.turn && piece?.t === "k";

                                const bg = isKingCheck
                                    ? "bg-rose-500"
                                    : isSel
                                      ? "bg-sky-400"
                                      : isLast
                                        ? isLight
                                            ? "bg-amber-200"
                                            : "bg-amber-400/80"
                                        : isLight
                                          ? "bg-[#F0D9B5]"
                                          : "bg-[#B58863]";

                                return (
                                    <button
                                        key={`${r}-${c}`}
                                        type="button"
                                        onClick={() => handleSquareClick(r, c)}
                                        aria-label={`${String.fromCharCode(97 + c)}${8 - r}`}
                                        className={`relative aspect-square flex items-center justify-center text-3xl sm:text-4xl transition-colors cursor-pointer ${bg}`}
                                    >
                                        {piece && (
                                            <span
                                                className={
                                                    piece.c === "w"
                                                        ? "text-white drop-shadow-[0_1.5px_1.5px_rgba(15,23,42,0.85)]"
                                                        : "text-slate-950"
                                                }
                                            >
                                                {PIECE_UNICODE[piece.c][piece.t]}
                                            </span>
                                        )}
                                        {isTarget && (
                                            <span
                                                className={
                                                    piece
                                                        ? "absolute inset-1 rounded-full border-4 border-emerald-600/70 pointer-events-none"
                                                        : "w-3.5 h-3.5 rounded-full bg-slate-900/35 pointer-events-none"
                                                }
                                            />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Controls & Move History */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="border border-[#E6E3DB] rounded-xl p-4 space-y-3 bg-[#FAF9F6]">
                        <p className="text-xs font-semibold text-[#3F3E39]">Game Mode</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            <button
                                type="button"
                                onClick={() => setMode("ai")}
                                className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                                    mode === "ai" ? "bg-slate-900 text-white" : "bg-white border border-[#E6E3DB] text-[#3F3E39]"
                                }`}
                            >
                                <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>vs Chess AI</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("2p")}
                                className={`inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                                    mode === "2p" ? "bg-slate-900 text-white" : "bg-white border border-[#E6E3DB] text-[#3F3E39]"
                                }`}
                            >
                                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>2-Player</span>
                            </button>
                        </div>

                        {mode === "ai" && (
                            <div className="space-y-1.5 pt-1">
                                <p className="text-xs font-semibold text-[#57554E]">AI Difficulty</p>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {(["casual", "club", "master"] as const).map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setAiLevel(lvl)}
                                            className={`py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                                                aiLevel === lvl ? "bg-[#161614] text-[#FAF9F6]" : "bg-white border border-[#E6E3DB] text-[#3F3E39]"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#E6E3DB]">
                            <button
                                type="button"
                                onClick={handleUndo}
                                disabled={history.length <= 1 || aiThinking}
                                className="inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#F3F1EB] disabled:opacity-40 text-xs font-semibold text-[#3F3E39] cursor-pointer"
                            >
                                <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Undo</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFlipped((f) => !f)}
                                className="inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#F3F1EB] text-xs font-semibold text-[#3F3E39] cursor-pointer"
                            >
                                <FlipVertical2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Flip</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#F3F1EB] text-xs font-semibold text-[#3F3E39] cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>New</span>
                            </button>
                        </div>
                    </div>

                    {/* Algebraic Move Log */}
                    <div className="border border-[#E6E3DB] rounded-xl p-4 bg-white space-y-2">
                        <p className="text-xs font-semibold text-[#3F3E39]">Move History</p>
                        {snap.notation.length === 0 ? (
                            <p className="text-xs text-[#78756C] py-4 text-center">Click any White piece to begin playing.</p>
                        ) : (
                            <div className="max-h-[260px] overflow-y-auto grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-xs tabular-nums">
                                {Array.from({ length: Math.ceil(snap.notation.length / 2) }).map((_, i) => (
                                    <React.Fragment key={i}>
                                        <span className="text-[#3F3E39]">
                                            <span className="text-slate-400 mr-1.5">{i + 1}.</span>
                                            {snap.notation[i * 2]}
                                        </span>
                                        <span className="text-[#3F3E39]">{snap.notation[i * 2 + 1] || ""}</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
