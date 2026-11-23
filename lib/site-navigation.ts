import { TOOL_MAPPING } from "@/config/tool-mapping";

export interface SiteNavLink {
    label: string;
    href: string;
    description?: string;
    translationKey?: string;
}

export interface SiteCategoryEntry {
    id:
        | "puzzles"
        | "classics"
        | "reflex"
        | "memory"
        | "speed"
        | "accuracy"
        | "gaming"
        | "productivity"
        | "stem"
        | "lab-3d"
        | "multiplayer";
    label: string;
    shortLabel: string;
    href: string;
    group: "puzzles-classics" | "benchmarks" | "labs-suite";
    description: string;
    translationKey?: string;
    toolCount: number;
}

function countToolsForCategory(prefix: string): number {
    const uniquePaths = new Set(Object.values(TOOL_MAPPING));
    let count = 0;
    for (const p of uniquePaths) {
        if (p.startsWith(`${prefix}/`)) count++;
    }
    return count;
}

export const SITE_CATEGORIES: SiteCategoryEntry[] = [
    {
        id: "puzzles",
        label: "Logic & Word Puzzles",
        shortLabel: "Puzzles",
        href: "/puzzles",
        group: "puzzles-classics",
        description: "9 Mensa-grade daily logic & word games with 1,200+ levels each.",
        toolCount: countToolsForCategory("/puzzles"),
    },
    {
        id: "classics",
        label: "Flagship Classics",
        shortLabel: "Classics",
        href: "/classics",
        group: "puzzles-classics",
        description: "Authentic Wordle, 60fps SRS Tetris, and full-rules Chess vs AI.",
        toolCount: countToolsForCategory("/classics"),
    },
    {
        id: "reflex",
        label: "Reflex Arena",
        shortLabel: "Reflex",
        href: "/reflex",
        group: "benchmarks",
        description: "Visual, auditory, Go/No-Go, and flanker reaction latency tests.",
        translationKey: "nav.reflex",
        toolCount: countToolsForCategory("/reflex"),
    },
    {
        id: "memory",
        label: "Memory Arena",
        shortLabel: "Memory",
        href: "/memory",
        group: "benchmarks",
        description: "Working memory spans, Chimp Test, N-Back, and spatial recall.",
        translationKey: "nav.memory",
        toolCount: countToolsForCategory("/memory"),
    },
    {
        id: "speed",
        label: "Speed Arena",
        shortLabel: "Speed",
        href: "/speed",
        group: "benchmarks",
        description: "Typing WPM, Schulte tables, CPS click speed, and mental math.",
        translationKey: "nav.speed",
        toolCount: countToolsForCategory("/speed"),
    },
    {
        id: "accuracy",
        label: "Accuracy Arena",
        shortLabel: "Accuracy",
        href: "/accuracy",
        group: "benchmarks",
        description: "Fine motor precision, angle estimation, color match, and rotation.",
        translationKey: "nav.accuracy",
        toolCount: countToolsForCategory("/accuracy"),
    },
    {
        id: "gaming",
        label: "Gaming Arena",
        shortLabel: "Gaming",
        href: "/gaming",
        group: "benchmarks",
        description: "FPS aim trainer, flick shot, target tracking, and rhythm timing.",
        translationKey: "nav.gaming",
        toolCount: countToolsForCategory("/gaming"),
    },
    {
        id: "productivity",
        label: "Student & Work Suite",
        shortLabel: "Study & Work",
        href: "/productivity",
        group: "labs-suite",
        description: "Graphing calculator, unit solver, GPA tracker, flashcards & RSVP.",
        toolCount: countToolsForCategory("/productivity"),
    },
    {
        id: "stem",
        label: "STEM & Physics Lab",
        shortLabel: "STEM Lab",
        href: "/stem",
        group: "labs-suite",
        description: "Interactive gravity, laser reflection, projectile & torque labs.",
        translationKey: "nav.stem",
        toolCount: countToolsForCategory("/stem"),
    },
    {
        id: "lab-3d",
        label: "3D Interactive Lab",
        shortLabel: "3D Lab",
        href: "/lab-3d",
        group: "labs-suite",
        description: "Real-time WebGL orbital mechanics and 3D depth aim calibration.",
        translationKey: "nav.lab3d",
        toolCount: countToolsForCategory("/lab-3d"),
    },
    {
        id: "multiplayer",
        label: "2-Player Battle Arena",
        shortLabel: "2-Player",
        href: "/multiplayer",
        group: "labs-suite",
        description: "Local split-screen reflex duels, math tug-of-war & artillery.",
        translationKey: "nav.multiplayer",
        toolCount: countToolsForCategory("/multiplayer"),
    },
];

