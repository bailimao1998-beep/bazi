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
  const left = normalizeSide(rawPillars[0], layer, values[0]);
  const right = normalizeSide(rawPillars[1], layer, values[1]);
  const warnings = [];

  if (relationType === "unknown") warnings.push("relation type could not be identified");
  if (left.pillar === "unknown" || right.pillar === "unknown") warnings.push("relation pillars could not be identified");

  const affects = {
    dayStem: affectsPosition([left, right], "day", "stem"),
    dayBranch: affectsPosition([left, right], "day", "branch"),
    monthStem: affectsPosition([left, right], "month", "stem"),
    monthBranch: affectsPosition([left, right], "month", "branch"),
    spousePalace: affectsPosition([left, right], "day", "branch"),
  };

  const confidence = normalizeConfidence(raw.confidence, warnings);

  return {
    id: buildRelationId(left, right, relationType, raw),
    relationType,
    layer,
    left,
    right,
    members: normalizeMembers(raw, rawPillars, values, layer),
    affects,
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
  if (/天干.*冲|天干.*克|天克/.test(text)) return "stem_clash";
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
    return ganzhi.slice(0, 2).map((item) => valueFromGanzhi(item, layer));
  }

  const byPillar = rawPillars.slice(0, 2).map((key) => valueFromPillar(pillars[key], layer));
  if (byPillar.every(Boolean)) return byPillar;

  const members = toArray(raw.branches).length ? toArray(raw.branches) : toArray(raw.members);
  return [members[0] ?? "", members[1] ?? ""];
}

function normalizeSide(pillar, layer, value) {
  return {
    pillar: normalizePillarKey(pillar),
    position: layer === "stem" ? "stem" : layer === "branch" ? "branch" : layer === "pillar" ? "pillar" : "unknown",
    value: String(value ?? ""),
  };
}

function normalizeMembers(raw, rawPillars, values, layer) {
  const source = toArray(raw.members).length ? toArray(raw.members) : toArray(raw.branches);
  const alignedValues = rawPillars.length === 2 ? values : source.length ? source : values;
  return alignedValues.map((value, index) => ({
    pillar: normalizePillarKey(rawPillars[index]),
    position: layer === "stem" ? "stem" : layer === "branch" ? "branch" : "unknown",
    value: String(value ?? ""),
  }));
}

function affectsPosition(sides, pillar, position) {
  return sides.some((side) => side.pillar === pillar && side.position === position);
}

function normalizeConfidence(confidence, warnings) {
  if (["high", "medium", "low"].includes(confidence)) return confidence;
  return warnings.length ? "low" : "medium";
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

    const pairKey = pillarPairKey(item.left.pillar, item.right.pillar);
    if (pairKey) addUnique(matrix.byPillarPair, pairKey, item);

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
  const values = compact([left.value, right.value]).join("-");
  const fallback = compact([raw.type, raw.name, raw.evidence]).join("-") || "relation";
  return `${leftKey}_${rightKey}_${relationType}_${values || slug(fallback)}`;
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

function slug(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .slice(0, 48) || "unknown";
}
