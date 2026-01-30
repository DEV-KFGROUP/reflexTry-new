import { NextResponse } from "next/server";

// Disable caching for API routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email address" },
                { status: 400 }
            );
        }

        // TODO: Integrate with email service (SendGrid, Resend, etc.)
        // In production, implement email sending here

        return NextResponse.json({
            success: true,
            message: "Thank you for your message! We'll get back to you soon.",
        });
    } catch (error) {
        // Log error in production (use proper logging service)
        if (process.env.NODE_ENV === 'development') {
            console.error("Contact form error:", error);
        }
        return NextResponse.json(
            { success: false, message: "Failed to send message. Please try again later." },
            { status: 500 }
        );
    }
}

