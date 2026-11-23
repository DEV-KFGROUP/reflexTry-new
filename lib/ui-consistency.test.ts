import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function walkTsxFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTsxFiles(full, out);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      if (!entry.name.endsWith(".test.ts") && !entry.name.endsWith(".test.tsx")) {
        out.push(full);
      }
    }
  }
  return out;
}

const UI_FILES = [
  ...walkTsxFiles(path.join(ROOT, "app")),
  ...walkTsxFiles(path.join(ROOT, "components")),
];

const FORBIDDEN_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: "FLOATING_SHAPES background clutter", regex: /\bFLOATING_SHAPES\b/ },
  { label: "DECK // slash-comment HUD header", regex: /DECK \/\// },
  { label: "ARENA // slash-comment HUD header", regex: /ARENA \/\// },
  { label: "AI-slop 02 AGENTS copy", regex: /02 AGENTS/ },
  { label: "AI-slop TRANSMISSION SLA copy", regex: /TRANSMISSION SLA/ },
  { label: "AI-slop Last Calibrated copy", regex: /Last Calibrated/ },
  { label: "AI-slop OPTIC CALIBRATOR copy", regex: /OPTIC CALIBRATOR/ },
  { label: "legacy cool-slate canvas bg-[#f8fafc]", regex: /bg-\[#f8fafc\]/i },
  {
    label: "legacy page wrapper bg-slate-50 dark:bg-slate-900",
    regex: /bg-slate-50 dark:bg-slate-900/,
  },
  { label: "neon cyan gradient", regex: /from-cyan-/ },
  { label: "iframe-unsafe window.alert", regex: /\bwindow\.alert\s*\(/ },
  { label: "iframe-unsafe window.open", regex: /\bwindow\.open\s*\(/ },
];

test("app/ and components/ contain zero legacy AI-slop, dark-slate wrapper, or iframe-unsafe patterns", () => {
  const violations: string[] = [];

  for (const file of UI_FILES) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file);
    for (const rule of FORBIDDEN_PATTERNS) {
      if (rule.regex.test(content)) {
        violations.push(`${rel}: matched ${rule.label}`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found UI consistency / iframe safety violations:\n${violations.join("\n")}`
  );
});

test("shared navigation popovers, hero, and stat widgets use unified Clinical Light tokens", () => {
  const sharedChromeFiles = [
    "app/HeroSection.tsx",
    "components/PomodoroTimer.tsx",
    "components/LanguageSwitcher.tsx",
    "components/AchievementNotification.tsx",
    "components/EnhancedStatsBase.tsx",
    "components/XPProgress.tsx",
    "components/HighScore.tsx",
    "app/error.tsx",
    "app/global-error.tsx",
  ];

  const violations: string[] = [];
  const legacyCoolSlateRx = /\b(border-slate-200|bg-slate-50|bg-slate-100|bg-blue-600|bg-indigo-600)\b/;

  for (const rel of sharedChromeFiles) {
    const content = fs.readFileSync(path.join(ROOT, rel), "utf8");
    if (legacyCoolSlateRx.test(content)) {
      violations.push(`${rel}: still contains legacy cool slate/blue token`);
    }
  }

  const hero = fs.readFileSync(path.join(ROOT, "app/HeroSection.tsx"), "utf8");
  assert.equal(
    /HeroCognitiveScene|Gyro-Chronometer/i.test(hero),
    false,
    "app/HeroSection.tsx must not reference removed HeroCognitiveScene or Gyro-Chronometer"
  );
  assert.match(
    hero,
    /hero-quick-reaction-pad/,
    "app/HeroSection.tsx must expose the interactive Quick Reaction Check pad"
  );

  assert.deepEqual(
    violations,
    [],
    `Shared chrome Clinical Light violations:\n${violations.join("\n")}`
  );
});

