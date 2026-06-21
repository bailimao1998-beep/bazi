import {
  PILLAR_KEYS,
  TWELVE_GROWTH_PHASES,
  TWELVE_GROWTH_STAGES,
  resolveGrowthStage,
} from "../config/specialStateTables.js";

const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

export function buildGrowthStageFeatures({
  dayMaster,
  pillars,
} = {}) {
  const referenceStem = dayMaster?.stem ?? "";
  const safePillars = pillars ?? {};
  const warnings = [];

  if (!referenceStem) {
    warnings.push("day master stem is unavailable; twelve-growth stages may remain unknown");
  }

  const byPillar = Object.fromEntries(
    PILLAR_KEYS.map((key) => [
      key,
      buildPillarStage(key, safePillars[key] ?? {}, referenceStem),
    ]),
  );
  const stageCounts = {};
  const byStage = {};
  const knownPillars = [];
  const unknownPillars = [];

  for (const key of PILLAR_KEYS) {
    const item = byPillar[key];
    if (!item.isKnown) {
      unknownPillars.push(key);
      continue;
    }
    knownPillars.push(key);
    stageCounts[item.stage] = (stageCounts[item.stage] ?? 0) + 1;
    if (!byStage[item.stage]) byStage[item.stage] = [];
    byStage[item.stage].push(key);
  }

  return {
    convention: "day-master-twelve-growth-v1",
    referenceStem,
    stages: [...TWELVE_GROWTH_STAGES],
    byPillar,
    byStage,
    stageCounts,
    knownPillars,
    unknownPillars,
    monthCommandStage: byPillar.month,
    spousePalaceStage: byPillar.day,
    warnings,
  };
}

function buildPillarStage(key, pillar, referenceStem) {
  const branch = pillar.branch ?? "";
  const suppliedStage = normalizeStage(pillar.twelveGrowth);
  const calculatedStage = normalizeStage(resolveGrowthStage(referenceStem, branch));
  const stage = suppliedStage !== "unknown"
    ? suppliedStage
    : calculatedStage;
  const isKnown = TWELVE_GROWTH_STAGES.includes(stage);
  const warnings = [];

  if (!branch) warnings.push(`${key} branch is unavailable`);
  if (!isKnown) warnings.push(`${key} twelve-growth stage is unavailable`);

  return {
    key,
    label: pillarLabels[key] ?? key,
    branch,
    stage: isKnown ? stage : "unknown",
    stageIndex: isKnown ? TWELVE_GROWTH_STAGES.indexOf(stage) : -1,
    phase: isKnown ? TWELVE_GROWTH_PHASES[stage] ?? "unknown" : "unknown",
    isKnown,
    evidence: isKnown
      ? [{
          type: "twelve_growth",
          position: `${key}.branch`,
          text: `${referenceStem || "日主"}临${branch}为${stage}`,
        }]
      : [],
    warnings,
  };
}

function normalizeStage(value) {
  const stage = String(value ?? "").trim();
  return TWELVE_GROWTH_STAGES.includes(stage) ? stage : "unknown";
}
