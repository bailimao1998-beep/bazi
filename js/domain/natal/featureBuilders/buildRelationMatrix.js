import { stemElements } from "../../bazi/fiveElements.js";

const pillarOrder = ["year", "month", "day", "hour"];
const pillarLabelToKey = {
  年: "year",
  年柱: "year",
  year: "year",
  月: "month",
  月柱: "month",
  month: "month",
  日: "day",
  日柱: "day",
  day: "day",
  时: "hour",
  時: "hour",
  时柱: "hour",
  時柱: "hour",
  hour: "hour",
};
const controls = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };

export function buildRelationMatrix({
  relations,
  pillars,
} = {}) {
  const items = [];
  const seen = new Set();

  for (const raw of Array.isArray(relations) ? relations : []) {
    const item = normalizeRelation(raw, pillars ?? {});
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }

  return buildIndexes(items);
}

function normalizeRelation(raw = {}, pillars = {}) {
  const text = compact([raw.type, raw.name, raw.evidence, raw.effect, raw.description]).join(" ");
  const relationType = normalizeRelationType(raw.type ?? raw.name ?? text);
  const layer = normalizeLayer(relationType, raw.type ?? raw.name ?? text);
  const rawPillars = normalizePillarRefs(raw.pillars, raw, pillars, text);
  const values = normalizeRelationValues(raw, rawPillars, layer, pillars);
  const participants = normalizeParticipants(raw, rawPillars, values, layer);
  const left = participants[0] ?? normalizeSide("unknown", layer, "");
  const right = participants[1] ?? normalizeSide("unknown", layer, "");
  const warnings = [];

  if (relationType === "unknown") warnings.push("relation type could not be identified");
  if (left.pillar === "unknown" || right.pillar === "unknown") warnings.push("relation pillars could not be identified");

  const direction = relationType === "stem_control"
    ? resolveStemControlDirection(participants, warnings)
    : null;
  addUnmodeledRelationWarnings(relationType, text, warnings);

  const affects = {
    dayStem: affectsPosition(participants, "day", "stem", relationType),
    dayBranch: affectsPosition(participants, "day", "branch", relationType),
    monthStem: affectsPosition(participants, "month", "stem", relationType),
    monthBranch: affectsPosition(participants, "month", "branch", relationType),
    spousePalace: affectsPosition(participants, "day", "branch", relationType),
  };

  const confidence = normalizeConfidence(
    raw.confidence,
    {
      relationType,
      participants,
      direction,
    },
    warnings,
  );

  return {
    id: buildRelationId(left, right, relationType, raw),
    relationType,
    layer,
    left,
    right,
    participants,
    members: participants.map((item) => ({ ...item })),
    affects,
    direction,
    formation: normalizeFormation(raw.formation, relationType),
    canTransform: Boolean(raw.canTransform),
    transformed: raw.transformed === true || raw.isTransformed === true,
    confidence,
    evidence: compact([raw.evidence, raw.effect, raw.description]).map(String),
    warnings,
    raw,
  };
}

function normalizeRelationType(value = "") {
  const text = String(value);
  if (/天干.*合|天干五合|五合/.test(text)) return "stem_combine";
  if (/天干.*冲|天干相冲/.test(text)) return "stem_clash";
  if (/天干.*克|天克/.test(text)) return "stem_control";
  if (/地支.*六合|六合/.test(text)) return "branch_combine";
  if (/地支.*六冲|六冲|相冲|冲/.test(text)) return "branch_clash";
  if (/自刑/.test(text)) return "branch_self_punish";
  if (/三刑|刑/.test(text)) return "branch_punish";
  if (/六害|穿|害/.test(text)) return "branch_harm";
  if (/六破|破/.test(text)) return "branch_break";
  if (/三合/.test(text)) return "three_harmony";
  if (/三会/.test(text)) return "three_meeting";
  if (/半合/.test(text)) return "half_harmony";
  if (/拱合|拱/.test(text)) return "arch_harmony";
  if (/伏吟|反吟|重复/.test(text)) return "repetition";
  return "unknown";
}

