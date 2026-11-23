"use client";

import Link from "next/link";
import { Home, ArrowLeft, Target, Zap, Gauge, Brain, Gamepad2 } from "lucide-react";

export default function NotFoundClient({ locale }: { locale: string }) {
  const prefix = locale && locale !== "en" ? `/${locale}` : "";
  const localized = (path: string) => (path === "/" ? prefix || "/" : `${prefix}${path}`);

  const arenas = [
    { href: "/reflex", label: "Reflex Arena", icon: Zap },
    { href: "/memory", label: "Memory Arena", icon: Brain },
    { href: "/speed", label: "Speed Arena", icon: Gauge },
    { href: "/gaming", label: "Gaming Arena", icon: Gamepad2 },
    { href: "/accuracy", label: "Accuracy Arena", icon: Target },
  ];

  return (
    <div className="bg-[#FAF9F6] text-[#161614] min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center space-y-10">
        <div className="space-y-3">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#78756C]">
            Error 404
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-[-0.02em] text-[#161614]">
            Page not found
          </h1>
          <p className="text-base text-[#57554E] max-w-xl mx-auto leading-relaxed">
            The page you requested could not be found. It may have been moved or the URL may be mistyped.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={localized("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-[#E6E3DB] hover:bg-[#F3F1EB] hover:border-[#D8D4C9] text-[#161614] text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#E6E3DB]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
            Jump to a Training Arena
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-t border-l border-[#E6E3DB] bg-white">
            {arenas.map((arena) => {
              const Icon = arena.icon;
              return (
                <Link
                  key={arena.href}
                  href={localized(arena.href)}
                  className="group p-4 border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] transition-colors flex flex-col items-center justify-center gap-2.5"
                >
                  <Icon className="w-5 h-5 text-[#57554E] group-hover:text-[#161614] transition-colors" aria-hidden="true" />
                  <span className="text-xs font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors">
                    {arena.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
