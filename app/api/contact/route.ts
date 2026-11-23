import { NextResponse } from "next/server";

// Disable caching for API routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_MAX_KEYS = 500;
const requestLog = new Map<string, number[]>();

function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();
        if (first) return first.slice(0, 64);
    }
    return request.headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
    if (requestLog.size > RATE_LIMIT_MAX_KEYS) {
        for (const [key, timestamps] of requestLog.entries()) {
            const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
            if (recent.length === 0) requestLog.delete(key);
            else requestLog.set(key, recent);
        }
    }

    const history = (requestLog.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (history.length >= RATE_LIMIT_MAX_REQUESTS) {
        requestLog.set(ip, history);
        return true;
    }
    history.push(now);
    requestLog.set(ip, history);
    return false;
}

export async function POST(request: Request) {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp, Date.now())) {
        return NextResponse.json(
            { success: false, message: "Too many requests. Please wait a minute and try again." },
            { status: 429 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON payload." },
            { status: 400 }
        );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json(
            { success: false, message: "Invalid request body." },
            { status: 400 }
        );
    }

    const record = body as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const email = typeof record.email === "string" ? record.email.trim() : "";
    const subject = typeof record.subject === "string" ? record.subject.trim() : "";
    const message = typeof record.message === "string" ? record.message.trim() : "";

    if (!name || !email || !message) {
        return NextResponse.json(
            { success: false, message: "Name, email, and message are required." },
            { status: 400 }
        );
    }

    if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 5000) {
        return NextResponse.json(
            { success: false, message: "One or more fields exceed the maximum allowed length." },
            { status: 400 }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json(
            { success: false, message: "Invalid email address." },
            { status: 400 }
        );
    }

    // Ready for transactional email provider integration (SendGrid, Resend, etc.)
    return NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
    });
}
