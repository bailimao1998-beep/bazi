export function createTenGodStateSnapshot(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return null;
  }

  return {
    name: String(state.name ?? ""),
    strengthLevel: state.strengthLevel || "unknown",
    usableLevel: state.usableLevel || "unknown",
    weightedCount: finiteNumber(state.weightedCount),

    visibleCount: finiteNumber(state.visibleCount),
    hiddenCount: finiteNumber(state.hiddenCount),
    mainQiCount: finiteNumber(state.mainQiCount),

    visiblePositions: unique(state.visiblePositions),
    hiddenPositions: unique(state.hiddenPositions),
    mainQiPositions: unique(state.mainQiPositions),

    hasRoot: Boolean(state.hasRoot),
    isVisible: Boolean(state.isVisible),
    isHiddenOnly: Boolean(state.isHiddenOnly),
    isFloating: Boolean(state.isFloating),
    isBlocked: Boolean(state.isBlocked),

    relationIds: unique([
      ...(state.relationIds ?? []),
      ...(state.relatedRelations ?? []).map((relation) => relation?.id),
    ]),
    controlledBy: unique(state.controlledBy),
    combinedBy: unique(state.combinedBy),
    clashedBy: unique(state.clashedBy),
    punishedBy: unique(state.punishedBy),
    harmedBy: unique(state.harmedBy),
    brokenBy: unique(state.brokenBy),

    evidence: sanitizeEvidence(state.evidence),
    warnings: unique(state.warnings),
  };
}

function finiteNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number * 100) / 100;
}

function unique(items = []) {
  return [...new Set((Array.isArray(items) ? items : [])
    .filter((item) => item !== undefined && item !== null && item !== ""))];
}

function sanitizeEvidence(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) => sanitizeValue(item))
    .filter((item) => item !== null);
}

function sanitizeValue(value) {
  if (value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item))
      .filter((item) => item !== null);
  }
  if (value && typeof value === "object") {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "raw" || key === "relatedRelations") continue;
      const sanitized = sanitizeValue(item);
      if (sanitized !== null) result[key] = sanitized;
    }
    return result;
  }
  return value;
}