function normalizeLayer(relationType, text = "") {
  if (relationType.startsWith("stem_") || /天干/.test(text)) return "stem";
  if (relationType.startsWith("branch_") || /地支|三合|三会|半合|拱合/.test(text)) return "branch";
  if (relationType === "repetition") return "pillar";
  return "unknown";
}

function normalizePillarRefs(input, raw, pillars, text) {
  const explicit = toArray(input).map(normalizePillarKey).filter((item) => item !== "unknown");
  if (explicit.length >= 2) return explicit;

  const fromGanzhi = toArray(raw.ganzhi)
    .map((label) => findPillarByGanzhi(label, pillars))
    .filter((item) => item !== "unknown");
  if (fromGanzhi.length >= 2) return fromGanzhi;

  const parsed = [...String(text).matchAll(/([年月日时時])柱/g)]
    .map((match) => normalizePillarKey(`${match[1]}柱`))
    .filter((item) => item !== "unknown");
  if (parsed.length >= 2) return parsed;

  return ["unknown", "unknown"];
}

function normalizeRelationValues(raw, rawPillars, layer, pillars) {
  const ganzhi = toArray(raw.ganzhi);
  if (ganzhi.length >= 2) {
    return ganzhi.map((item) => valueFromGanzhi(item, layer));
  }

  const byPillar = rawPillars.map((key) => valueFromPillar(pillars[key], layer));
  if (byPillar.every(Boolean)) return byPillar;

  const members = toArray(raw.branches).length ? toArray(raw.branches) : toArray(raw.members);
  return members.length ? members : ["", ""];
}

function normalizeSide(pillar, layer, value) {
  return {
    pillar: normalizePillarKey(pillar),
    position: layer === "stem" ? "stem" : layer === "branch" ? "branch" : layer === "pillar" ? "pillar" : "unknown",
    value: String(value ?? ""),
  };
}

function normalizeParticipants(raw, rawPillars, values, layer) {
  const source = toArray(raw.members).length ? toArray(raw.members) : toArray(raw.branches);
  const size = Math.max(rawPillars.length, values.length, source.length, 2);
  return Array.from({ length: size }, (_, index) =>
    normalizeSide(rawPillars[index], layer, values[index] ?? source[index] ?? ""),
  );
}

function affectsPosition(sides, pillar, position, relationType) {
  return sides.some((side) =>
    side.pillar === pillar &&
    (
      side.position === position ||
      (
        relationType === "repetition" &&
        side.position === "pillar"
      )
    ),
  );
}

function normalizeConfidence(requestedConfidence, {
  relationType,
  participants,
  direction,
} = {}, warnings = []) {
  const hasUnknownParticipant = (participants ?? []).some((item) =>
    item.pillar === "unknown" ||
    item.position === "unknown",
  );
  const unresolvedControl = relationType === "stem_control" && !direction;

  if (
    relationType === "unknown" ||
    hasUnknownParticipant ||
    unresolvedControl
  ) {
    return "low";
  }

  if (["high", "medium", "low"].includes(requestedConfidence)) return requestedConfidence;
  return warnings.length ? "low" : "medium";
}

function addUnmodeledRelationWarnings(relationType, text, warnings) {
  if (
    relationType === "unknown" &&
    /地支.*克|地支相克|[子丑寅卯辰巳午未申酉戌亥].*克/.test(String(text))
  ) {
    warnings.push("branch control relation is not modeled in natal-feature-v2 phase 1");
  }
}

function resolveStemControlDirection(participants, warnings) {
  const stems = participants.filter((item) => item.position === "stem" && item.value);
  if (stems.length < 2) {
    warnings.push("stem control direction could not be determined");
    return null;
  }

  const [left, right] = stems;
  const leftElement = stemElements[left.value];
  const rightElement = stemElements[right.value];
  if (leftElement && rightElement && controls[leftElement] === rightElement) {
    return {
      controller: { ...left },
      controlled: { ...right },
    };
  }
  if (leftElement && rightElement && controls[rightElement] === leftElement) {
    return {
      controller: { ...right },
      controlled: { ...left },
    };
  }

  warnings.push("stem control direction could not be determined");
  return null;
}

