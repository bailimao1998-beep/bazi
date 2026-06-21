const tenGodNames = [
  "比肩",
  "劫财",
  "食神",
  "伤官",
  "正财",
  "偏财",
  "正官",
  "七杀",
  "正印",
  "偏印",
];

const pillarKeys = ["year", "month", "day", "hour"];

export function buildTenGodStates({
  pillars,
  tenGods,
  relationMatrix,
  structure,
} = {}) {
  const safePillars = pillars ?? {};
  const relations = Array.isArray(relationMatrix?.items) ? relationMatrix.items : [];

  return Object.fromEntries(tenGodNames.map((name) => {
    const state = createEmptyState(name);
    collectVisibleState(state, safePillars);
    collectHiddenState(state, safePillars);
    collectMainQiState(state, safePillars);

    state.weightedCount = round(resolveWeightedCount(name, tenGods, safePillars, state));
    state.relatedRelations = collectRelatedRelations(state, relations);
    fillRelationBuckets(state);

    state.hasRoot = state.rootPositions.length > 0;
    state.inMonthStem = state.visiblePositions.includes("month.stem");
    state.inMonthBranchMainQi = state.mainQiPositions.includes("month.branch.mainQi");
    state.inMonthCommand = state.inMonthBranchMainQi;
    state.isVisible = state.visibleCount > 0;
    state.isHiddenOnly = !state.isVisible && state.hiddenCount > 0;
    state.isFloating = state.isVisible && !state.hasRoot;
    state.isBlocked = state.clashedBy.length > 0 ||
      state.punishedBy.length > 0 ||
      state.harmedBy.length > 0 ||
      state.brokenBy.length > 0;
    state.strengthLevel = resolveStrengthLevel(state, structure);
    state.usableLevel = resolveUsableLevel(state);
    state.evidence = buildEvidence(state);

    return [name, state];
  }));
}

function createEmptyState(name) {
  return {
    name,

    visibleCount: 0,
    hiddenCount: 0,
    mainQiCount: 0,
    weightedCount: 0,

    visiblePositions: [],
    hiddenPositions: [],
    mainQiPositions: [],

    rootPositions: [],
    hasRoot: false,

    inMonthStem: false,
    inMonthBranchMainQi: false,
    inMonthCommand: false,

    relatedRelations: [],

    combinedBy: [],
    clashedBy: [],
    punishedBy: [],
    harmedBy: [],
    brokenBy: [],
    controlledBy: [],
    supportedBy: [],

    strengthLevel: "unknown",
    usableLevel: "unknown",

    isVisible: false,
    isHiddenOnly: false,
    isFloating: false,
    isBlocked: false,

    evidence: [],
    warnings: [],
  };
}

function collectVisibleState(state, pillars) {
  for (const key of pillarKeys) {
    if (pillars[key]?.stemTenGod !== state.name) continue;
    const position = `${key}.stem`;
    state.visibleCount += 1;
    state.visiblePositions.push(position);
  }
}

function collectHiddenState(state, pillars) {
  for (const key of pillarKeys) {
    const hiddenStems = Array.isArray(pillars[key]?.hiddenStems) ? pillars[key].hiddenStems : [];
    hiddenStems.forEach((hidden, index) => {
      if (hidden?.tenGod !== state.name) return;
      const position = `${key}.branch.hidden.${index}`;
      state.hiddenCount += 1;
      state.hiddenPositions.push(position);
      state.rootPositions.push(position);
    });
  }
}

function collectMainQiState(state, pillars) {
  for (const key of pillarKeys) {
    if (pillars[key]?.branchMainTenGod !== state.name) continue;
    const position = `${key}.branch.mainQi`;
    state.mainQiCount += 1;
    state.mainQiPositions.push(position);
    if (!state.rootPositions.includes(position)) {
      state.rootPositions.push(position);
    }
  }
}

function resolveWeightedCount(name, tenGods = {}, pillars = {}, state) {
  const rawExplicit = tenGods?.weightedCounts?.[name];
  const explicit = normalizeWeightedCount(rawExplicit);
  if (explicit !== null) return explicit;

  if (rawExplicit !== undefined) {
    addWarning(state, `${name} explicit weightedCount was invalid and has been recalculated`);
  }

  let count = 0;
  for (const key of pillarKeys) {
    if (pillars[key]?.stemTenGod === name) count += 1;
    for (const hidden of pillars[key]?.hiddenStems ?? []) {
      if (hidden?.tenGod === name) count += hiddenWeight(hidden, state);
    }
  }
  return count;
}

