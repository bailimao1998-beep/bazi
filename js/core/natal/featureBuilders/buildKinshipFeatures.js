import {
  KINSHIP_MAPPING_VERSION,
  resolveKinshipMapping,
} from "../config/kinshipMapping.js";

const kinshipLabels = {
  father: "父亲",
  mother: "母亲",
  siblings: "兄弟姐妹",
  spouse: "配偶",
  children: "子女",
};

const kinshipKeys = [
  "father",
  "mother",
  "siblings",
  "spouse",
  "children",
];

export function buildKinshipFeatures({
  gender,
  tenGodStates,
  palaceFeatures,
  relationMatrix,
  mapping,
} = {}) {
  const resolvedMapping = resolveKinshipMapping(gender, mapping);
  const warnings = [...(resolvedMapping.warnings ?? [])];

  return {
    mappingVersion:
      resolvedMapping.version ||
      KINSHIP_MAPPING_VERSION,

    mappingId:
      resolvedMapping.id ||
      "",

    gender:
      resolvedMapping.gender ||
      "unknown",

    father: buildKinshipProfile("father", resolvedMapping, tenGodStates, palaceFeatures),
    mother: buildKinshipProfile("mother", resolvedMapping, tenGodStates, palaceFeatures),
    siblings: buildKinshipProfile("siblings", resolvedMapping, tenGodStates, palaceFeatures),
    spouse: buildKinshipProfile("spouse", resolvedMapping, tenGodStates, palaceFeatures),
    children: buildKinshipProfile("children", resolvedMapping, tenGodStates, palaceFeatures),

    warnings,
  };
}

function buildKinshipProfile(
  key,
  mapping,
  tenGodStates = {},
  palaceFeatures = {},
) {
  const role = mapping.roles?.[key];
  const candidates = mapping.candidateRoles?.[key] ?? [];
  const mappingStatus = role
    ? "resolved"
    : candidates.length
      ? "gender_required"
      : "unknown";
  const primaryTenGods = role?.primaryTenGods ?? [];
  const secondaryTenGods = role?.secondaryTenGods ?? [];
  const palaceRefs = role?.palaceRefs ?? union(candidates.flatMap((item) => item.palaceRefs ?? []));
  const candidateMappings = candidates.map((item) => ({
    gender: item.gender,
    primaryTenGods: item.primaryTenGods ?? [],
    secondaryTenGods: item.secondaryTenGods ?? [],
    palaceRefs: item.palaceRefs ?? [],
  }));
  const tenGodNames = unique([
    ...primaryTenGods,
    ...secondaryTenGods,
  ]);

  const profile = {
    key,
    label: kinshipLabels[key] ?? "",

    mappingStatus,

    primaryTenGods,
    secondaryTenGods,
    candidateMappings,

    palaceRefs,

    starProfile: buildStarProfile(tenGodNames, tenGodStates),
    palaceProfile: buildPalaceProfile(palaceRefs, palaceFeatures),

    evidence: [],
    warnings: [],
  };

  profile.evidence = [
    ...profile.starProfile.evidence,
    ...profile.palaceProfile.evidence,
  ];

  if (mappingStatus === "gender_required") {
    profile.warnings.push("gender is required to resolve this kinship mapping");
  }
  if (mappingStatus === "unknown") {
    profile.warnings.push("kinship mapping is unavailable");
  }

  return profile;
}

function buildStarProfile(tenGodNames, tenGodStates = {}) {
  const states = tenGodNames
    .map((name) => tenGodStates?.[name])
    .filter(Boolean);
  const weightedCount = round(
    states.reduce((sum, state) => {
      const value = Number(state.weightedCount);
      return Number.isFinite(value) ? sum + value : sum;
    }, 0),
  );

  return {
    tenGods: tenGodNames,
    states,
    visiblePositions: unique(states.flatMap((state) => state.visiblePositions ?? [])),
    hiddenPositions: unique(states.flatMap((state) => state.hiddenPositions ?? [])),
    mainQiPositions: unique(states.flatMap((state) => state.mainQiPositions ?? [])),
    weightedCount,
    strengthLevels: unique(states.map((state) => state.strengthLevel).filter(Boolean)),
    relationIds: unique(states.flatMap((state) =>
      (state.relatedRelations ?? []).map((relation) => relation.id),
    )),
    evidence: states.flatMap((state) =>
      (state.evidence ?? []).map((item) => ({
        ...item,
        tenGod: state.name,
      })),
    ),
  };
}

function buildPalaceProfile(palaceRefs, palaceFeatures = {}) {
  const palaces = palaceRefs
    .map((ref) => palaceFeatures?.[ref])
    .filter(Boolean);

  return {
    refs: palaceRefs,
    relationIds: unique(palaces.flatMap((palace) => palace.relationIds ?? [])),
    relationTypes: unique(palaces.flatMap((palace) =>
      palace.relationTypes ??
      relationTypesFromSummary(palace.relationSummary),
    )),
    evidence: uniqueEvidence(palaces.flatMap((palace) => palace.evidence ?? [])),
  };
}

function relationTypesFromSummary(summary = {}) {
  const types = [];
  if (summary.combineCount > 0) types.push("combine");
  if (summary.clashCount > 0) types.push("clash");
  if (summary.punishCount > 0) types.push("punish");
  if (summary.harmCount > 0) types.push("harm");
  if (summary.breakCount > 0) types.push("break");
  if (summary.controlCount > 0) types.push("control");
  if (summary.repetitionCount > 0) types.push("repetition");
  if (summary.harmonyCount > 0) types.push("harmony");
  return types;
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && item !== ""))];
}

function union(items = []) {
  return unique(items);
}

function uniqueEvidence(items = []) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = JSON.stringify(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function round(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number * 100) / 100;
}
