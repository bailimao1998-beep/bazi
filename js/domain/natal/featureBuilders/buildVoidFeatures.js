import {
  PILLAR_KEYS,
  resolveVoidBranches,
} from "../config/specialStateTables.js";

const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

export function buildVoidFeatures({
  pillars,
} = {}) {
  const safePillars = pillars ?? {};
  const dayReference = buildReference("day", safePillars);
  const yearReference = buildReference("year", safePillars);

  return {
    convention: "xunkong-reference-v1",
    primaryReference: "day",

    references: {
      day: dayReference,
      year: yearReference,
    },

    voidBranches: dayReference.voidBranches,
    byPillar: dayReference.byPillar,
    voidPillars: dayReference.voidPillars,
    nonVoidPillars: dayReference.nonVoidPillars,
    voidTenGods: dayReference.voidTenGods,

    spousePalace: {
      pillar: "day",
      branch: safePillars.day?.branch ?? "",
      byDayReference: Boolean(dayReference.byPillar.day?.isVoid),
      byYearReference: Boolean(yearReference.byPillar.day?.isVoid),
      primaryIsVoid: Boolean(dayReference.byPillar.day?.isVoid),
      evidence: compact([
        dayReference.byPillar.day?.evidence,
        yearReference.byPillar.day?.evidence,
      ]),
      warnings: [],
    },

    warnings: unique([
      ...(dayReference.warnings ?? []),
      ...(yearReference.warnings ?? []),
    ]),
  };
}

function buildReference(sourceKey, pillars) {
  const source = pillars?.[sourceKey] ?? {};
  const supplied = normalizeBranches(source.voidBranches);
  const calculated = resolveVoidBranches(source.stem, source.branch);
  const voidBranches = supplied.length ? supplied : calculated;
  const warnings = [];

  if (!source.stem || !source.branch) {
    warnings.push(`${sourceKey} pillar is incomplete; xunkong reference could not be fully resolved`);
  }
  if (voidBranches.length === 0) {
    warnings.push(`${sourceKey} pillar void branches are unavailable`);
  }

  const byPillar = Object.fromEntries(
    PILLAR_KEYS.map((key) => [
      key,
      buildPillarVoidState(key, pillars?.[key] ?? {}, voidBranches, sourceKey),
    ]),
  );
  const voidPillars = PILLAR_KEYS.filter((key) => byPillar[key].isVoid);
  const nonVoidPillars = PILLAR_KEYS.filter((key) => !byPillar[key].isVoid);
  const voidTenGods = aggregateVoidTenGods(voidPillars, byPillar);

  return {
    sourcePillar: sourceKey,
    sourceLabel: pillarLabels[sourceKey] ?? sourceKey,
    sourceGanzhi: source.label ?? `${source.stem ?? ""}${source.branch ?? ""}`,
    voidBranches,
    byPillar,
    voidPillars,
    nonVoidPillars,
    voidTenGods,
    evidence: voidBranches.length
      ? [{
          type: "xunkong",
          sourcePillar: sourceKey,
          text: `${pillarLabels[sourceKey] ?? sourceKey}旬空为${voidBranches.join("、")}`,
        }]
      : [],
    warnings,
  };
}

function buildPillarVoidState(key, pillar, voidBranches, sourceKey) {
  const branch = pillar.branch ?? "";
  const isVoid = Boolean(branch && voidBranches.includes(branch));
  const hiddenTenGods = unique(
    (Array.isArray(pillar.hiddenStems) ? pillar.hiddenStems : [])
      .map((item) => item?.tenGod)
      .filter(Boolean),
  );

  return {
    key,
    label: pillarLabels[key] ?? key,
    branch,
    isVoid,
    referencePillar: sourceKey,
    branchMainTenGod: pillar.branchMainTenGod ?? "",
    hiddenTenGods,
    evidence: branch
      ? [{
          type: "xunkong_check",
          sourcePillar: sourceKey,
          position: `${key}.branch`,
          text: `${pillarLabels[key] ?? key}${branch}${isVoid ? "落入" : "未落入"}${pillarLabels[sourceKey] ?? sourceKey}旬空`,
        }]
      : [],
    warnings: branch ? [] : [`${key} branch is unavailable`],
  };
}

function aggregateVoidTenGods(voidPillars, byPillar) {
  const mainQi = [];
  const hidden = [];

  for (const key of voidPillars) {
    const item = byPillar[key];
    if (item?.branchMainTenGod) mainQi.push(item.branchMainTenGod);
    hidden.push(...(item?.hiddenTenGods ?? []));
  }

  return {
    mainQi: unique(mainQi),
    hidden: unique(hidden),
    all: unique([...mainQi, ...hidden]),
  };
}

function normalizeBranches(value) {
  return unique(
    (Array.isArray(value) ? value : [])
      .map((item) => String(item ?? "").trim())
      .filter(Boolean),
  );
}

function unique(items = []) {
  return [...new Set(items.filter((item) => item !== undefined && item !== null && item !== ""))];
}

function compact(items = []) {
  return (Array.isArray(items) ? items.flat(Infinity) : [items])
    .filter((item) => item !== undefined && item !== null && item !== "");
}
