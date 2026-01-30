import { NextResponse } from "next/server";

// Disable caching for API routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageId, userInput } = body;

        // Mock functionality: In a real app, this would compare against ground truth
        // For demo, we'll check if the user input matches a hardcoded "correct" answer
        // or just return a similarity score based on string distance.

        // Simple mock logic
        const correctAnswers: Record<string, string> = {
            "img_001": "cat",
            "img_002": "sunset",
            "img_003": "geometric shapes",
        };

        const expected = correctAnswers[imageId] || "unknown";
        const isCorrect = userInput.toLowerCase().trim() === expected;
        const accuracy = isCorrect ? 100 : calculateSimilarity(userInput, expected);

        return NextResponse.json({
            success: true,
            accuracy,
            message: accuracy === 100 ? "Perfect Match!" : `Accuracy: ${accuracy}%`,
        });
    } catch (error) {
        return NextResponse.json(
            { message: "Invalid request" },
            { status: 400 }
        );
    }
}

function calculateSimilarity(s1: string, s2: string): number {
    if (!s1 || !s2) return 0;
    // Very basic length/char overlap mock
    const overlap = s1.split('').filter(c => s2.includes(c)).length;
    const maxLength = Math.max(s1.length, s2.length);
    return Math.round((overlap / maxLength) * 100);
}