export const PRIMARY_HEADER_LINKS: SiteNavLink[] = [
    { label: "Logic Puzzles", href: "/puzzles" },
    { label: "Benchmarks", href: "/reflex", translationKey: "nav.reflex" },
    { label: "Classics", href: "/classics" },
    { label: "Study & Labs", href: "/productivity" },
    { label: "All Tools", href: "/tools", translationKey: "nav.tools" },
];

export const FEATURED_FLAGSHIP_LINKS: SiteNavLink[] = [
    { label: "Reaction Time", href: "/reflex/reaction" },
    { label: "Queens Puzzle", href: "/puzzles/queens" },
    { label: "Tango Puzzle", href: "/puzzles/tango" },
    { label: "Wordle", href: "/classics/wordle" },
    { label: "Chess vs AI", href: "/classics/chess" },
    { label: "Aim Trainer", href: "/gaming/aim" },
    { label: "Typing Speed", href: "/speed/typing" },
    { label: "Graphing Calculator", href: "/productivity/graphing-calculator" },
    { label: "Solar Gravity 3D", href: "/lab-3d/solar-gravity" },
];

export const PROGRESS_LINKS: SiteNavLink[] = [
    {
        label: "Personal Statistics",
        href: "/statistics",
        description: "Local session logs, trends, and deep-work history.",
        translationKey: "nav.statistics",
    },
    {
        label: "Leaderboard",
        href: "/leaderboard",
        description: "Compare scores across core drills.",
        translationKey: "nav.leaderboard",
    },
    {
        label: "Daily Challenges",
        href: "/challenges",
        description: "Short daily practice targets.",
        translationKey: "nav.challenges",
    },
    {
        label: "Achievements",
        href: "/achievements",
        description: "Milestones unlocked across arenas.",
        translationKey: "footer.achievements",
    },
];

export const RESEARCH_LINKS: SiteNavLink[] = [
    {
        label: "Testing Methodology",
        href: "/methodology",
        description: "Scoring formulas and hardware timing limits.",
        translationKey: "footer.methodology",
    },
    {
        label: "Science & Citations",
        href: "/science",
        description: "Peer-reviewed cognitive literature and context.",
        translationKey: "nav.science",
    },
    {
        label: "Training Programs",
        href: "/training-programs",
        description: "Structured 10–15 minute practice routines.",
        translationKey: "footer.trainingPrograms",
    },
    {
        label: "Research Journal",
        href: "/blog",
        description: "Guides on latency, memory, and fair scoring.",
        translationKey: "nav.blog",
    },
    {
        label: "FAQ",
        href: "/faq",
        description: "Answers on privacy, scoring, and practice.",
        translationKey: "footer.faq",
    },
];

export const COMPANY_LEGAL_LINKS: SiteNavLink[] = [
    { label: "About the Lab", href: "/about", translationKey: "footer.about" },
    { label: "Contact", href: "/contact", translationKey: "footer.contact" },
    { label: "Privacy Policy", href: "/privacy", translationKey: "footer.privacy" },
    { label: "Terms of Service", href: "/terms", translationKey: "footer.terms" },
    { label: "Cookie Policy", href: "/cookies", translationKey: "footer.cookies" },
];

export interface QuickDirectoryItem {
    label: string;
    href: string;
    group: string;
}

/**
 * Flat searchable index used inside the Header "All Pages" mega-menu filter so users can
 * reach every category, static page, and all 76 interactive tools in one keystroke.
 */
export function buildAllPagesDirectory(): QuickDirectoryItem[] {
    const items: QuickDirectoryItem[] = [
        { label: "Home", href: "/", group: "Overview" },
        { label: "All Tools Directory", href: "/tools", group: "Overview" },
    ];

    for (const cat of SITE_CATEGORIES) {
        items.push({ label: cat.label, href: cat.href, group: "Arenas & Labs" });
    }
    for (const item of PROGRESS_LINKS) {
        items.push({ label: item.label, href: item.href, group: "Progress" });
    }
    for (const item of RESEARCH_LINKS) {
        items.push({ label: item.label, href: item.href, group: "Research & Guides" });
    }
    for (const item of COMPANY_LEGAL_LINKS) {
        items.push({ label: item.label, href: item.href, group: "About & Policies" });
    }

    const seenToolPaths = new Set<string>();
    for (const [slug, href] of Object.entries(TOOL_MAPPING)) {
        if (seenToolPaths.has(href)) continue;
        seenToolPaths.add(href);
        const categorySlug = href.split("/")[1] || "tool";
        const cat = SITE_CATEGORIES.find((c) => c.id === categorySlug);
        const prettyTitle = slug
            .split("-")
            .map((w) => (w === "3d" ? "3D" : w === "2p" ? "2P" : w === "cps" ? "CPS" : w === "rpg" ? "RPG" : w === "gpa" ? "GPA" : w.charAt(0).toUpperCase() + w.slice(1)))
            .join(" ");
        items.push({
            label: prettyTitle,
            href,
            group: cat ? cat.shortLabel : "Tools",
        });
    }

    return items;
}

