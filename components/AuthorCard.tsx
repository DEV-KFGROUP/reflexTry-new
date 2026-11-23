import React from "react";
import Image from "next/image";

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
            className="my-8 p-6 rounded-2xl bg-[#FAF9F6] border border-[#E6E3DB] flex flex-col sm:flex-row items-start gap-5"
            itemScope
            itemType={name.startsWith("Reflextry") ? "https://schema.org/Organization" : "https://schema.org/Person"}
        >
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E6E3DB] bg-white flex items-center justify-center">
                <Image
                    src={avatarUrl}
                    alt={name}
                    width={40}
                    height={40}
                    className="object-contain"
                    referrerPolicy="no-referrer"
                    itemProp="image"
                />
            </div>
            <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <h4 className="font-serif text-lg font-medium text-[#161614]" itemProp="name">
                        <a href="/about" className="hover:text-[#1E40AF] underline underline-offset-4 decoration-[#D8D4C9]" itemProp="url">
                            {name}
                        </a>
                    </h4>
                    <span className="text-xs text-[#78756C]">
                        · {role}
                    </span>
                </div>
                <p className="text-sm text-[#57554E] leading-relaxed" itemProp="description">
                    {bio}
                </p>
                {expertise.length > 0 && (
                    <p className="pt-1 text-xs text-[#78756C]">
                        <span className="font-semibold text-[#161614]">Topics: </span>
                        {expertise.join(" · ")}
                    </p>
                )}
            </div>
        </div>
    );
}
