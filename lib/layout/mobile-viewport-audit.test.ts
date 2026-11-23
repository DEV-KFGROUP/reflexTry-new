import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MOBILE_AUDIT_VIEWPORTS,
  computeResponsiveBoardSize,
  detectUnsafeMobileMinWidthClasses,
  evaluateMobileViewportFit,
} from "./mobile-viewport-audit";

const ROOT = process.cwd();

describe("evaluateMobileViewportFit", () => {
  it("passes when document, game container, and elements stay within 360px viewport", () => {
    const report = evaluateMobileViewportFit({
      route: "/puzzles/zip",
      stage: "idle",
      viewportWidth: 360,
      documentScrollWidth: 360,
      bodyScrollWidth: 360,
      gameContainerRect: {
        tag: "div",
        left: 16,
        right: 344,
        width: 328,
        height: 480,
      },
      elements: [
        { tag: "canvas", left: 24, right: 336, width: 312, height: 312 },
        { tag: "button", left: 16, right: 170, width: 154, height: 48 },
      ],
    });

    assert.equal(report.passed, true);
    assert.equal(report.severity, "none");
    assert.equal(report.horizontalOverflowPx, 0);
    assert.equal(report.offendingElements.length, 0);
  });

  it("flags horizontal overflow and container clipping with accurate severity", () => {
    const report = evaluateMobileViewportFit({
      route: "/puzzles/zip",
      stage: "playing",
      viewportWidth: 360,
      documentScrollWidth: 412,
      bodyScrollWidth: 412,
      gameContainerRect: {
        tag: "div",
        left: 16,
        right: 412,
        width: 396,
        height: 396,
      },
      elements: [
        { tag: "div", className: "board-grid", left: 16, right: 412, width: 396, height: 396 },
      ],
    });

    assert.equal(report.passed, false);
    assert.equal(report.severity, "critical");
    assert.equal(report.horizontalOverflowPx, 52);
    assert.equal(report.containerOverflowRightPx, 52);
    assert.equal(report.offendingElements.length, 1);
  });

  it("ignores children legitimately contained inside an explicit horizontal scroller", () => {
    const report = evaluateMobileViewportFit({
      route: "/productivity/unit-converter",
      stage: "idle",
      viewportWidth: 360,
      documentScrollWidth: 360,
      bodyScrollWidth: 360,
      elements: [
        {
          tag: "table",
          left: 16,
          right: 520,
          width: 504,
          height: 200,
          insideHorizontalScroller: true,
        },
      ],
    });

    assert.equal(report.passed, true);
    assert.equal(report.offendingElements.length, 0);
  });
});

describe("computeResponsiveBoardSize", () => {
  it("clamps board sizes to fit inside every standard mobile audit viewport", () => {
    for (const vp of MOBILE_AUDIT_VIEWPORTS) {
      const size = computeResponsiveBoardSize(vp.width, 16, 378);
      assert.ok(size <= vp.width - 32, `Expected ${size} <= ${vp.width - 32} on ${vp.label}`);
      assert.ok(size >= 220, `Expected ${size} >= 220 on ${vp.label}`);
    }
  });
});

describe("detectUnsafeMobileMinWidthClasses", () => {
  it("detects unprefixed min-w-[>=320px] classes while allowing responsive prefixes", () => {
    assert.deepEqual(
      detectUnsafeMobileMinWidthClasses('<div className="min-w-[380px] sm:min-w-[420px]"></div>'),
      ["min-w-[380px]"]
    );
    assert.deepEqual(
      detectUnsafeMobileMinWidthClasses('<div className="w-full sm:min-w-[420px] min-w-[200px]"></div>'),
      []
    );
  });
});

describe("mobile layout & hero guardrails", () => {
  it("keeps the 3D Gyro-Chronometer removed from HeroSection", () => {
    const heroSource = fs.readFileSync(path.join(ROOT, "app/HeroSection.tsx"), "utf8");
    assert.equal(heroSource.includes("HeroCognitiveScene"), false);
    assert.equal(/Gyro-Chronometer/i.test(heroSource), false);
    assert.ok(heroSource.includes('data-testid="hero-quick-reaction-pad"'));
  });

  it("ensures audited game shells and boards maintain responsive mobile containment", () => {
    const checks: Array<{ file: string; mustContain: string[] }> = [
      {
        file: "components/puzzles/games/ZipGame.tsx",
        mustContain: ["w-full aspect-square", "minmax(0, 1fr)"],
      },
      {
        file: "components/puzzles/games/PinpointGame.tsx",
        mustContain: ["min-w-0 w-full", "flex-wrap"],
      },
      {
        file: "components/puzzles/games/MiniSudokuGame.tsx",
        mustContain: ["w-full max-w-[336px] aspect-square grid grid-cols-6"],
      },
      {
        file: "app/classics/tetris/TetrisGame.tsx",
        mustContain: ["w-full max-w-[264px]", "w-full h-auto"],
      },
      {
        file: "app/productivity/graphing-calculator/GraphingCalculatorTool.tsx",
        mustContain: ["flex-wrap items-center justify-between gap-2"],
      },
      {
        file: "app/productivity/gpa-calculator/GpaCalculatorTool.tsx",
        mustContain: ["grid-cols-6 sm:grid-cols-12"],
      },
      {
        file: "components/FlagshipPageFrame.tsx",
        mustContain: ["flex-wrap items-center justify-between"],
      },
      {
        file: "components/dashboard/GameDashboardLayout.tsx",
        mustContain: ["game-arena flex flex-col gap-4 w-full min-w-0 max-w-full"],
      },
    ];

    for (const check of checks) {
      const content = fs.readFileSync(path.join(ROOT, check.file), "utf8");
      assert.deepEqual(
        detectUnsafeMobileMinWidthClasses(content),
        [],
        `Unsafe mobile min-w class found in ${check.file}`
      );
      for (const snippet of check.mustContain) {
        assert.ok(
          content.includes(snippet),
          `Expected ${check.file} to contain "${snippet}"`
        );
      }
    }
  });
});
