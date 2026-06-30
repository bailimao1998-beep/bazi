import {
  KINSHIP_MAPPING_VERSION,
  resolveKinshipMapping,
} from "../config/kinshipMapping.js";
import { createTenGodStateSnapshot } from "./tenGodStateSnapshot.js";

const kinshipLabels = {
  father: "父亲",
  mother: "母亲",
  siblings: "兄弟姐妹",
  spouse: "配偶",
  children: "子女",
};

export function buildKinshipFeatures({
  gender,
  tenGodStates,
  palaceFeatures,
  relationMatrix,
  mapping,
} = {}) {
  const resolvedMapping = resolveKinshipMapping(gender, mapping);
  const warnings = [...(resolvedMapping.warnings ?? [])];
  const relationTypeById = buildRelationTypeById(relationMatrix?.items);

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

    father: buildKinshipProfile("father", resolvedMapping, tenGodStates, palaceFeatures, relationTypeById),
    mother: buildKinshipProfile("mother", resolvedMapping, tenGodStates, palaceFeatures, relationTypeById),
    siblings: buildKinshipProfile("siblings", resolvedMapping, tenGodStates, palaceFeatures, relationTypeById),
    spouse: buildKinshipProfile("spouse", resolvedMapping, tenGodStates, palaceFeatures, relationTypeById),
    children: buildKinshipProfile("children", resolvedMapping, tenGodStates, palaceFeatures, relationTypeById),

    warnings,
  };
}

function buildKinshipProfile(
  key,
  mapping,
  tenGodStates = {},
  palaceFeatures = {},
  relationTypeById = {},
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
  const candidateStarProfiles = candidates.map((item) => ({
    gender: item.gender,
    primaryTenGods: item.primaryTenGods ?? [],
    secondaryTenGods: item.secondaryTenGods ?? [],
    starProfile: buildStarProfile(
      item.primaryTenGods ?? [],
      item.secondaryTenGods ?? [],
      tenGodStates,
    ),
  }));

  const profile = {
    key,
    label: kinshipLabels[key] ?? "",

    mappingStatus,

    primaryTenGods,
    secondaryTenGods,
    candidateMappings,
    candidateStarProfiles,

    palaceRefs,

    starProfile: buildStarProfile(primaryTenGods, secondaryTenGods, tenGodStates),
    palaceProfile: buildPalaceProfile(palaceRefs, palaceFeatures, relationTypeById),

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

function buildStarProfile(primaryTenGods, secondaryTenGods, tenGodStates = {}) {
  const tenGodNames = unique([
    ...primaryTenGods,
    ...secondaryTenGods,
  ]);
  const primary = buildStarSegment(primaryTenGods, tenGodStates);
  const secondary = buildStarSegment(secondaryTenGods, tenGodStates);
  const states = uniqueSnapshots([
    ...primary.states,
    ...secondary.states,
  ]);
  const weightedCount = round(
    primary.weightedCount +
    secondary.weightedCount,
  );

  return {
    tenGods: tenGodNames,
    states,
    visiblePositions: unique(states.flatMap((state) => state.visiblePositions ?? [])),
    hiddenPositions: unique(states.flatMap((state) => state.hiddenPositions ?? [])),
    mainQiPositions: unique(states.flatMap((state) => state.mainQiPositions ?? [])),
    weightedCount,
    strengthLevels: unique(states.map((state) => state.strengthLevel).filter(Boolean)),
    relationIds: unique(states.flatMap((state) => state.relationIds ?? [])),
    evidence: states.flatMap((state) =>
      state.evidence ?? [],
    ),
    primary,
    secondary,
    weightedByTenGod: Object.fromEntries(
      tenGodNames.map((name) => [
        name,
        finiteWeight(tenGodStates?.[name]?.weightedCount),
      ]),
    ),
  };
}

function buildStarSegment(tenGodNames, tenGodStates = {}) {
  const states = uniqueSnapshots(
    tenGodNames
      .map((name) => createTenGodStateSnapshot(tenGodStates?.[name]))
      .filter(Boolean),
  );
  const weightedCount = round(
    states.reduce((sum, state) => sum + finiteWeight(state.weightedCount), 0),
  );

  return {
    tenGods: unique(tenGodNames),
    states,
    weightedCount,
    visiblePositions: unique(states.flatMap((state) => state.visiblePositions ?? [])),
    hiddenPositions: unique(states.flatMap((state) => state.hiddenPositions ?? [])),
    mainQiPositions: unique(states.flatMap((state) => state.mainQiPositions ?? [])),
    relationIds: unique(states.flatMap((state) => state.relationIds ?? [])),
    evidence: states.flatMap((state) => state.evidence ?? []),
  };
}

function buildPalaceProfile(palaceRefs, palaceFeatures = {}, relationTypeById = {}) {
  const palaces = palaceRefs
    .map((ref) => palaceFeatures?.[ref])
    .filter(Boolean);
  const relationIds = unique(palaces.flatMap((palace) => palace.relationIds ?? []));
  const exactRelationTypes = unique(palaces.flatMap((palace) =>
    Array.isArray(palace.relationTypes)
      ? palace.relationTypes
      : [],
  ));

  return {
    refs: palaceRefs,
    relationIds,
    relationTypes: exactRelationTypes.length
      ? exactRelationTypes
      : unique(relationIds.map((id) => relationTypeById[id])),
    evidence: uniqueEvidence(palaces.flatMap((palace) => palace.evidence ?? [])),
  };
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && item !== ""))];
}

function uniqueSnapshots(items = []) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item?.name || seen.has(item.name)) continue;
    seen.add(item.name);
    result.push(item);
  }
  return result;
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

function finiteWeight(value) {
  const number = Number(value);
  return Number.isFinite(number) ? round(number) : 0;
}

function buildRelationTypeById(items = []) {
  return Object.fromEntries(
    (Array.isArray(items) ? items : [])
      .filter((item) => item?.id)
      .map((item) => [item.id, item.relationType]),
  );
}
