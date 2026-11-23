import { NextResponse } from "next/server";

// Disable caching for API routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CORRECT_ANSWERS: Record<string, string> = {
    img_001: "cat",
    img_002: "sunset",
    img_003: "geometric shapes",
};

const MAX_INPUT_LENGTH = 120;

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    if (typeof record.imageId !== "string" || typeof record.userInput !== "string") {
        return NextResponse.json(
            { success: false, message: "imageId and userInput must be strings" },
            { status: 400 }
        );
    }

    const imageId = record.imageId.trim();
    const normalizedInput = record.userInput.trim().toLowerCase();

    if (!imageId || imageId.length > 64 || normalizedInput.length > MAX_INPUT_LENGTH) {
        return NextResponse.json(
            { success: false, message: "Input parameters out of bounds" },
            { status: 400 }
        );
    }

    const expected = Object.prototype.hasOwnProperty.call(CORRECT_ANSWERS, imageId)
        ? CORRECT_ANSWERS[imageId]
        : null;

    if (!expected) {
        return NextResponse.json(
            { success: false, message: "Unknown imageId" },
            { status: 404 }
        );
    }

    const isCorrect = normalizedInput === expected;
    const accuracy = isCorrect ? 100 : calculateSimilarity(normalizedInput, expected);

    return NextResponse.json({
        success: true,
        accuracy,
        message: accuracy === 100 ? "Perfect Match!" : `Accuracy: ${accuracy}%`,
    });
}

function calculateSimilarity(a: string, b: string): number {
    if (!a || !b) return 0;
    const m = a.length;
    const n = b.length;
    const prev = new Array<number>(n + 1);
    const curr = new Array<number>(n + 1);

    for (let j = 0; j <= n; j++) prev[j] = j;

    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
        }
        for (let j = 0; j <= n; j++) prev[j] = curr[j];
    }

    const distance = prev[n];
    const maxLen = Math.max(m, n);
    return Math.max(0, Math.round((1 - distance / maxLen) * 100));
}

