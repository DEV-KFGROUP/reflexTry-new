"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, RotateCw, Trash2, CheckCircle2, HelpCircle, Layers, Shuffle } from "lucide-react";

interface StudyCard {
    id: string;
    front: string;
    back: string;
    mastery: number; // 0 = new, 1 = learning, 2 = mastered
}

interface StudyDeck {
    id: string;
    title: string;
    cards: StudyCard[];
}

const DEFAULT_DECKS: StudyDeck[] = [
    {
        id: "physics",
        title: "Core Physics Formulas",
        cards: [
            { id: "p1", front: "Newton's Second Law", back: "F = m · a (Force equals mass times acceleration)", mastery: 0 },
            { id: "p2", front: "Kinetic Energy", back: "KE = ½ · m · v² (measured in Joules)", mastery: 0 },
            { id: "p3", front: "Ohm's Law", back: "V = I · R (Voltage = Current × Resistance)", mastery: 0 },
            { id: "p4", front: "Universal Gravitation", back: "F = G · (m₁·m₂) / r²", mastery: 0 },
            { id: "p5", front: "Ideal Gas Law", back: "P · V = n · R · T", mastery: 0 },
            { id: "p6", front: "Wave Speed Equation", back: "v = f · λ (frequency × wavelength)", mastery: 0 },
        ],
    },
    {
        id: "cs",
        title: "Algorithms & Big-O",
        cards: [
            { id: "c1", front: "Binary Search Time Complexity", back: "O(log n) on a sorted array", mastery: 0 },
            { id: "c2", front: "Hash Table Average Lookup", back: "O(1) constant time lookup, insert, and delete", mastery: 0 },
            { id: "c3", front: "Merge Sort Complexity", back: "O(n log n) guaranteed worst-case time, O(n) space", mastery: 0 },
            { id: "c4", front: "BFS vs DFS Data Structure", back: "BFS uses a Queue (FIFO); DFS uses a Stack (LIFO) or recursion", mastery: 0 },
            { id: "c5", front: "Dynamic Programming Criteria", back: "Optimal substructure + overlapping subproblems", mastery: 0 },
        ],
    },
    {
        id: "biology",
        title: "Biology & Chemistry Essentials",
        cards: [
            { id: "b1", front: "ATP Synthesis Organelle", back: "Mitochondria via oxidative phosphorylation", mastery: 0 },
            { id: "b2", front: "DNA Base Pairing Rule", back: "Adenine ↔ Thymine (2 H-bonds), Cytosine ↔ Guanine (3 H-bonds)", mastery: 0 },
            { id: "b3", front: "Avogadro's Constant", back: "6.022 × 10²³ particles per mole", mastery: 0 },
            { id: "b4", front: "Photosynthesis Formula", back: "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂", mastery: 0 },
        ],
    },
];

const STORAGE_KEY = "reflextry_flashcard_decks_v1";