export function getAllHeaderMenuHrefs(): string[] {
    return [
        "/",
        "/tools",
        ...SITE_CATEGORIES.map((c) => c.href),
        ...FEATURED_FLAGSHIP_LINKS.map((l) => l.href),
        ...PROGRESS_LINKS.map((l) => l.href),
        ...RESEARCH_LINKS.map((l) => l.href),
        ...COMPANY_LEGAL_LINKS.map((l) => l.href),
    ];
}

export function getAllFooterHrefs(): string[] {
    return [
        "/",
        "/tools",
        ...SITE_CATEGORIES.map((c) => c.href),
        ...FEATURED_FLAGSHIP_LINKS.map((l) => l.href),
        ...PROGRESS_LINKS.map((l) => l.href),
        ...RESEARCH_LINKS.map((l) => l.href),
        ...COMPANY_LEGAL_LINKS.map((l) => l.href),
    ];
}

export interface NavigationAuditReport {
    passed: boolean;
    brokenHeaderLinks: string[];
    brokenFooterLinks: string[];
    missingFromHeader: string[];
    missingFromFooter: string[];
    duplicateLinksBySection: Record<string, string[]>;
}

/**
 * Automated Menu Checker: validates that every top-level route and category on disk is
 * reachable in both Header and Footer, with zero broken links and zero duplicate links per section.
 */
export function auditSiteNavigation(existingRoutes: Set<string>): NavigationAuditReport {
    const headerHrefs = getAllHeaderMenuHrefs();
    const footerHrefs = getAllFooterHrefs();

    const brokenHeaderLinks = Array.from(
        new Set(headerHrefs.filter((href) => !existingRoutes.has(href)))
    );
    const brokenFooterLinks = Array.from(
        new Set(footerHrefs.filter((href) => !existingRoutes.has(href)))
    );

    // Every non-dynamic top-level route (e.g. /puzzles, /about, /statistics, /tools, etc.)
    // must be directly reachable from both Header ("All Pages" menu & mobile drawer) and Footer.
    const requiredTopLevelRoutes = Array.from(existingRoutes).filter((route) => {
        if (route === "/") return true;
        const segments = route.split("/").filter(Boolean);
        return segments.length === 1 && !segments[0].startsWith("[");
    });

    const headerSet = new Set(headerHrefs);
    const footerSet = new Set(footerHrefs);

    const missingFromHeader = requiredTopLevelRoutes.filter((r) => !headerSet.has(r));
    const missingFromFooter = requiredTopLevelRoutes.filter((r) => !footerSet.has(r));

    const sections: Record<string, string[]> = {
        PRIMARY_HEADER_LINKS: PRIMARY_HEADER_LINKS.map((l) => l.href),
        SITE_CATEGORIES: SITE_CATEGORIES.map((c) => c.href),
        FEATURED_FLAGSHIP_LINKS: FEATURED_FLAGSHIP_LINKS.map((l) => l.href),
        PROGRESS_LINKS: PROGRESS_LINKS.map((l) => l.href),
        RESEARCH_LINKS: RESEARCH_LINKS.map((l) => l.href),
        COMPANY_LEGAL_LINKS: COMPANY_LEGAL_LINKS.map((l) => l.href),
    };

    const duplicateLinksBySection: Record<string, string[]> = {};
    for (const [section, list] of Object.entries(sections)) {
        const seen = new Set<string>();
        const dupes = new Set<string>();
        for (const href of list) {
            if (seen.has(href)) dupes.add(href);
            seen.add(href);
        }
        if (dupes.size > 0) {
            duplicateLinksBySection[section] = Array.from(dupes);
        }
    }

    const passed =
        brokenHeaderLinks.length === 0 &&
        brokenFooterLinks.length === 0 &&
        missingFromHeader.length === 0 &&
        missingFromFooter.length === 0 &&
        Object.keys(duplicateLinksBySection).length === 0;

    return {
        passed,
        brokenHeaderLinks,
        brokenFooterLinks,
        missingFromHeader,
        missingFromFooter,
        duplicateLinksBySection,
    };
}
