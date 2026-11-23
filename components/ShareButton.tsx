"use client";

import { useEffect, useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { toast } from "@/utils/toast";

interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
    score?: number;
    toolName?: string;
}

export function ShareButton({ title, text, url, score, toolName }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [resolvedUrl, setResolvedUrl] = useState(url || "");
    const [hasWebShare, setHasWebShare] = useState(false);

    useEffect(() => {
        if (!url && typeof window !== "undefined") {
            setResolvedUrl(window.location.href);
        }
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            setHasWebShare(true);
        }
    }, [url]);

    const shareUrl = url || resolvedUrl;
    const shareText = text || `Check out my ${score ? `${score} score` : "result"} on ${toolName || "Reflextry"}!`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl || shareText);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleWebShare = async () => {
        if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
            try {
                await navigator.share({
                    title: title || "Reflextry",
                    text: shareText,
                    url: shareUrl,
                });
            } catch {
                // User cancelled share sheet
            }
        }
    };

    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

    const linkBtnClass =
        "inline-flex items-center justify-center h-9 px-3 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-[#3F3E39] hover:text-[#161614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {hasWebShare && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWebShare}
                    className="flex items-center gap-2"
                >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    Share
                </Button>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
            >
                {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                {copied ? "Copied!" : "Copy Link"}
            </Button>
            <a
                href={twitterHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBtnClass}
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Twitter</span>
            </a>
            <a
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBtnClass}
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Facebook</span>
            </a>
            <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBtnClass}
                aria-label="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">WhatsApp</span>
            </a>
        </div>
    );
}
