export const MIN_TOUCH_TARGET_PX = 44;
export const MIN_PRIMARY_CTA_PX = 48;
export const MIN_GAME_PAD_PX = 52;

export interface TouchMeasurement {
  label: string;
  width: number;
  height: number;
  role?: "nav" | "cta" | "game-pad" | "control" | "target-dot";
  exempt?: boolean;
}

export interface TouchAuditViolation {
  label: string;
  width: number;
  height: number;
  requiredPx: number;
  reason: string;
}

export interface TouchAuditSummary {
  totalChecked: number;
  exemptCount: number;
  passed: boolean;
  violations: TouchAuditViolation[];
}

export function requiredTouchSizeForRole(role: TouchMeasurement["role"] = "control"): number {
  switch (role) {
    case "cta":
      return MIN_PRIMARY_CTA_PX;
    case "game-pad":
      return MIN_GAME_PAD_PX;
    case "nav":
    case "control":
    default:
      return MIN_TOUCH_TARGET_PX;
  }
}

export function isTouchTargetCompliant(
  rect: { width: number; height: number },
  minPx: number = MIN_TOUCH_TARGET_PX
): boolean {
  if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height)) {
    return false;
  }
  return rect.width >= minPx && rect.height >= minPx;
}

export function auditTouchMeasurements(elements: TouchMeasurement[]): TouchAuditSummary {
  const violations: TouchAuditViolation[] = [];
  let exemptCount = 0;
  let totalChecked = 0;

  for (const el of elements) {
    if (el.exempt || el.role === "target-dot") {
      exemptCount++;
      continue;
    }

    totalChecked++;
    const requiredPx = requiredTouchSizeForRole(el.role);
    if (!isTouchTargetCompliant(el, requiredPx)) {
      const reasons: string[] = [];
      if (el.width < requiredPx) reasons.push(`width ${Math.round(el.width)}px < ${requiredPx}px`);
      if (el.height < requiredPx) reasons.push(`height ${Math.round(el.height)}px < ${requiredPx}px`);
      violations.push({
        label: el.label,
        width: el.width,
        height: el.height,
        requiredPx,
        reason: reasons.join(", ") || "invalid dimensions",
      });
    }
  }

  return {
    totalChecked,
    exemptCount,
    passed: violations.length === 0,
    violations,
  };
}