function hiddenWeight(hidden = {}, state) {
  const weightInvalid = hasInvalidFraction(hidden.weight);
  const percentageInvalid = hasInvalidFraction(hidden.percentage);

  if (weightInvalid || percentageInvalid) {
    addWarning(state, "hidden weight or percentage ignored because it is outside 0-100");
  }

  const normalizedWeight = normalizeFraction(hidden.weight);
  if (normalizedWeight !== null) return normalizedWeight;

  const normalizedPercentage = normalizeFraction(hidden.percentage);
  if (normalizedPercentage !== null) return normalizedPercentage;

  if (/主气|本气/.test(hidden.role || hidden.qiLevel || "")) return 0.7;
  if (/中气/.test(hidden.role || hidden.qiLevel || "")) return 0.4;
  if (/余气|杂气/.test(hidden.role || hidden.qiLevel || "")) return 0.25;
  return 0.25;
}

function normalizeWeightedCount(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 20) return null;
  return number;
}

function normalizeFraction(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  if (number < 0 || number > 100) return null;
  return number > 1 ? number / 100 : number;
}

function hasInvalidFraction(value) {
  if (value === undefined || value === null || value === "") return false;
  const number = Number(value);
  return !Number.isFinite(number) || number < 0 || number > 100;
}

function collectRelatedRelations(state, relations) {
  const positionKeys = [
    ...state.visiblePositions,
    ...state.mainQiPositions,
    ...state.hiddenPositions.map((position) => position.replace(/\.hidden\.\d+$/, "")),
  ];
  return relations.filter((relation) => {
    const relationPositions = [
      relationPositionKey(relation.left),
      relationPositionKey(relation.right),
      ...(relation.members ?? []).map((member) => relationPositionKey(member)),
    ].filter(Boolean);
    return relationPositions.some((position) => positionKeys.some((key) => key.startsWith(position)));
  });
}

function relationPositionKey(side = {}) {
  if (!side?.pillar || side.pillar === "unknown") return "";
  if (side.position === "stem") return `${side.pillar}.stem`;
  if (side.position === "branch") return `${side.pillar}.branch`;
  return "";
}

function fillRelationBuckets(state) {
  for (const relation of state.relatedRelations) {
    const id = relation.id;
    if (/combine|harmony|meeting/.test(relation.relationType)) state.combinedBy.push(id);
    if (/clash/.test(relation.relationType)) state.clashedBy.push(id);
    if (/punish/.test(relation.relationType)) state.punishedBy.push(id);
    if (/harm/.test(relation.relationType)) state.harmedBy.push(id);
    if (/break/.test(relation.relationType)) state.brokenBy.push(id);
    if (
      relation.relationType === "stem_control" &&
      relation.direction?.controlled &&
      stateHasSide(state, relation.direction.controlled)
    ) {
      state.controlledBy.push(id);
    }
  }
}

function stateHasSide(state, side = {}) {
  const key = relationPositionKey(side);
  return state.visiblePositions.includes(key) ||
    state.mainQiPositions.includes(key) ||
    state.hiddenPositions.some((position) => position.startsWith(key));
}

function resolveStrengthLevel(state) {
  const hasPresence =
    state.visibleCount > 0 ||
    state.hiddenCount > 0 ||
    state.mainQiCount > 0;
  if (!hasPresence) return "absent";
  if (state.visibleCount === 0 && state.mainQiCount === 0 && state.hiddenCount > 0) return "weak";
  if (state.inMonthBranchMainQi && state.visibleCount > 0 && state.hasRoot && state.weightedCount >= 2) return "strong";
  if (state.visibleCount > 0 || state.mainQiCount > 0) return "medium";
  return "unknown";
}

function resolveUsableLevel(state) {
  addWarning(state, "usableLevel requires structure, climate and work-chain analysis");
  return "unknown";
}

function buildEvidence(state) {
  const lines = [];
  for (const position of state.visiblePositions) lines.push({ type: "visible", position, text: `${position} 透出${state.name}` });
  for (const position of state.hiddenPositions) lines.push({ type: "hidden", position, text: `${position} 藏干见${state.name}` });
  for (const position of state.mainQiPositions) lines.push({ type: "main_qi", position, text: `${position} 主气为${state.name}` });
  if (state.weightedCount > 0) lines.push({ type: "weighted", position: "tenGods.weightedCounts", text: `${state.name}加权约${state.weightedCount}` });
  return lines;
}

function round(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number * 100) / 100;
}

function addWarning(state, warning) {
  if (!state || state.warnings.includes(warning)) return;
  state.warnings.push(warning);
}