export default function FlashcardsTool() {
    const [decks, setDecks] = useState<StudyDeck[]>(DEFAULT_DECKS);
    const [activeDeckId, setActiveDeckId] = useState("physics");
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [mode, setMode] = useState<"study" | "edit">("study");

    const [newFront, setNewFront] = useState("");
    const [newBack, setNewBack] = useState("");

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) setDecks(parsed);
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
        } catch {
            // ignore
        }
    }, [decks]);

    const deck = useMemo(() => decks.find((d) => d.id === activeDeckId) || decks[0], [decks, activeDeckId]);
    const currentCard = deck.cards[Math.min(cardIndex, Math.max(0, deck.cards.length - 1))];
    const masteredCount = deck.cards.filter((c) => c.mastery >= 2).length;

    const rateCard = (rating: "again" | "good" | "mastered") => {
        if (!currentCard) return;
        const nextMastery = rating === "again" ? 0 : rating === "good" ? 1 : 2;
        setDecks((prev) =>
            prev.map((d) =>
                d.id === deck.id
                    ? {
                          ...d,
                          cards: d.cards.map((c) => (c.id === currentCard.id ? { ...c, mastery: nextMastery } : c)),
                      }
                    : d
            )
        );
        setFlipped(false);
        setCardIndex((i) => (i + 1) % Math.max(1, deck.cards.length));
    };

    // Keyboard shortcuts in study mode
    useEffect(() => {
        if (mode !== "study") return;
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.code === "Space") {
                e.preventDefault();
                setFlipped((f) => !f);
            } else if (e.key === "1") {
                rateCard("again");
            } else if (e.key === "2") {
                rateCard("good");
            } else if (e.key === "3") {
                rateCard("mastered");
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    const addCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFront.trim() || !newBack.trim()) return;
        const card: StudyCard = {
            id: `card-${Date.now()}`,
            front: newFront.trim(),
            back: newBack.trim(),
            mastery: 0,
        };
        setDecks((prev) => prev.map((d) => (d.id === deck.id ? { ...d, cards: [...d.cards, card] } : d)));
        setNewFront("");
        setNewBack("");
    };

    const shuffleDeck = () => {
        setDecks((prev) =>
            prev.map((d) => {
                if (d.id !== deck.id) return d;
                const copy = [...d.cards];
                for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                }
                return { ...d, cards: copy };
            })
        );
        setCardIndex(0);
        setFlipped(false);
    };

    return (
        <div className="bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden">
            {/* Deck Switcher & Mode Bar */}
            <div className="px-5 py-3.5 border-b border-[#E6E3DB] bg-[#FAF9F6]/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {decks.map((d) => (
                        <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                                setActiveDeckId(d.id);
                                setCardIndex(0);
                                setFlipped(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                                activeDeckId === d.id ? "bg-slate-900 text-white" : "bg-white border border-[#E6E3DB] text-[#3F3E39] hover:bg-[#F3F1EB]"
                            }`}
                        >
                            {d.title} ({d.cards.length})
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={shuffleDeck}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E3DB] bg-white text-xs font-semibold text-[#3F3E39] hover:bg-[#FAF9F6] cursor-pointer"
                    >
                        <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Shuffle</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode((m) => (m === "study" ? "edit" : "study"))}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold cursor-pointer"
                    >
                        <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{mode === "study" ? "Manage Cards" : "Back to Study"}</span>
                    </button>
                </div>
            </div>

            {mode === "study" ? (
                <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between text-xs text-[#78756C] font-mono tabular-nums">
                        <span>
                            Card {Math.min(cardIndex + 1, deck.cards.length)} of {deck.cards.length}
                        </span>
                        <span>
                            Mastered: <strong className="text-emerald-700">{masteredCount}/{deck.cards.length}</strong>
                        </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#F3F1EB] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${(masteredCount / Math.max(1, deck.cards.length)) * 100}%` }}
                        />
                    </div>

                    {currentCard ? (
                        <button
                            type="button"
                            onClick={() => setFlipped((f) => !f)}
                            className={`w-full min-h-[260px] rounded-2xl border-2 p-8 flex flex-col items-center justify-center text-center gap-4 transition-all cursor-pointer ${
                                flipped
                                    ? "bg-blue-50/60 border-blue-300 text-[#161614]"
                                    : "bg-[#FAF9F6] border-[#E6E3DB] hover:border-[#D8D4C9] text-[#161614]"
                            }`}
                        >
                            <span className="text-xs font-mono font-semibold text-[#78756C]">
                                {flipped ? "Answer / Explanation" : "Prompt / Term"}
                            </span>
                            <p className="text-xl sm:text-2xl font-bold leading-snug max-w-2xl">
                                {flipped ? currentCard.back : currentCard.front}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-xs text-[#78756C] mt-2">
                                <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Click card or press Space to flip</span>
                            </span>
                        </button>
                    ) : (
                        <p className="text-center text-sm text-[#78756C] py-12">This deck is empty. Switch to Manage Cards to add flashcards.</p>
                    )}

                    {/* Spaced-Repetition Rating Controls */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => rateCard("again")}
                            className="py-3 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <HelpCircle className="w-4 h-4" aria-hidden="true" />
                            <span>1 · Needs Review</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => rateCard("good")}
                            className="py-3 px-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold cursor-pointer"
                        >
                            2 · Getting It
                        </button>
                        <button
                            type="button"
                            onClick={() => rateCard("mastered")}
                            className="py-3 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                            <span>3 · Mastered</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-5 sm:p-6 space-y-5">
                    <form onSubmit={addCard} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <input
                            type="text"
                            value={newFront}
                            onChange={(e) => setNewFront(e.target.value)}
                            placeholder="Front prompt or question..."
                            className="md:col-span-5 px-3.5 py-2.5 rounded-xl border border-[#D8D4C9] text-sm text-[#161614]"
                        />
                        <input
                            type="text"
                            value={newBack}
                            onChange={(e) => setNewBack(e.target.value)}
                            placeholder="Back answer or formula..."
                            className="md:col-span-5 px-3.5 py-2.5 rounded-xl border border-[#D8D4C9] text-sm text-[#161614]"
                        />
                        <button
                            type="submit"
                            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
                        >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                            <span>Add</span>
                        </button>
                    </form>

                    <div className="divide-y divide-[#EFECE4] border border-[#E6E3DB] rounded-xl overflow-hidden">
                        {deck.cards.map((c) => (
                            <div key={c.id} className="p-3.5 bg-white flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[#161614]">{c.front}</p>
                                    <p className="text-xs text-[#57554E] mt-0.5">{c.back}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDecks((prev) =>
                                            prev.map((d) =>
                                                d.id === deck.id ? { ...d, cards: d.cards.filter((x) => x.id !== c.id) } : d
                                            )
                                        )
                                    }
                                    aria-label="Delete flashcard"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 shrink-0 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
