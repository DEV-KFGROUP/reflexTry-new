"use client";

import { useState } from "react";
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
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareText = text || `Check out my ${score ? `${score} score` : "result"} on ${toolName || "Reflextry"}!`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || "Reflextry",
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error
            }
        }
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, "_blank", "width=550,height=420");
    };

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, "_blank", "width=550,height=420");
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        window.open(whatsappUrl, "_blank");
    };

    const hasWebShare = typeof navigator !== "undefined" && "share" in navigator && typeof navigator.share === "function";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {hasWebShare && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWebShare}
                    className="flex items-center gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleTwitterShare}
                className="flex items-center gap-2"
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Twitter</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleFacebookShare}
                className="flex items-center gap-2"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Facebook</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2"
                aria-label="Share on WhatsApp"
            >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">WhatsApp</span>
            </Button>
        </div>
    );
}

