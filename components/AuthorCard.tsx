import React from "react";
import Image from "next/image";
import { UserCheck, ShieldCheck, Award } from "lucide-react";

interface AuthorCardProps {
    name?: string;
    role?: string;
    bio?: string;
    avatarUrl?: string;
    expertise?: string[];
}

export function AuthorCard({
    name = "Reflextry Cognitive Lab Team",
    role = "Cognitive Assessment & Neuropsychology Benchmark Team",
    bio = "Our interdisciplinary team designs standardized sensory-motor and working memory benchmarks grounded in peer-reviewed cognitive science literature.",
    avatarUrl = "/apple-icon.png",
    expertise = ["Neuroplasticity", "Reaction Time Metrics", "Working Memory Assessment", "Esports Warmup Mechanics"]
}: AuthorCardProps) {
    return (
        <div 
            className="my-8 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start gap-5"
            itemScope 
            itemType="https://schema.org/Person"
        >
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-blue-500/30">
                <Image 
                    src={avatarUrl} 
                    alt={name} 
                    fill 
                    className="object-cover" 
                    sizes="64px"
                    itemProp="image"
                />
            </div>
            <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-foreground flex items-center gap-1.5" itemProp="name">
                        {name}
                        <ShieldCheck className="w-4 h-4 text-blue-500 inline" />
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold" itemProp="jobTitle">
                        {role}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed" itemProp="description">
                    {bio}
                </p>
                {expertise.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" /> Key Expertise:
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
