export const NATAL_FEATURE_VERSION = "natal-feature-v2";

const pillarKeys = ["year", "month", "day", "hour"];
const allowedGenders = new Set(["male", "female", "unknown"]);

export function createEmptyNatalFeatureVector() {
  return {
    featureVersion: NATAL_FEATURE_VERSION,
    voidFeatures: emptyVoidFeatures(),
    storageFeatures: emptyStorageFeatures(),
    growthStageFeatures: emptyGrowthStageFeatures(),
    climateProfile: emptyClimateProfile(),
    workChains: emptyWorkChains(),
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

    palaceFeatures: {
      year: emptyPalaceFeature("year"),
      month: emptyPalaceFeature("month"),
      day: emptyPalaceFeature("day"),
      hour: emptyPalaceFeature("hour"),
      spousePalace: emptySpousePalaceFeature(),
    },

    kinshipFeatures: {
      mappingVersion: "",
      mappingId: "",
      gender: "unknown",
      father: emptyKinshipFeature("father"),
      mother: emptyKinshipFeature("mother"),
      siblings: emptyKinshipFeature("siblings"),
      spouse: emptyKinshipFeature("spouse"),
      children: emptyKinshipFeature("children"),
      warnings: [],
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
    const rawNaNPaths =
      findNonFiniteNumberPaths(input);

    for (const path of rawNaNPaths) {
      errors.push(
        `NaN or non-finite number at ${path}`,
      );
    }

    const vector =
      normalizeNatalFeatureVector(input);

    if (
      vector.featureVersion !==
      NATAL_FEATURE_VERSION
    ) {
      errors.push(
        "featureVersion mismatch",
      );
    }

    if (
      !allowedGenders.has(
        input?.meta?.gender ??
        vector.meta.gender,
      )
    ) {
      warnings.push(
        `unknown gender value: ${
          String(input?.meta?.gender)
        }`,
      );
    }

    for (const key of pillarKeys) {
      if (
        !isPlainObject(
          vector.pillars?.[key],
        )
      ) {
        errors.push(
          `missing pillar ${key}`,
        );
      }

      if (
        !isPlainObject(
          vector.palaceFeatures?.[key],
        )
      ) {
        errors.push(
          `missing palace feature ${key}`,
        );
      }
    }

    if (
      !isPlainObject(
        vector.palaceFeatures
          ?.spousePalace,
      )
    ) {
      errors.push(
        "missing palace feature spousePalace",
      );
    }

    for (
      const key of [
        "father",
        "mother",
        "siblings",
        "spouse",
        "children",
      ]
    ) {
      if (
        !isPlainObject(
          vector.kinshipFeatures?.[key],
        )
      ) {
        errors.push(
          `missing kinship feature ${key}`,
        );
      }
    }

    if (
      !Array.isArray(
        vector.kinshipFeatures
          ?.warnings,
      )
    ) {
      warnings.push(
        "kinshipFeatures.warnings should be an array",
      );
    }

    for (
      const key of [
        "voidFeatures",
        "storageFeatures",
        "growthStageFeatures",
      ]
    ) {
      if (!isPlainObject(vector[key])) {
        errors.push(`missing feature group ${key}`);
        continue;
      }

      if (!isPlainObject(vector[key]?.byPillar)) {
        errors.push(`${key}.byPillar should be an object`);
      }
    }

    if (!isPlainObject(vector.climateProfile)) {
      errors.push("missing feature group climateProfile");
    } else {
      if (!isPlainObject(vector.climateProfile.scores)) {
        errors.push("climateProfile.scores should be an object");
      }
      if (!Array.isArray(vector.climateProfile.priorityNeeds)) {
        errors.push("climateProfile.priorityNeeds should be an array");
      }
      if (!Array.isArray(vector.climateProfile.passThroughCandidates)) {
        errors.push("climateProfile.passThroughCandidates should be an array");
      }
    }

    if (!isPlainObject(vector.workChains)) {
      errors.push("missing feature group workChains");
    } else {
      for (const key of ["nodes", "edges", "chains"]) {
        if (!Array.isArray(vector.workChains[key])) {
          errors.push(`workChains.${key} should be an array`);
        }
      }
      if (!isPlainObject(vector.workChains.summary)) {
        errors.push("workChains.summary should be an object");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [
        ...warnings,
        ...(vector.meta.warnings ?? []),
      ],
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        error?.message ??
        "unknown validation error",
      ],
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
    nayin: "",
    twelveGrowth: "",
    voidBranches: [],
  };
}

function emptyPalaceFeature(key) {
  return {
    key,
    label: "",
    stem: "",
    branch: "",
    pillarLabel: "",
    stemTenGod: "",
    branchMainTenGod: "",
    hiddenTenGods: [],
    visibleTenGodState: null,
    mainQiTenGodState: null,
    hiddenTenGodStates: [],
    relationIds: [],
    relationTypes: [],
    stemRelationIds: [],
    branchRelationIds: [],
    pillarRelationIds: [],
    relationSummary: {
      combineCount: 0,
      clashCount: 0,
      punishCount: 0,
      harmCount: 0,
      breakCount: 0,
      controlCount: 0,
      repetitionCount: 0,
      harmonyCount: 0,
    },
    isDayPillar: key === "day",
    isMonthCommandPillar: key === "month",
    traditionalThemes: [],
    evidence: [],
    warnings: [],
  };
}

function emptySpousePalaceFeature() {
  return {
    key: "spousePalace",
    label: "夫妻宫",
    pillar: "day",
    position: "branch",
    branch: "",
    mainTenGod: "",
    hiddenTenGods: [],
    mainTenGodState: null,
    hiddenTenGodStates: [],
    relationIds: [],
    relationTypes: [],
    hasCombine: false,
    hasClash: false,
    hasPunish: false,
    hasSelfPunish: false,
    hasHarm: false,
    hasBreak: false,
    hasHarmony: false,
    hasRepetition: false,
    evidence: [],
    warnings: [],
  };
}

function emptyKinshipFeature(key) {
  return {
    key,
    label: "",
    mappingStatus: "unknown",
    primaryTenGods: [],
    secondaryTenGods: [],
    candidateMappings: [],
    candidateStarProfiles: [],
    palaceRefs: [],
    starProfile: emptyStarProfile(),
    palaceProfile: {
      refs: [],
      relationIds: [],
      relationTypes: [],
      evidence: [],
    },
    evidence: [],
    warnings: [],
  };
}

function emptyStarProfile() {
  return {
    tenGods: [],
    states: [],
    visiblePositions: [],
    hiddenPositions: [],
    mainQiPositions: [],
    weightedCount: 0,
    strengthLevels: [],
    relationIds: [],
    evidence: [],
    primary: emptyStarSegment(),
    secondary: emptyStarSegment(),
    weightedByTenGod: {},
  };
}

function emptyStarSegment() {
  return {
    tenGods: [],
    states: [],
    weightedCount: 0,
    visiblePositions: [],
    hiddenPositions: [],
    mainQiPositions: [],
    relationIds: [],
    evidence: [],
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

function emptyClimateProfile() {
  return {
    version: "climate-profile-v1",
    monthBranch: "",
    season: "unknown",
    seasonLabel: "",
    baseClimate: { cold: 0, warm: 0, dry: 0, wet: 0 },
    scores: { cold: 0, warm: 0, dry: 0, wet: 0 },
    tendencies: { temperature: "unknown", moisture: "unknown" },
    severity: { temperature: "unknown", moisture: "unknown" },
    elementAvailability: {},
    priorityNeeds: [],
    candidateElements: [],
    existingSupport: [],
    missingSupport: [],
    passThroughCandidates: [],
    legacyHint: {},
    confidence: "unknown",
    evidence: [],
    warnings: [],
  };
}

function emptyWorkChains() {
  return {
    version: "work-chains-v1",
    nodes: [],
    edges: [],
    chains: [],
    bodyToUseCandidates: [],
    useToBodyCandidates: [],
    selfInvolvedCandidates: [],
    interruptionSignals: [],
    passThroughCandidates: [],
    summary: {
      nodeCount: 0,
      edgeCount: 0,
      chainCount: 0,
      bodyNodeCount: 0,
      useNodeCount: 0,
      bodyToUseCount: 0,
      interruptionCount: 0,
    },
    confidence: "unknown",
    evidence: [],
    warnings: [],
  };
}

function emptySpecialPillarMap(factory) {
  return Object.fromEntries(
    pillarKeys.map((key) => [key, factory(key)]),
  );
}

function emptyVoidPillarFeature(key) {
  return {
    key,
    label: "",
    branch: "",
    isVoid: false,
    referencePillar: "day",
    branchMainTenGod: "",
    hiddenTenGods: [],
    evidence: [],
    warnings: [],
  };
}

function emptyStoragePillarFeature(key) {
  return {
    key,
    label: "",
    branch: "",
    isStorage: false,
    storageElement: "",
    storageElementLabel: "",
    storageLabel: "",
    storedStem: "",
    storedTenGod: "",
    hiddenStems: [],
    hiddenTenGods: [],
    relationIds: [],
    relationTypes: [],
    openingSignalRelationIds: [],
    openingSignalTypes: [],
    hasOpeningSignal: false,
    openState: "unknown",
    evidence: [],
    warnings: [],
  };
}

function emptyGrowthStagePillarFeature(key) {
  return {
    key,
    label: "",
    branch: "",
    stage: "unknown",
    stageIndex: -1,
    phase: "unknown",
    isKnown: false,
    evidence: [],
    warnings: [],
  };
}

function emptyVoidFeatures() {
  return {
    convention: "xunkong-reference-v1",
    primaryReference: "day",
    references: {
      day: {},
      year: {},
    },
    voidBranches: [],
    byPillar: emptySpecialPillarMap(emptyVoidPillarFeature),
    voidPillars: [],
    nonVoidPillars: [],
    voidTenGods: {
      mainQi: [],
      hidden: [],
      all: [],
    },
    spousePalace: {
      pillar: "day",
      branch: "",
      byDayReference: false,
      byYearReference: false,
      primaryIsVoid: false,
      evidence: [],
      warnings: [],
    },
    warnings: [],
  };
}

function emptyStorageFeatures() {
  return {
    convention: "four-storage-branches-v1",
    byPillar: emptySpecialPillarMap(emptyStoragePillarFeature),
    storagePillars: [],
    count: 0,
    branchesPresent: [],
    elementsPresent: [],
    byElement: {},
    openingSignalPillars: [],
    warnings: [],
  };
}

function emptyGrowthStageFeatures() {
  return {
    convention: "day-master-twelve-growth-v1",
    referenceStem: "",
    stages: [],
    byPillar: emptySpecialPillarMap(emptyGrowthStagePillarFeature),
    byStage: {},
    stageCounts: {},
    knownPillars: [],
    unknownPillars: [],
    monthCommandStage: {},
    spousePalaceStage: {},
    warnings: [],
  };
}