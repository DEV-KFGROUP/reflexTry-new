import React from "react";
import Image from "next/image";
import { Award } from "lucide-react";

interface AuthorCardProps {
    name?: string;
    role?: string;
    bio?: string;
    avatarUrl?: string;
    expertise?: string[];
}

export function AuthorCard({
    name = "Reflextry Editorial",
    role = "Product editorial",
    bio = "Guides to using Reflextry tests, understanding scores, and comparing your own practice sessions.",
    avatarUrl = "/logo-80x80.png",
    expertise = ["Reaction Time Benchmarks", "Working Memory Capacity", "Sensorimotor Calibration", "Esports Warmup Mechanics"]
}: AuthorCardProps) {
    return (
        <div 
            className="my-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start gap-5 shadow-sm"
            itemScope 
            itemType={name.startsWith("Reflextry") ? "https://schema.org/Organization" : "https://schema.org/Person"}
        >
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-cyan-500/30 bg-slate-900 flex items-center justify-center shadow-sm">
                <Image 
                    src={avatarUrl} 
                    alt={name} 
                    width={44}
                    height={44}
                    className="object-contain rounded-full" 
                    itemProp="image"
                />
            </div>
            <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-foreground flex items-center gap-1.5" itemProp="name">
                        <a href="/about" className="underline underline-offset-4" itemProp="url">{name}</a>

                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" >
                        {role}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed" itemProp="description">
                    {bio}
                </p>
                {expertise.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" /> Topics:
                        </span>
                        {expertise.map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-muted-foreground">
                                {item}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
