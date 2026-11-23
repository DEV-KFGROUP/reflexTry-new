export interface ViewportSpec {
  label: string;
  width: number;
  height: number;
}

export const MOBILE_AUDIT_VIEWPORTS: readonly ViewportSpec[] = [
  { label: "Small Mobile", width: 320, height: 568 },
  { label: "Compact Android", width: 360, height: 740 },
  { label: "Standard Mobile", width: 390, height: 844 },
] as const;

export interface ElementRect {
  tag: string;
  left: number;
  right: number;
  top?: number;
  bottom?: number;
  width: number;
  height: number;
  className?: string;
  id?: string;
  insideHorizontalScroller?: boolean;
}

export interface DocumentViewportMetrics {
  route: string;
  stage: "idle" | "playing" | "result";
  viewportWidth: number;
  documentScrollWidth: number;
  bodyScrollWidth: number;
  gameContainerRect?: ElementRect | null;
  elements: ElementRect[];
}

export interface OffendingElement {
  tag: string;
  className: string;
  overflowLeftPx: number;
  overflowRightPx: number;
  width: number;
}

export type OverflowSeverity = "none" | "minor" | "major" | "critical";

export interface MobileOverflowReport {
  route: string;
  stage: "idle" | "playing" | "result";
  viewportWidth: number;
  passed: boolean;
  horizontalOverflowPx: number;
  containerOverflowLeftPx: number;
  containerOverflowRightPx: number;
  offendingElements: OffendingElement[];
  severity: OverflowSeverity;
}

/**
 * Evaluates whether a rendered page and its primary game container remain
 * strictly inside the mobile viewport without horizontal overflow.
 */
export function evaluateMobileViewportFit(
  metrics: DocumentViewportMetrics,
  tolerancePx = 2
): MobileOverflowReport {
  const vw = Math.max(1, metrics.viewportWidth);
  const rawDocOverflow = Math.max(metrics.documentScrollWidth, metrics.bodyScrollWidth) - vw;
  const horizontalOverflowPx = rawDocOverflow > tolerancePx ? Math.ceil(rawDocOverflow) : 0;

  let containerOverflowLeftPx = 0;
  let containerOverflowRightPx = 0;

  if (metrics.gameContainerRect && metrics.gameContainerRect.width > 0) {
    const leftDelta = -metrics.gameContainerRect.left;
    const rightDelta = metrics.gameContainerRect.right - vw;
    if (leftDelta > tolerancePx) containerOverflowLeftPx = Math.ceil(leftDelta);
    if (rightDelta > tolerancePx) containerOverflowRightPx = Math.ceil(rightDelta);
  }

  const offendingElements: OffendingElement[] = [];
  for (const el of metrics.elements) {
    if (el.insideHorizontalScroller) continue;
    if (el.width <= 0 || el.height <= 0) continue;

    const overflowLeftPx = -el.left > tolerancePx ? Math.ceil(-el.left) : 0;
    const overflowRightPx = el.right - vw > tolerancePx ? Math.ceil(el.right - vw) : 0;

    if (overflowLeftPx > 0 || overflowRightPx > 0) {
      offendingElements.push({
        tag: el.tag,
        className: (el.className ?? "").slice(0, 80),
        overflowLeftPx,
        overflowRightPx,
        width: Math.round(el.width),
      });
    }
  }

  const maxElementOverflow = offendingElements.reduce(
    (max, item) => Math.max(max, item.overflowLeftPx, item.overflowRightPx),
    0
  );
  const worstOverflow = Math.max(
    horizontalOverflowPx,
    containerOverflowLeftPx,
    containerOverflowRightPx,
    maxElementOverflow
  );

  let severity: OverflowSeverity = "none";
  if (worstOverflow > 48) {
    severity = "critical";
  } else if (worstOverflow > 16) {
    severity = "major";
  } else if (worstOverflow > 0) {
    severity = "minor";
  }

  const passed =
    horizontalOverflowPx === 0 &&
    containerOverflowLeftPx === 0 &&
    containerOverflowRightPx === 0 &&
    offendingElements.length === 0;

  return {
    route: metrics.route,
    stage: metrics.stage,
    viewportWidth: vw,
    passed,
    horizontalOverflowPx,
    containerOverflowLeftPx,
    containerOverflowRightPx,
    offendingElements,
    severity,
  };
}

/**
 * Computes a clamped responsive pixel dimension for square game boards or canvases
 * so they never exceed the available mobile viewport width.
 */
export function computeResponsiveBoardSize(
  viewportWidth: number,
  horizontalPaddingPx: number,
  maxBoardPx: number,
  minBoardPx = 220
): number {
  const available = Math.max(0, Math.floor(viewportWidth - horizontalPaddingPx * 2));
  if (available <= 0) return 0;
  const boundedMin = Math.min(minBoardPx, available);
  return Math.max(boundedMin, Math.min(maxBoardPx, available));
}

/**
 * Flags unprefixed fixed Tailwind minimum widths >= 320px (e.g. `min-w-[360px]`)
 * that will unconditionally force horizontal overflow on narrow mobile screens.
 */
export function detectUnsafeMobileMinWidthClasses(sourceCode: string): string[] {
  const findings: string[] = [];
  const regex = /(?:^|[\s"'`])(min-w-\[(\d+)px\])/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(sourceCode)) !== null) {
    const token = match[1];
    const px = Number(match[2]);
    if (px >= 320) {
      findings.push(token);
    }
  }
  return findings;
}