function normalizeFormation(value, relationType) {
  if (["direct", "partial", "candidate", "unknown"].includes(value)) return value;
  if (relationType === "unknown") return "unknown";
  if (/harmony|meeting/.test(relationType)) return "candidate";
  return "direct";
}

function buildIndexes(items) {
  const matrix = {
    items,
    byPillarPair: {},
    byRelationType: {},
    dayStemRelations: [],
    dayBranchRelations: [],
    monthStemRelations: [],
    monthBranchRelations: [],
  };

  for (const item of items) {
    addUnique(matrix.byRelationType, item.relationType, item);

    for (const pairKey of pillarPairKeys(item.participants)) {
      addUnique(matrix.byPillarPair, pairKey, item);
    }

    if (item.affects.dayStem) addUniqueArray(matrix.dayStemRelations, item);
    if (item.affects.dayBranch) addUniqueArray(matrix.dayBranchRelations, item);
    if (item.affects.monthStem) addUniqueArray(matrix.monthStemRelations, item);
    if (item.affects.monthBranch) addUniqueArray(matrix.monthBranchRelations, item);
  }

  return matrix;
}

function buildRelationId(left, right, relationType, raw) {
  const leftKey = `${left.pillar}-${left.position}`;
  const rightKey = `${right.pillar}-${right.position}`;
  const values = compact(toArray(raw.ganzhi).length ? raw.ganzhi : raw.members ?? [left.value, right.value]).join("-");
  const fallback = compact([raw.type, raw.name, raw.evidence]).join("-") || "relation";
  return `${leftKey}_${rightKey}_${relationType}_${values || slug(fallback)}`;
}

function pillarPairKeys(participants = []) {
  const keys = unique(participants.map((item) => item.pillar).filter((key) => pillarOrder.includes(key)));
  const result = [];
  for (let leftIndex = 0; leftIndex < keys.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < keys.length; rightIndex += 1) {
      const key = pillarPairKey(keys[leftIndex], keys[rightIndex]);
      if (key && !result.includes(key)) result.push(key);
    }
  }
  return result;
}

function pillarPairKey(left, right) {
  if (!pillarOrder.includes(left) || !pillarOrder.includes(right)) return "";
  const sorted = [left, right].sort((a, b) => pillarOrder.indexOf(a) - pillarOrder.indexOf(b));
  return `${sorted[0]}-${sorted[1]}`;
}

function addUnique(index, key, item) {
  if (!index[key]) index[key] = [];
  addUniqueArray(index[key], item);
}

function addUniqueArray(array, item) {
  if (!array.some((entry) => entry.id === item.id)) array.push(item);
}

function normalizePillarKey(value) {
  return pillarLabelToKey[String(value ?? "").trim()] ?? "unknown";
}

function findPillarByGanzhi(label, pillars = {}) {
  const text = String(label ?? "");
  const match = Object.entries(pillars).find(([, pillar]) => {
    const pillarLabel = pillar?.label || `${pillar?.stem ?? ""}${pillar?.branch ?? ""}`;
    return pillarLabel === text;
  });
  return match?.[0] ?? "unknown";
}

function valueFromGanzhi(value, layer) {
  const text = String(value ?? "");
  if (layer === "stem") return text[0] ?? "";
  if (layer === "branch") return text[1] ?? text[0] ?? "";
  return text;
}

function valueFromPillar(pillar, layer) {
  if (layer === "stem") return pillar?.stem ?? "";
  if (layer === "branch") return pillar?.branch ?? "";
  return pillar?.label ?? "";
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function compact(items = []) {
  return (Array.isArray(items) ? items.flat(Infinity) : [items])
    .filter((item) => item !== undefined && item !== null && String(item).trim() !== "");
}

function unique(items = []) {
  return [...new Set(items)];
}

function slug(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .slice(0, 48) || "unknown";
}
