import {
  CLIMATE_ADJUSTMENT_CANDIDATES,
  ELEMENT_CLIMATE_CONTRIBUTIONS,
  ELEMENT_KEYS,
  ELEMENT_LABELS,
  MONTH_CLIMATE_BASE,
  PASS_THROUGH_CANDIDATES,
} from "../config/climateAndWorkConfig.js";

export function buildClimateProfile({
  pillars,
  elements,
  structure,
} = {}) {
  const monthBranch = pillars?.month?.branch ?? structure?.monthCommand?.branch ?? "";
  const monthBase = MONTH_CLIMATE_BASE[monthBranch] ?? null;
  const elementCounts = normalizeElementCounts(elements?.counts ?? elements ?? {});
  const warnings = [];

  if (!monthBranch) warnings.push("month branch is unavailable; climate profile is incomplete");
  if (!monthBase) warnings.push("month climate base could not be resolved");

  const scores = {
    cold: finite(monthBase?.cold),
    warm: finite(monthBase?.warm),
    dry: finite(monthBase?.dry),
    wet: finite(monthBase?.wet),
  };

  for (const element of ELEMENT_KEYS) {
    const count = elementCounts[element];
    const contribution = ELEMENT_CLIMATE_CONTRIBUTIONS[element];
    for (const axis of ["cold", "warm", "dry", "wet"]) {
      scores[axis] += count * finite(contribution?.[axis]);
    }
  }

  const temperature = resolveAxis(scores.warm, scores.cold, "warm", "cold");
  const moisture = resolveAxis(scores.wet, scores.dry, "wet", "dry");
  const priorityNeeds = buildPriorityNeeds(temperature, moisture);
  const candidateElements = unique(priorityNeeds.flatMap((item) => item.candidateElements));
  const existingSupport = candidateElements.filter((element) => elementCounts[element] > 0);
  const missingSupport = candidateElements.filter((element) => elementCounts[element] <= 0);
  const passThroughCandidates = buildPassThroughCandidates(elementCounts);

  return {
    version: "climate-profile-v1",
    monthBranch,
    season: monthBase?.season ?? structure?.monthCommand?.season ?? "unknown",
    seasonLabel: monthBase?.seasonLabel ?? structure?.monthCommand?.seasonLabel ?? "",
    baseClimate: monthBase
      ? {
          cold: monthBase.cold,
          warm: monthBase.warm,
          dry: monthBase.dry,
          wet: monthBase.wet,
        }
      : { cold: 0, warm: 0, dry: 0, wet: 0 },
    scores: roundObject(scores),
    tendencies: {
      temperature: temperature.tendency,
      moisture: moisture.tendency,
    },
    severity: {
      temperature: temperature.severity,
      moisture: moisture.severity,
    },
    elementAvailability: Object.fromEntries(ELEMENT_KEYS.map((element) => [element, {
      element,
      label: ELEMENT_LABELS[element],
      count: round(elementCounts[element]),
      present: elementCounts[element] > 0,
    }])),
    priorityNeeds,
    candidateElements,
    existingSupport,
    missingSupport,
    passThroughCandidates,
    legacyHint: normalizeLegacyHint(structure?.climate),
    confidence: monthBase ? "medium" : "low",
    evidence: buildEvidence({ monthBranch, monthBase, scores, temperature, moisture, elementCounts }),
    warnings,
  };
}

function buildPriorityNeeds(temperature, moisture) {
  const needs = [];

  if (temperature.tendency === "cold") {
    needs.push(makeNeed("temperature", "warming", temperature.severity));
  }
  if (temperature.tendency === "warm") {
    needs.push(makeNeed("temperature", "cooling", temperature.severity));
  }
  if (moisture.tendency === "dry") {
    needs.push(makeNeed("moisture", "moistening", moisture.severity));
  }
  if (moisture.tendency === "wet") {
    needs.push(makeNeed("moisture", "drying", moisture.severity));
  }

  return needs;
}

function makeNeed(axis, need, severity) {
  return {
    axis,
    need,
    priority: severity === "strong" ? "high" : severity === "moderate" ? "medium" : "low",
    candidateElements: [...(CLIMATE_ADJUSTMENT_CANDIDATES[need] ?? [])],
  };
}

function buildPassThroughCandidates(elementCounts) {
  return PASS_THROUGH_CANDIDATES
    .filter((item) => item.conflictElements.every((element) => elementCounts[element] > 0))
    .map((item) => ({
      conflictElements: [...item.conflictElements],
      mediatorElement: item.mediatorElement,
      mediatorPresent: elementCounts[item.mediatorElement] > 0,
      label: item.label,
      status: elementCounts[item.mediatorElement] > 0 ? "available" : "missing",
    }));
}

function resolveAxis(positiveScore, negativeScore, positiveLabel, negativeLabel) {
  const delta = finite(positiveScore) - finite(negativeScore);
  const total = finite(positiveScore) + finite(negativeScore);

  if (total >= 6 && Math.abs(delta) < 1) {
    return { tendency: "mixed", severity: "moderate", delta: round(delta) };
  }
  if (delta >= 2) {
    return { tendency: positiveLabel, severity: severityForDelta(delta), delta: round(delta) };
  }
  if (delta <= -2) {
    return { tendency: negativeLabel, severity: severityForDelta(delta), delta: round(delta) };
  }
  return { tendency: "balanced", severity: Math.abs(delta) >= 1 ? "mild" : "balanced", delta: round(delta) };
}

function severityForDelta(delta) {
  const value = Math.abs(delta);
  if (value >= 4) return "strong";
  if (value >= 2) return "moderate";
  return "mild";
}

function normalizeElementCounts(source) {
  return Object.fromEntries(ELEMENT_KEYS.map((element) => [
    element,
    Math.max(0, finite(source?.[element])),
  ]));
}

function normalizeLegacyHint(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return {
    coldWarm: value.coldWarm ?? "",
    dryWet: value.dryWet ?? "",
    adjustmentHint: value.adjustmentHint ?? "",
    reasons: Array.isArray(value.reasons) ? [...value.reasons] : [],
  };
}

function buildEvidence({ monthBranch, monthBase, scores, temperature, moisture, elementCounts }) {
  const evidence = [];
  if (monthBase) {
    evidence.push({
      type: "month_climate",
      position: "month.branch",
      text: `月支${monthBranch}提供${monthBase.seasonLabel}基础气候参考`,
    });
  }
  evidence.push({
    type: "element_climate_counts",
    position: "elements.counts",
    text: `五行计数：${ELEMENT_KEYS.map((element) => `${ELEMENT_LABELS[element]}${round(elementCounts[element])}`).join("、")}`,
  });
  evidence.push({
    type: "climate_axis",
    position: "climateProfile.scores",
    text: `温度倾向${temperature.tendency}，湿度倾向${moisture.tendency}；寒暖燥湿分值为${JSON.stringify(roundObject(scores))}`,
  });
  return evidence;
}

function roundObject(value) {
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, round(item)]));
}

function round(value) {
  return Math.round((finite(value) + Number.EPSILON) * 100) / 100;
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function unique(items = []) {
  return [...new Set(items.filter(Boolean))];
}
