import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MIN_GAME_PAD_PX,
  MIN_PRIMARY_CTA_PX,
  MIN_TOUCH_TARGET_PX,
  auditTouchMeasurements,
  isTouchTargetCompliant,
  requiredTouchSizeForRole,
} from "./touch-targets";

const ROOT = process.cwd();

const ACCURACY_CLIENTS = [
  "app/accuracy/angle-estimation/AngleEstimationGame.tsx",
  "app/accuracy/color-blindness/ColorBlindnessGame.tsx",
  "app/accuracy/color-match/ColorMatchGame.tsx",
  "app/accuracy/data/DataEntryClient.tsx",
  "app/accuracy/image-recognition/ImageRecognitionClient.tsx",
  "app/accuracy/mental-rotation/MentalRotationGame.tsx",
  "app/accuracy/pattern-matching/PatternMatchingGame.tsx",
  "app/accuracy/precision-click/PrecisionClickGame.tsx",
];

const GAMING_CLIENTS = [
  "app/gaming/aim/AimTrainerClient.tsx",
  "app/gaming/endless-dodge/EndlessDodgeClient.tsx",
  "app/gaming/flick-shot/FlickShotGame.tsx",
  "app/gaming/reaction/RPGReactionClient.tsx",
  "app/gaming/rhythm-tap/RhythmTapGame.tsx",
  "app/gaming/stroop-drop/StroopDropClient.tsx",
  "app/gaming/target-tracking/TargetTrackingClient.tsx",
];

const NAV_AND_SHELL_FILES = [
  "components/Navbar.tsx",
  "components/LanguageSwitcher.tsx",
  "components/PomodoroTimer.tsx",
  "components/ArenaHubLayout.tsx",
  "components/CategoryGuideSection.tsx",
  "components/dashboard/GameDashboardLayout.tsx",
  "components/dashboard/DashboardDifficultyCard.tsx",
  "components/ToolContentBase.tsx",
  "components/Footer.tsx",
];

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

test("pure touch target compliance logic enforces 44/48/52px thresholds", () => {
  assert.equal(MIN_TOUCH_TARGET_PX, 44);
  assert.equal(MIN_PRIMARY_CTA_PX, 48);
  assert.equal(MIN_GAME_PAD_PX, 52);

  assert.equal(requiredTouchSizeForRole("nav"), 44);
  assert.equal(requiredTouchSizeForRole("cta"), 48);
  assert.equal(requiredTouchSizeForRole("game-pad"), 52);

  assert.equal(isTouchTargetCompliant({ width: 44, height: 44 }), true);
  assert.equal(isTouchTargetCompliant({ width: 43.9, height: 44 }), false);
  assert.equal(isTouchTargetCompliant({ width: 120, height: 32 }), false);
  assert.equal(isTouchTargetCompliant({ width: Number.NaN, height: 48 }), false);
});

test("auditTouchMeasurements exempts difficulty-scaled target dots and reports undersized controls", () => {
  const summary = auditTouchMeasurements([
    { label: "Play", width: 200, height: 52, role: "cta" },
    { label: "End round", width: 128, height: 44, role: "control" },
    { label: "Aim target (Pro)", width: 24, height: 24, role: "target-dot" },
    { label: "Tiny link", width: 80, height: 24, role: "nav" },
  ]);

  assert.equal(summary.totalChecked, 3);
  assert.equal(summary.exemptCount, 1);
  assert.equal(summary.passed, false);
  assert.equal(summary.violations.length, 1);
  assert.equal(summary.violations[0].label, "Tiny link");
  assert.match(summary.violations[0].reason, /height 24px < 44px/);
});

test("all 8 /accuracy and all 7 /gaming clients enforce touch ergonomics and upgraded controls", () => {
  for (const rel of [...ACCURACY_CLIENTS, ...GAMING_CLIENTS]) {
    const src = readFile(rel);

    assert.match(
      src,
      /touch-manipulation|touch-none/,
      `${rel} must declare touch-manipulation or touch-none`
    );

    assert.match(
      src,
      /min-h-\[(48|50|52|54|56)px\]/,
      `${rel} must enforce >=48px touch heights on primary controls`
    );

    // Ensure no legacy tiny bare-text End round button remains
    const legacyAbortRegex = /className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer"/;
    assert.equal(
      legacyAbortRegex.test(src),
      false,
      `${rel} still contains legacy undersized End round button`
    );
  }
});

test("precision/aim/flick target dots use .game-target-dot and AimTrainerClient interpolates targetColor", () => {
  const aimSrc = readFile("app/gaming/aim/AimTrainerClient.tsx");
  assert.match(aimSrc, /game-target-dot/);
  assert.match(aimSrc, /\$\{targetColor\}/);

  const flickSrc = readFile("app/gaming/flick-shot/FlickShotGame.tsx");
  assert.match(flickSrc, /game-target-dot/);
  assert.match(flickSrc, /onPointerDown/);

  const precisionSrc = readFile("app/accuracy/precision-click/PrecisionClickGame.tsx");
  assert.match(precisionSrc, /game-target-dot/);
  assert.match(precisionSrc, /onPointerDown/);
});

test("StroopDropClient uses responsive multi-row grid on mobile for 5-6 colors", () => {
  const stroopSrc = readFile("app/gaming/stroop-drop/StroopDropClient.tsx");
  assert.match(stroopSrc, /grid-cols-3 sm:grid-cols-6/);
  assert.match(stroopSrc, /min-h-\[56px\]/);
});

test("RPGReactionClient uses 3-column touch directional pad with >=56px buttons", () => {
  const rpgSrc = readFile("app/gaming/reaction/RPGReactionClient.tsx");
  assert.match(rpgSrc, /grid-cols-3 gap-2/);
  assert.match(rpgSrc, /min-h-\[(56|58|60|64)px\]/);
  assert.match(rpgSrc, /min-h-\[48px\].*Next Strike|Next Strike/s);
});

test("navigation menus and shared shells include /gaming and >=44px touch targets", () => {
  const navbarSrc = readFile("components/Navbar.tsx");
  assert.match(navbarSrc, /href:\s*"\/gaming"/, "Navbar mobile drawer must include /gaming");
  assert.match(navbarSrc, /min-h-\[48px\]/);

  const footerSrc = readFile("components/Footer.tsx");
  assert.match(footerSrc, /href[=:]\s*"\/gaming"/, "Footer must include /gaming");

  for (const rel of NAV_AND_SHELL_FILES) {
    const src = readFile(rel);
    assert.match(
      src,
      /min-h-\[(44|48|52|56|60)px\]/,
      `${rel} must enforce >=44px minimum touch targets`
    );
    assert.match(src, /touch-manipulation/, `${rel} must include touch-manipulation`);
  }

  const globalsCss = readFile("app/globals.css");
  assert.match(globalsCss, /touch-action:\s*manipulation/);
  assert.match(globalsCss, /:not\(\.game-target-dot\)/);
});
