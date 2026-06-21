export const NATAL_FEATURE_VERSION = "natal-feature-v2";

const pillarKeys = ["year", "month", "day", "hour"];
const allowedGenders = new Set(["male", "female", "unknown"]);

export function createEmptyNatalFeatureVector() {
  return {
    featureVersion: NATAL_FEATURE_VERSION,

    meta: {
      gender: "unknown",
      source: "chart",
      warnings: [],
    },

    dayMaster: {
      stem: "",
      label: "",
      element: "",
      strengthLevel: "unknown",
      strengthScore: null,
      inSeason: false,
      rootLevel: "unknown",
    },

    pillars: Object.fromEntries(pillarKeys.map((key) => [key, emptyPillar(key)])),

    tenGods: {
      stemVisibleCounts: {},
      branchMainQiCounts: {},
      hiddenCounts: {},
      hiddenWeightedCounts: {},
      weightedCounts: {},
      visibleCounts: {},
      mainQiCounts: {},
      byPillar: {},
      groupCounts: {},
      dominantGroups: [],
      weakGroups: [],
    },

    tenGodStates: {},

    elements: {
      counts: {},
      ratios: {},
      dominant: [],
      weakest: [],
      biasLevel: "unknown",
      climate: {},
      flowChains: [],
    },

    relations: [],

    relationMatrix: {
      items: [],
      byPillarPair: {},
      byRelationType: {},
      dayStemRelations: [],
      dayBranchRelations: [],
      monthStemRelations: [],
      monthBranchRelations: [],
    },

    structure: {
      monthCommand: {},
      visibleStems: [],
      roots: {},
      usefulGodHint: {},
      climate: {},
    },
  };
}

export function normalizeNatalFeatureVector(input) {
  const base = createEmptyNatalFeatureVector();
  const source = isPlainObject(input) ? input : {};
  const merged = mergeStable(base, source);

  merged.featureVersion = NATAL_FEATURE_VERSION;
  merged.meta = {
    ...base.meta,
    ...(isPlainObject(source.meta) ? source.meta : {}),
    gender: normalizeGender(source.meta?.gender),
    source: source.meta?.source || "chart",
    warnings: Array.isArray(source.meta?.warnings) ? source.meta.warnings : [],
  };

  for (const key of pillarKeys) {
    merged.pillars[key] = mergeStable(emptyPillar(key), source.pillars?.[key] ?? {});
  }

  return sanitizeValue(merged);
}

export function validateNatalFeatureVector(input) {
  const errors = [];
  const warnings = [];

  try {
    const rawNaNPaths = findNonFiniteNumberPaths(input);
    for (const path of rawNaNPaths) {
      errors.push(`NaN or non-finite number at ${path}`);
    }

    const vector = normalizeNatalFeatureVector(input);
    if (vector.featureVersion !== NATAL_FEATURE_VERSION) {
      errors.push("featureVersion mismatch");
    }

    if (!allowedGenders.has(input?.meta?.gender ?? vector.meta.gender)) {
      warnings.push(`unknown gender value: ${String(input?.meta?.gender)}`);
    }

    for (const key of pillarKeys) {
      if (!isPlainObject(vector.pillars?.[key])) {
        errors.push(`missing pillar ${key}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [...warnings, ...vector.meta.warnings],
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error?.message ?? "unknown validation error"],
      warnings,
    };
  }
}

function emptyPillar(key) {
  return {
    key,
    label: "",
    name: "",
    stem: "",
    branch: "",
    stemTenGod: "",
    branchMainTenGod: "",
    hiddenStems: [],
    shensha: [],
  };
}

function normalizeGender(value) {
  return allowedGenders.has(value) ? value : "unknown";
}

function mergeStable(base, input) {
  if (Array.isArray(base)) return Array.isArray(input) ? input : base;
  if (!isPlainObject(base)) return input === undefined ? base : input;

  const result = { ...base };
  const source = isPlainObject(input) ? input : {};
  for (const [key, value] of Object.entries(source)) {
    if (key in base) result[key] = mergeStable(base[key], value);
    else result[key] = value;
  }
  return result;
}

function sanitizeValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]));
  }
  return value;
}

function findNonFiniteNumberPaths(value, path = "input", seen = new WeakSet()) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? [] : [path];
  }
  if (!value || typeof value !== "object") return [];
  if (seen.has(value)) return [];
  seen.add(value);

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findNonFiniteNumberPaths(item, `${path}[${index}]`, seen));
  }

  return Object.entries(value).flatMap(([key, item]) => findNonFiniteNumberPaths(item, `${path}.${key}`, seen));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
